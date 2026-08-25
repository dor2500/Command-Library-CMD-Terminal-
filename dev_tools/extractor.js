const fs = require('fs');
const { execSync } = require('child_process');

let jsonArray = [];
const path = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\data\\commands.js';

// 1. Get PowerShell Cmdlets
console.log("Extracting PowerShell Cmdlets...");
try {
    const psCmd = `powershell.exe -NoProfile -Command "Get-Command -CommandType Cmdlet,Function,Alias -ErrorAction SilentlyContinue | Select-Object -Unique -Property Name | ConvertTo-Json -Compress"`;
    const psOut = execSync(psCmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    const cmdlets = JSON.parse(psOut);
    
    cmdlets.forEach(c => {
        if(c && c.Name) {
            jsonArray.push({
                command: c.Name,
                descriptionHe: `פקודת PowerShell מקורית: ${c.Name}`,
                descriptionEn: `Native PowerShell Command: ${c.Name}`,
                category: "PowerShell Cmdlets",
                shell: "PowerShell",
                os: "Windows"
            });
        }
    });
} catch(e) { console.error("Error extracting PS commands", e.message); }

// 2. Get Windows Services
console.log("Extracting Windows Services...");
try {
    const srvCmd = `powershell.exe -NoProfile -Command "Get-Service -ErrorAction SilentlyContinue | Select-Object -Unique -Property Name, DisplayName | ConvertTo-Json -Compress"`;
    const srvOut = execSync(srvCmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    const services = JSON.parse(srvOut);
    
    services.forEach(s => {
        if(s && s.Name) {
            jsonArray.push({
                command: `Start-Service -Name "${s.Name}"`,
                descriptionHe: `הפעלת שירות מערכת: ${s.DisplayName || s.Name}`,
                descriptionEn: `Start system service: ${s.DisplayName || s.Name}`,
                category: "Windows Services",
                shell: "PowerShell",
                os: "Windows"
            });
        }
    });
} catch(e) { console.error("Error extracting services", e.message); }

// 3. Get WMI Classes
console.log("Extracting WMI Classes...");
try {
    const wmiCmd = `powershell.exe -NoProfile -Command "Get-CimClass -ErrorAction SilentlyContinue | Select-Object -First 3000 -Property CimClassName | ConvertTo-Json -Compress"`;
    const wmiOut = execSync(wmiCmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    const wmiClasses = JSON.parse(wmiOut);
    
    wmiClasses.forEach(w => {
        if(w && w.CimClassName) {
            jsonArray.push({
                command: `Get-CimInstance -ClassName ${w.CimClassName}`,
                descriptionHe: `שליפת נתוני WMI עבור המחלקה ${w.CimClassName}`,
                descriptionEn: `Query WMI hardware/software class: ${w.CimClassName}`,
                category: "WMI Classes",
                shell: "PowerShell",
                os: "Windows"
            });
        }
    });
} catch(e) { console.error("Error extracting WMI classes", e.message); }

// 4. Get System32 Executables
console.log("Extracting System32 Executables...");
try {
    const exeCmd = `dir /b C:\\Windows\\System32\\*.exe`;
    const exeOut = execSync(exeCmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    const exes = exeOut.split('\n').map(x => x.trim()).filter(x => x.length > 0);
    
    exes.forEach(exe => {
        jsonArray.push({
            command: exe,
            descriptionHe: `הפעלת כלי מובנה של ווינדוס: ${exe}`,
            descriptionEn: `Execute Windows built-in tool: ${exe}`,
            category: "System32 Executables",
            shell: "CMD",
            os: "Windows"
        });
    });
} catch(e) { console.error("Error extracting Exes", e.message); }

console.log(`Total authentic commands extracted: ${jsonArray.length}`);

// Append to commands.js
let content = fs.readFileSync(path, 'utf8').trim();
if (content.endsWith('];')) {
    content = content.substring(0, content.length - 2);
}
if (content.endsWith('] ;')) {
    content = content.substring(0, content.length - 3);
}
content = content.trim();

let newJson = JSON.stringify(jsonArray, null, 2);
if (newJson.length > 4) {
    newJson = newJson.substring(1, newJson.length - 2);
    const finalContent = content + ",\n" + newJson + "\n];";
    fs.writeFileSync(path, finalContent, 'utf8');
    console.log("Commands successfully written to commands.js");
}
