# GitHub 发布指南

## 📋 准备工作

### 1. 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `continuous-learning-skill`
   - **Description**: `Continuous Learning Skill for OpenClaw - Autonomous learning system`
   - **Public** 或 **Private**（建议先设为私有）
   - 勾选 "Add a README file"
   - 选择 MIT License

### 2. 获取 GitHub Token（如果需要命令行上传）
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择权限：
   - `repo` (Full control of private repositories)
   - `workflow` (可选)
4. 生成并复制 Token

## 🚀 上传方式选择

### 方案A：使用 GitHub CLI（推荐）

```bash
# 1. 安装 GitHub CLI
# macOS
brew install gh

# 2. 登录
gh auth login

# 3. 进入发布目录
cd /Users/sosme_macmini/openclaw/skills/continuous-learning-publish

# 4. 初始化 Git
git init
git add .
git commit -m "Initial release: Continuous Learning Skill v1.0.0"

# 5. 创建并推送仓库
gh repo create continuous-learning-skill --public --source=. --remote=origin --push
```

### 方案B：手动 Git 操作

```bash
# 1. 进入发布目录
cd /Users/sosme_macmini/openclaw/skills/continuous-learning-publish

# 2. 初始化 Git
git init
git add .
git commit -m "Initial release: Continuous Learning Skill v1.0.0"

# 3. 添加远程仓库
git remote add origin https://github.com/fjmw123/continuous-learning-skill.git

# 4. 推送代码
git branch -M main
git push -u origin main
```

### 方案C：通过 OpenClaw 上传（需要 Token）

```bash
# 1. 设置 GitHub Token 环境变量
export GITHUB_TOKEN="your_github_token_here"

# 2. 通过 exec 执行 git 命令
# 我会帮你执行上述 git 命令
```

## 🔧 VSCode 集成

### 1. 在 VSCode 中打开发布目录
```bash
code /Users/sosme_macmini/openclaw/skills/continuous-learning-publish
```

### 2. 安装推荐的扩展
- **GitLens** - Git 增强功能
- **GitHub Pull Requests** - PR 管理
- **Markdown All in One** - Markdown 支持

### 3. VSCode Git 操作
1. 打开 Source Control 面板 (Ctrl+Shift+G)
2. 点击 "Initialize Repository"
3. 暂存所有更改
4. 提交并推送

## 📁 发布目录结构

```
continuous-learning-publish/
├── README.md                    # 项目主页
├── SKILL.md                     # 完整技能文档
├── SETUP.md                     # 安装配置指南
├── package.json                 # 依赖配置
├── LICENSE                      # MIT 许可证
├── GITHUB_SETUP.md             # 本指南
├── scripts/                     # 核心脚本
│   ├── init-learning.mjs       # 初始化脚本
│   ├── learn-from-conversation.mjs # 对话学习
│   ├── analyze-notes.mjs       # 笔记分析
│   ├── aggregate-web.mjs       # 网络聚合
│   ├── behavior-report.mjs     # 行为报告
│   └── llm-client.mjs          # LLM 客户端
└── examples/                    # 示例数据
    ├── README.md               # 示例说明
    ├── quick-start.md          # 快速开始
    ├── run-test.sh             # 测试脚本
    ├── conversations/          # 对话示例
    ├── configs/                # 配置示例
    ├── notes/                  # 笔记示例
    └── web-aggregation/        # 网络聚合示例
```

## 🔐 隐私保护检查

已清理的隐私内容：
- ✅ 移除具体用户路径 (`/Users/sosme_macmini/...`)
- ✅ 移除真实 API Key
- ✅ 移除个人 Obsidian vault 路径
- ✅ 移除真实会话数据
- ✅ 使用通用占位符

需要你手动替换的内容：
- `yourusername` → 你的 GitHub 用户名
- `your_tavily_api_key_here` → 用户自己的 API Key
- `/path/to/...` → 用户自己的路径

## 🏷️ 发布标签与版本

### 创建发布版本
```bash
# 1. 创建标签
git tag -a v1.0.0 -m "Initial release: Continuous Learning Skill"

# 2. 推送标签
git push origin v1.0.0

# 3. 在 GitHub 创建 Release
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release"
```

### 版本管理建议
- `v1.0.0` - 初始发布
- `v1.1.0` - 功能更新
- `v1.0.1` - Bug 修复

## 🤝 协作设置

### 1. 分支保护规则
在 GitHub 仓库设置中启用：
- Require pull request reviews
- Require status checks
- Include administrators

### 2. Issue 模板
创建 `.github/ISSUE_TEMPLATE/` 目录，添加模板：
- bug_report.md
- feature_request.md

### 3. Pull Request 模板
创建 `.github/PULL_REQUEST_TEMPLATE.md`

## 📊 发布检查清单

- [ ] 所有隐私内容已清理
- [ ] 文档完整且可读
- [ ] 示例数据可用
- [ ] 测试脚本可运行
- [ ] 许可证文件已添加
- [ ] package.json 配置正确
- [ ] README.md 包含使用说明
- [ ] GitHub 仓库已创建
- [ ] 代码已推送
- [ ] 发布标签已创建

## 🆘 问题解决

### 常见问题

#### 1. 权限被拒绝
```bash
# 检查 SSH 密钥
ssh -T git@github.com

# 或使用 HTTPS 替代 SSH
git remote set-url origin https://github.com/fjmw123/continuous-learning-skill.git
```

#### 2. 大文件上传失败
```bash
# 安装 Git LFS
brew install git-lfs

# 跟踪大文件
git lfs track "*.zip" "*.tar.gz"
git add .gitattributes
```

#### 3. 合并冲突
```bash
# 拉取最新代码
git pull origin main

# 解决冲突后
git add .
git commit -m "Resolve merge conflicts"
git push
```

## 📞 支持

- **GitHub 文档**: https://docs.github.com
- **Git 教程**: https://git-scm.com/doc
- **OpenClaw 社区**: https://discord.com/invite/clawd

---

**发布完成！** 🎉

现在你的 Continuous Learning Skill 已经准备好与 OpenClaw 社区分享了。