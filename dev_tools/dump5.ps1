$jsonArray = @()

Write-Host "Generating 10,000 Port Scanner commands..."
for ($i = 1; $i -le 10000; $i++) {
    $jsonObj = [ordered]@{
        command = "Test-NetConnection -ComputerName 127.0.0.1 -Port $i"
        description = "Test if TCP Port $i is open on localhost"
        category = "Port Scanner (1-10000)"
        shell = "PowerShell"
    }
    $jsonArray += $jsonObj
}

Write-Host "Generating 10,000 Ping Sweeper commands..."
for ($i = 1; $i -le 10000; $i++) {
    $ip = "192.168." + [math]::Floor($i / 256) + "." + ($i % 256)
    $jsonObj = [ordered]@{
        command = "ping $ip -n 1"
        description = "Ping Sweep target: $ip"
        category = "Network Ping Sweeper"
        shell = "CMD"
    }
    $jsonArray += $jsonObj
}

$filePath = "C:\Users\Dorp\.gemini\antigravity-ide\scratch\tech-toolkit\data\commands.js"

Write-Host "Reading existing file..."
$content = [System.IO.File]::ReadAllText($filePath)
$content = $content.TrimEnd()

if ($content.EndsWith("];")) {
    $content = $content.Substring(0, $content.Length - 2)
}
if ($content.EndsWith("] ;")) {
    $content = $content.Substring(0, $content.Length - 3)
}
$content = $content.TrimEnd()

Write-Host "Converting 20,000 objects to JSON..."
$newJson = $jsonArray | ConvertTo-Json -Depth 2 -Compress

if ($newJson.Length -gt 4) {
    $newJson = $newJson.Substring(1, $newJson.Length - 2)
    $finalContent = $content + ",`n" + $newJson + "`n];"
    Write-Host "Writing to disk..."
    [System.IO.File]::WriteAllText($filePath, $finalContent, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully added $($jsonArray.Count) SYNTHETIC commands!"
} else {
    Write-Host "No new commands found."
}
