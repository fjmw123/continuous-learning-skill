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

**Empower OpenClaw with autonomous learning capabilities, evolving across four dimensions:**

1. **Conversation Learning** — Extract preferences, habits, and decision patterns from every dialogue
2. **Note Analysis** — Analyze Obsidian notes, build knowledge association graphs
3. **Behavior Observation** — Observe operation patterns, identify high-frequency tasks and efficiency bottlenecks
4. **Web Aggregation** — Regularly search for topics of interest, automatically organize and store content

## ✨ Core Value

- **Personalized Service**: AI understands you better over time, providing more precise assistance
- **Knowledge Accumulation**: Automatically organize conversations, notes, and web content to build a personal knowledge base
- **Efficiency Improvement**: Identify repetitive work patterns and provide automation suggestions
- **Continuous Evolution**: AI capabilities grow over time without manual training

## 🚀 Quick Start

### 1. Installation & Initialization

```bash
# Enter the skill directory
cd /path/to/continuous-learning-skill

# Initialize the learning system
node scripts/init-learning.mjs
```

### 2. Configure Learning Pipeline

Edit `~/.config/continuous-learning/config.json`:

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

### 3. Set Environment Variables

```bash
# Tavily API Key (for web aggregation)
export TAVILY_API_KEY="your_tavily_api_key_here"

# Add to shell configuration file for permanent effect
echo 'export TAVILY_API_KEY="your_tavily_api_key_here"' >> ~/.zshrc
```

### 4. Manual Testing of Modules

```bash
# Test conversation learning
node scripts/learn-from-conversation.mjs --since "1h" --output both

# Test note analysis
node scripts/analyze-notes.mjs --incremental

# Test web aggregation
node scripts/aggregate-web.mjs --topic "AI" --max-results 5

# Test behavior reporting
node scripts/behavior-report.mjs --period weekly --output console
```

### 5. Set Up Automated Scheduled Tasks

```bash
# View configured cron tasks
openclaw cron list

# Or manually add scheduled tasks
# Hourly: Conversation learning
# Daily 02:00: Note analysis
# Daily 09:00: Web aggregation
# Monday 09:00: Behavior reporting
```

## 📊 Module Details

### 1. Conversation Learner

**Features**:
- Automatically analyze OpenClaw session history
- Extract facts, preferences, decisions, commitments
- Generate structured summaries, update MEMORY.md

**Usage**:
```bash
# Analyze conversations from the past 1 hour
node scripts/learn-from-conversation.mjs --since "1h"

# Analyze specific session
node scripts/learn-from-conversation.mjs --session <session-id>

# Output to Obsidian
node scripts/learn-from-conversation.mjs --since "24h" --output obsidian

# Output to both MEMORY.md and Obsidian
node scripts/learn-from-conversation.mjs --since "24h" --output both
```

**Output Example**:
```json
{
  "facts": ["User is a rail transit vehicle maintenance project manager"],
  "preferences": ["Prefers using tables to display structured information"],
  "decisions": ["Decided to use squad mode for complex tasks"],
  "commitments": ["Will start side business plan tomorrow"],
  "timestamp": "2026-02-12T20:30:00+08:00"
}
```

### 2. Note Analyzer

**Features**:
- Scan all notes in Obsidian vault
- Extract tags, links, topic clusters
- Build knowledge graphs, generate link suggestions

**Usage**:
```bash
# Complete analysis of entire vault
node scripts/analyze-notes.mjs

# Incremental analysis (only new/modified notes)
node scripts/analyze-notes.mjs --incremental

# Specify vault path
node scripts/analyze-notes.mjs --vault "/path/to/obsidian/vault"
```

**Output Files**:
- `graph.json` — Complete knowledge graph data
- `suggested-links.json` — Recommended note links
- `report.md` — Analysis report (includes tag distribution, link suggestions, etc.)

**Report Content**:
```
# Knowledge Graph Analysis Report

**Total Notes:** 2038
**Total Links:** 117  
**Unique Tags:** 184
**Link Suggestions:** 20

## Top Tags
- #project (158 notes) - Project management related
- #meeting (144 notes) - Meeting records
- #learning (120 notes) - Learning notes

## Top Link Suggestions
1. Project Plan.md ↔ Meeting Records.md (Common tags: #project)
2. Learning Notes.md ↔ Technical Documentation.md (Common tags: #learning)
```

### 3. Web Aggregator

**Features**:
- Use Tavily API to search for high-quality content
- Aggregate web information by topic
- Generate Chinese summaries, save to Obsidian

**Topic Configuration** (`~/.config/continuous-learning/topics.json`):
```json
{
  "topics": [
    {
      "name": "AI",
      "display_name": "Artificial Intelligence",
      "queries": ["AI news", "artificial intelligence", "LLM updates"],
      "keywords": ["AI", "machine learning", "large language models"],
      "frequency": "daily",
      "max_results": 5,
      "language": "zh"
    },
    {
      "name": "SmartMetro",
      "display_name": "Rail Transit Intelligence",
      "queries": ["smart metro digitalization", "predictive maintenance rail"],
      "keywords": ["metro intelligence", "predictive maintenance", "rail transit"],
      "frequency": "daily",
      "max_results": 3,
      "language": "zh"
    }
  ]
}
```

