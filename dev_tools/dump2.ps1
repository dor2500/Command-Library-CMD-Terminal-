$jsonArray = @()

# 1. System32 tools
$sys32Files = Get-ChildItem -Path "C:\Windows\System32" -Include *.exe,*.msc,*.cpl -File -ErrorAction SilentlyContinue
foreach ($file in $sys32Files) {
    $desc = "Windows System Tool"
    if ($file.Extension -eq ".msc") { $desc = "Microsoft Management Console Snap-in" }
    if ($file.Extension -eq ".cpl") { $desc = "Control Panel Applet" }
    
    $jsonObj = [ordered]@{
        command = $file.Name
        description = $desc
        category = "Windows System Tools"
        shell = "CMD/Run"
    }
    $jsonArray += $jsonObj
}

# 2. All Available PowerShell Commands
$psCommands = Get-Command -ListAvailable -CommandType Cmdlet,Function,Alias
foreach ($cmd in $psCommands) {
    $desc = $cmd.ModuleName
    if ([string]::IsNullOrWhiteSpace($desc)) {
        $desc = "Available PowerShell Command"
    } else {
        $desc = "Module: " + $desc
    }
    
    $jsonObj = [ordered]@{
        command = $cmd.Name
        description = $desc
        category = "PowerShell Native"
        shell = "PowerShell"
    }
    $jsonArray += $jsonObj
}

$filePath = "C:\Users\Dorp\.gemini\antigravity-ide\scratch\tech-toolkit\data\commands.js"
$content = Get-Content $filePath -Raw
$content = $content.TrimEnd()

if ($content.EndsWith("];")) {
    $content = $content.Substring(0, $content.Length - 2)
}
if ($content.EndsWith("] ;")) {
    $content = $content.Substring(0, $content.Length - 3)
}
$content = $content.TrimEnd()

$newJson = $jsonArray | ConvertTo-Json -Depth 2 -Compress

if ($newJson.Length -gt 4) {
    $newJson = $newJson.Substring(1, $newJson.Length - 2)
    $finalContent = $content + ",`n" + $newJson + "`n];"
    Set-Content $filePath $finalContent -Encoding UTF8
    Write-Host "Successfully added $($jsonArray.Count) MORE commands!"
} else {
    Write-Host "No new commands found."
}
