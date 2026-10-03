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

if (-not (Test-Path "node_modules")) { npm ci }

$env:AZURE_BUILD = "1"
Remove-Item Env:PAGES_BUILD -ErrorAction SilentlyContinue
npx vite build
if ($LASTEXITCODE -ne 0) { throw "vite build failed" }

$out = Join-Path $root "dist\client"
if (-not (Test-Path (Join-Path $out "index.html"))) { $out = Join-Path $root "dist" }
Copy-Item (Join-Path $root "deploy\web.config") (Join-Path $out "web.config") -Force

$cfg = Get-Content (Join-Path $root "deploy\azure.json") -Raw | ConvertFrom-Json
Push-Location $out
& $azCmd webapp up --name $cfg.azure.app_name --resource-group $cfg.azure.resource_group --location $cfg.azure.location --sku $cfg.azure.plan_sku --html -o none
$code = $LASTEXITCODE
Pop-Location
if ($code -ne 0) { throw "az webapp up failed: $code" }
Write-Output ("URL=" + $cfg.live_url)
