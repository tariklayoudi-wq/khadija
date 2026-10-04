$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$azCmd = "$env:ProgramFiles\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"
if (-not (Test-Path $azCmd)) {
  $found = Get-Command az -ErrorAction SilentlyContinue
  if (-not $found) { throw "Azure CLI not found" }
  $azCmd = $found.Source
}

& $azCmd account show --query "{name:name,user:user.name}" -o json
if ($LASTEXITCODE -ne 0) { throw "Run az login first" }

$cfg = Get-Content (Join-Path $root "deploy\azure.json") -Raw | ConvertFrom-Json
$planId = & $azCmd webapp show --name $cfg.azure.app_name --resource-group $cfg.azure.resource_group --query serverFarmId -o tsv
if ($LASTEXITCODE -ne 0 -or -not $planId) { throw "Existing webapp not found; refusing resource creation" }
$sku = & $azCmd appservice plan show --ids $planId --query sku.name -o tsv
if ($LASTEXITCODE -ne 0 -or $sku.Trim() -ne "F1") { throw "Expected F1 plan; refusing deployment" }

npm ci --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
node scripts/export-catalog.mjs
if ($LASTEXITCODE -ne 0) { throw "Catalog export failed" }
node --test backend/server.test.cjs
if ($LASTEXITCODE -ne 0) { throw "Order backend tests failed" }
$env:AZURE_BUILD = "1"
Remove-Item Env:PAGES_BUILD -ErrorAction SilentlyContinue
npx vite build
if ($LASTEXITCODE -ne 0) { throw "vite build failed" }
npm run typecheck
if ($LASTEXITCODE -ne 0) { throw "Typecheck failed" }
$out = Join-Path $root "dist\client"
# TanStack Start SPA output uses _shell.html, not index.html.
if (-not (Test-Path (Join-Path $out "index.html"))) {
  if (-not (Test-Path (Join-Path $out "_shell.html"))) { throw "Missing SPA shell" }
  Copy-Item (Join-Path $out "_shell.html") (Join-Path $out "index.html")
}
$package = Join-Path $root 'dist\azure'
if (Test-Path $package) { Remove-Item $package -Recurse -Force }
New-Item -ItemType Directory -Path $package | Out-Null
Copy-Item $out (Join-Path $package 'public') -Recurse
Copy-Item (Join-Path $root 'backend\server.cjs') $package
Copy-Item (Join-Path $root 'backend\catalog.json') $package
Copy-Item (Join-Path $root 'deploy\web.config') $package
Set-Content -Encoding ASCII (Join-Path $package 'package.json') '{"private":true,"type":"commonjs"}'
$settingsRaw = & $azCmd webapp config appsettings list --name $cfg.azure.app_name --resource-group $cfg.azure.resource_group -o json
if ($LASTEXITCODE -ne 0) { throw 'Cannot read existing configuration' }
$existing = $settingsRaw | ConvertFrom-Json
$key = ($existing | Where-Object { $_.name -eq 'KHADIJA_ADMIN_KEY' }).value
if (-not $key) { $bytes=New-Object byte[] 48; $rng=[Security.Cryptography.RandomNumberGenerator]::Create(); $rng.GetBytes($bytes); $key=[Convert]::ToBase64String($bytes); $rng.Dispose() }
# Single process on the existing free plan; persistent data lives outside deployment content.
& $azCmd webapp config appsettings set --name $cfg.azure.app_name --resource-group $cfg.azure.resource_group --settings 'WEBSITE_NODE_DEFAULT_VERSION=~22' 'KHADIJA_HOSTED=1' "KHADIJA_ADMIN_KEY=$key" "KHADIJA_ORIGIN=$($cfg.live_url)" -o none
if ($LASTEXITCODE -ne 0) { throw 'Runtime configuration failed' }
$zip = Join-Path $root "khadija-release.zip"
Compress-Archive -Path (Join-Path $package "*") -DestinationPath $zip -Force
& $azCmd webapp deploy --name $cfg.azure.app_name --resource-group $cfg.azure.resource_group --src-path $zip --type zip --clean true -o none
if ($LASTEXITCODE -ne 0) { throw "Azure deploy failed" }
$healthy=$false
for ($attempt=0; $attempt -lt 18; $attempt++) {
  try { $health=Invoke-RestMethod "$($cfg.live_url)/api/health" -TimeoutSec 20; if ($health.ok -and $health.version -eq 2) { $healthy=$true; break } } catch {}
  Start-Sleep -Seconds 5
}
if (-not $healthy) { throw 'New order backend did not become healthy' }
$headers=@{Authorization="Bearer $key"; Origin=$cfg.live_url; 'Idempotency-Key'=[guid]::NewGuid().ToString()}
$body=@{items=@(@{id='lben-casa';quantity=1});name='TEST technique - ne pas traiter';phone='0600000000';city='Khouribga';fulfilment='pickup';isTest=$true} | ConvertTo-Json -Depth 5
$order=Invoke-RestMethod "$($cfg.live_url)/api/orders" -Method Post -Headers $headers -ContentType 'application/json' -Body $body
if ($order.order.subtotal -ne 12) { throw 'Order total check failed' }
$cancel=@{status='cancelled'} | ConvertTo-Json
Invoke-RestMethod "$($cfg.live_url)/api/admin/orders/$($order.order.id)" -Method Patch -Headers $headers -ContentType 'application/json' -Body $cancel | Out-Null
# Authenticated administration and catalogue are verified without logging customer data or keys.
Invoke-RestMethod "$($cfg.live_url)/api/admin/products" -Headers $headers | Out-Null
& (Join-Path $root 'scripts\install-order-tools.ps1') -Key $key -Api $cfg.live_url
Write-Output 'ORDER_BACKEND=verified; TEST_ORDER=cancelled; PLAN=F1'
Write-Output ("URL=" + $cfg.live_url)
