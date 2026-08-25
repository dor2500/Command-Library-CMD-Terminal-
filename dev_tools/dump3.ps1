$jsonArray = @()

# 1. Aliases
$aliases = Get-Alias
foreach ($a in $aliases) {
    $jsonObj = [ordered]@{
        command = $a.Name
        description = "Alias for $($a.Definition)"
        category = "PowerShell Aliases"
        shell = "PowerShell"
    }
    $jsonArray += $jsonObj
}

# 2. Services
$services = Get-Service
foreach ($s in $services) {
    $jsonObjStart = [ordered]@{
        command = "Start-Service -Name `"$($s.Name)`""
        description = "Start the $($s.DisplayName) service"
        category = "Windows Services"
        shell = "PowerShell"
    }
    $jsonArray += $jsonObjStart
    
    $jsonObjStop = [ordered]@{
        command = "Stop-Service -Name `"$($s.Name)`""
        description = "Stop the $($s.DisplayName) service"
        category = "Windows Services"
        shell = "PowerShell"
    }
    $jsonArray += $jsonObjStop
}

# 3. WMI Classes (CIM)
$wmiClasses = Get-CimClass -ErrorAction SilentlyContinue | Select-Object -First 6000
foreach ($cls in $wmiClasses) {
    $jsonObj = [ordered]@{
        command = "Get-CimInstance -ClassName $($cls.CimClassName)"
        description = "Query WMI/CIM Class: $($cls.CimClassName)"
        category = "WMI & CIM Classes"
        shell = "PowerShell"
    }
    $jsonArray += $jsonObj
}

# 4. All Executables in Windows folder
$allExes = Get-ChildItem -Path "C:\Windows" -Include *.exe -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 10000
foreach ($exe in $allExes) {
    $jsonObj = [ordered]@{
        command = $exe.FullName
        description = "Execute $($exe.Name)"
        category = "Windows Executables"
        shell = "CMD/Run"
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
    Write-Host "Successfully added $($jsonArray.Count) MASSIVE commands!"
} else {
    Write-Host "No new commands found."
}
