---
name: continuous-learning-skill
description: >-
  Autonomous learning skill for OpenClaw that extracts insights from conversations,
  analyzes Obsidian notes, observes user behavior patterns, and aggregates web content.
  Enables AI to continuously improve understanding of user preferences, habits, and knowledge.
  Use when: (1) Configuring automated learning pipelines, (2) Extracting insights from conversations,
  (3) Building knowledge graphs from notes, (4) Setting up periodic content aggregation.
metadata:
  clawdbot:
    emoji: 🧠
    requires:
      bins: [node]
      env: [TAVILY_API_KEY]
    version: 1.0.0
    author: SoSME
    last_updated: 2026-02-12
---

# 🧠 Continuous Learning Skill

**让 OpenClaw 具备自主学习能力，从四个维度持续进化：**

1. **对话学习** — 从每次对话中提取偏好、习惯、决策模式
2. **笔记分析** — 分析 Obsidian 笔记，构建知识关联图谱
3. **行为观察** — 观察操作模式，识别高频任务和效率瓶颈
4. **网络聚合** — 定期搜索关注主题，自动整理入库

## ✨ 核心价值

- **个性化服务**：AI 越用越懂你，提供更精准的帮助
- **知识沉淀**：自动整理对话、笔记、网络内容，构建个人知识库
- **效率提升**：识别重复工作模式，提供自动化建议
- **持续进化**：AI 能力随时间增长，无需手动训练

## 🚀 快速开始

### 1. 安装与初始化

```bash
# 进入技能目录
cd /path/to/continuous-learning

# 初始化学习系统
node scripts/init-learning.mjs
```

### 2. 配置学习管道

编辑 `~/.config/continuous-learning/config.json`：

```json
{
  "conversation_learning": {
    "enabled": true,
    "extract_facts": true,
    "update_memory_md": true,
    "min_confidence": 0.7
  },
  "note_analysis": {
    "enabled": true,
    "obsidian_vault": "/path/to/your/obsidian/vault",
    "incremental": true,
    "build_knowledge_graph": true
  },
  "behavior_observation": {
    "enabled": true,
    "track_commands": true,
    "analyze_patterns": "weekly"
  },
  "web_aggregation": {
    "enabled": true,
    "topics_config": "~/.config/continuous-learning/topics.json",
    "output_to": "obsidian"
  }
}
```

### 3. 设置环境变量

```bash
# Tavily API Key (用于网络聚合)
export TAVILY_API_KEY="your_tavily_api_key_here"

# 添加到 shell 配置文件永久生效
echo 'export TAVILY_API_KEY="your_tavily_api_key_here"' >> ~/.zshrc
```

### 4. 手动测试各模块

```bash
# 测试对话学习
node scripts/learn-from-conversation.mjs --since "1h" --output both

# 测试笔记分析
node scripts/analyze-notes.mjs --incremental

# 测试网络聚合
node scripts/aggregate-web.mjs --topic "AI" --max-results 5

# 测试行为报告
node scripts/behavior-report.mjs --period weekly --output console
```

### 5. 设置自动化定时任务

```bash
# 查看已配置的 cron 任务
openclaw cron list

# 或手动添加定时任务
# 每小时：对话学习
# 每天 02:00：笔记分析
# 每天 09:00：网络聚合
# 每周一 09:00：行为报告
```

## 📊 模块详解

### 1. 对话学习器 (Conversation Learner)

**功能**：
- 自动分析 OpenClaw 会话历史
- 提取事实、偏好、决策、承诺
- 生成结构化摘要，更新 MEMORY.md

**使用方法**：
```bash
# 分析过去1小时的对话
node scripts/learn-from-conversation.mjs --since "1h"

# 分析指定会话
node scripts/learn-from-conversation.mjs --session <session-id>

# 输出到 Obsidian
node scripts/learn-from-conversation.mjs --since "24h" --output obsidian

# 同时输出到 MEMORY.md 和 Obsidian
node scripts/learn-from-conversation.mjs --since "24h" --output both
```

**输出示例**：
```json
{
  "facts": ["用户是轨道交通车辆维护项目经理"],
  "preferences": ["喜欢使用表格展示结构化信息"],
  "decisions": ["决定使用小队模式处理复杂任务"],
  "commitments": ["明天开始副业计划"],
  "timestamp": "2026-02-12T20:30:00+08:00"
}
```

