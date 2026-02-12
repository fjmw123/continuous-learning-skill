# Continuous Learning Skill - Installation & Configuration Guide

## 📋 System Requirements

### Hardware Requirements
- **Memory**: At least 2GB available RAM
- **Storage**: At least 500MB available space (for logs and cache)
- **Network**: Stable internet connection (for web aggregation)

### Software Requirements
- **Node.js**: v16.0.0 or higher
- **OpenClaw**: v2026.2.0 or higher
- **Obsidian** (optional): For note analysis and content storage

### Permission Requirements
- Read access to OpenClaw session files
- Write access to configuration directories
- Execute permission for Node.js scripts

## 🛠️ Installation Steps

### 1. Get Skill Files

```bash
# Clone from GitHub
git clone https://github.com/yourusername/continuous-learning.git
cd continuous-learning

# Or download ZIP file and extract
```

### 2. Install Dependencies

```bash
# Check Node.js version
node --version  # Requires >= 16.0.0

# Install dependencies
npm install
# Or use yarn
yarn install
```

### 3. Initialize Configuration

```bash
# Run initialization script
node scripts/init-learning.mjs
```

The initialization script creates the following directory structure:
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

## 🔧 Detailed Configuration

### 1. Main Configuration File (`config.json`)

#### Conversation Learning Configuration
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

#### Note Analysis Configuration
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

#### Behavior Observation Configuration
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

#### Web Aggregation Configuration
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

### 2. Topic Configuration File (`topics.json`)

```json
{
  "topics": [
    {
      "name": "AI",
      "display_name": "Artificial Intelligence",
      "description": "AI technology development, large model updates, machine learning trends",
      "queries": [
        "AI news 2026",
        "artificial intelligence breakthroughs",
        "LLM updates latest",
        "machine learning trends",
        "AI ethics discussion"
      ],
      "keywords": ["AI", "artificial intelligence", "machine learning", "large language models", "deep learning"],
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
      "display_name": "Rail Transit Intelligence",
      "description": "Metro intelligence, predictive maintenance, digital twin technology",
      "queries": [
        "smart metro digitalization",
        "predictive maintenance railway",
        "digital twin metro system",
        "CBTC system updates",
        "rail asset management digital"
      ],
      "keywords": ["metro", "rail transit", "intelligence", "predictive maintenance", "digital twin"],
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

### 3. Environment Variable Configuration

#### Required Environment Variables
```bash
# Tavily API Key (for web aggregation)
export TAVILY_API_KEY="your_tavily_api_key_here"

# Obsidian Vault Path (for note analysis)
export OBSIDIAN_VAULT="/path/to/your/obsidian/vault"

# OpenClaw Sessions Path
export OPENCLAW_SESSIONS_PATH="~/.openclaw/agents/main/sessions"
```

#### Optional Environment Variables
```bash
# Log level
export CONTINUOUS_LEARNING_LOG_LEVEL="info"  # debug, info, warn, error

# Data directory
export CONTINUOUS_LEARNING_DATA_DIR="~/.local/share/continuous-learning"

# Configuration directory
export CONTINUOUS_LEARNING_CONFIG_DIR="~/.config/continuous-learning"

# Cache settings
export CONTINUOUS_LEARNING_CACHE_ENABLED="true"
export CONTINUOUS_LEARNING_CACHE_TTL="86400"  # 24 hours, in seconds

# Network proxy (if needed)
export HTTP_PROXY="http://proxy.example.com:8080"
export HTTPS_PROXY="http://proxy.example.com:8080"
```

#### Permanent Configuration (Add to shell configuration file)
```bash
# Edit ~/.zshrc or ~/.bashrc
echo 'export TAVILY_API_KEY="your_tavily_api_key_here"' >> ~/.zshrc
echo 'export OBSIDIAN_VAULT="/path/to/your/obsidian/vault"' >> ~/.zshrc
echo 'export CONTINUOUS_LEARNING_LOG_LEVEL="info"' >> ~/.zshrc

# Reload configuration
source ~/.zshrc
```

## 🔐 Permission Settings

### 1. File Permissions
```bash
# Ensure read access to OpenClaw session files
ls -la ~/.openclaw/agents/main/sessions/

# Adjust permissions if needed
chmod 755 ~/.openclaw
chmod 755 ~/.openclaw/agents
chmod 755 ~/.openclaw/agents/main
chmod 755 ~/.openclaw/agents/main/sessions
```

### 2. Directory Permissions
```bash
# Create and set data directory permissions
mkdir -p ~/.local/share/continuous-learning
chmod 755 ~/.local/share/continuous-learning

