$ErrorActionPreference='Stop'
$root=Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$tools=Join-Path $env:USERPROFILE 'Tools\Khadija'
$bin=Join-Path $env:USERPROFILE 'Tools\third_party\Bonsai-demo\bin\vulkan\llama-server.exe'
if (-not (Test-Path $bin)) { throw 'Existing local inference executable unavailable' }
$os=Get-CimInstance Win32_OperatingSystem
if ($os.FreePhysicalMemory -lt 2*1MB) { throw 'Not enough free RAM for safe local inference' }
New-Item -ItemType Directory -Force (Join-Path $tools 'models')|Out-Null
$model=Join-Path $tools 'models\Qwen3-0.6B-Q8_0.gguf'
$expected='9465e63a22add5354d9bb4b99e90117043c7124007664907259bd16d043bb031'
if (-not (Test-Path $model)) {
  $tmp=$model+'.download'
  & curl.exe --fail --location --silent --show-error --max-time 180 --output $tmp 'https://huggingface.co/Qwen/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q8_0.gguf'
  if ($LASTEXITCODE -ne 0) { throw 'Official model download failed' }
  if ((Get-FileHash $tmp -Algorithm SHA256).Hash.ToLower() -ne $expected) { throw 'Model checksum mismatch; refusing execution' }
  Move-Item $tmp $model
}
if ((Get-FileHash $model -Algorithm SHA256).Hash.ToLower() -ne $expected) { throw 'Model checksum mismatch' }
$keyFile=Join-Path $tools 'local-model.key'
if (-not (Test-Path $keyFile)) {
  $bytes=New-Object byte[] 32
  $rng=[Security.Cryptography.RandomNumberGenerator]::Create();$rng.GetBytes($bytes);$rng.Dispose()
  $localKey=[Convert]::ToBase64String($bytes)
  Set-Content -Encoding ASCII $keyFile $localKey
  $who=[Security.Principal.WindowsIdentity]::GetCurrent().Name
  & icacls $keyFile /inheritance:r /grant:r "${who}:(F)" 'SYSTEM:(F)'|Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Cannot protect local model access file' }
  $localKey|ConvertTo-SecureString -AsPlainText -Force|Export-Clixml (Join-Path $tools 'model-access.xml')
}
$start=@'
$ErrorActionPreference='Stop'
$tools=Split-Path -Parent $MyInvocation.MyCommand.Path
$os=Get-CimInstance Win32_OperatingSystem
if($os.FreePhysicalMemory -lt 2*1MB){throw 'Insufficient free memory; rules remain available'}
$bin=Join-Path $env:USERPROFILE 'Tools\third_party\Bonsai-demo\bin\vulkan\llama-server.exe'
$model=Join-Path $tools 'models\Qwen3-0.6B-Q8_0.gguf'
$key=Join-Path $tools 'local-model.key'
& $bin -m $model --host 127.0.0.1 --port 8577 --device none -ngl 0 -fa off -c 2048 -t 2 -tb 2 --parallel 1 --no-warmup --alias khadija-qwen --api-key-file $key --jinja 1>> (Join-Path $tools 'model-output.log') 2>> (Join-Path $tools 'model-error.log')
'@
Set-Content -Encoding UTF8 (Join-Path $tools 'Start-Local-AI.ps1') $start
$occupied=Get-NetTCPConnection -LocalPort 8577 -State Listen -ErrorAction SilentlyContinue|Select-Object -First 1
if ($occupied) { throw 'Local AI port already in use; refusing to replace another service' }
$action=New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$(Join-Path $tools 'Start-Local-AI.ps1')`""
$who=[Security.Principal.WindowsIdentity]::GetCurrent().Name
$principal=New-ScheduledTaskPrincipal -UserId $who -LogonType Interactive -RunLevel Limited
$trigger=New-ScheduledTaskTrigger -AtLogOn -User $who
$settings=New-ScheduledTaskSettingsSet -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 2 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName 'Khadija-Local-AI' -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Petit modèle local pour suggestions de commandes; aucune dépense cloud' -Force|Out-Null
Start-ScheduledTask -TaskName 'Khadija-Local-AI'
$localKey=(Get-Content $keyFile -Raw).Trim()
$headers=@{Authorization="Bearer $localKey"}
$ready=$false
for($n=0;$n -lt 30;$n++){try{$h=Invoke-RestMethod 'http://127.0.0.1:8577/health' -Headers $headers -TimeoutSec 2;if($h.status -eq 'ok'){$ready=$true;break}}catch{};Start-Sleep -Seconds 2}
if(-not $ready){Stop-ScheduledTask -TaskName 'Khadija-Local-AI';throw 'Local model did not become healthy; stopped its task'}
$body=@{model='khadija-qwen';messages=@(@{role='system';content='Écris uniquement une courte liste de contrôle en français. Ne confirme jamais les commandes. /no_think'},@{role='user';content='Deux litres de lben, retrait à Khouribga. Quels contrôles effectuer ? /no_think'});max_tokens=110;temperature=0;chat_template_kwargs=@{enable_thinking=$false}}|ConvertTo-Json -Depth 6
$response=Invoke-RestMethod 'http://127.0.0.1:8577/v1/chat/completions' -Method Post -Headers $headers -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 60
if(-not $response.choices[0].message.content){throw 'Local model returned no text'}
Write-Output ('LOCAL_MODEL_SAMPLE='+$response.choices[0].message.content)
@{url='http://127.0.0.1:8577/v1';model='khadija-qwen'}|ConvertTo-Json|Set-Content -Encoding ASCII (Join-Path $tools 'local-ai.json')
$secure=Import-Clixml (Join-Path $tools 'access.xml')
$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try{$adminKey=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)}finally{[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}
& (Join-Path $root 'scripts\install-order-tools.ps1') -Key $adminKey -Api 'https://khadija-khouribga.azurewebsites.net'
powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $tools 'Review-Orders.ps1')
if($LASTEXITCODE -ne 0){throw 'Connected order assistant failed'}
Write-Output 'LOCAL_AI=ready; COST=local-only; REVIEW_TASK=connected'