### 2. 笔记分析器 (Note Analyzer)

**功能**：
- 扫描 Obsidian vault 中的所有笔记
- 提取标签、链接、主题聚类
- 构建知识图谱，生成链接建议

**使用方法**：
```bash
# 完整分析整个 vault
node scripts/analyze-notes.mjs

# 增量分析（只分析新/修改的笔记）
node scripts/analyze-notes.mjs --incremental

# 指定 vault 路径
node scripts/analyze-notes.mjs --vault "/path/to/obsidian/vault"
```

**输出文件**：
- `graph.json` — 完整的知识图谱数据
- `suggested-links.json` — 推荐的笔记链接
- `report.md` — 分析报告（包含标签分布、链接建议等）

**报告内容**：
```
# Knowledge Graph Analysis Report

**Total Notes:** 2038
**Total Links:** 117  
**Unique Tags:** 184
**Link Suggestions:** 20

## Top Tags
- #project (158 notes) - 项目管理相关
- #meeting (144 notes) - 会议记录
- #learning (120 notes) - 学习笔记

## Top Link Suggestions
1. 项目计划.md ↔ 会议记录.md (共同标签: #project)
2. 学习笔记.md ↔ 技术文档.md (共同标签: #learning)
```

### 3. 网络聚合器 (Web Aggregator)

**功能**：
- 使用 Tavily API 搜索高质量内容
- 按主题聚合网络信息
- 生成中文摘要，保存到 Obsidian

**配置主题** (`~/.config/continuous-learning/topics.json`)：
```json
{
  "topics": [
    {
      "name": "AI",
      "display_name": "人工智能",
      "queries": ["AI news", "artificial intelligence", "LLM updates"],
      "keywords": ["AI", "机器学习", "大模型"],
      "frequency": "daily",
      "max_results": 5,
      "language": "zh"
    },
    {
      "name": "SmartMetro",
      "display_name": "轨道交通智能化",
      "queries": ["smart metro digitalization", "predictive maintenance rail"],
      "keywords": ["地铁智能化", "预测性维护", "轨道交通"],
      "frequency": "daily",
      "max_results": 3,
      "language": "zh"
    }
  ]
}
```

**使用方法**：
```bash
# 聚合所有主题
node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json

# 聚合单个主题
node scripts/aggregate-web.mjs --topic "AI" --max-results 5

# 测试模式（不保存）
node scripts/aggregate-web.mjs --topic "AI" --dry-run
```

**输出示例** (Obsidian 笔记)：
```markdown
---
date created: 2026,02,12
tags:
  - web-aggregation
  - auto-learning
  - ai
---

# 网络聚合: AI

**聚合时间:** 2026-02-12 21:19
**关键词:** AI

## 今日精选

### 1. Understanding AI: Definitions, history, and technological evolution

**摘要:** Artificial Intelligence (AI): AI is the umbrella term for machines designed to mimic human brainpower...

🔗 [阅读原文](https://example.com/ai-article)
📊 相关度: 99%
```

### 4. 行为观察器 (Behavior Observer)

**功能**：
- 记录 OpenClaw 命令使用情况
- 分析高频命令和工作流模式
- 提供自动化建议

**启用行为跟踪**：
```bash
# 行为日志存储在
~/.local/share/continuous-learning/behavior/
```

**使用方法**：
```bash
# 生成每日报告
node scripts/behavior-report.mjs --period daily --output console

# 生成每周报告（保存到文件）
node scripts/behavior-report.mjs --period weekly --output file

# 生成月度报告（输出到 Obsidian）
node scripts/behavior-report.mjs --period monthly --output obsidian
```

**报告内容**：
```
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
| read | 8 |
| edit | 7 |

## Automation Suggestions
1. **高频命令**: "cron list" (使用15次) - 考虑创建别名或快捷键
2. **工作流模式**: "memory search → read → edit" (出现8次) - 可自动化此流程
```

## ⚙️ 配置详解

### 配置文件结构

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

### 完整配置示例

