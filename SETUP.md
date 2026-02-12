# Continuous Learning Skill - 安装与配置指南

## 📋 系统要求

### 硬件要求
- **内存**: 至少 2GB 可用内存
- **存储**: 至少 500MB 可用空间（用于日志和缓存）
- **网络**: 稳定的互联网连接（用于网络聚合）

### 软件要求
- **Node.js**: v16.0.0 或更高版本
- **OpenClaw**: v2026.2.0 或更高版本
- **Obsidian** (可选): 用于笔记分析和内容存储

### 权限要求
- 读取 OpenClaw 会话文件的权限
- 写入配置目录的权限
- 执行 Node.js 脚本的权限

## 🛠️ 安装步骤

### 1. 获取技能文件

```bash
# 从 GitHub 克隆
git clone https://github.com/yourusername/continuous-learning.git
cd continuous-learning

# 或下载 ZIP 文件解压
```

### 2. 安装依赖

```bash
# 检查 Node.js 版本
node --version  # 需要 >= 16.0.0

# 安装依赖包
npm install
# 或使用 yarn
yarn install
```

### 3. 初始化配置

```bash
# 运行初始化脚本
node scripts/init-learning.mjs
```

初始化脚本会创建以下目录结构：
```
~/.config/continuous-learning/
├── config.json          # 主配置文件
├── topics.json          # 网络聚合主题配置
└── behavior-config.json # 行为观察配置（可选）

~/.local/share/continuous-learning/
├── logs/                # 运行日志
├── knowledge-graph/     # 知识图谱数据
├── behavior/           # 行为日志
└── cache/              # 缓存数据
```

## 🔧 详细配置

### 1. 主配置文件 (`config.json`)

#### 对话学习配置
```json
{
  "conversation_learning": {
    "enabled": true,
    "extract_facts": true,
    "extract_preferences": true,
    "extract_decisions": true,
    "extract_commitments": true,
    "update_memory_md": true,
    "update_obsidian": true,
    "min_confidence": 0.7,
    "max_messages_per_session": 100,
    "exclude_sessions": ["cron", "system", "isolated"],
    "output_formats": ["memory", "obsidian"],
    "auto_trigger": true,
    "trigger_interval_hours": 1
  }
}
```

#### 笔记分析配置
```json
{
  "note_analysis": {
    "enabled": true,
    "obsidian_vault": "/path/to/your/obsidian/vault",
    "incremental": true,
    "build_knowledge_graph": true,
    "generate_link_suggestions": true,
    "exclude_folders": ["Attachments", ".trash", ".git", "node_modules"],
    "include_extensions": [".md", ".txt", ".markdown"],
    "max_file_size_mb": 10,
    "min_similarity_score": 0.6,
    "parallel_processing": 4,
    "cache_enabled": true,
    "cache_ttl_hours": 24
  }
}
```

#### 行为观察配置
```json
{
  "behavior_observation": {
    "enabled": true,
    "track_commands": true,
    "track_sessions": true,
    "analyze_patterns": "weekly",
    "privacy_mode": "minimal",
    "retention_days": 90,
    "exclude_commands": ["password", "secret", "key", "token"],
    "exclude_parameters": true,
    "anonymize_user_data": true,
    "log_level": "info",
    "auto_cleanup": true,
    "cleanup_interval_days": 7
  }
}
```

#### 网络聚合配置
```json
{
  "web_aggregation": {
    "enabled": true,
    "topics_config": "~/.config/continuous-learning/topics.json",
    "output_to": "obsidian",
    "language": "zh",
    "max_results_per_topic": 5,
    "min_relevance_score": 0.7,
    "exclude_domains": ["spam-site.com", "low-quality-blog.net"],
    "include_sources": ["news", "blogs", "academic"],
    "time_range": "week",
    "cache_enabled": true,
    "cache_ttl_hours": 6,
    "rate_limit_requests_per_minute": 10
  }
}
```

### 2. 主题配置文件 (`topics.json`)

