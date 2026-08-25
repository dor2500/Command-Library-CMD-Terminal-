const fs = require('fs');
const path = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\data\\commands.js';

const commands = [
    // System Repair
    { command: "chkdsk /f /r C:", descriptionHe: "סריקה ותיקון סקטורים פגומים בדיסק", descriptionEn: "Scan and repair bad sectors on disk", category: "System Repair", shell: "CMD (Admin)", os: "Windows" },
    { command: "bootrec /fixmbr", descriptionHe: "תיקון רשומת האתחול הראשית (MBR)", descriptionEn: "Fix Master Boot Record (MBR)", category: "System Repair", shell: "WinRE CMD", os: "Windows" },
    { command: "bootrec /fixboot", descriptionHe: "כתיבת סקטור אתחול חדש לוינדוס", descriptionEn: "Write new boot sector", category: "System Repair", shell: "WinRE CMD", os: "Windows" },
    { command: "bootrec /rebuildbcd", descriptionHe: "בנייה מחדש של נתוני האתחול (BCD)", descriptionEn: "Rebuild Boot Configuration Data", category: "System Repair", shell: "WinRE CMD", os: "Windows" },
    { command: "DISM /Online /Cleanup-Image /ScanHealth", descriptionHe: "סריקת תמונת וינדוס לאיתור שגיאות", descriptionEn: "Scan Windows image for corruption", category: "System Repair", shell: "CMD (Admin)", os: "Windows" },
    { command: "wusa /uninstall /kb:XXXXXX", descriptionHe: "הסרת עדכון וינדוס פגום לפי מספר מזהה", descriptionEn: "Uninstall Windows Update by KB number", category: "System Repair", shell: "CMD (Admin)", os: "Windows" },
    
    // Networking
    { command: "ipconfig /release", descriptionHe: "שחרור כתובת IP נוכחית", descriptionEn: "Release current IP address", category: "Networking", shell: "CMD", os: "Windows" },
    { command: "ipconfig /renew", descriptionHe: "חידוש כתובת IP משרת DHCP", descriptionEn: "Renew IP address from DHCP", category: "Networking", shell: "CMD", os: "Windows" },
    { command: "netsh int ip reset", descriptionHe: "איפוס הגדרות TCP/IP", descriptionEn: "Reset TCP/IP configuration", category: "Networking", shell: "CMD (Admin)", os: "Windows" },
    { command: "tracert 8.8.8.8", descriptionHe: "בדיקת נתיב הניתוב לשרת של גוגל", descriptionEn: "Trace route to Google DNS", category: "Networking", shell: "CMD", os: "Windows" },
    { command: "pathping 8.8.8.8", descriptionHe: "בדיקת נתיב משולבת עם פינג ואובדן חבילות", descriptionEn: "Trace route with packet loss statistics", category: "Networking", shell: "CMD", os: "Windows" },
    { command: "netstat -ano", descriptionHe: "הצגת כל החיבורים הפעילים והפורטים", descriptionEn: "Show all active connections and ports", category: "Networking", shell: "CMD", os: "Windows" },
    { command: "nslookup google.com", descriptionHe: "שאילתת שרת DNS עבור דומיין", descriptionEn: "Query DNS server for domain", category: "Networking", shell: "CMD", os: "Windows" },
    { command: "Get-NetAdapter", descriptionHe: "הצגת כל כרטיסי הרשת במחשב", descriptionEn: "List all network adapters", category: "Networking", shell: "PowerShell", os: "Windows" },
    
    // Disk Utilities
    { command: "diskpart", descriptionHe: "כניסה לכלי ניהול הדיסקים", descriptionEn: "Enter Disk Partition tool", category: "Disk Utilities", shell: "CMD (Admin)", os: "Windows" },
    { command: "fsutil fsinfo drives", descriptionHe: "הצגת כל הכוננים המחוברים", descriptionEn: "List all mapped drives", category: "Disk Utilities", shell: "CMD (Admin)", os: "Windows" },
    { command: "vssadmin list shadows", descriptionHe: "הצגת כל נקודות השחזור והצלליות", descriptionEn: "List all Volume Shadow Copies", category: "Disk Utilities", shell: "CMD (Admin)", os: "Windows" },
    
    // Linux System Repair
    { command: "fsck /dev/sda1", descriptionHe: "סריקה ותיקון שגיאות בדיסק בלינוקס", descriptionEn: "Filesystem consistency check and repair", category: "System Repair", shell: "Bash (Root)", os: "Linux" },
    { command: "update-grub", descriptionHe: "עדכון תפריט האתחול של GRUB", descriptionEn: "Update GRUB bootloader menu", category: "System Repair", shell: "Bash (Root)", os: "Linux" },
    { command: "systemctl failed", descriptionHe: "הצגת שירותים שנכשלו בעליית המערכת", descriptionEn: "List failed systemd services", category: "System Repair", shell: "Bash", os: "Linux" },
    { command: "dpkg --configure -a", descriptionHe: "תיקון חבילות שבורות שלא הותקנו כראוי", descriptionEn: "Fix broken package installations", category: "System Repair", shell: "Bash (Root)", os: "Linux" },
    { command: "apt-get install -f", descriptionHe: "תיקון תלויות שבורות במערכת", descriptionEn: "Fix broken dependencies", category: "System Repair", shell: "Bash (Root)", os: "Linux" },
    
    // Linux Networking
    { command: "netstat -tuln", descriptionHe: "הצגת כל הפורטים הפתוחים והמאזינים", descriptionEn: "Show all listening ports", category: "Networking", shell: "Bash", os: "Linux" },
    { command: "ss -tulpn", descriptionHe: "הצגת תהליכים ופורטים פעילים (חלופה ל-netstat)", descriptionEn: "Show socket stats and processes", category: "Networking", shell: "Bash", os: "Linux" },
    { command: "dig +short example.com", descriptionHe: "שליפת כתובת IP מדומיין", descriptionEn: "DNS lookup for domain", category: "Networking", shell: "Bash", os: "Linux" },
    { command: "iptables -L -n -v", descriptionHe: "הצגת כל חוקי חומת האש", descriptionEn: "List firewall rules", category: "Networking", shell: "Bash (Root)", os: "Linux" },
    
    // ADB Commands
    { command: "adb devices", descriptionHe: "הצגת כל המכשירים המחוברים", descriptionEn: "List connected devices", category: "Device Management", shell: "ADB", os: "ADB" },
    { command: "adb reboot recovery", descriptionHe: "הפעלה מחדש למצב צריבה (Recovery)", descriptionEn: "Reboot into Recovery mode", category: "System Repair", shell: "ADB", os: "ADB" },
    { command: "adb reboot bootloader", descriptionHe: "הפעלה מחדש למצב Fastboot", descriptionEn: "Reboot into Fastboot mode", category: "System Repair", shell: "ADB", os: "ADB" },
    { command: "adb logcat -c", descriptionHe: "ניקוי יומן הרישום של המכשיר", descriptionEn: "Clear device log buffer", category: "System Repair", shell: "ADB", os: "ADB" },
    { command: "adb shell pm clear com.android.chrome", descriptionHe: "איפוס נתוני אפליקציה (כרום לדוגמה)", descriptionEn: "Clear app data (e.g. Chrome)", category: "System Repair", shell: "ADB", os: "ADB" }
];

let content = fs.readFileSync(path, 'utf8').trim();

if (content.endsWith('];')) {
    content = content.substring(0, content.length - 2);
}
if (content.endsWith('] ;')) {
    content = content.substring(0, content.length - 3);
}
content = content.trim();

let newJson = JSON.stringify(commands, null, 2);

if (newJson.length > 4) {
    newJson = newJson.substring(1, newJson.length - 2);
    const finalContent = content + ",\n" + newJson + "\n];";
    fs.writeFileSync(path, finalContent, 'utf8');
    console.log("Injected specialized tech commands successfully!");
}
