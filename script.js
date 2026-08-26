const toast = document.getElementById('toast');


// Favorites State
let favorites = JSON.parse(localStorage.getItem('tech_toolkit_favorites')) || [];

function toggleFavorite(commandId) {
    const index = favorites.indexOf(commandId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(commandId);
    }
    localStorage.setItem('tech_toolkit_favorites', JSON.stringify(favorites));
    renderCommands(); // Re-render to update star icons and filters
}

// Global Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Focus search on "/"
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection.id === 'commands-section') {
            document.getElementById('commandSearch').focus();
        } else if (activeSection.id === 'software-section') {
            document.getElementById('softwareSearch').focus();
        }
    }
    // Clear search on "Escape"
    if (e.key === 'Escape') {
        if (document.activeElement.id === 'commandSearch') {
            document.activeElement.value = '';
            document.activeElement.blur();
            renderCommands();
        } else if (document.activeElement.id === 'softwareSearch') {
            document.activeElement.value = '';
            document.activeElement.blur();
            renderSoftware();
        }
    }
});

// Syntax Highlighting formatting function
function formatCommandText(text) {
    // Escape HTML tags first
    let formatted = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Highlight paths (C:\... or /var/...)
    formatted = formatted.replace(/([a-zA-Z]:\\[^\s]+|\/[a-zA-Z0-9_.-]+(\/[a-zA-Z0-9_.-]+)+)/g, '<span class="sh-path">$1</span>');
    
    // Highlight flags (-f, /f, --force)
    formatted = formatted.replace(/(\s)(-[a-zA-Z0-9]+|--[a-zA-Z0-9\-]+|\/[a-zA-Z0-9]+)/g, '$1<span class="sh-flag">$2</span>');
    
    return formatted;
}

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
        favorites: "מועדפים",
        copy_success: "הפקודה הועתקה בהצלחה!",
        download: "הורדה / לאתר",
        main_title: "מאגר פקודות (CMD & PowerShell)",
        main_subtitle: "חפש מתוך אלפי פקודות מערכת, רשת ותיקון.",
        sw_title: "תוכנות חובה לטכנאים",
        sw_subtitle: "מאגר תוכנות ניידות וכלים שכל טכנאי חייב בדיסק און קי.",
        all_os: "הכל יחד",
        favorites: "מועדפים",
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
        favorites: "Favorites",
        copy_success: "Command copied successfully!",
        download: "Download / Website",
        main_title: "Command Library (CMD & Terminal)",
        main_subtitle: "Search through thousands of system, network, and repair commands.",
        sw_title: "Essential Technician Software",
        sw_subtitle: "Portable tools and software every technician needs on a USB drive.",
        all_os: "All OS",
        favorites: "Favorites",
        about_title: "About The System",
        about_subtitle: "Tech Toolkit - The Ultimate Toolbox",
        about_p1: "Welcome to the largest and most advanced command library of its kind. Built specifically for technicians, sysadmins, and developers needing instant access to thousands of tools entirely offline.",
        about_li1: "Massive Database: Over 25,000 system commands, including native PowerShell cmdlets, WMI classes, Windows services, and authentic technician commands.",
        about_li2: "Multi-Platform Support: Extensive coverage for Windows, Linux, macOS, and Android devices via ADB.",
        about_li3: "Full Bilingual Support: All commands are fully translated to English and Hebrew, switchable with a single click including dynamic RTL/LTR text alignment.",
        theme_light: "Light Mode",
        theme_dark: "Dark Mode",
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

// Debounce helper to prevent UI lag while typing
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initialize
function loadData() {
    initThemeToggle();
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
    updateThemeText();
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


function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlEl.setAttribute('data-theme', 'light');
    } else {
        htmlEl.removeAttribute('data-theme');
    }
    updateThemeText();
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (htmlEl.getAttribute('data-theme') === 'light') {
                htmlEl.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlEl.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
            updateThemeText();
        });
    }
}

function updateThemeText() {
    const themeText = document.getElementById('themeToggleText');
    const themeIcon = document.querySelector('#themeToggle i');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const t = translations[currentLang];
    
    if (themeText && t) {
        themeText.textContent = isLight ? (t.theme_dark || 'Dark Mode') : (t.theme_light || 'Light Mode');
    }
    
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        if (window.lucide) {
            lucide.createIcons();
        }
    }
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
    
    // Search Listener with Debounce (fixes lag when typing)
    searchInput.addEventListener('input', debounce(() => {
        renderCommands();
    }, 250));
}

