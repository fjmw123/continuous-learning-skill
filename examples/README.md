# Continuous Learning Skill - Example Data

This directory contains various example data for the Continuous Learning skill, used for testing and understanding the functionality of each module.

## 📁 Directory Structure

```
examples/
├── conversations/          # Conversation learning examples
│   ├── sample-session.jsonl     # OpenClaw session file example
│   ├── extracted-insights.json  # Extracted insights example
│   └── memory-update.md         # MEMORY.md update example
├── notes/                 # Note analysis examples
│   ├── sample-notes/           # Example Obsidian notes
│   ├── knowledge-graph.json    # Knowledge graph example
│   └── link-suggestions.md     # Link suggestions example
├── behavior/              # Behavior observation examples
│   ├── command-logs.json       # Command logs example
│   ├── behavior-report.md      # Behavior report example
│   └── automation-suggestions.md # Automation suggestions example
├── web-aggregation/       # Web aggregation examples
│   ├── topics-config.json      # Topic configuration example
│   ├── aggregated-content.md   # Aggregated content example
│   └── search-results.json     # Raw search results example
└── configs/               # Configuration examples
    ├── minimal-config.json     # Minimal configuration
    ├── full-config.json        # Full configuration
    └── production-config.json  # Production environment configuration
```

## 🧪 How to Use Example Data

### 1. Test Conversation Learning

```bash
# Test using example session file
cp examples/conversations/sample-session.jsonl ~/.openclaw/agents/main/sessions/test-session.jsonl

# Run conversation learning
node scripts/learn-from-conversation.mjs --session test-session --output console
```

### 2. Test Note Analysis

```bash
# Create test vault
mkdir -p /tmp/test-vault
cp examples/notes/sample-notes/* /tmp/test-vault/

# Run note analysis
node scripts/analyze-notes.mjs --vault /tmp/test-vault --output console
```

### 3. Test Behavior Reporting

```bash
# Use example behavior logs
cp examples/behavior/command-logs.json ~/.local/share/continuous-learning/behavior/

# Generate behavior report
node scripts/behavior-report.mjs --period weekly --output console
```

### 4. Test Web Aggregation

```bash
# Use example configuration
cp examples/web-aggregation/topics-config.json ~/.config/continuous-learning/topics.json

# Run web aggregation (requires Tavily API Key)
export TAVILY_API_KEY="your-api-key"
node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json --dry-run
```

## 📋 Example File Descriptions

### 1. Conversation Learning Examples

**sample-session.jsonl** - OpenClaw session file format example:
```json
{"type":"session","version":3,"id":"example-session","timestamp":"2026-02-12T10:00:00Z"}
{"type":"message","id":"msg1","timestamp":"2026-02-12T10:01:00Z","message":{"role":"user","content":[{"type":"text","text":"I prefer using tables to display information"}]}}
{"type":"message","id":"msg2","timestamp":"2026-02-12T10:02:00Z","message":{"role":"assistant","content":[{"type":"text","text":"Okay, I'll use tables to organize information"}]}}
```

**extracted-insights.json** - Extracted insights example:
```json
{
  "facts": ["User is a project manager", "User works in Shanghai"],
  "preferences": ["Prefers table display", "Prefers structured information"],
  "decisions": ["Chose to use squad mode", "Decided to learn Python"],
  "commitments": ["Will start side business tomorrow", "Will study 3 hours per week"],
  "timestamp": "2026-02-12T10:30:00Z"
}
```

### 2. Note Analysis Examples

