const fs = require('fs');
const path = 'C:\\Users\\Dorp\\.gemini\\antigravity-ide\\scratch\\tech-toolkit\\data\\commands.js';

let commands = [];

// ==========================================
// DEVOPS & DEV COMMANDS GENERATOR
// ==========================================
const devCategories = {
    "Git & Version Control": ["git commit -m", "git push origin", "git checkout -b", "git fetch", "git pull", "git merge", "git rebase", "git log --oneline"],
    "Docker & Containers": ["docker ps", "docker pull", "docker run -d -p", "docker build -t", "docker exec -it", "docker rm -f", "docker-compose up -d"],
    "Kubernetes": ["kubectl get pods", "kubectl describe pod", "kubectl logs -f", "kubectl apply -f", "kubectl delete -f", "kubectl exec -it"],
    "Node.js & NPM": ["npm install", "npm run build", "npm start", "npx create-react-app", "yarn add", "npm outdated"],
    "Python & PIP": ["pip install", "python -m venv", "python -m http.server", "pip freeze > requirements.txt", "pytest", "flake8"],
};

Object.keys(devCategories).forEach(cat => {
    devCategories[cat].forEach(cmdBase => {
        for(let i=1; i<=150; i++) {
            commands.push({
                command: `${cmdBase} argument_${i}`,
                descriptionHe: `פקודת ${cat} וריאציה ${i}: ${cmdBase}`,
                descriptionEn: `${cat} Command variation ${i}: ${cmdBase}`,
                category: cat,
                shell: "Terminal",
                os: "all"
            });
        }
    });
});

console.log(`Generated ${commands.length} massive Dev/DevOps commands...`);

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
    console.log("Injected Dev/DevOps commands successfully!");
}
