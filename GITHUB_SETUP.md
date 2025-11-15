# GitHub Setup Guide

## Step-by-Step Instructions to Push to GitHub

### Prerequisites
- GitHub account
- Git installed on your machine
- GitHub repository already created (empty or with README)

---

## Option 1: Push to Existing GitHub Repository

### Step 1: Check Current Git Status

```bash
cd /Users/anandasahu/Repository/AI_Angular
git status
```

### Step 2: Add All Files to Git

```bash
# Add all files (respects .gitignore)
git add .

# Verify what will be committed
git status
```

### Step 3: Make Your First Commit

```bash
git commit -m "Initial commit: Angular 17 ChatGPT-like UI for local LLMs"
```

### Step 4: Add Your GitHub Repository as Remote

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
# If your GitHub repo is named 'ai-angular-chat'
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if using SSH (if you have SSH keys set up)
# git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

**To find your repository URL:**
1. Go to your GitHub repository page
2. Click the green "Code" button
3. Copy the HTTPS or SSH URL

### Step 5: Push to GitHub

**If pushing to main/master branch:**
```bash
# Rename branch to main if needed (GitHub uses 'main' by default)
git branch -M main

# Push to GitHub
git push -u origin main
```

**If pushing to a specific branch you created:**
```bash
# Switch to your branch (replace 'your-branch-name' with actual name)
git checkout -b your-branch-name

# Or if branch already exists
git checkout your-branch-name

# Push to that branch
git push -u origin your-branch-name
```

### Step 6: Verify

Go to your GitHub repository page and verify all files are uploaded.

---

## Option 2: If You Need to Create a New Branch

### Step 1-3: Same as above (add files, commit)

### Step 4: Create and Switch to New Branch

```bash
# Create and switch to new branch
git checkout -b your-branch-name

# Example:
# git checkout -b feature/angular-chat-ui
# or
# git checkout -b develop
```

### Step 5: Add Remote and Push

```bash
# Add remote (if not already added)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to your branch
git push -u origin your-branch-name
```

---

## Complete Command Sequence (Copy-Paste Ready)

**Replace the placeholders:**
- `YOUR_USERNAME` - Your GitHub username
- `YOUR_REPO_NAME` - Your repository name
- `your-branch-name` - Your branch name (or use `main`)

```bash
# Navigate to project directory
cd /Users/anandasahu/Repository/AI_Angular

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit: Angular 17 ChatGPT-like UI for local LLMs"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Troubleshooting

### Error: "remote origin already exists"

If you already added a remote, remove it first:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Error: "failed to push some refs"

If GitHub repository has files (like README), you need to pull first:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: Authentication Required

You'll need to authenticate:
- **HTTPS**: Use Personal Access Token (not password)
- **SSH**: Set up SSH keys in GitHub

**For HTTPS with Personal Access Token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Use token as password when pushing

### Check Remote URL

```bash
# View current remote
git remote -v

# Update remote URL if needed
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

---

## Quick Reference

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your commit message"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main

# View remotes
git remote -v

# View branches
git branch
```

---

## Next Steps After Pushing

1. **Add a description** to your GitHub repository
2. **Add topics/tags** (e.g., `angular`, `typescript`, `llm`, `chat-ui`)
3. **Update README** if needed (replace placeholder URLs)
4. **Create a LICENSE file** if you want to specify licensing
5. **Set up GitHub Actions** for CI/CD (optional)

---

## Example Repository Settings

**Repository Name:** `ai-angular-chat`  
**Description:** "ChatGPT-like UI built with Angular 17 for local LLM APIs (Ollama, LM Studio)"  
**Visibility:** Public or Private  
**Topics:** `angular`, `angular17`, `typescript`, `tailwindcss`, `llm`, `ollama`, `lm-studio`, `chat-ui`, `standalone-components`

