# Continuous Learning Skill - 示例数据

本目录包含 Continuous Learning 技能的各种示例数据，用于测试和理解各模块的功能。

## 📁 目录结构

```
examples/
├── conversations/          # 对话学习示例
│   ├── sample-session.jsonl     # OpenClaw 会话文件示例
│   ├── extracted-insights.json  # 提取的洞察示例
│   └── memory-update.md         # MEMORY.md 更新示例
├── notes/                 # 笔记分析示例
│   ├── sample-notes/           # 示例 Obsidian 笔记
│   ├── knowledge-graph.json    # 知识图谱示例
│   └── link-suggestions.md     # 链接建议示例
├── behavior/              # 行为观察示例
│   ├── command-logs.json       # 命令日志示例
│   ├── behavior-report.md      # 行为报告示例
│   └── automation-suggestions.md # 自动化建议示例
├── web-aggregation/       # 网络聚合示例
│   ├── topics-config.json      # 主题配置示例
│   ├── aggregated-content.md   # 聚合内容示例
│   └── search-results.json     # 原始搜索结果示例
└── configs/               # 配置示例
    ├── minimal-config.json     # 最小配置
    ├── full-config.json        # 完整配置
    └── production-config.json  # 生产环境配置
```

## 🧪 如何使用示例数据

### 1. 测试对话学习

```bash
# 使用示例会话文件测试
cp examples/conversations/sample-session.jsonl ~/.openclaw/agents/main/sessions/test-session.jsonl

# 运行对话学习
node scripts/learn-from-conversation.mjs --session test-session --output console
```

### 2. 测试笔记分析

```bash
# 创建测试 vault
mkdir -p /tmp/test-vault
cp examples/notes/sample-notes/* /tmp/test-vault/

# 运行笔记分析
node scripts/analyze-notes.mjs --vault /tmp/test-vault --output console
```

### 3. 测试行为报告

```bash
# 使用示例行为日志
cp examples/behavior/command-logs.json ~/.local/share/continuous-learning/behavior/

# 生成行为报告
node scripts/behavior-report.mjs --period weekly --output console
```

### 4. 测试网络聚合

```bash
# 使用示例配置
cp examples/web-aggregation/topics-config.json ~/.config/continuous-learning/topics.json

# 运行网络聚合（需要 Tavily API Key）
export TAVILY_API_KEY="your-api-key"
node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json --dry-run
```

## 📋 示例文件说明

### 1. 对话学习示例

**sample-session.jsonl** - OpenClaw 会话文件格式示例：
```json
{"type":"session","version":3,"id":"example-session","timestamp":"2026-02-12T10:00:00Z"}
{"type":"message","id":"msg1","timestamp":"2026-02-12T10:01:00Z","message":{"role":"user","content":[{"type":"text","text":"我喜欢用表格展示信息"}]}}
{"type":"message","id":"msg2","timestamp":"2026-02-12T10:02:00Z","message":{"role":"assistant","content":[{"type":"text","text":"好的，我会用表格整理信息"}]}}
```

**extracted-insights.json** - 提取的洞察示例：
```json
{
  "facts": ["用户是项目经理", "用户在上海工作"],
  "preferences": ["喜欢表格展示", "偏好结构化信息"],
  "decisions": ["选择使用小队模式", "决定学习Python"],
  "commitments": ["明天开始副业", "每周学习3小时"],
  "timestamp": "2026-02-12T10:30:00Z"
}
```

### 2. 笔记分析示例

