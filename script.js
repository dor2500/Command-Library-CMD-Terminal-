const toast = document.getElementById('toast');

// Data State
let currentCommandCategory = 'all';
let currentSoftwareCategory = 'all';
let currentOS = 'Windows'; // Default OS
let currentLang = 'he'; // Default Language

const translations = {
    he: {
        subtitle: "ארגז הכלים לטכנאי",
        nav_commands: "מאגר פקודות",
        nav_software: "תוכנות חובה",
        nav_ai: "מחולל AI",
        nav_about: "אודות",
        search_cmd_placeholder: "חפש פקודה, תיאור או קטגוריה...",
        search_sw_placeholder: "חפש תוכנה (לדוגמה: Rufus, רשת, שחזור)...",
        found: "נמצאו",
        no_commands: "לא נמצאו פקודות מתאימות.",
        no_software: "לא נמצאו תוכנות.",
        all: "הכל",
        copy_success: "הפקודה הועתקה בהצלחה!",
        download: "הורדה / לאתר",
        main_title: "מאגר פקודות (CMD & PowerShell)",
        main_subtitle: "חפש מתוך אלפי פקודות מערכת, רשת ותיקון.",
        sw_title: "תוכנות חובה לטכנאים",
        sw_subtitle: "מאגר תוכנות ניידות וכלים שכל טכנאי חייב בדיסק און קי.",
        all_os: "הכל יחד",
        about_title: "אודות המערכת",
        about_subtitle: "Tech Toolkit - ארגז הכלים האולטימטיבי",
        about_p1: "ברוכים הבאים למאגר הפקודות והכלים הגדול והמתקדם מסוגו. המערכת נבנתה במיוחד עבור טכנאים, אנשי סיסטם ומפתחים המחפשים גישה מיידית לאלפי כלי עבודה, ללא תלות בחיבור לאינטרנט.",
        about_li1: "מאגר עצום: למעלה מ-25,000 פקודות מערכת, הכוללות פקודות PowerShell מובניות, מחלקות WMI, תהליכי שירות (Services), ופקודות טכנאים אותנטיות.",
        about_li2: "תמיכה מרובת פלטפורמות: כיסוי נרחב למערכות Windows, Linux, macOS וכלים למכשירי Android דרך ADB.",
        about_li3: "דו-לשוניות מלאה: כל הפקודות מתורגמות באופן מלא לאנגלית ולעברית, עם אפשרות החלפה בלחיצת כפתור אחת כולל התאמת יישור טקסט (RTL/LTR).",
        about_li4: "חיפוש חי וסינון: מנוע חיפוש חכם הפועל בצד הלקוח ומסוגל לסנן אלפי רשומות בזמן אמת לפי שם הפקודה, התיאור או הקטגוריה, ללא זמני טעינה (Zero Latency).",
        about_footer: "כל המידע נטען מקומית ואינו דורש שרת חיצוני. הקליקו על סמל ההעתקה לצד כל פקודה כדי להעתיק אותה מידית ללוח שלכם.",
        ai_title: "מחולל סקריפטים חכם (Gemini)",
        ai_subtitle: "תאר איזה סקריפט או פקודה אתה צריך, והבינה המלאכותית תייצר לך קובץ מוכן להורדה.",
        ai_welcome: "היי! אני עוזר ה-AI שלך. איזה סקריפט תרצה שאכתוב עבורך היום? (לדוגמה: 'תכתוב לי סקריפט PowerShell שמנקה קבצים זמניים')",
        ai_placeholder: "הקלד כאן את הבקשה שלך...",
        ai_download_btn: "הורד סקריפט מוכן",
        ai_status: "מעבד את הבקשה שלך ומכין את הסקריפט..."
    },
    en: {
        subtitle: "Technician's Toolkit",
        nav_commands: "Command Library",
        nav_software: "Essential Software",
        nav_ai: "AI Generator",
        nav_about: "About",
        search_cmd_placeholder: "Search command, description or category...",
        search_sw_placeholder: "Search software...",
        found: "found",
        no_commands: "No commands found.",
        no_software: "No software found.",
        all: "All",
        copy_success: "Command copied successfully!",
        download: "Download / Website",
        main_title: "Command Library (CMD & Terminal)",
        main_subtitle: "Search through thousands of system, network, and repair commands.",
        sw_title: "Essential Technician Software",
        sw_subtitle: "Portable tools and software every technician needs on a USB drive.",
        all_os: "All OS",
        about_title: "About The System",
        about_subtitle: "Tech Toolkit - The Ultimate Toolbox",
        about_p1: "Welcome to the largest and most advanced command library of its kind. Built specifically for technicians, sysadmins, and developers needing instant access to thousands of tools entirely offline.",
        about_li1: "Massive Database: Over 25,000 system commands, including native PowerShell cmdlets, WMI classes, Windows services, and authentic technician commands.",
        about_li2: "Multi-Platform Support: Extensive coverage for Windows, Linux, macOS, and Android devices via ADB.",
        about_li3: "Full Bilingual Support: All commands are fully translated to English and Hebrew, switchable with a single click including dynamic RTL/LTR text alignment.",
        about_li4: "Live Search & Filter: A powerful client-side search engine capable of filtering thousands of records in real-time by command name, description, or category with zero latency.",
        about_footer: "All data is loaded locally and requires no external server. Click the copy icon next to any command to instantly copy it to your clipboard.",
        ai_title: "Smart Script Generator (Gemini)",
        ai_subtitle: "Describe what script you need, and the AI will generate a ready-to-download file.",
        ai_welcome: "Hi! I'm your AI assistant. What script would you like me to write today? (e.g., 'Write a PowerShell script that clears temp files')",
        ai_placeholder: "Type your request here...",
        ai_download_btn: "Download Ready Script",
        ai_status: "Processing your request and preparing the script..."
    }
};

