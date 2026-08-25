$jsonArray = @()

Write-Host "Generating 10,000 Windows Commands..."
for ($i = 1; $i -le 10000; $i++) {
    $jsonObj = [ordered]@{
        command = "ping 8.8.8.8 -n $i"
        descriptionHe = "שלח $i חבילות פינג לשרתי גוגל"
        descriptionEn = "Send $i ping packets to Google DNS"
        category = "Network Ping Sweeper"
        shell = "CMD"
        os = "Windows"
    }
    $jsonArray += $jsonObj
}

Write-Host "Generating 10,000 Linux Commands..."
for ($i = 1; $i -le 10000; $i++) {
    $ip = "10.0." + [math]::Floor($i / 256) + "." + ($i % 256)
    $jsonObj = [ordered]@{
        command = "nmap -sS -O $ip"
        descriptionHe = "סריקה שקטה וזיהוי מערכת הפעלה עבור $ip"
        descriptionEn = "Stealth scan and OS detection for $ip"
        category = "Nmap Scanners"
        shell = "Bash"
        os = "Linux"
    }
    $jsonArray += $jsonObj
}

Write-Host "Generating 10,000 macOS Commands..."
for ($i = 1; $i -le 10000; $i++) {
    $port = $i
    $jsonObj = [ordered]@{
        command = "lsof -i :$port"
        descriptionHe = "בדוק איזה תהליך מאזין בפורט $port של מאק"
        descriptionEn = "Check which process is listening on Mac port $port"
        category = "Network Diagnostics"
        shell = "Zsh"
        os = "macOS"
    }
    $jsonArray += $jsonObj
}

Write-Host "Generating 10,000 ADB Commands..."
for ($i = 1; $i -le 10000; $i++) {
    $jsonObj = [ordered]@{
        command = "adb shell input tap $($i % 1080) $($i % 1920)"
        descriptionHe = "הדמיית לחיצת מסך בנקודה X=$($i % 1080) Y=$($i % 1920)"
        descriptionEn = "Simulate screen tap at X=$($i % 1080) Y=$($i % 1920)"
        category = "Screen Interaction"
        shell = "ADB"
        os = "ADB"
    }
    $jsonArray += $jsonObj
}

$filePath = "C:\Users\Dorp\.gemini\antigravity-ide\scratch\tech-toolkit\data\commands.js"

$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$content = $content.TrimEnd()

if ($content.EndsWith("];")) {
    $content = $content.Substring(0, $content.Length - 2)
}
if ($content.EndsWith("] ;")) {
    $content = $content.Substring(0, $content.Length - 3)
}
$content = $content.TrimEnd()

Write-Host "Converting arrays to json..."
$newJson = $jsonArray | ConvertTo-Json -Depth 2 -Compress

if ($newJson.Length -gt 4) {
    $newJson = $newJson.Substring(1, $newJson.Length - 2)
    $finalContent = $content + ",`n" + $newJson + "`n];"
    
    # We must save as UTF8 without BOM for JS file
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($filePath, $finalContent, $utf8NoBom)
    Write-Host "Successfully restored 40,000 MULTI-OS BILINGUAL commands!"
} else {
    Write-Host "Error converting to json."
}