function renderCommands() {
    const grid = document.getElementById('commandsGrid');
    const countBadge = document.getElementById('commandCount');
    const searchTerm = document.getElementById('commandSearch').value.toLowerCase();
    
    // Filter data
    const filtered = commandsData.filter(cmd => {
        const descHe = cmd.descriptionHe || cmd.description || '';
        const descEn = cmd.descriptionEn || cmd.description || '';
        
        const searchWords = searchTerm.trim().split(/\s+/);
        const searchString = `${cmd.command} ${descHe} ${descEn} ${cmd.category}`.toLowerCase();
        const matchesSearch = searchWords.every(word => searchString.includes(word));
        
        const matchesCategory = currentCommandCategory === 'all' || cmd.category === currentCommandCategory;
        let matchesOS = currentOS === 'all' || cmd.os === currentOS;
        if (currentOS === 'favorites') {
            matchesOS = favorites.includes(cmd.id || cmd.command); // Fallback to command string if no id
        }
        
        return matchesSearch && matchesCategory && matchesOS;
    });
    
    const t = translations[currentLang];
    
    // Performance: limit rendering to 300 items max
    const maxResults = 300;
    const isLimited = filtered.length > maxResults;
    const itemsToRender = filtered.slice(0, maxResults);
    
    if (isLimited) {
        countBadge.textContent = `${filtered.length} ${t.found} (Showing first ${maxResults})`;
    } else {
        countBadge.textContent = `${filtered.length} ${t.found}`;
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">${t.no_commands}</div>`;
        return;
    }
    
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    itemsToRender.forEach((cmd, index) => {
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
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const t = translations[currentLang];
        showToast(t.copy_success);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function downloadCommandFile(elementId, shell) {
    const text = document.getElementById(elementId).textContent;
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
    
    // Search Listener with Debounce
    searchInput.addEventListener('input', debounce(() => {
        renderSoftware();
    }, 250));
}

function renderSoftware() {
    const grid = document.getElementById('softwareGrid');
    const countBadge = document.getElementById('softwareCount');
    const searchTerm = document.getElementById('softwareSearch').value.toLowerCase();
    
    // Filter data
    const filtered = softwareData.filter(sw => {
        const descHe = sw.descriptionHe || sw.description || '';
        const descEn = sw.descriptionEn || sw.description || '';
        
        const searchWords = searchTerm.trim().split(/\s+/);
        const searchString = `${sw.name} ${descHe} ${descEn} ${sw.category}`.toLowerCase();
        const matchesSearch = searchWords.every(word => searchString.includes(word));
        
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

// UX: Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// UX: Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press '/' to focus search
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection.id === 'commands') {
            document.getElementById('commandSearch').focus();
        } else if (activeSection.id === 'software') {
            document.getElementById('softwareSearch').focus();
        }
    }
});

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

// --- New Module Integrations --- //

// Winget Selection & Generation
document.addEventListener('DOMContentLoaded', () => {
    // Nav logic update for new sections
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    const wingetData = {
        "Web Browsers": [
            { id: "Google.Chrome", name: "Google Chrome", rec: true },
            { id: "Mozilla.Firefox", name: "Mozilla Firefox", rec: true },
            { id: "Brave.Brave", name: "Brave" }
        ],
        "Utilities": [
            { id: "7zip.7zip", name: "7-Zip", rec: true },
            { id: "Rufus.Rufus", name: "Rufus", rec: true }
        ]
    };

    const wContainer = document.getElementById('wingetCategories');
    if (wContainer) {
        for (const [cat, apps] of Object.entries(wingetData)) {
            let html = `<div style="margin-bottom:10px;"><h4>${cat}</h4><div style="display:flex;gap:10px;flex-wrap:wrap;">`;
            apps.forEach(app => {
                html += `<label><input type="checkbox" class="winget-chk" value="${app.id}" data-rec="${app.rec}"> ${app.name}</label>`;
            });
            html += `</div></div>`;
            wContainer.innerHTML += html;
        }
    }

    const generateWinget = () => {
        const selected = Array.from(document.querySelectorAll('.winget-chk:checked')).map(c => c.value);
        return selected.length ? `winget install --id ${selected.join(" ")} -e --accept-package-agreements` : "";
    };

    const btnGenW = document.getElementById('btnGenerateWinget');
    if (btnGenW) {
        btnGenW.addEventListener('click', () => {
            document.getElementById('wingetOutput').value = generateWinget();
        });
    }

    const btnStore = document.getElementById('btnGenerateStore');
    if (btnStore) {
        btnStore.addEventListener('click', () => {
            let input = document.getElementById('storeInput').value.trim();
            let idMatch = input.match(/9[A-Z0-9]{9,13}/i);
            let extractedId = idMatch ? idMatch[0] : input;
            if (!extractedId) extractedId = "INVALID_ID";
            document.getElementById('storeWingetOutput').value = `winget download --id ${extractedId} -e --accept-package-agreements`;
            document.getElementById('storeAdguardLink').href = `https://store.rg-adguard.net/?type=ProductId&url=${extractedId}`;
            // Re-render lucide icons if needed
            if (window.lucide) lucide.createIcons();
        });
    }
});


// --- Additional Fixes Logic --- //
document.addEventListener('DOMContentLoaded', () => {
    
    // Store Downloader .bat logic
    const btnDownloadStoreBat = document.getElementById('btnDownloadStoreBat');
    if (btnDownloadStoreBat) {
        btnDownloadStoreBat.addEventListener('click', () => {
            let input = document.getElementById('storeInput').value.trim();
            let idMatch = input.match(/9[A-Z0-9]{9,13}/i);
            let extractedId = idMatch ? idMatch[0] : input;
            if (!extractedId) {
                alert("Please enter a valid MS Store link or ID.");
                return;
            }
            
            const batContent = `@echo off\ncolor 0A\necho Downloading AppX package from MS Store...\nwinget download --id ${extractedId} -e --accept-package-agreements\necho.\npause`;
            const blob = new Blob([batContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MS_Store_${extractedId}.bat`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Windows Shortcuts Logic
    const shortcutsGrid = document.getElementById('shortcutsGrid');
    if (shortcutsGrid) {
        const shortcuts = [
            { name: "Network Connections", cmd: "ncpa.cpl", icon: "wifi" },
            { name: "Programs & Features", cmd: "appwiz.cpl", icon: "trash-2" },
            { name: "Computer Management", cmd: "compmgmt.msc", icon: "monitor" },
            { name: "Device Manager", cmd: "devmgmt.msc", icon: "cpu" },
            { name: "System Properties", cmd: "sysdm.cpl", icon: "settings" },
            { name: "Disk Management", cmd: "diskmgmt.msc", icon: "hard-drive" }
        ];
        
        let sHtml = '';
        shortcuts.forEach(s => {
            sHtml += `<div class="about-card glass-panel" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:10px; align-items:center;">
                    <i data-lucide="${s.icon}" style="color:var(--text-main);"></i>
                    <span style="font-weight:500;">${s.name}</span>
                </div>
                <div style="font-family:'Fira Code', monospace; color:var(--text-muted);">${s.cmd}</div>
            </div>`;
        });
        shortcutsGrid.innerHTML = sHtml;
    }

    // Hardware Diagnostics (Display Test)
    const btnDisplayTest = document.getElementById('btnDisplayTest');
    if (btnDisplayTest) {
        btnDisplayTest.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0'; overlay.style.left = '0';
            overlay.style.width = '100vw'; overlay.style.height = '100vh';
            overlay.style.zIndex = '999999';
            overlay.style.cursor = 'pointer';
            
            const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];
            let colorIndex = 0;
            overlay.style.backgroundColor = colors[colorIndex];
            
            overlay.addEventListener('click', () => {
                colorIndex++;
                if (colorIndex >= colors.length) {
                    document.body.removeChild(overlay);
                    if (document.exitFullscreen) document.exitFullscreen();
                } else {
                    overlay.style.backgroundColor = colors[colorIndex];
                }
            });
            
            document.body.appendChild(overlay);
            if (overlay.requestFullscreen) overlay.requestFullscreen();
        });
    }

    // Script Generators (Health check)
    const btnHealth = document.getElementById('btnGenerateHealthBat');
    if (btnHealth) {
        btnHealth.addEventListener('click', () => {
            let cmds = [`@echo off`, `color 0A`, `echo Starting Windows Health Repair...`, `echo Please ensure this is running as Administrator!`, `pause`];
            if (document.getElementById('chkSFC').checked) cmds.push(`sfc /scannow`);
            if (document.getElementById('chkDISM').checked) cmds.push(`DISM /Online /Cleanup-Image /RestoreHealth`);
            cmds.push(`echo Done!`, `pause`);
            
            const blob = new Blob([cmds.join('\n')], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Windows_Health_Repair.bat`;
            a.click();
        });
    }

    // Network Tools (Reset)
    const btnNet = document.getElementById('btnNetResetBat');
    if (btnNet) {
        btnNet.addEventListener('click', () => {
            let cmds = [`@echo off`, `color 0A`, `echo Resetting Network Settings...`, `ipconfig /release`, `ipconfig /flushdns`, `ipconfig /renew`, `netsh winsock reset`, `echo Network reset complete. Please restart your computer.`, `pause`];
            
            const blob = new Blob([cmds.join('\n')], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Network_Reset.bat`;
            a.click();
        });
    }

    if (window.lucide) {
        lucide.createIcons();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnAdguardSearch');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const type = document.getElementById('adguardType').value;
            let val = document.getElementById('adguardInput').value.trim();
            const ring = document.getElementById('adguardRing').value;
            
            if (!val) {
                alert('Please enter a value to search.');
                return;
            }
            
            // If user pastes full URL but selected ProductId, try to extract ID
            if (type === 'ProductId' && val.includes('http')) {
                let idMatch = val.match(/9[A-Z0-9]{9,13}/i);
                if (idMatch) val = idMatch[0];
            }
            
            const targetUrl = `https://store.rg-adguard.net/?type=${type}&url=${encodeURIComponent(val)}&ring=${ring}&lang=en-US`;
            window.open(targetUrl, '_blank');
        });
    }
});