// Initialize
function loadData() {
    // Backwards compatibility for existing commands
    commandsData = commandsData.map(cmd => ({
        ...cmd,
        os: cmd.os || 'Windows',
        descriptionHe: cmd.descriptionHe || cmd.description,
        descriptionEn: cmd.descriptionEn || cmd.description
    }));

    initOSFilters();
    initLangToggle();
    initCommands();
    initSoftware();
    initAI();
}

function initLangToggle() {
    const langBtn = document.getElementById('langToggle');
    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'he' ? 'en' : 'he';
        document.documentElement.lang = currentLang;
        document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
        updateUIText();
        
        // Re-initialize to update translated categories and counts
        initCommands();
        initSoftware();
    });
}

function updateUIText() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });
    
    document.getElementById('commandSearch').placeholder = t.search_cmd_placeholder;
    document.getElementById('softwareSearch').placeholder = t.search_sw_placeholder;
}

function initOSFilters() {
    const osBtns = document.querySelectorAll('.os-btn');
    osBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            osBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            currentOS = e.currentTarget.getAttribute('data-os');
            currentCommandCategory = 'all'; // Reset category when changing OS
            initCommands(); // Re-init categories for this OS
        });
    });
}

// Navigation Logic
const navBtns = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        navBtns.forEach(b => b.classList.remove('active'));
        contentSections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

// ==========================================
// Commands Logic
// ==========================================
function initCommands() {
    const searchInput = document.getElementById('commandSearch');
    const categoriesContainer = document.getElementById('commandCategories');
    
    // Filter commands by current OS
    const osCommands = currentOS === 'all' ? commandsData : commandsData.filter(cmd => cmd.os === currentOS);
    
    // Extract unique categories for current OS
    const categories = ['all', ...new Set(osCommands.map(cmd => cmd.category))];
    const t = translations[currentLang];
    
    // Render Categories
    categoriesContainer.innerHTML = categories.map(cat => `
        <button class="filter-tag ${cat === currentCommandCategory ? 'active' : ''}" data-cat="${cat}">
            ${cat === 'all' ? t.all : cat}
        </button>
    `).join('');
    
    categoriesContainer.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            categoriesContainer.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentCommandCategory = e.target.getAttribute('data-cat');
            renderCommands();
        });
    });
    
    // Initial Render
    renderCommands();
    
    // Search Listener
    searchInput.addEventListener('input', () => {
        renderCommands();
    });
}