```json
{
  "topics": [
    {
      "name": "AI",
      "display_name": "人工智能",
      "description": "AI技术发展、大模型更新、机器学习趋势",
      "queries": [
        "AI news 2026",
        "artificial intelligence breakthroughs",
        "LLM updates latest",
        "machine learning trends",
        "AI ethics discussion"
      ],
      "keywords": ["AI", "人工智能", "机器学习", "大模型", "深度学习"],
      "frequency": "daily",
      "max_results": 5,
      "language": "zh",
      "sources": ["news", "blogs", "academic"],
      "time_range": "week",
      "min_relevance": 0.7,
      "exclude_keywords": ["spam", "promotion", "advertisement"]
    },
    {
      "name": "SmartMetro",
      "display_name": "轨道交通智能化",
      "description": "地铁智能化、预测性维护、数字孪生技术",
      "queries": [
        "smart metro digitalization",
        "predictive maintenance railway",
        "digital twin metro system",
        "CBTC system updates",
        "rail asset management digital"
      ],
      "keywords": ["地铁", "轨道交通", "智能化", "预测性维护", "数字孪生"],
      "frequency": "daily",
      "max_results": 3,
      "language": "zh",
      "sources": ["news", "academic", "industry"],
      "time_range": "month",
      "min_relevance": 0.6
    }
  ],
  "general": {
    "default_language": "zh",
    "default_max_results": 5,
    "default_time_range": "week",
    "duplicate_check": true,
    "summary_length": 200,
    "include_source_metadata": true
  }
}
```

### 3. 环境变量配置

#### 必需的环境变量
```bash
# Tavily API Key (用于网络聚合)
export TAVILY_API_KEY="your_tavily_api_key_here"

# Obsidian Vault 路径 (用于笔记分析)
export OBSIDIAN_VAULT="/path/to/your/obsidian/vault"

# OpenClaw 会话路径
export OPENCLAW_SESSIONS_PATH="~/.openclaw/agents/main/sessions"
```

#### 可选的环境变量
```bash
# 日志级别
export CONTINUOUS_LEARNING_LOG_LEVEL="info"  # debug, info, warn, error

# 数据目录
export CONTINUOUS_LEARNING_DATA_DIR="~/.local/share/continuous-learning"

# 配置目录
export CONTINUOUS_LEARNING_CONFIG_DIR="~/.config/continuous-learning"

# 缓存设置
export CONTINUOUS_LEARNING_CACHE_ENABLED="true"
export CONTINUOUS_LEARNING_CACHE_TTL="86400"  # 24小时，单位秒

# 网络代理 (如果需要)
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
```

#### 永久配置 (添加到 shell 配置文件)
```bash
# 编辑 ~/.zshrc 或 ~/.bashrc
echo 'export TAVILY_API_KEY="your_tavily_api_key_here"' >> ~/.zshrc
echo 'export OBSIDIAN_VAULT="/path/to/your/obsidian/vault"' >> ~/.zshrc
echo 'export CONTINUOUS_LEARNING_LOG_LEVEL="info"' >> ~/.zshrc

# 重新加载配置
source ~/.zshrc
```

## 🔐 权限设置

### 1. 文件权限
```bash
# 确保有读取 OpenClaw 会话文件的权限
ls -la ~/.openclaw/agents/main/sessions/

# 如果需要，调整权限
chmod 755 ~/.openclaw
chmod 755 ~/.openclaw/agents
chmod 755 ~/.openclaw/agents/main
chmod 755 ~/.openclaw/agents/main/sessions
```

### 2. 目录权限
```bash
# 创建并设置数据目录权限
mkdir -p ~/.local/share/continuous-learning
chmod 755 ~/.local/share/continuous-learning

# 创建并设置配置目录权限
mkdir -p ~/.config/continuous-learning
chmod 755 ~/.config/continuous-learning
```

### 3. 脚本执行权限
```bash
# 确保脚本有执行权限
chmod +x /path/to/continuous-learning/scripts/*.mjs
```

## 🚀 自动化部署

### 1. 使用 OpenClaw Cron 系统

```bash
# 查看当前 cron 任务
openclaw cron list

# 添加对话学习任务 (每小时运行)
openclaw cron add --name "对话学习" --schedule "0 * * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"运行对话学习脚本：node /path/to/continuous-learning/scripts/learn-from-conversation.mjs --since 1h --output both"}'

# 添加笔记分析任务 (每天凌晨2点)
openclaw cron add --name "笔记分析" --schedule "0 2 * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"运行笔记分析脚本：node /path/to/continuous-learning/scripts/analyze-notes.mjs --incremental"}'

# 添加网络聚合任务 (每天上午9点)
openclaw cron add --name "网络聚合" --schedule "0 9 * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"运行网络聚合脚本：export TAVILY_API_KEY=\"your_tavily_api_key_here\" && node /path/to/continuous-learning/scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json"}'

# 添加行为报告任务 (每周一上午9点)
openclaw cron add --name "行为报告" --schedule "0 9 * * 1" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"运行行为报告脚本：node /path/to/continuous-learning/scripts/behavior-report.mjs --period weekly --output file"}'
```

### 2. 使用系统 Crontab

