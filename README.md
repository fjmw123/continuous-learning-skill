# Continuous Learning Skill for OpenClaw

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![OpenClaw Skill](https://img.shields.io/badge/OpenClaw-Skill-blue.svg)](https://openclaw.ai)

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

### 安装
```bash
# 克隆仓库
git clone https://github.com/yourusername/continuous-learning.git
cd continuous-learning

# 安装依赖
npm install

# 初始化配置
node scripts/init-learning.mjs
```

### 最小配置
编辑 `~/.config/continuous-learning/config.json`：
```json
{
  "conversation_learning": {
    "enabled": true,
    "extract_facts": true,
    "update_memory_md": true
  }
}
```

### 测试
```bash
# 分析最近对话
node scripts/learn-from-conversation.mjs --since "1h"

# 查看结果
cat ~/openclaw/MEMORY.md | tail -20
```

## 📊 功能模块

### 1. 对话学习器
- 自动分析 OpenClaw 会话历史
- 提取事实、偏好、决策、承诺
- 生成结构化摘要，更新 MEMORY.md

### 2. 笔记分析器  
- 扫描 Obsidian vault 中的所有笔记
- 提取标签、链接、主题聚类
- 构建知识图谱，生成链接建议

### 3. 网络聚合器
- 使用 Tavily API 搜索高质量内容
- 按主题聚合网络信息
- 生成中文摘要，保存到 Obsidian

### 4. 行为观察器
- 记录 OpenClaw 命令使用情况
- 分析高频命令和工作流模式
- 提供自动化建议

## ⚙️ 配置

详细配置请参考 [SETUP.md](SETUP.md)，包含：
- 系统要求与安装步骤
- 完整配置示例
- 环境变量设置
- 权限配置
- 自动化部署

## 🧪 示例与测试

查看 [examples/](examples/) 目录获取：
- 示例会话数据
- 配置模板
- 自动化测试脚本
- 快速开始指南

运行测试：
```bash
./examples/run-test.sh
```

## 🔧 故障排除

常见问题请参考 [SKILL.md](SKILL.md#故障排除) 中的故障排除章节。

## 📈 路线图

### v1.1 (近期)
- [ ] 支持 Notion 集成
- [ ] 多语言支持
- [ ] 更智能的链接建议算法
- [ ] 可视化知识图谱

### v1.5 (中期)
- [ ] PDF/文档内容分析
- [ ] 跨设备学习同步
- [ ] 个性化模型微调
- [ ] 主动建议功能

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

- **文档**: [SKILL.md](SKILL.md), [SETUP.md](SETUP.md)
- **示例**: [examples/](examples/)
- **问题**: [GitHub Issues](https://github.com/yourusername/continuous-learning/issues)

---

**开始你的 Continuous Learning 之旅吧！** 🚀

*最后更新: 2026-02-12*  
*版本: 1.0.0*