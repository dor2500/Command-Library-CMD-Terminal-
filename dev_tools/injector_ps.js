const fs = require('fs');
const path = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\data\\commands.js';
const psJsonPath = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\ps_cmds.json';

let newCommands = [];

if (fs.existsSync(psJsonPath)) {
    const rawData = fs.readFileSync(psJsonPath, 'utf8');
    // Remove BOM if present
    const cleanData = rawData.replace(/^\uFEFF/, '');
    try {
        const psCmds = JSON.parse(cleanData);
        psCmds.forEach(c => {
            if (c.Name) {
                newCommands.push({
                    command: c.Name,
                    descriptionHe: `פקודת מערכת מקורית של Windows מתוך מודול: ${c.Category.replace('PS: ', '')}`,
                    descriptionEn: `Native Windows command from module: ${c.Category.replace('PS: ', '')}`,
                    category: c.Category || 'PowerShell',
                    shell: "PowerShell",
                    os: "Windows"
                });
            }
        });
        console.log(`Loaded ${psCmds.length} authentic PowerShell commands.`);
    } catch (e) {
        console.error("Failed to parse JSON:", e.message);
    }
} else {
    console.log("No ps_cmds.json found.");
}

console.log(`Total new Windows authentic commands to inject: ${newCommands.length}`);

if (newCommands.length > 0) {
    let content = fs.readFileSync(path, 'utf8').trim();
    if (content.endsWith('];')) content = content.substring(0, content.length - 2);
    if (content.endsWith('] ;')) content = content.substring(0, content.length - 3);
    content = content.trim();

    let newJson = JSON.stringify(newCommands, null, 2);
    newJson = newJson.substring(1, newJson.length - 2); // remove [ and ]
    
    const finalContent = content + ",\n" + newJson + "\n];";
    fs.writeFileSync(path, finalContent, 'utf8');
    console.log("Successfully injected massive authentic Windows commands!");
}