# Create and set configuration directory permissions
mkdir -p ~/.config/continuous-learning
chmod 755 ~/.config/continuous-learning
```

### 3. Script Execution Permissions
```bash
# Ensure scripts have execute permissions
chmod +x /path/to/continuous-learning/scripts/*.mjs
```

## 🚀 Automated Deployment

### 1. Using OpenClaw Cron System

```bash
# View current cron tasks
openclaw cron list

# Add conversation learning task (runs hourly)
openclaw cron add --name "Conversation Learning" --schedule "0 * * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"Run conversation learning script: node /path/to/continuous-learning/scripts/learn-from-conversation.mjs --since 1h --output both"}'

# Add note analysis task (runs daily at 2 AM)
openclaw cron add --name "Note Analysis" --schedule "0 2 * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"Run note analysis script: node /path/to/continuous-learning/scripts/analyze-notes.mjs --incremental"}'

# Add web aggregation task (runs daily at 9 AM)
openclaw cron add --name "Web Aggregation" --schedule "0 9 * * *" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"Run web aggregation script: export TAVILY_API_KEY=\"your_tavily_api_key_here\" && node /path/to/continuous-learning/scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json"}'

# Add behavior report task (runs Monday at 9 AM)
openclaw cron add --name "Behavior Report" --schedule "0 9 * * 1" --sessionTarget isolated --payload '{"kind":"agentTurn","message":"Run behavior report script: node /path/to/continuous-learning/scripts/behavior-report.mjs --period weekly --output file"}'
```

### 2. Using System Crontab

```bash
# Edit crontab
crontab -e

# Add the following tasks
# Hourly: Conversation learning
0 * * * * cd /path/to/continuous-learning && node scripts/learn-from-conversation.mjs --since 1h --output both >> ~/.local/share/continuous-learning/logs/conversation.log 2>&1

# Daily 02:00: Note analysis
0 2 * * * cd /path/to/continuous-learning && node scripts/analyze-notes.mjs --incremental >> ~/.local/share/continuous-learning/logs/notes.log 2>&1

# Daily 09:00: Web aggregation
0 9 * * * export TAVILY_API_KEY="your_tavily_api_key_here" && cd /path/to/continuous-learning && node scripts/aggregate-web.mjs --config ~/.config/continuous-learning/topics.json >> ~/.local/share/continuous-learning/logs/web.log 2>&1

# Monday 09:00: Behavior report
0 9 * * 1 cd /path/to/continuous-learning && node scripts/behavior-report.mjs --period weekly --output file >> ~/.local/share/continuous-learning/logs/behavior.log 2>&1
```

## 🧪 Test Configuration

### 1. Test All Modules
```bash
# Enter skill directory
cd /path/to/continuous-learning

# Test conversation learning
echo "Testing conversation learning..."
node scripts/learn-from-conversation.mjs --since "10m" --dry-run

# Test note analysis
echo "Testing note analysis..."
node scripts/analyze-notes.mjs --dry-run

# Test web aggregation
echo "Testing web aggregation..."
export TAVILY_API_KEY="your_tavily_api_key_here"
node scripts/aggregate-web.mjs --topic "AI" --max-results 2 --dry-run

# Test behavior reporting
echo "Testing behavior reporting..."
node scripts/behavior-report.mjs --period daily --output console
```

### 2. Verify Output
```bash
# Check log files
ls -la ~/.local/share/continuous-learning/logs/

# View recent logs
tail -f ~/.local/share/continuous-learning/logs/*.log

# Check generated files
ls -la ~/.local/share/continuous-learning/knowledge-graph/
ls -la ~/.local/share/continuous-learning/behavior/
```

### 3. Verify Permissions
```bash
# Test file access
node -e "const fs = require('fs'); console.log('OpenClaw sessions accessible:', fs.existsSync(process.env.HOME + '/.openclaw/agents/main/sessions/'));"

# Test directory write
node -e "const fs = require('fs'); fs.writeFileSync('/tmp/test-permission.txt', 'test'); console.log('Write permission normal'); fs.unlinkSync('/tmp/test-permission.txt');"
```

## 🔄 Updates & Maintenance

### 1. Update Skill
```bash
# If cloned from GitHub
cd /path/to/continuous-learning
git pull origin main
npm install
```

### 2. Backup Configuration
```bash
# Backup configuration files
cp -r ~/.config/continuous-learning ~/.config/continuous-learning-backup-$(date +%Y%m%d)

# Backup data files
cp -r ~/.local/share/continuous-learning ~/.local/share/continuous-learning-backup-$(date +%Y%m%d)
```

### 3. Clean Old Data
```bash
# Clean old logs (keep last 30 days)
find ~/.local/share/continuous-learning/logs -name "*.log" -mtime +30 -delete

# Clean old cache (keep last 7 days)
find ~/.local/share/continuous-learning/cache -type f -mtime +7 -delete

# Clean old behavior logs (keep last 90 days)
find ~/.local/share/continuous-learning/behavior -name "*.json" -mtime +90 -delete
```

## 🆘 Troubleshooting

### Common Problem Solutions

#### 1. "Permission Denied" Error
```bash
# Check current user
whoami

# Check file permissions
ls -la ~/.openclaw/
ls -la ~/.local/share/continuous-learning/

# Fix permissions
sudo chown -R $(whoami) ~/.openclaw
sudo chown -R $(whoami) ~/.local/share/continuous-learning
sudo chown -R $(whoami) ~/.config/continuous-learning
```

#### 2. "Module Not Found" Error
```bash
# Check Node.js version
node --version

# Reinstall dependencies
cd /path/to/continuous-learning
rm -rf node_modules package-lock.json
npm install
```

#### 3. "API Key Invalid" Error
```bash
# Check environment variable
echo $TAVILY_API_KEY

# Test API connection
curl -s "https://api.tavily.com/search?query=test&api_key=$TAVILY_API_KEY" | jq '.error // "API normal"'
```

#### 4. "Insufficient Memory" Error
```bash
# Reduce parallel processing count
# Set "parallel_processing": 2 in config.json

# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
```

### Get Help

1. **View Logs**: `~/.local/share/continuous-learning/logs/`
2. **Enable Debug Mode**: Set `log_level: "debug"`
3. **Contact Support**: Through OpenClaw community or GitHub Issues

---

**Configuration Complete!** You can now start using the Continuous Learning skill. It's recommended to run the test script first to verify all functions work properly.