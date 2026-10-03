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
npm run typecheck
if ($LASTEXITCODE -ne 0) { throw "Typecheck failed" }
$env:AZURE_BUILD = "1"
Remove-Item Env:PAGES_BUILD -ErrorAction SilentlyContinue
npx vite build
if ($LASTEXITCODE -ne 0) { throw "vite build failed" }
$out = Join-Path $root "dist\client"
# TanStack Start SPA output uses _shell.html, not index.html.
if (-not (Test-Path (Join-Path $out "index.html"))) {
  if (-not (Test-Path (Join-Path $out "_shell.html"))) { throw "Missing SPA shell" }
  Copy-Item (Join-Path $out "_shell.html") (Join-Path $out "index.html")
}
Copy-Item (Join-Path $root "deploy\web.config") (Join-Path $out "web.config") -Force
$zip = Join-Path $root "khadija-release.zip"
Compress-Archive -Path (Join-Path $out "*") -DestinationPath $zip -Force
& $azCmd webapp deploy --name $cfg.azure.app_name --resource-group $cfg.azure.resource_group --src-path $zip --type zip --clean true -o none
if ($LASTEXITCODE -ne 0) { throw "Azure deploy failed" }
Write-Output ("URL=" + $cfg.live_url)
