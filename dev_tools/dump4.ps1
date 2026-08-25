$jsonArray = @()
$maxLimit = 25000 # Total chunks to add to prevent out-of-memory in PS

# 1. System32 DLLs (Registering them is a very common tech command)
Write-Host "Collecting DLLs..."
$dlls = Get-ChildItem -Path "C:\Windows\System32" -Filter *.dll -File -ErrorAction SilentlyContinue | Select-Object -First 15000
foreach ($dll in $dlls) {
    $jsonObjReg = [ordered]@{
        command = "regsvr32.exe /s `"$($dll.FullName)`""
        description = "Register $($dll.Name) component"
        category = "DLL Registration"
        shell = "CMD (Admin)"
    }
    $jsonArray += $jsonObjReg
}

# 2. Installed Programs (Program Files & x86)
Write-Host "Collecting EXEs from Program Files..."
$paths = @("C:\Program Files", "C:\Program Files (x86)")
foreach ($p in $paths) {
    if (Test-Path $p) {
        $exes = Get-ChildItem -Path $p -Filter *.exe -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 10000
        foreach ($exe in $exes) {
            $jsonObj = [ordered]@{
                command = "`"$($exe.FullName)`""
                description = "Launch $($exe.Name)"
                category = "Installed Programs"
                shell = "CMD/Run"
            }
            $jsonArray += $jsonObj
        }
    }
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

Write-Host "Converting $($jsonArray.Count) objects to JSON (This might take a minute)..."
# Using a faster method than ConvertTo-Json for massive arrays if possible, but ConvertTo-Json is fine for 35k objects usually.
$newJson = $jsonArray | ConvertTo-Json -Depth 2 -Compress

if ($newJson.Length -gt 4) {
    $newJson = $newJson.Substring(1, $newJson.Length - 2)
    $finalContent = $content + ",`n" + $newJson + "`n];"
    Write-Host "Writing to disk..."
    [System.IO.File]::WriteAllText($filePath, $finalContent, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully added $($jsonArray.Count) INSANE commands!"
} else {
    Write-Host "No new commands found."
}
