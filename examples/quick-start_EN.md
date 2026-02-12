# 🚀 Continuous Learning Skill - Quick Start Guide

## 5-Minute Quick Start

### Step 1: Initialization
```bash
# Enter skill directory
cd /path/to/continuous-learning

# Run initialization script
node scripts/init-learning.mjs
```

### Step 2: Minimal Configuration
Edit `~/.config/continuous-learning/config.json`:
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

### Step 3: Test Conversation Learning
```bash
# Analyze conversations from the past 1 hour
node scripts/learn-from-conversation.mjs --since "1h" --output console

# View results
cat ~/openclaw/MEMORY.md | tail -20
```

### Step 4: Set Up Automation
```bash
# Add hourly conversation learning task
openclaw cron add --name "Conversation Learning" --schedule "0 * * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"Run conversation learning script: node /path/to/continuous-learning/scripts/learn-from-conversation.mjs --since 1h --output both"}'
```

## Advanced Configuration

### Enable Note Analysis
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
# Manually run note analysis
node scripts/analyze-notes.mjs --incremental

# View knowledge graph
cat ~/.local/share/continuous-learning/knowledge-graph/report.md
```

### Enable Web Aggregation
```bash
# Set API Key
export TAVILY_API_KEY="your-api-key"

# Create topic configuration
cp examples/web-aggregation/topics-config.json ~/.config/continuous-learning/topics.json

# Test aggregation
node scripts/aggregate-web.mjs --topic "AI" --max-results 3
```

### Enable Behavior Observation
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
# Generate behavior report
node scripts/behavior-report.mjs --period weekly --output console
```

## Common Command Reference

### Conversation Learning
```bash
# Analyze recent conversations
node scripts/learn-from-conversation.mjs --since "1h"

# Analyze specific time period
node scripts/learn-from-conversation.mjs --since "24h"

# Output to Obsidian
node scripts/learn-from-conversation.mjs --since "1h" --output obsidian

# Verbose mode
node scripts/learn-from-conversation.mjs --since "1h" --verbose
```

### Note Analysis
```bash
# Complete analysis
node scripts/analyze-notes.mjs

# Incremental analysis
node scripts/analyze-notes.mjs --incremental

# Specify vault path
node scripts/analyze-notes.mjs --vault "/path/to/vault"

# Exclude folders
node scripts/analyze-notes.mjs --exclude "Attachments,node_modules"
```

### Web Aggregation
```bash
# Aggregate all topics
node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json

# Aggregate single topic
node scripts/aggregate-web.mjs --topic "AI"

# Limit result count
node scripts/aggregate-web.mjs --topic "AI" --max-results 5

# Test mode
node scripts/aggregate-web.mjs --topic "AI" --dry-run
```

### Behavior Reporting
```bash
# Daily report
node scripts/behavior-report.mjs --period daily --output console

# Weekly report (save to file)
node scripts/behavior-report.mjs --period weekly --output file

# Monthly report
node scripts/behavior-report.mjs --period monthly --output obsidian
```

## Automation Configuration Example

### Complete Automation Configuration
```bash
# Conversation Learning - Hourly
0 * * * * cd /path/to/continuous-learning && node scripts/learn-from-conversation.mjs --since 1h --output both >> ~/.local/share/continuous-learning/logs/conversation.log 2>&1

# Note Analysis - Daily 02:00
0 2 * * * cd /path/to/continuous-learning && node scripts/analyze-notes.mjs --incremental >> ~/.local/share/continuous-learning/logs/notes.log 2>&1

# Web Aggregation - Daily 09:00
0 9 * * * export TAVILY_API_KEY="your-api-key" && cd /path/to/continuous-learning && node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json >> ~/.local/share/continuous-learning/logs/web.log 2>&1

# Behavior Report - Monday 09:00
0 9 * * 1 cd /path/to/continuous-learning && node scripts/behavior-report.mjs --period weekly --output file >> ~/.local/share/continuous-learning/logs/behavior.log 2>&1
```

## Quick Troubleshooting Guide

### 1. Permission Issues
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.openclaw
sudo chown -R $(whoami) ~/.local/share/continuous-learning
```

### 2. API Key Issues
```bash
# Check environment variable
echo $TAVILY_API_KEY

# Temporary setup
export TAVILY_API_KEY="your-api-key"
```

### 3. Insufficient Memory
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=2048"
```

### 4. View Logs
```bash
# View latest logs
tail -f ~/.local/share/continuous-learning/logs/*.log

# View error logs
cat ~/.local/share/continuous-learning/logs/error.log
```

## Next Steps

1. **Detailed Configuration**: View `SETUP_EN.md` for complete configuration instructions
2. **Example Data**: Check `examples/` directory for test data
3. **Advanced Features**: Read `SKILL_EN.md` to learn about all features
4. **Automation**: Set up scheduled tasks for full automation

## Get Help

- **Documentation**: `SKILL_EN.md`, `SETUP_EN.md`
- **Examples**: `examples/` directory
- **Testing**: Run `./examples/run-test.sh`
- **Logs**: `~/.local/share/continuous-learning/logs/`

---

**Start your Continuous Learning journey now!** 🚀