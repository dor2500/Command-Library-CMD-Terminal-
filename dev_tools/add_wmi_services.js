const fs = require('fs');
const { execSync } = require('child_process');
const path = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\data\\commands.js';

console.log("Starting advanced extraction and deduplication...");

let content = fs.readFileSync(path, 'utf8').trim();
let scriptCode = content + '\n; commandsData;';
let commands = [];
try {
    commands = eval(scriptCode);
} catch (e) {
    console.error("Failed to parse commands.js", e);
    process.exit(1);
}

const initialCount = commands.length;
console.log(`Initial command count: ${initialCount}`);

// 1. Add Windows Services Commands
try {
    console.log("Extracting Windows Services...");
    const svcOut = execSync(`powershell -NoProfile -Command "Get-Service | Select-Object Name, DisplayName | ConvertTo-Json"`, { encoding: 'utf8' });
    if (svcOut.trim()) {
        const services = JSON.parse(svcOut);
        services.forEach(s => {
            if (s.Name) {
                commands.push({
                    command: `Restart-Service -Name "${s.Name}" -Force`,
                    descriptionHe: `הפעלה מחדש של שירות מערכת: ${s.DisplayName || s.Name}`,
                    descriptionEn: `Restart system service: ${s.DisplayName || s.Name}`,
                    category: "Windows Services",
                    shell: "PowerShell (Admin)",
                    os: "Windows"
                });
                commands.push({
                    command: `Stop-Service -Name "${s.Name}" -Force`,
                    descriptionHe: `עצירת שירות מערכת: ${s.DisplayName || s.Name}`,
                    descriptionEn: `Stop system service: ${s.DisplayName || s.Name}`,
                    category: "Windows Services",
                    shell: "PowerShell (Admin)",
                    os: "Windows"
                });
            }
        });
    }
} catch (e) {
    console.error("Failed extracting services:", e.message);
}

// 2. Add WMI Classes (CIM Instances)
try {
    console.log("Extracting WMI Classes (CIM)...");
    const wmiOut = execSync(`powershell -NoProfile -Command "Get-CimClass | Select-Object -First 3000 CimClassName | ConvertTo-Json"`, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 50 });
    if (wmiOut.trim()) {
        const wmiClasses = JSON.parse(wmiOut);
        wmiClasses.forEach(w => {
            if (w.CimClassName) {
                commands.push({
                    command: `Get-CimInstance -ClassName ${w.CimClassName}`,
                    descriptionHe: `שליפת נתוני WMI/CIM ממחלקה: ${w.CimClassName}`,
                    descriptionEn: `Retrieve WMI/CIM data from class: ${w.CimClassName}`,
                    category: "WMI & CIM",
                    shell: "PowerShell",
                    os: "Windows"
                });
            }
        });
    }
} catch (e) {
    console.error("Failed extracting WMI:", e.message);
}

// 3. Global Deduplication
console.log(`Command count before deduplication: ${commands.length}`);
const uniqueCommands = new Map();

commands.forEach(cmd => {
    // Clean up spaces for comparison
    const rawCmd = cmd.command.trim();
    if (!uniqueCommands.has(rawCmd)) {
        uniqueCommands.set(rawCmd, cmd);
    }
});

const finalCommands = Array.from(uniqueCommands.values());
console.log(`Final unique command count: ${finalCommands.length}`);
console.log(`Removed ${commands.length - finalCommands.length} exact duplicates.`);

// Write back
const newContent = 'const commandsData = ' + JSON.stringify(finalCommands, null, 2) + ';';
fs.writeFileSync(path, newContent, 'utf8');
console.log("Extraction and deduplication complete!");