```bash
# 编辑 crontab
crontab -e

# 添加以下任务
# 每小时：对话学习
0 * * * * cd /path/to/continuous-learning && node scripts/learn-from-conversation.mjs --since 1h --output both >> ~/.local/share/continuous-learning/logs/conversation.log 2>&1

# 每天凌晨2点：笔记分析
0 2 * * * cd /path/to/continuous-learning && node scripts/analyze-notes.mjs --incremental >> ~/.local/share/continuous-learning/logs/notes.log 2>&1

# 每天上午9点：网络聚合
0 9 * * * export TAVILY_API_KEY="your_tavily_api_key_here" && cd /path/to/continuous-learning && node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json >> ~/.local/share/continuous-learning/logs/web.log 2>&1

# 每周一上午9点：行为报告
0 9 * * 1 cd /path/to/continuous-learning && node scripts/behavior-report.mjs --period weekly --output file >> ~/.local/share/continuous-learning/logs/behavior.log 2>&1
```

## 🧪 测试配置

### 1. 测试所有模块
```bash
# 进入技能目录
cd /path/to/continuous-learning

# 测试对话学习
echo "测试对话学习..."
node scripts/learn-from-conversation.mjs --since "10m" --dry-run

# 测试笔记分析
echo "测试笔记分析..."
node scripts/analyze-notes.mjs --dry-run

# 测试网络聚合
echo "测试网络聚合..."
export TAVILY_API_KEY="your_tavily_api_key_here"
node scripts/aggregate-web.mjs --topic "AI" --max-results 2 --dry-run

# 测试行为报告
echo "测试行为报告..."
node scripts/behavior-report.mjs --period daily --output console
```

### 2. 验证输出
```bash
# 检查日志文件
ls -la ~/.local/share/continuous-learning/logs/

# 查看最近日志
tail -f ~/.local/share/continuous-learning/logs/*.log

# 检查生成的文件
ls -la ~/.local/share/continuous-learning/knowledge-graph/
ls -la ~/.local/share/continuous-learning/behavior/
```

### 3. 验证权限
```bash
# 测试文件访问
node -e "const fs = require('fs'); console.log('OpenClaw会话可访问:', fs.existsSync(process.env.HOME + '/.openclaw/agents/main/sessions/'));"

# 测试目录写入
node -e "const fs = require('fs'); fs.writeFileSync('/tmp/test-permission.txt', 'test'); console.log('写入权限正常'); fs.unlinkSync('/tmp/test-permission.txt');"
```

## 🔄 更新与维护

### 1. 更新技能
```bash
# 如果从 GitHub 克隆
cd /path/to/continuous-learning
git pull origin main
npm install
```

### 2. 备份配置
```bash
# 备份配置文件
cp -r ~/.config/continuous-learning ~/.config/continuous-learning-backup-$(date +%Y%m%d)

# 备份数据文件
cp -r ~/.local/share/continuous-learning ~/.local/share/continuous-learning-backup-$(date +%Y%m%d)
```

### 3. 清理旧数据
```bash
# 清理旧日志 (保留最近30天)
find ~/.local/share/continuous-learning/logs -name "*.log" -mtime +30 -delete

# 清理旧缓存 (保留最近7天)
find ~/.local/share/continuous-learning/cache -type f -mtime +7 -delete

# 清理旧行为日志 (保留最近90天)
find ~/.local/share/continuous-learning/behavior -name "*.json" -mtime +90 -delete
```

## 🆘 故障排除

### 常见问题解决

#### 1. "权限被拒绝" 错误
```bash
# 检查当前用户
whoami

# 检查文件权限
ls -la ~/.openclaw/
ls -la ~/.local/share/continuous-learning/

# 修复权限
sudo chown -R $(whoami) ~/.openclaw
sudo chown -R $(whoami) ~/.local/share/continuous-learning
sudo chown -R $(whoami) ~/.config/continuous-learning
```

#### 2. "模块未找到" 错误
```bash
# 检查 Node.js 版本
node --version

# 重新安装依赖
cd /path/to/continuous-learning
rm -rf node_modules package-lock.json
npm install
```

#### 3. "API Key 无效" 错误
```bash
# 检查环境变量
echo $TAVILY_API_KEY

# 测试 API 连接
curl -s "https://api.tavily.com/search?query=test&api_key=$TAVILY_API_KEY" | jq '.error // "API正常"'
```

#### 4. "内存不足" 错误
```bash
# 减少并行处理数量
# 在 config.json 中设置 "parallel_processing": 2

# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
```

### 获取帮助

1. **查看日志**: `~/.local/share/continuous-learning/logs/`
2. **启用调试模式**: 设置 `log_level: "debug"`
3. **联系支持**: 通过 OpenClaw 社区或 GitHub Issues

---

**配置完成！** 现在可以开始使用 Continuous Learning 技能了。建议先运行测试脚本验证所有功能正常工作。