# Continuous Learning Skill for OpenClaw

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue.svg)](https://openclaw.ai)

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

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/continuous-learning.git
cd continuous-learning

# Install dependencies
npm install

# Initialize configuration
node scripts/init-learning.mjs
```

### Minimal Configuration
Edit `~/.config/continuous-learning/config.json`:
```json
{
  "conversation_learning": {
    "enabled": true,
    "extract_facts": true,
    "update_memory_md": true
  }
}
```

### Testing
```bash
# Analyze recent conversations
node scripts/learn-from-conversation.mjs --since "1h"

# View results
cat ~/openclaw/MEMORY.md | tail -20
```

## 📊 Feature Modules

### 1. Conversation Learner
- Automatically analyze OpenClaw session history
- Extract facts, preferences, decisions, commitments
- Generate structured summaries, update MEMORY.md

### 2. Note Analyzer
- Scan all notes in Obsidian vault
- Extract tags, links, topic clusters
- Build knowledge graphs, generate link suggestions

### 3. Web Aggregator
- Use Tavily API to search for high-quality content
- Aggregate web information by topic
- Generate Chinese summaries, save to Obsidian

### 4. Behavior Observer
- Record OpenClaw command usage
- Analyze high-frequency commands and workflow patterns
- Provide automation suggestions

## ⚙️ Configuration

For detailed configuration, refer to [SETUP_EN.md](SETUP_EN.md), including:
- System requirements and installation steps
- Complete configuration examples
- Environment variable settings
- Permission configuration
- Automated deployment

## 🧪 Examples & Testing

Check the [examples/](examples/) directory for:
- Sample session data
- Configuration templates
- Automated test scripts
- Quick start guide

Run tests:
```bash
./examples/run-test.sh
```

## 🔧 Troubleshooting

For common issues, refer to the troubleshooting section in [SKILL_EN.md](SKILL_EN.md#troubleshooting).

## 📈 Roadmap

### v1.1 (Near-term)
- [ ] Notion integration support
- [ ] Multi-language support
- [ ] Smarter link suggestion algorithms
- [ ] Visual knowledge graph

### v1.5 (Medium-term)
- [ ] PDF/document content analysis
- [ ] Cross-device learning synchronization
- [ ] Personalized model fine-tuning
- [ ] Proactive suggestion functionality

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [SKILL_EN.md](SKILL_EN.md), [SETUP_EN.md](SETUP_EN.md)
- **Examples**: [examples/](examples/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/continuous-learning/issues)

---

**Start your Continuous Learning journey now!** 🚀

*Last Updated: 2026-02-12*  
*Version: 1.0.0*