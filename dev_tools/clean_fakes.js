
const fs = require('fs');
const path = 'C:/Users/Dorp/Documents/GitHub/Command-Library-CMD-Terminal-/data/commands.js';

let content = fs.readFileSync(path, 'utf8');
content = content.replace(/^let commandsData = /, '');
if(content.endsWith(';')) content = content.substring(0, content.length - 1);

let data = eval(content);
let initialCount = data.length;

// Filter out fakes
data = data.filter(cmd => !cmd.command.includes(' argument_'));

let newJson = JSON.stringify(data, null, 2);
fs.writeFileSync(path, 'let commandsData = ' + newJson + ';', 'utf8');

console.log('Removed ' + (initialCount - data.length) + ' fake commands. New count: ' + data.length);

