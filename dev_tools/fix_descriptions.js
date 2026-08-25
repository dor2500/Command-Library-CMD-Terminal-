
const fs = require('fs');
const path = 'C:/Users/Dorp/Documents/GitHub/Command-Library-CMD-Terminal-/data/commands.js';

let content = fs.readFileSync(path, 'utf8');
content = content.replace(/^(const|let) commandsData = /, '');
if(content.endsWith(';')) content = content.substring(0, content.length - 1);

let data = eval(content);

const verbTranslations = {
    'Get': 'קבלת מידע על',
    'Set': 'הגדרת',
    'New': 'יצירת',
    'Remove': 'מחיקת',
    'Start': 'הפעלת',
    'Stop': 'עצירת',
    'Restart': 'הפעלה מחדש של',
    'Enable': 'הפעלת/אפשור',
    'Disable': 'השבתת',
    'Clear': 'ניקוי',
    'Export': 'ייצוא נתונים עבור',
    'Import': 'ייבוא נתונים עבור',
    'Invoke': 'הרצת',
    'Add': 'הוספת',
    'Update': 'עדכון',
    'Show': 'הצגת',
    'Test': 'בדיקת תקינות של',
    'Format': 'עיצוב פלט של',
    'Out': 'הוצאת פלט אל'
};

const commonAliases = {
    'dir': 'הצגת רשימת הקבצים והתיקיות בספרייה הנוכחית',
    'ls': 'הצגת רשימת הקבצים והתיקיות בספרייה הנוכחית',
    'cd': 'מעבר לספרייה (תיקייה) אחרת',
    'pwd': 'הצגת הנתיב המלא של התיקייה הנוכחית',
    'echo': 'הדפסת טקסט או משתנים למסך',
    'clear': 'ניקוי המסך מכל הפלט הקודם',
    'cls': 'ניקוי המסך מכל הפלט הקודם',
    'pushd': 'שמירת התיקייה הנוכחית בזכרון ומעבר לתיקייה חדשה',
    'popd': 'חזרה לתיקייה הקודמת שנשמרה בזכרון (על ידי pushd)',
    'cat': 'הצגת תוכן של קובץ טקסט על המסך'
};

let fixedCount = 0;

data.forEach(cmd => {
    if(cmd.descriptionHe && cmd.descriptionHe.includes('פקודת PowerShell מקורית:')) {
        let cmdName = cmd.command.split(' ')[0].trim();
        
        if (commonAliases[cmdName.toLowerCase()]) {
            cmd.descriptionHe = commonAliases[cmdName.toLowerCase()];
            fixedCount++;
            return;
        }

        if(cmdName.includes('-')) {
            let parts = cmdName.split('-');
            let verb = parts[0];
            let noun = parts.slice(1).join('-');
            
            let hebrewVerb = verbTranslations[verb] || 'פעולת PowerShell על';
            let prettyNoun = noun.replace(/([A-Z])/g, ' ').trim();
            
            cmd.descriptionHe = hebrewVerb + ' ' + prettyNoun;
            fixedCount++;
            return;
        }
        
        cmd.descriptionHe = 'פקודת מערכת מתקדמת לניהול ' + cmdName;
        fixedCount++;
    }
});

let newJson = JSON.stringify(data, null, 2);
fs.writeFileSync(path, 'const commandsData = ' + newJson + ';', 'utf8');
console.log('Fixed ' + fixedCount + ' descriptions.');

