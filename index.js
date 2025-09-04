#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];

if (!projectName) {
  console.error(
    "❌ Please provide a project name: npx create-rs-app <project-name>"
  );
  process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);

// Clone boilerplate
console.log("📥 Downloading boilerplate...");
execSync(
  `git clone --depth 1 https://github.com/Nitin1229/rs-prjkt.git "${projectName}"`,
  { stdio: "inherit" }
);

// Replace occurrences of rs-prjkt with projectName
console.log("🔄 Replacing project name...");
const replaceInFiles = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      replaceInFiles(filepath);
    } else {
      let content = fs.readFileSync(filepath, "utf8");
      if (content.includes("rs-prjkt")) {
        content = content.replace(/rs-prjkt/g, projectName);
        fs.writeFileSync(filepath, content, "utf8");
      }
    }
  });
};
replaceInFiles(projectPath);

// Remove git history (cross-platform)
console.log("🗑 Removing old git history...");
try {
  fs.rmSync(path.join(projectPath, ".git"), { recursive: true, force: true });
} catch (err) {
  console.warn("⚠️ Could not remove .git folder:", err.message);
}

// Install dependencies
console.log("📦 Installing dependencies...");
execSync("npm install", { cwd: projectPath, stdio: "inherit" });

console.log(`✅ Project ${projectName} is ready!`);
console.log(`👉 cd ${projectName} && npm start`);