**sample-notes/** - Example Obsidian notes:
- `project-plan.md` - Project planning notes
- `meeting-notes.md` - Meeting records
- `research-ideas.md` - Research ideas
- `book-summary.md` - Book summaries

**knowledge-graph.json** - Knowledge graph example:
```json
{
  "nodes": [
    {"id": "note1", "title": "Project Plan", "tags": ["project", "planning"]},
    {"id": "note2", "title": "Meeting Records", "tags": ["meeting", "work"]}
  ],
  "edges": [
    {"source": "note1", "target": "note2", "type": "reference", "strength": 0.8}
  ]
}
```

### 3. Behavior Observation Examples

**command-logs.json** - Command logs example:
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

**behavior-report.md** - Behavior report example:
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

### 4. Web Aggregation Examples

**topics-config.json** - Topic configuration example:
```json
{
  "topics": [
    {
      "name": "AI",
      "display_name": "Artificial Intelligence",
      "queries": ["AI news", "machine learning"],
      "keywords": ["AI", "artificial intelligence"],
      "frequency": "daily",
      "max_results": 3
    }
  ]
}
```

**aggregated-content.md** - Aggregated content example:
```markdown
# Web Aggregation: AI

## Today's Selection

### 1. Understanding AI Technology

**Summary:** Artificial Intelligence is transforming industries...

🔗 [Read Original](https://example.com/ai-article)
📊 Relevance: 95%
```

## 🎯 Test Scenarios

### Scenario 1: New User Quick Start
```bash
# 1. Copy minimal configuration
cp examples/configs/minimal-config.json ~/.config/continuous-learning/config.json

# 2. Run initialization
node scripts/init-learning.mjs

# 3. Test all modules
./examples/run-all-tests.sh
```

### Scenario 2: Development Debugging
```bash
# 1. Enable debug mode
export CONTINUOUS_LEARNING_LOG_LEVEL="debug"

# 2. Test with example data
node scripts/learn-from-conversation.mjs --session examples/conversations/sample-session.jsonl --verbose

# 3. Check detailed output
tail -f ~/.local/share/continuous-learning/logs/debug.log
```

### Scenario 3: Performance Testing
```bash
# 1. Use large example dataset
cp examples/notes/large-dataset/* /tmp/test-vault-large/

# 2. Run performance test
time node scripts/analyze-notes.mjs --vault /tmp/test-vault-large --output none

# 3. Check memory usage
node scripts/analyze-notes.mjs --vault /tmp/test-vault-large --memory-profile
```

## 🔧 Custom Examples

### Create Your Own Test Data
```bash
# 1. Create test directory
mkdir -p ~/continuous-learning-test

# 2. Copy templates
cp examples/configs/minimal-config.json ~/continuous-learning-test/my-config.json

# 3. Modify configuration
# Edit ~/continuous-learning-test/my-config.json

# 4. Use custom configuration
export CONTINUOUS_LEARNING_CONFIG_DIR="~/continuous-learning-test"
node scripts/init-learning.mjs
```

### Extend Example Data
```bash
# 1. Add new example sessions
cp ~/.openclaw/agents/main/sessions/*.jsonl examples/conversations/real-session.jsonl

# 2. Add real notes
cp ~/Documents/Obsidian/*.md examples/notes/real-notes/

# 3. Update example configurations
# Modify examples/configs/ based on actual usage
```

## 📊 Verify Test Results

### Verify Conversation Learning
```bash
# Check if insights were extracted
node -e "const insights = require('./examples/conversations/extracted-insights.json'); console.log('Preferences extracted:', insights.preferences.length);"
```

### Verify Note Analysis
```bash
# Check knowledge graph
node -e "const graph = require('./examples/notes/knowledge-graph.json'); console.log('Nodes:', graph.nodes.length, 'Edges:', graph.edges.length);"
```

### Verify Behavior Reporting
```bash
# Check report generation
node -e "const fs = require('fs'); const report = fs.readFileSync('./examples/behavior/behavior-report.md', 'utf8'); console.log('Report length:', report.length, 'characters');"
```

## 🚨 Important Notes

1. **API Key**: Web aggregation examples require a real Tavily API Key
2. **File Permissions**: Ensure read permissions for example files
3. **Data Security**: Example data does not contain real sensitive information
4. **Storage Space**: Large examples may require significant storage space

## 📞 Support

If you encounter problems using example data:
1. Check file paths and permissions
2. View log files: `~/.local/share/continuous-learning/logs/`
3. Refer to main documentation: `../SKILL_EN.md`
4. Contact technical support

---

**Example Data Update Date**: 2026-02-12  
**Version**: 1.0.0  
**Compatible Version**: Continuous Learning Skill v1.0.0+