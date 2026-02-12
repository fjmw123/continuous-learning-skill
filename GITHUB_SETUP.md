# GitHub Repository Setup Guide

## Overview

This document guides you through publishing the Continuous Learning skill to GitHub, including repository creation, file upload, Issue template configuration, and other steps.

## Prerequisites

### 1. Create GitHub Repository
1. Visit https://github.com/new
2. Fill in repository information:
   - **Repository name**: `continuous-learning-skill`
   - **Description**: `Continuous Learning Skill for OpenClaw - Autonomous learning system`
   - **Public** or **Private** (recommended to start as private)
   - Check "Add a README file"
   - Select MIT License

### 2. Get GitHub Token (if needed for command line upload)
1. Visit https://github.com/settings/tokens
2. Click "Generate new token"
3. Select permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (optional)
4. Generate and copy Token

## 🚀 Upload Methods

### Option A: Using GitHub CLI (Recommended)

```bash
# 1. Install GitHub CLI
# macOS
brew install gh

# 2. Login
gh auth login

# 3. Enter publish directory
cd /path/to/continuous-learning-skill

# 4. Initialize Git
git init
git add .
git commit -m "Initial release: Continuous Learning Skill v1.0.0"

# 5. Create and push repository
gh repo create continuous-learning-skill --public --source=. --remote=origin --push
```

### Option B: Manual Git Operations

```bash
# 1. Enter publish directory
cd /path/to/continuous-learning-skill

# 2. Initialize Git
git init
git add .
git commit -m "Initial release: Continuous Learning Skill v1.0.0"

# 3. Add remote repository
git remote add origin https://github.com/fjmw123/continuous-learning-skill.git

# 4. Push code
git branch -M main
git push -u origin main
```

### Option C: Upload via OpenClaw (requires Token)

```bash
# 1. Set GitHub Token environment variable
export GITHUB_TOKEN="your_github_token_here"

# 2. Execute git commands via exec
# I will help you execute the above git commands
```

## 🔧 VSCode Integration

### 1. Open publish directory in VSCode
```bash
code /path/to/continuous-learning-skill
```

### 2. Install recommended extensions
- **GitLens** - Git enhancement features
- **GitHub Pull Requests** - PR management
- **Markdown All in One** - Markdown support

### 3. VSCode Git operations
1. Open Source Control panel (Ctrl+Shift+G)
2. Click "Initialize Repository"
3. Stage all changes
4. Commit and push

## 📁 Publish Directory Structure

```
continuous-learning-skill/
├── README.md                    # Project homepage (English)
├── SKILL.md                     # Complete skill documentation (English)
├── SETUP.md                     # Installation & configuration guide (English)
├── package.json                 # Dependency configuration
├── LICENSE                      # MIT License
├── GITHUB_SETUP.md             # This guide
├── docs/                        # Chinese documentation (translations)
│   ├── README_zh.md            # Chinese homepage
│   ├── SKILL_zh.md             # Chinese skill documentation
│   └── SETUP_zh.md             # Chinese configuration guide
├── scripts/                     # Core scripts
│   ├── init-learning.mjs       # Initialization script
│   ├── learn-from-conversation.mjs # Conversation learning
│   ├── analyze-notes.mjs       # Note analysis
│   ├── aggregate-web.mjs       # Web aggregation
│   ├── behavior-report.mjs     # Behavior reporting
│   └── llm-client.mjs          # LLM client
└── examples/                    # Example data (English)
    ├── README.md               # Example instructions
    ├── quick-start.md          # Quick start guide
    ├── run-test.sh             # Test script
    ├── conversations/          # Conversation examples
    ├── configs/                # Configuration examples
    ├── notes/                  # Note examples
    └── web-aggregation/        # Web aggregation examples
```

## 🔐 Privacy Protection Check

Cleaned privacy content:
- ✅ Removed specific user paths (`/Users/sosme_macmini/...`)
- ✅ Removed real API Keys
- ✅ Removed personal Obsidian vault paths
- ✅ Removed real session data
- ✅ Used generic placeholders

Content you need to manually replace:
- `yourusername` → Your GitHub username
- `your_tavily_api_key_here` → User's own API Key
- `/path/to/...` → User's own paths

## 🏷️ Release Tags & Versioning

### Create release version
```bash
# 1. Create tag
git tag -a v1.0.0 -m "Initial release: Continuous Learning Skill"

# 2. Push tag
git push origin v1.0.0

# 3. Create Release on GitHub
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"
```

### Version management suggestions
- `v1.0.0` - Initial release
- `v1.1.0` - Feature updates
- `v1.0.1` - Bug fixes

## 🤝 Collaboration Settings

### 1. Branch protection rules
Enable in GitHub repository settings:
- Require pull request reviews
- Require status checks
- Include administrators

### 2. Issue templates
Create `.github/ISSUE_TEMPLATE/` directory, add templates:
- bug_report.md
- feature_request.md

### 3. Pull Request template
Create `.github/PULL_REQUEST_TEMPLATE.md`

## 📊 Release Checklist

- [ ] All privacy content cleaned
- [ ] Documentation complete and readable
- [ ] Example data available
- [ ] Test scripts runnable
- [ ] License file added
- [ ] package.json configured correctly
- [ ] README.md includes usage instructions
- [ ] GitHub repository created
- [ ] Code pushed
- [ ] Release tag created

## 🆘 Troubleshooting

### Common Issues

#### 1. Permission denied
```bash
# Check SSH key
ssh -T git@github.com

# Or use HTTPS instead of SSH
git remote set-url origin https://github.com/fjmw123/continuous-learning-skill.git
```

#### 2. Large file upload failed
```bash
# Install Git LFS
brew install git-lfs

# Track large files
git lfs track "*.zip" "*.tar.gz"
git add .gitattributes
```

#### 3. Merge conflicts
```bash
# Pull latest code
git pull origin main

# After resolving conflicts
git add .
git commit -m "Resolve merge conflicts"
git push
```

## 📞 Support

- **GitHub Documentation**: https://docs.github.com
- **Git Tutorial**: https://git-scm.com/doc
- **OpenClaw Community**: https://discord.com/invite/clawd

---

**Release Complete!** 🎉

Now your Continuous Learning Skill is ready to share with the OpenClaw community.