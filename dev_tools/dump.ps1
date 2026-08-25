$commands = Get-Command -CommandType Cmdlet | Select-Object -First 3000
$jsonArray = @()

foreach ($cmd in $commands) {
    $desc = $cmd.ModuleName
    if ([string]::IsNullOrWhiteSpace($desc)) {
        $desc = "Built-in PowerShell Cmdlet"
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

$newJson = $newJson.Substring(1, $newJson.Length - 2)

$finalContent = $content + ",`n" + $newJson + "`n];"
Set-Content $filePath $finalContent -Encoding UTF8
Write-Host "Successfully added $($jsonArray.Count) commands!"
