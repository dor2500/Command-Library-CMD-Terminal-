const fs = require('fs');
const path = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\data\\commands.js';

console.log("Starting cleanup of synthetic commands...");

let content = fs.readFileSync(path, 'utf8').trim();

// The file format is `let commandsData = [ ... ];` or `const commandsData = [ ... ];`
// We need to parse the JS array.
let commands = [];
try {
    let scriptCode = content + '\n; commandsData;';
    commands = eval(scriptCode);
} catch (e) {
    console.error("Failed to parse commands.js", e);
    process.exit(1);
}

const originalCount = commands.length;

// Filter out synthetics
commands = commands.filter(cmd => {
    const text = cmd.command.toLowerCase();
    const descHe = (cmd.descriptionHe || '').toLowerCase();
    
    // Check for synthetic patterns
    if (text.match(/param_\d+/)) return false;
    if (text.match(/argument_\d+/)) return false;
    if (text.match(/#var\d+/)) return false;
    if (descHe.includes('וריאציה')) return false;
    if (descHe.includes('variation')) return false;
    if (descHe.includes('test config')) return false;
    
    return true;
});

const newCount = commands.length;
console.log(`Cleaned up ${originalCount - newCount} synthetic commands.`);
console.log(`Remaining authentic commands: ${newCount}`);

// Write back
const newContent = 'const commandsData = ' + JSON.stringify(commands, null, 2) + ';';
fs.writeFileSync(path, newContent, 'utf8');
console.log("Cleanup complete!");
