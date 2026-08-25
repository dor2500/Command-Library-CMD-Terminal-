$jsonArray = @()

Write-Host "Generating 5,000 Linux Commands..."
for ($i = 1; $i -le 5000; $i++) {
    $ip = "10.0." + [math]::Floor($i / 256) + "." + ($i % 256)
    $jsonObj = [ordered]@{
        command = "nmap -sS -O $ip"
        description = "Nmap stealth scan and OS detection for $ip"
        category = "Nmap Scanners"
        shell = "Bash"
        os = "Linux"
    }
    $jsonArray += $jsonObj
}

Write-Host "Generating 5,000 macOS Commands..."
for ($i = 1; $i -le 5000; $i++) {
    $port = $i
    $jsonObj = [ordered]@{
        command = "lsof -i :$port"
        description = "Check which process is listening on Mac port $port"
        category = "Network Diagnostics"
        shell = "Zsh"
        os = "macOS"
    }
    $jsonArray += $jsonObj
}

Write-Host "Generating 5,000 ADB Commands..."
for ($i = 1; $i -le 5000; $i++) {
    $jsonObj = [ordered]@{
        command = "adb shell input tap $($i % 1080) $($i % 1920)"
        description = "Simulate screen tap at X=$($i % 1080) Y=$($i % 1920)"
        category = "Screen Interaction"
        shell = "ADB"
        os = "ADB"
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

Write-Host "Converting 15,000 multi-OS objects to JSON..."
$newJson = $jsonArray | ConvertTo-Json -Depth 2 -Compress

if ($newJson.Length -gt 4) {
    $newJson = $newJson.Substring(1, $newJson.Length - 2)
    $finalContent = $content + ",`n" + $newJson + "`n];"
    Write-Host "Writing to disk..."
    [System.IO.File]::WriteAllText($filePath, $finalContent, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully added $($jsonArray.Count) Multi-OS commands!"
} else {
    Write-Host "No new commands found."
}
