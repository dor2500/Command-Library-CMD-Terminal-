
const fs = require('fs');
const path = 'C:/Users/Dorp/Documents/GitHub/Command-Library-CMD-Terminal-/data/commands.js';

let content = fs.readFileSync(path, 'utf8');
content = content.replace(/^(const|let) commandsData = /, '');
if(content.endsWith(';')) content = content.substring(0, content.length - 1);

let data = eval(content);

let cleanData = data.filter(cmd => cmd.os === 'Windows');
let nonWindows = data.filter(cmd => cmd.os !== 'Windows');
let uniqueMap = new Map();

nonWindows.forEach(cmd => {
    let baseCmd = cmd.command.replace(/ argument_\d+$/, '').replace(/ param_\d+$/, '');
    if(!uniqueMap.has(baseCmd)) {
        cmd.command = baseCmd;
        cmd.descriptionHe = cmd.descriptionHe.replace(/ ?ו?ריאציה \d+:/, '').trim();
        cmd.descriptionEn = cmd.descriptionEn.replace(/ variation \d+:/, '').trim();
        uniqueMap.set(baseCmd, cmd);
    }
});

cleanData.push(...Array.from(uniqueMap.values()));

let newJson = JSON.stringify(cleanData, null, 2);
fs.writeFileSync(path, 'const commandsData = ' + newJson + ';', 'utf8');
console.log('Cleaned and deduplicated! Final count: ' + cleanData.length);

