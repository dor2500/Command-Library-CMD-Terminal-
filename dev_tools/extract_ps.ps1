$commands = Get-Command -CommandType Cmdlet, Function | Select-Object -First 4000 Name, ModuleName, CommandType
$result = @()
foreach ($c in $commands) {
    $cat = if ($c.ModuleName) { "PS: " + $c.ModuleName } else { "PowerShell Core (" + $c.CommandType + ")" }
    $result += [PSCustomObject]@{
        Name = $c.Name
        Category = $cat
    }
}
$result | ConvertTo-Json -Depth 2 -Compress | Out-File "ps_cmds.json" -Encoding UTF8
