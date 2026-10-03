param([Parameter(Mandatory=$true)][string]$Key,[Parameter(Mandatory=$true)][string]$Api)
$ErrorActionPreference='Stop'
$root=Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tools=Join-Path $env:USERPROFILE 'Tools\Khadija'
New-Item -ItemType Directory -Force $tools | Out-Null
$Key | ConvertTo-SecureString -AsPlainText -Force | Export-Clixml (Join-Path $tools 'access.xml')
Copy-Item (Join-Path $root 'backend\agent.cjs') $tools -Force
$common=@'
$ErrorActionPreference='Stop'
$tools=Split-Path -Parent $MyInvocation.MyCommand.Path
$secure=Import-Clixml (Join-Path $tools 'access.xml')
$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try { $key=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
'@
$open=$common+"`n"+@'
$invite=Invoke-RestMethod 'https://khadija-khouribga.azurewebsites.net/api/admin/invites' -Method Post -Headers @{Authorization="Bearer $key"} -ContentType 'application/json' -Body '{}'
Start-Process $invite.url
'@
Set-Content -Encoding UTF8 (Join-Path $tools 'Open-Orders.ps1') $open
$node=(Get-Command node).Source
$worker=$common+"`n"+"`$env:KHADIJA_ADMIN_KEY=`$key`n`$env:KHADIJA_API='$Api'`n& '$node' (Join-Path `$tools 'agent.cjs')`n"
Set-Content -Encoding UTF8 (Join-Path $tools 'Review-Orders.ps1') $worker
$desktop=[Environment]::GetFolderPath('Desktop')
if ($desktop) {
  $shell=New-Object -ComObject WScript.Shell
  $link=$shell.CreateShortcut((Join-Path $desktop 'Gestion Khadija.lnk'))
  $link.TargetPath='powershell.exe'
  $link.Arguments="-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $tools 'Open-Orders.ps1')`""
  $link.Description='Gestion sécurisée des commandes Khadija'
  $link.Save()
}
try {
  $action=New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $tools 'Review-Orders.ps1')`""
  $trigger=New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 2)
  $principal=New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
  Register-ScheduledTask -TaskName 'Khadija-Order-Review' -Action $action -Trigger $trigger -Principal $principal -Description 'Préparation des commandes; aucun envoi ni paiement automatique' -Force | Out-Null
  Write-Output 'ORDER_REVIEW_TASK=installed'
} catch { Write-Output 'ORDER_REVIEW_TASK=unavailable; server-side summaries remain automatic' }
Write-Output 'ORDER_ADMIN_SHORTCUT=installed; ACCESS_KEY=DPAPI-protected'