**Usage**:
```bash
# Aggregate all topics
node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json

# Aggregate single topic
node scripts/aggregate-web.mjs --topic "AI" --max-results 5

# Test mode (no save)
node scripts/aggregate-web.mjs --topic "AI" --dry-run
```

**Output Example** (Obsidian note):
```markdown
---
date created: 2026,02,12
tags:
  - web-aggregation
  - auto-learning
  - ai
---

# Web Aggregation: AI

**Aggregation Time:** 2026-02-12 21:19
**Keywords:** AI

## Today's Selection

### 1. Understanding AI: Definitions, history, and technological evolution

**Summary:** Artificial Intelligence (AI): AI is the umbrella term for machines designed to mimic human brainpower...

🔗 [Read Original](https://example.com/ai-article)
📊 Relevance: 99%
```

### 4. Behavior Observer

**Features**:
- Record OpenClaw command usage
- Analyze high-frequency commands and workflow patterns
- Provide automation suggestions

**Enable Behavior Tracking**:
```bash
# Behavior logs stored in
~/.local/share/continuous-learning/behavior/
```

**Usage**:
```bash
# Generate daily report
node scripts/behavior-report.mjs --period daily --output console

# Generate weekly report (save to file)
node scripts/behavior-report.mjs --period weekly --output file

# Generate monthly report (output to Obsidian)
node scripts/behavior-report.mjs --period monthly --output obsidian
```

**Report Content**:
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
1. **High-frequency command**: "cron list" (used 15 times) - Consider creating an alias or shortcut
2. **Workflow pattern**: "memory search → read → edit" (appeared 8 times) - Could automate this process
```

## ⚙️ Configuration Details

### Configuration File Structure

```
~/.config/continuous-learning/
├── config.json          # Main configuration file
├── topics.json          # Web aggregation topic configuration
└── behavior-config.json # Behavior observation configuration (optional)

~/.local/share/continuous-learning/
├── logs/                # Runtime logs
├── knowledge-graph/     # Knowledge graph data
├── behavior/           # Behavior logs
└── cache/              # Cache data
```

### Complete Configuration Example

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

## 🔧 Troubleshooting

### Common Issues

#### 1. Conversation Learning Not Extracting Messages
**Possible Causes**:
- Session file format mismatch
- No qualifying messages
- Permission issues

**Solutions**:
```bash
# Check session file format
head -n 5 ~/.openclaw/agents/main/sessions/*.jsonl | head -20

# Manual extraction test
node scripts/learn-from-conversation.mjs --dry-run --verbose
```

#### 2. Note Analysis Slow
**Optimization Suggestions**:
- Use incremental analysis `--incremental`
- Exclude large file directories
- Increase memory limit

```bash
# Exclude specific folders
node scripts/analyze-notes.mjs --exclude "Attachments,node_modules,.git"

# Limit processing file size
node scripts/analyze-notes.mjs --max-size 5
```

#### 3. Web Aggregation API Error
**Check Steps**:
1. Verify API Key is correctly set
2. Check network connection
3. Confirm API quota is sufficient

```bash
# Test API connection
export TAVILY_API_KEY="your-key"
curl -s "https://api.tavily.com/search?query=test&api_key=$TAVILY_API_KEY" | jq .
```

#### 4. Behavior Report No Data
**Enable Tracking**:
```bash
# Ensure behavior observation is enabled
# Set "track_commands": true in config.json

# Manually create test data
node scripts/init-learning.mjs --enable-behavior-tracking
```

### Log Locations
- **Runtime Logs**: `~/.local/share/continuous-learning/logs/`
- **Error Logs**: `~/.local/share/continuous-learning/logs/error.log`
- **Debug Logs**: View detailed logs after setting `log_level: "debug"`

## 📈 Best Practices

### 1. Progressive Enablement
```bash
# Week 1: Enable only conversation learning
# Week 2: Enable note analysis
# Week 3: Enable web aggregation
# Week 4: Enable behavior observation
```

### 2. Regular Review
- Check learning results weekly
- Review automation suggestions monthly
- Adjust topic configuration quarterly

### 3. Privacy Protection
- Automatic sensitive information masking
- All data stored locally
- Configurable data retention period

### 4. Performance Optimization
- Use incremental analysis to reduce processing time
- Reasonably schedule task times
- Regularly clean cache and old data

## 🗺️ Roadmap

### Near-term Plans (v1.1)
- [ ] Notion integration support
- [ ] Multi-language support
- [ ] Smarter link suggestion algorithms
- [ ] Visual knowledge graph

### Medium-term Plans (v1.5)
- [ ] PDF/document content analysis
- [ ] Cross-device learning synchronization
- [ ] Personalized model fine-tuning
- [ ] Proactive suggestion functionality

### Long-term Vision (v2.0)
- [ ] Multimodal learning (images, audio)
- [ ] Predictive learning (anticipating user needs)
- [ ] Collaborative learning (team knowledge sharing)
- [ ] Open-ended learning (automatically discovering new topics)

## 📞 Support & Feedback

### Report Issues
1. Check log files: `~/.local/share/continuous-learning/logs/`
2. Provide reproduction steps
3. Include relevant configuration information

### Feature Suggestions
Submit suggestions through OpenClaw community or directly contact the developer.

### Code Contributions
Welcome to submit Pull Requests to the GitHub repository.

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-12  
**Author**: SoSME  
**License**: MIT