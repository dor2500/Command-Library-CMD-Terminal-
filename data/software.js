const softwareData = [
  {
    "name": "Sysinternals Suite",
    "description": "אוסף כלי תשתית וניהול מתקדמים של מיקרוסופט (Process Explorer, Autoruns ועוד).",
    "category": "System Utilities",
    "url": "https://docs.microsoft.com/en-us/sysinternals/downloads/sysinternals-suite"
  },
  {
    "name": "Rufus",
    "description": "הכלי המהיר והטוב ביותר ליצירת כונני USB הניתנים לאתחול (Bootable USB) להתקנת מערכות הפעלה.",
    "category": "OS Installation",
    "url": "https://rufus.ie/"
  },
  {
    "name": "HWiNFO",
    "description": "כלי אבחון חומרה וניטור מערכת מקיף וחינמי. קורא סנסורים טמפרטורות, מתחים ומידע מפורט על כל רכיב.",
    "category": "Hardware Diagnostics",
    "url": "https://www.hwinfo.com/"
  },
  {
    "name": "Malwarebytes",
    "description": "כלי חובה לסריקה והסרה של תוכנות זדוניות, וירוסים, רוגלות ותוכנות כופר שתוכנות אנטי וירוס רגילות מפספסות.",
    "category": "Security / Anti-Malware",
    "url": "https://www.malwarebytes.com/"
  },
  {
    "name": "Ninite",
    "description": "התקנה ושדרוג אוטומטי ובצובר של כל התוכנות הבסיסיות (Chrome, 7-Zip, VLC וכו') במכה אחת, ללא שאלות.",
    "category": "Software Installation",
    "url": "https://ninite.com/"
  },
  {
    "name": "CrystalDiskInfo",
    "description": "בדיקת תקינות ובריאות של כונני אחסון (HDD / SSD), כולל קריאת נתוני S.M.A.R.T. כדי למנוע קריסות פתאומיות.",
    "category": "Hardware Diagnostics",
    "url": "https://crystalmark.info/en/software/crystaldiskinfo/"
  },
  {
    "name": "WizTree / WinDirStat",
    "description": "מיפוי ויזואלי של הדיסק הקשיח. WizTree מהיר פי כמה ומאפשר למצוא בקלות קבצים ענקיים שתופסים מקום.",
    "category": "Disk Management",
    "url": "https://diskanalyzer.com/"
  },
  {
    "name": "AIDA64 (Extreme)",
    "description": "כלי מתקדם מאוד למידע חומרה, ספסולים (Benchmarks) ובדיקות מאמץ ליציבות המערכת (Stress Tests).",
    "category": "Hardware Diagnostics",
    "url": "https://www.aida64.com/"
  },
  {
    "name": "CPU-Z",
    "description": "כלי קליל ומהיר לקבלת כל המידע האפשרי על המעבד, לוח האם והזיכרון של המחשב.",
    "category": "Hardware Diagnostics",
    "url": "https://www.cpuid.com/softwares/cpu-z.html"
  },
  {
    "name": "GPU-Z",
    "description": "המקבילה של CPU-Z עבור כרטיס המסך. מידע על טמפרטורות, גרסת דרייברים, ביוס ועוד.",
    "category": "Hardware Diagnostics",
    "url": "https://www.techpowerup.com/gpuz/"
  },
  {
    "name": "Recuva",
    "description": "תוכנה לשחזור קבצים שנמחקו בטעות מבית היוצר של CCleaner. פשוטה ויעילה למקרים קלים.",
    "category": "Data Recovery",
    "url": "https://www.ccleaner.com/recuva"
  },
  {
    "name": "TestDisk & PhotoRec",
    "description": "כלי קוד פתוח רבי עוצמה לשחזור מחיצות פגומות, מתקן טבלאות מחיצה ושחזור נתונים קריטי.",
    "category": "Data Recovery",
    "url": "https://www.cgsecurity.org/wiki/TestDisk_Download"
  },
  {
    "name": "Advanced IP Scanner",
    "description": "סורק רשת מהיר שמציג את כל המחשבים והמכשירים המחוברים לרשת מקומית, מאפשר התחברות לתיקיות ו-RDP.",
    "category": "Network Tools",
    "url": "https://www.advanced-ip-scanner.com/"
  },
  {
    "name": "Wireshark",
    "description": "מנתח פרוטוקולי רשת מתקדם. חובה לאיתור תקלות רשת מורכבות וניתוח תעבורה.",
    "category": "Network Tools",
    "url": "https://www.wireshark.org/"
  },
  {
    "name": "AnyDesk / TeamViewer / RustDesk",
    "description": "תוכנות לשליטה מרחוק על מחשבים. RustDesk מהווה חלופה חינמית מצוינת וקוד פתוח.",
    "category": "Remote Desktop",
    "url": "https://rustdesk.com/"
  },
  {
    "name": "Snappy Driver Installer Origin (SDIO)",
    "description": "אוסף הדרייברים האופליין הגדול בעולם להתקנת דרייברים לכל מחשב ללא חיבור לאינטרנט. נקי מפרסומות.",
    "category": "Drivers & Updates",
    "url": "https://www.snappy-driver-installer.org/"
  },
  {
    "name": "Revo Uninstaller",
    "description": "הסרת תוכנות מהשורש כולל ניקוי השאריות ברג'יסטרי ובקבצי המערכת שהתוכנית הרגילה משאירה.",
    "category": "System Utilities",
    "url": "https://www.revouninstaller.com/"
  },
  {
    "name": "Veeam Agent for Microsoft Windows",
    "description": "כלי גיבוי מלא ברמת בלוקים בחינם. מושלם לגיבוי מחשבים ניידים ושרתים פשוטים לאחסון חיצוני או NAS.",
    "category": "Backup & Imaging",
    "url": "https://www.veeam.com/windows-endpoint-server-backup-free.html"
  },
  {
    "name": "Macrium Reflect (Free edition)",
    "description": "יצירת אימג' (Image) לכוננים ושכפול דיסקים (Cloning) במהירות. מעולה למעבר מ-HDD ל-SSD.",
    "category": "Backup & Imaging",
    "url": "https://www.macrium.com/reflectfree"
  },
  {
    "name": "O&O ShutUp10++",
    "description": "כלי לחסימת טלמטריה ומעקב של ווינדוס 10/11. מחזיר למשתמש את השליטה על הפרטיות.",
    "category": "System Tweaks",
    "url": "https://www.oo-software.com/en/shutup10"
  }
]
;
