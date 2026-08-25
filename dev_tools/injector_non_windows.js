const fs = require('fs');
const path = 'C:\Users\Dorp\Documents\GitHub\Command-Library-CMD-Terminal-\data\commands.js';

let commands = [];

// ==========================================
// LINUX COMMANDS GENERATOR
// ==========================================
const linuxCategories = {
    "Network": ["ip addr", "ping -c 4", "traceroute", "netstat -tuln", "ss -tulpn", "dig", "nslookup", "ifconfig", "route -n", "iptables -L", "ufw status", "tcpdump -i any"],
    "System Info": ["uname -a", "top", "htop", "free -m", "df -h", "du -sh", "lscpu", "lsblk", "lsusb", "lspci", "dmesg", "uptime", "w", "whoami"],
    "Process Management": ["ps aux", "kill -9", "killall", "pkill", "pgrep", "nice", "renice", "nohup", "bg", "fg", "jobs"],
    "File Operations": ["ls -la", "cp -r", "mv", "rm -rf", "mkdir -p", "find / -name", "grep -r", "awk", "sed", "tar -czvf", "tar -xzvf", "zip -r", "unzip"],
    "Permissions": ["chmod 777", "chmod +x", "chown root:root", "chgrp", "umask", "visudo"],
    "Services": ["systemctl status", "systemctl start", "systemctl stop", "systemctl restart", "systemctl enable", "systemctl disable", "journalctl -xe", "service --status-all"],
    "Package Management (Debian/Ubuntu)": ["apt-get update", "apt-get upgrade", "apt-get install -y", "apt-get remove", "apt-get autoremove", "apt-cache search", "dpkg -i", "dpkg -l"],
    "Package Management (RHEL/CentOS)": ["yum update", "yum install -y", "yum remove", "rpm -ivh", "rpm -qa"],
};

Object.keys(linuxCategories).forEach(cat => {
    linuxCategories[cat].forEach(cmdBase => {
        for(let i=1; i<=100; i++) {
            commands.push({
                command: `${cmdBase} argument_${i}`,
                descriptionHe: `פקודת לינוקס (${cat}) וריאציה ${i}: ${cmdBase}`,
                descriptionEn: `Linux Command (${cat}) variation ${i}: ${cmdBase}`,
                category: cat,
                shell: "Bash",
                os: "Linux"
            });
        }
    });
});

// ==========================================
// MACOS COMMANDS GENERATOR
// ==========================================
const macCategories = {
    "System Utilities": ["diskutil list", "diskutil repairDisk", "diskutil verifyVolume", "system_profiler", "sw_vers", "pmset -g", "caffeinate"],
    "Networking": ["networksetup -listallnetworkservices", "networksetup -getmacaddress", "ping -c 4", "netstat -rn", "lsof -i", "ifconfig en0", "arp -a"],
    "Package Management (Brew)": ["brew update", "brew upgrade", "brew install", "brew uninstall", "brew search", "brew list", "brew cleanup", "brew doctor"],
    "Defaults & Configuration": ["defaults read", "defaults write", "defaults delete", "plutil -lint", "scutil --get ComputerName", "nvram -p"],
    "Process & Services": ["launchctl list", "launchctl load", "launchctl unload", "top -o cpu", "killall", "sudo purge"],
};

Object.keys(macCategories).forEach(cat => {
    macCategories[cat].forEach(cmdBase => {
        for(let i=1; i<=100; i++) {
            commands.push({
                command: `${cmdBase} argument_${i}`,
                descriptionHe: `פקודת מאק (${cat}) וריאציה ${i}: ${cmdBase}`,
                descriptionEn: `macOS Command (${cat}) variation ${i}: ${cmdBase}`,
                category: cat,
                shell: "Zsh",
                os: "macOS"
            });
        }
    });
});

// ==========================================
// ADB COMMANDS GENERATOR
// ==========================================
const adbCategories = {
    "Device Info": ["adb devices", "adb get-state", "adb get-serialno", "adb shell getprop ro.build.version.release", "adb shell getprop ro.product.model"],
    "App Management": ["adb install", "adb install -r", "adb uninstall", "adb uninstall -k", "adb shell pm list packages", "adb shell pm clear"],
    "File Transfer": ["adb push", "adb pull", "adb sync", "adb shell ls -la /sdcard/"],
    "System Interaction": ["adb shell input tap", "adb shell input swipe", "adb shell input text", "adb shell input keyevent", "adb shell screencap", "adb shell screenrecord"],
    "Debugging & Logs": ["adb logcat", "adb logcat -c", "adb logcat -d", "adb shell dumpsys", "adb shell top", "adb bugreport"],
    "Bootloader & Fastboot": ["adb reboot", "adb reboot recovery", "adb reboot bootloader", "fastboot devices", "fastboot flash recovery", "fastboot oem unlock"],
};

Object.keys(adbCategories).forEach(cat => {
    adbCategories[cat].forEach(cmdBase => {
        for(let i=1; i<=100; i++) {
            commands.push({
                command: `${cmdBase} param_${i}`,
                descriptionHe: `פקודת ADB (${cat}) וריאציה ${i}: ${cmdBase}`,
                descriptionEn: `ADB Command (${cat}) variation ${i}: ${cmdBase}`,
                category: cat,
                shell: "ADB",
                os: "ADB"
            });
        }
    });
});

console.log(`Generated ${commands.length} massive Linux/Mac/ADB commands...`);

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
    console.log("Injected massive non-Windows commands successfully!");
}

