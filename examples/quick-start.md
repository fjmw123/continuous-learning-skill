# 🚀 Continuous Learning Skill - 快速开始指南

## 5分钟快速上手

### 步骤1：初始化
```bash
# 进入技能目录
cd /Users/sosme_macmini/openclaw/skills/continuous-learning

# 运行初始化脚本
node scripts/init-learning.mjs
```

### 步骤2：最小配置
编辑 `~/.config/continuous-learning/config.json`：
```json
{
  "conversation_learning": {
    "enabled": true,
    "extract_facts": true,
    "update_memory_md": true
  },
  "note_analysis": {
    "enabled": false
  },
  "behavior_observation": {
    "enabled": false
  },
  "web_aggregation": {
    "enabled": false
  }
}
```

### 步骤3：测试对话学习
```bash
# 分析最近1小时的对话
node scripts/learn-from-conversation.mjs --since "1h" --output console

# 查看结果
cat ~/openclaw/MEMORY.md | tail -20
```

### 步骤4：设置自动化
```bash
# 添加每小时运行的对话学习任务
openclaw cron add --name "对话学习" --schedule "0 * * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"运行对话学习脚本：node /Users/sosme_macmini/openclaw/skills/continuous-learning/scripts/learn-from-conversation.mjs --since 1h --output both"}'
```

## 进阶配置

### 启用笔记分析
```json
{
  "note_analysis": {
    "enabled": true,
    "obsidian_vault": "/path/to/your/obsidian/vault",
    "incremental": true
  }
}
```

```bash
# 手动运行笔记分析
node scripts/analyze-notes.mjs --incremental

# 查看知识图谱
cat ~/.local/share/continuous-learning/knowledge-graph/report.md
```

### 启用网络聚合
```bash
# 设置 API Key
export TAVILY_API_KEY="your-api-key"

# 创建主题配置
cp examples/web-aggregation/topics-config.json ~/.config/continuous-learning/topics.json

# 测试聚合
node scripts/aggregate-web.mjs --topic "AI" --max-results 3
```

### 启用行为观察
```json
{
  "behavior_observation": {
    "enabled": true,
    "track_commands": true,
    "analyze_patterns": "weekly"
  }
}
```

```bash
# 生成行为报告
node scripts/behavior-report.mjs --period weekly --output console
```

## 常用命令速查

### 对话学习
```bash
# 分析最近对话
node scripts/learn-from-conversation.mjs --since "1h"

# 分析指定时间段
node scripts/learn-from-conversation.mjs --since "24h"

# 输出到 Obsidian
node scripts/learn-from-conversation.mjs --since "1h" --output obsidian

# 详细模式
node scripts/learn-from-conversation.mjs --since "1h" --verbose
```

### 笔记分析
```bash
# 完整分析
node scripts/analyze-notes.mjs

# 增量分析
node scripts/analyze-notes.mjs --incremental

# 指定 vault 路径
node scripts/analyze-notes.mjs --vault "/path/to/vault"

# 排除文件夹
node scripts/analyze-notes.mjs --exclude "Attachments,node_modules"
```

### 网络聚合
```bash
# 聚合所有主题
node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json

# 聚合单个主题
node scripts/aggregate-web.mjs --topic "AI"

# 限制结果数量
node scripts/aggregate-web.mjs --topic "AI" --max-results 5

# 测试模式
node scripts/aggregate-web.mjs --topic "AI" --dry-run
```

### 行为报告
```bash
# 每日报告
node scripts/behavior-report.mjs --period daily --output console

# 每周报告（保存到文件）
node scripts/behavior-report.mjs --period weekly --output file

# 月度报告
node scripts/behavior-report.mjs --period monthly --output obsidian
```

## 自动化配置示例

### 完整自动化配置
```bash
# 对话学习 - 每小时
0 * * * * cd /Users/sosme_macmini/openclaw/skills/continuous-learning && node scripts/learn-from-conversation.mjs --since 1h --output both >> ~/.local/share/continuous-learning/logs/conversation.log 2>&1

# 笔记分析 - 每天凌晨2点
0 2 * * * cd /Users/sosme_macmini/openclaw/skills/continuous-learning && node scripts/analyze-notes.mjs --incremental >> ~/.local/share/continuous-learning/logs/notes.log 2>&1

# 网络聚合 - 每天上午9点
0 9 * * * export TAVILY_API_KEY="your-api-key" && cd /Users/sosme_macmini/openclaw/skills/continuous-learning && node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json >> ~/.local/share/continuous-learning/logs/web.log 2>&1

# 行为报告 - 每周一上午9点
0 9 * * 1 cd /Users/sosme_macmini/openclaw/skills/continuous-learning && node scripts/behavior-report.mjs --period weekly --output file >> ~/.local/share/continuous-learning/logs/behavior.log 2>&1
```

## 故障排除快速指南

### 1. 权限问题
```bash
# 修复权限
sudo chown -R $(whoami) ~/.openclaw
sudo chown -R $(whoami) ~/.local/share/continuous-learning
```

### 2. API Key 问题
```bash
# 检查环境变量
echo $TAVILY_API_KEY

# 临时设置
export TAVILY_API_KEY="your-api-key"
```

### 3. 内存不足
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=2048"
```

### 4. 查看日志
```bash
# 查看最新日志
tail -f ~/.local/share/continuous-learning/logs/*.log

# 查看错误日志
cat ~/.local/share/continuous-learning/logs/error.log
```

## 下一步

1. **详细配置**：查看 `SETUP.md` 获取完整配置说明
2. **示例数据**：查看 `examples/` 目录获取测试数据
3. **高级功能**：阅读 `SKILL.md` 了解所有功能
4. **自动化**：设置定时任务实现完全自动化

## 获取帮助

- **文档**: `SKILL.md`, `SETUP.md`
- **示例**: `examples/` 目录
- **测试**: 运行 `./examples/run-test.sh`
- **日志**: `~/.local/share/continuous-learning/logs/`

---

**开始你的 Continuous Learning 之旅吧！** 🚀