**sample-notes/** - 示例 Obsidian 笔记：
- `project-plan.md` - 项目计划笔记
- `meeting-notes.md` - 会议记录
- `research-ideas.md` - 研究想法
- `book-summary.md` - 书籍摘要

**knowledge-graph.json** - 知识图谱示例：
```json
{
  "nodes": [
    {"id": "note1", "title": "项目计划", "tags": ["project", "planning"]},
    {"id": "note2", "title": "会议记录", "tags": ["meeting", "work"]}
  ],
  "edges": [
    {"source": "note1", "target": "note2", "type": "reference", "strength": 0.8}
  ]
}
```

### 3. 行为观察示例

**command-logs.json** - 命令日志示例：
```json
{
  "commands": [
    {
      "timestamp": "2026-02-12T09:00:00Z",
      "command": "cron list",
      "session": "main",
      "duration": 1500
    },
    {
      "timestamp": "2026-02-12T09:05:00Z",
      "command": "memory search",
      "session": "main", 
      "duration": 2000
    }
  ]
}
```

**behavior-report.md** - 行为报告示例：
```markdown
# Behavior Analysis Report

**Period:** weekly
**Generated:** 2026-02-12

## Summary
- **Total Commands:** 127
- **Unique Commands:** 23
- **Workflows Detected:** 5

## Top Commands
| Command | Count |
|---------|-------|
| cron list | 15 |
| memory search | 12 |
| exec | 10 |
```

### 4. 网络聚合示例

**topics-config.json** - 主题配置示例：
```json
{
  "topics": [
    {
      "name": "AI",
      "display_name": "人工智能",
      "queries": ["AI news", "machine learning"],
      "keywords": ["AI", "人工智能"],
      "frequency": "daily",
      "max_results": 3
    }
  ]
}
```

**aggregated-content.md** - 聚合内容示例：
```markdown
# 网络聚合: AI

## 今日精选

### 1. Understanding AI Technology

**摘要:** Artificial Intelligence is transforming industries...

🔗 [阅读原文](https://example.com/ai-article)
📊 相关度: 95%
```

## 🎯 测试场景

### 场景1：新用户快速上手
```bash
# 1. 复制最小配置
cp examples/configs/minimal-config.json ~/.config/continuous-learning/config.json

# 2. 运行初始化
node scripts/init-learning.mjs

# 3. 测试所有模块
./examples/run-all-tests.sh
```

### 场景2：开发调试
```bash
# 1. 启用调试模式
export CONTINUOUS_LEARNING_LOG_LEVEL="debug"

# 2. 使用示例数据测试
node scripts/learn-from-conversation.mjs --session examples/conversations/sample-session.jsonl --verbose

# 3. 检查详细输出
tail -f ~/.local/share/continuous-learning/logs/debug.log
```

### 场景3：性能测试
```bash
# 1. 使用大量示例数据
cp examples/notes/large-dataset/* /tmp/test-vault-large/

# 2. 运行性能测试
time node scripts/analyze-notes.mjs --vault /tmp/test-vault-large --output none

# 3. 检查内存使用
node scripts/analyze-notes.mjs --vault /tmp/test-vault-large --memory-profile
```

## 🔧 自定义示例

### 创建自己的测试数据
```bash
# 1. 创建测试目录
mkdir -p ~/continuous-learning-test

# 2. 复制模板
cp examples/configs/minimal-config.json ~/continuous-learning-test/my-config.json

# 3. 修改配置
# 编辑 ~/continuous-learning-test/my-config.json

# 4. 使用自定义配置
export CONTINUOUS_LEARNING_CONFIG_DIR="~/continuous-learning-test"
node scripts/init-learning.mjs
```

### 扩展示例数据
```bash
# 1. 添加新的示例会话
cp ~/.openclaw/agents/main/sessions/*.jsonl examples/conversations/real-session.jsonl

# 2. 添加真实笔记
cp ~/Documents/Obsidian/*.md examples/notes/real-notes/

# 3. 更新示例配置
# 根据实际使用情况修改 examples/configs/
```

## 📊 验证测试结果

### 验证对话学习
```bash
# 检查是否提取到洞察
node -e "const insights = require('./examples/conversations/extracted-insights.json'); console.log('提取到偏好:', insights.preferences.length);"
```

### 验证笔记分析
```bash
# 检查知识图谱
node -e "const graph = require('./examples/notes/knowledge-graph.json'); console.log('节点数:', graph.nodes.length, '边数:', graph.edges.length);"
```

### 验证行为报告
```bash
# 检查报告生成
node -e "const fs = require('fs'); const report = fs.readFileSync('./examples/behavior/behavior-report.md', 'utf8'); console.log('报告长度:', report.length, '字符');"
```

## 🚨 注意事项

1. **API Key**：网络聚合示例需要真实的 Tavily API Key
2. **文件权限**：确保有读取示例文件的权限
3. **数据安全**：示例数据不包含真实敏感信息
4. **存储空间**：大型示例可能需要较多存储空间

## 📞 支持

如果在使用示例数据时遇到问题：
1. 检查文件路径和权限
2. 查看日志文件：`~/.local/share/continuous-learning/logs/`
3. 参考主文档：`../SKILL.md`
4. 联系技术支持

---

**示例数据更新日期**: 2026-02-12  
**版本**: 1.0.0  
**适用版本**: Continuous Learning Skill v1.0.0+