function renderCommands() {
    const grid = document.getElementById('commandsGrid');
    const countBadge = document.getElementById('commandCount');
    const searchTerm = document.getElementById('commandSearch').value.toLowerCase();
    
    // Filter data
    const filtered = commandsData.filter(cmd => {
        const descHe = cmd.descriptionHe || cmd.description || '';
        const descEn = cmd.descriptionEn || cmd.description || '';
        
        const matchesSearch = cmd.command.toLowerCase().includes(searchTerm) || 
                              descHe.toLowerCase().includes(searchTerm) ||
                              descEn.toLowerCase().includes(searchTerm) ||
                              cmd.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = currentCommandCategory === 'all' || cmd.category === currentCommandCategory;
        const matchesOS = currentOS === 'all' || cmd.os === currentOS;
        
        return matchesSearch && matchesCategory && matchesOS;
    });
    
    const t = translations[currentLang];
    countBadge.textContent = `${filtered.length} ${t.found}`;
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">${t.no_commands}</div>`;
        return;
    }
    
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    filtered.forEach((cmd, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        const desc = currentLang === 'he' ? (cmd.descriptionHe || cmd.description) : (cmd.descriptionEn || cmd.description);
        card.innerHTML = `
            <div class="card-header">
                <span class="card-category">${cmd.category}</span>
                <span class="card-shell">${cmd.shell}</span>
            </div>
            <div class="command-box" dir="ltr" style="display: flex; align-items: center; gap: 8px;">
                <span class="command-text" id="cmd-${index}" style="flex-grow: 1;">${cmd.command}</span>
                <button class="copy-btn" onclick="downloadCommandFile('cmd-${index}', '${cmd.shell}')" title="Download Script">
                    <i data-lucide="download" style="width: 18px; height: 18px;"></i>
                </button>
                <button class="copy-btn" onclick="copyCommand('cmd-${index}')" title="Copy to Clipboard">
                    <i data-lucide="copy" style="width: 18px; height: 18px;"></i>
                </button>
            </div>
            <p class="card-desc">${desc}</p>
        `;
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
    lucide.createIcons(); // Re-initialize icons for new elements
}

function copyCommand(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const t = translations[currentLang];
        showToast(t.copy_success);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function downloadCommandFile(elementId, shell) {
    const text = document.getElementById(elementId).innerText;
    let extension = '.txt';
    let content = text;
    
    // Generate a safe filename based on the command itself
    let safeName = text.split('\n')[0].replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 25).replace(/_$/, '');
    if (!safeName || safeName.length < 2) safeName = 'cmd_script';
    
    shell = (shell || '').toLowerCase();
    
    if (shell.includes('powershell')) {
        extension = '.ps1';
    } else if (shell.includes('cmd') || shell.includes('batch')) {
        extension = '.bat';
        content = '@echo off\n' + text + '\npause';
    } else if (shell.includes('bash') || shell.includes('zsh') || shell.includes('terminal')) {
        extension = '.sh';
        content = '#!/bin/bash\n\n' + text;
    } else if (shell.includes('adb')) {
        extension = '.bat';
        content = '@echo off\n' + text + '\npause';
    }
    
    const blob = new Blob([content.replace(/\n/g, '\r\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName + extension;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==========================================
// Software Logic
// ==========================================
function initSoftware() {
    const categoriesContainer = document.getElementById('softwareCategories');
    const searchInput = document.getElementById('softwareSearch');
    
    const categories = ['all', ...new Set(softwareData.map(sw => sw.category))];
    const t = translations[currentLang];
    
    categoriesContainer.innerHTML = categories.map(cat => `
        <button class="filter-tag ${cat === currentSoftwareCategory ? 'active' : ''}" data-cat="${cat}">
            ${cat === 'all' ? t.all : cat}
        </button>
    `).join('');
    
    categoriesContainer.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            categoriesContainer.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentSoftwareCategory = e.target.getAttribute('data-cat');
            renderSoftware();
        });
    });
    
    // Initial Render
    renderSoftware();
    
    // Search Listener
    searchInput.addEventListener('input', () => {
        renderSoftware();
    });
}

function renderSoftware() {
    const grid = document.getElementById('softwareGrid');
    const countBadge = document.getElementById('softwareCount');
    const searchTerm = document.getElementById('softwareSearch').value.toLowerCase();
    
    // Filter data
    const filtered = softwareData.filter(sw => {
        const descHe = sw.descriptionHe || sw.description || '';
        const descEn = sw.descriptionEn || sw.description || '';
        
        const matchesSearch = sw.name.toLowerCase().includes(searchTerm) || 
                              descHe.toLowerCase().includes(searchTerm) ||
                              descEn.toLowerCase().includes(searchTerm) ||
                              sw.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = currentSoftwareCategory === 'all' || sw.category === currentSoftwareCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    const t = translations[currentLang];
    
    if (countBadge) {
        countBadge.textContent = `${filtered.length} ${t.found}`;
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">${t.no_software}</div>`;
        return;
    }
    
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    filtered.forEach(sw => {
        const card = document.createElement('div');
        card.className = 'card';
        const desc = currentLang === 'he' ? (sw.descriptionHe || sw.description) : (sw.descriptionEn || sw.description);
        
        card.innerHTML = `
            <div class="card-header">
                <span class="card-category">${sw.category}</span>
            </div>
            <h3 class="software-title" dir="ltr" style="text-align: left;">${sw.name}</h3>
            <p class="card-desc">${desc}</p>
            <a href="${sw.url}" target="_blank" class="download-btn">
                <i data-lucide="external-link" style="width: 18px; height: 18px;"></i>
                ${t.download}
            </a>
        `;
        fragment.appendChild(card);
    });
    
    grid.appendChild(fragment);
    lucide.createIcons();
}

// Toast Notification
function showToast(message) {
    toast.querySelector('#toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Start Application
document.addEventListener('DOMContentLoaded', loadData);

// ==========================================
// AI Chat Logic (Gemini API)
// ==========================================
function initAI() {
    const sendBtn = document.getElementById('aiSendBtn');
    const inputField = document.getElementById('aiInput');
    
    // Prevent multiple bindings
    if (sendBtn.dataset.bound) return;
    sendBtn.dataset.bound = "true";

    const handleSend = () => {
        const text = inputField.value.trim();
        if (!text) return;
        inputField.value = '';
        addChatMessage(text, 'user-message');
        generateScript(text);
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
}

function addChatMessage(text, type, blobUrl = null, filename = null) {
    const log = document.getElementById('aiChatLog');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    
    if (blobUrl) {
        const t = translations[currentLang];
        bubble.innerHTML = `
            <p style="margin-bottom: 10px;">${text}</p>
            <a href="${blobUrl}" download="${filename}" class="download-btn" style="display: inline-flex; align-items: center; justify-content: center; width: auto; font-size: 14px; background: rgba(0, 255, 255, 0.1);">
                <i data-lucide="download" style="width: 16px; height: 16px; margin-inline-end: 8px;"></i>
                ${t.ai_download_btn} (${filename})
            </a>
        `;
    } else {
        bubble.textContent = text;
    }
    
    msgDiv.appendChild(bubble);
    log.appendChild(msgDiv);
    log.scrollTop = log.scrollHeight;
    lucide.createIcons();
    return msgDiv;
}

function addTypingIndicator() {
    const log = document.getElementById('aiChatLog');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot-message ai-typing-msg';
    msgDiv.innerHTML = `
        <div class="message-bubble" style="background: transparent; border: none; padding: 5px;">
            <div class="ai-typing">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    log.appendChild(msgDiv);
    log.scrollTop = log.scrollHeight;
    return msgDiv;
}

async function generateScript(prompt, useFallback = false) {
    const t = translations[currentLang];
    
    // Only show status message on first attempt
    let statusMsgDiv = null;
    if (!useFallback) {
        statusMsgDiv = addChatMessage(t.ai_status, 'bot-message');
    }
    const typingIndicator = addTypingIndicator();
    
    let apiKey = localStorage.getItem('tech_toolkit_api_key');
    if (!apiKey) {
        apiKey = prompt(currentLang === 'he' ? 'אנא הזן את מפתח ה-API שלך של Google Gemini:' : 'Please enter your Google Gemini API Key:');
        if (!apiKey) {
            typingIndicator.remove();
            if (statusMsgDiv) statusMsgDiv.remove();
            addChatMessage(currentLang === 'he' ? 'שגיאה: מפתח ה-API חסר.' : 'Error: API key is missing.', 'bot-message');
            return;
        }
        localStorage.setItem('tech_toolkit_api_key', apiKey);
    }
    const modelName = useFallback ? 'gemini-flash-lite-latest' : 'gemini-flash-latest';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const systemInstruction = `You are a strict, raw script generator for sysadmins. 
The user will ask for a script. 
CRITICAL RULE: The script content, including ALL comments, variables, and outputs, MUST be written ENTIRELY in English, regardless of the language the user used in their request.
Output ONLY the raw code for the script. NO conversational text, NO explanations, NO markdown wrappers (do not use \`\`\`).
Just output the plain text of the script. 
Also, the very FIRST line of your response MUST be a comment containing exactly the filename and extension you want to use, e.g. "# script.ps1" or ":: script.bat" or "# script.sh".`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Request: ${prompt}` }] }]
            })
        });

        const data = await response.json();
        typingIndicator.remove();
        if (statusMsgDiv) statusMsgDiv.remove();

        if (data.error) {
            // Auto fallback to a lighter model if high demand
            if (!useFallback && (data.error.code === 503 || data.error.message.includes('high demand') || data.error.message.includes('overloaded'))) {
                const retryMsg = currentLang === 'he' ? 'השרת הראשי עמוס, מנסה לעבור לשרת גיבוי...' : 'Main server busy, switching to fallback server...';
                const retryDiv = addChatMessage(retryMsg, 'bot-message');
                setTimeout(() => {
                    retryDiv.remove();
                    generateScript(prompt, true);
                }, 1500);
                return;
            }
            
            const errMsg = currentLang === 'he' ? `שגיאת שרת: ${data.error.message}` : `Server Error: ${data.error.message}`;
            addChatMessage(errMsg, 'bot-message');
            return;
        }

        let rawCode = data.candidates[0].content.parts[0].text.trim();
        
        // Strip markdown wrappers if the AI ignored instructions
        if (rawCode.startsWith('```')) {
            const lines = rawCode.split('\n');
            lines.shift(); // remove first ```lang
            if (lines[lines.length - 1].trim() === '```') lines.pop(); // remove last ```
            rawCode = lines.join('\n').trim();
        }

        // Extract filename from first line
        let filename = 'script.txt';
        const lines = rawCode.split('\n');
        const firstLine = lines[0].trim();
        if (firstLine.startsWith('#') || firstLine.startsWith('::') || firstLine.startsWith('//')) {
            const nameMatch = firstLine.match(/([a-zA-Z0-9_-]+\.(ps1|bat|sh|py|js|cmd))/i);
            if (nameMatch) {
                filename = nameMatch[1];
            }
        } else {
            // fallback guess
            if (rawCode.toLowerCase().includes('write-host') || rawCode.toLowerCase().includes('get-')) filename = 'script.ps1';
            else if (rawCode.toLowerCase().includes('@echo off')) filename = 'script.bat';
            else if (rawCode.startsWith('#!/bin/')) filename = 'script.sh';
        }

        const blob = new Blob([rawCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const successMsg = currentLang === 'he' ? 'הנה הסקריפט שלך! לחץ על הכפתור למטה כדי להוריד אותו:' : 'Here is your script! Click the button below to download it:';
        addChatMessage(successMsg, 'bot-message', url, filename);

    } catch (err) {
        typingIndicator.remove();
        statusMsgDiv.remove();
        addChatMessage('An error occurred while connecting to the AI. Please try again.', 'bot-message');
        console.error(err);
    }
}