**config.json**:
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
    "exclude_sessions": ["cron", "system"]
  },
  "note_analysis": {
    "enabled": true,
    "obsidian_vault": "/path/to/your/obsidian/vault",
    "incremental": true,
    "build_knowledge_graph": true,
    "generate_link_suggestions": true,
    "exclude_folders": ["Attachments", ".trash", "node_modules"],
    "max_file_size_mb": 10,
    "min_similarity_score": 0.6
  },
  "behavior_observation": {
    "enabled": true,
    "track_commands": true,
    "track_sessions": true,
    "analyze_patterns": "weekly",
    "privacy_mode": "minimal",
    "retention_days": 90,
    "exclude_commands": ["password", "secret", "key"]
  },
  "web_aggregation": {
    "enabled": true,
    "topics_config": "~/.config/continuous-learning/topics.json",
    "output_to": "obsidian",
    "language": "zh",
    "max_results_per_topic": 5,
    "min_relevance_score": 0.7,
    "exclude_domains": ["spam-site.com", "low-quality-blog.net"]
  },
  "general": {
    "log_level": "info",
    "data_retention_days": 365,
    "backup_enabled": true,
    "backup_frequency": "weekly"
  }
}
```

## 🔧 故障排除

### 常见问题

#### 1. 对话学习没有提取到消息
**可能原因**：
- 会话文件格式不匹配
- 没有符合条件的消息
- 权限问题

**解决方案**：
```bash
# 检查会话文件格式
head -n 5 ~/.openclaw/agents/main/sessions/*.jsonl | head -20

# 手动测试提取
node scripts/learn-from-conversation.mjs --dry-run --verbose
```

#### 2. 笔记分析速度慢
**优化建议**：
- 使用增量分析 `--incremental`
- 排除大文件目录
- 增加内存限制

```bash
# 排除特定文件夹
node scripts/analyze-notes.mjs --exclude "Attachments,node_modules,.git"

# 限制处理文件大小
node scripts/analyze-notes.mjs --max-size 5
```

#### 3. 网络聚合 API 错误
**检查步骤**：
1. 验证 API Key 是否正确设置
2. 检查网络连接
3. 确认 API 额度是否充足

```bash
# 测试 API 连接
export TAVILY_API_KEY="your-key"
curl -s "https://api.tavily.com/search?query=test&api_key=$TAVILY_API_KEY" | jq .
```

#### 4. 行为报告没有数据
**启用跟踪**：
```bash
# 确保行为观察已启用
# 在 config.json 中设置 "track_commands": true

# 手动创建测试数据
node scripts/init-learning.mjs --enable-behavior-tracking
```

### 日志位置
- **运行日志**: `~/.local/share/continuous-learning/logs/`
- **错误日志**: `~/.local/share/continuous-learning/logs/error.log`
- **调试日志**: 设置 `log_level: "debug"` 后查看详细日志

## 📈 最佳实践

### 1. 渐进式启用
```bash
# 第1周：只启用对话学习
# 第2周：启用笔记分析
# 第3周：启用网络聚合
# 第4周：启用行为观察
```

### 2. 定期审查
- 每周检查一次学习结果
- 每月审查自动化建议
- 每季度调整主题配置

### 3. 隐私保护
- 敏感信息自动脱敏
- 本地存储所有数据
- 可配置数据保留期限

### 4. 性能优化
- 使用增量分析减少处理时间
- 合理安排定时任务时间
- 定期清理缓存和旧数据

## 🗺️ 路线图

### 近期计划 (v1.1)
- [ ] 支持 Notion 集成
- [ ] 多语言支持
- [ ] 更智能的链接建议算法
- [ ] 可视化知识图谱

### 中期计划 (v1.5)
- [ ] PDF/文档内容分析
- [ ] 跨设备学习同步
- [ ] 个性化模型微调
- [ ] 主动建议功能

### 长期愿景 (v2.0)
- [ ] 多模态学习（图片、音频）
- [ ] 预测性学习（预判用户需求）
- [ ] 协作学习（团队知识共享）
- [ ] 开放式学习（自动发现新主题）

## 📞 支持与反馈

### 报告问题
1. 查看日志文件：`~/.local/share/continuous-learning/logs/`
2. 提供复现步骤
3. 包含相关配置信息

### 功能建议
通过 OpenClaw 社区或直接联系开发者提交建议。

### 贡献代码
欢迎提交 Pull Request 到 GitHub 仓库。

---

**版本**: 1.0.0  
**最后更新**: 2026-02-12  
**作者**: SoSME  
**许可证**: MIT