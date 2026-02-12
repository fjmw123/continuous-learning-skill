#!/usr/bin/env node
/**
 * Dialogue Learning Module
 * 从对话历史中提取学习点，更新记忆系统
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE = process.env.OPENCLAW_WORKSPACE || '/Users/sosme_macmini/openclaw';

// Configuration
const CONFIG = {
  memoryPath: join(WORKSPACE, 'MEMORY.md'),
  obsidianVault: '/Users/sosme_macmini/Library/Mobile Documents/com~apple~CloudDocs/Documents/Obsidian_SoSME',
  inboxPath: '000 Inbox',
  minConfidence: 0.7,  // 最低置信度
  maxFactsPerSession: 10,  // 每会话最大提取数
};

/**
 * Extract learning points from conversation using LLM
 */
async function extractLearningPoints(sessionContent) {
  // Build prompt for LLM extraction
  const prompt = `分析以下对话记录，提取值得长期记忆的关键信息。

**提取类型**：
1. **偏好** (Preference) - 用户的喜好、厌恶、风格选择
2. **习惯** (Habit) - 重复出现的模式、工作流程
3. **决策** (Decision) - 明确的选择、判断标准
4. **知识** (Knowledge) - 重要的事实、概念理解
5. **人物** (Person) - 提及的重要人物及其关系
6. **项目** (Project) - 进行中的工作、目标

**输出格式**（JSON数组）：
[
  {
    "type": "preference|habit|decision|knowledge|person|project",
    "confidence": 0.0-1.0,
    "fact": "简洁的事实陈述",
    "context": "相关上下文（可选）",
    "source": "对话中的依据",
    "storage": "memory|obsidian|both"
  }
]

**规则**：
- 只提取高置信度（≥0.7）的事实
- 避免临时性、上下文依赖的信息
- 事实应简洁、原子化
- storage建议: 简短存memory，详细存obsidian，重要存both

---

对话记录：
${sessionContent}

请输出JSON格式（仅数组，无markdown代码块）：`;

  // For now, return mock data for testing
  // In production, this would call LLM API
  return [
    {
      type: "preference",
      confidence: 0.9,
      fact: "用户偏好使用表格展示结构化信息",
      context: "在讨论学习结果展示时明确表达",
      source: "'喜欢表格而非长文本'",
      storage: "memory"
    },
    {
      type: "decision",
      confidence: 0.85,
      fact: "确定使用小队模式(Squad Mode)处理复杂任务",
      context: "五阶段流程：策划→执行→监督→审核→决策",
      source: "自主学习技能开发讨论",
      storage: "both"
    },
    {
      type: "habit",
      confidence: 0.8,
      fact: "使用 PARA + 数字编号系统管理 Obsidian 笔记",
      context: "000=Inbox, 100=Projects, 300=Resources",
      source: "Obsidian知识库档案",
      storage: "memory"
    }
  ].filter(f => f.confidence >= CONFIG.minConfidence);
}

/**
 * Update MEMORY.md with new facts
 */
function updateMemory(facts) {
  if (!existsSync(CONFIG.memoryPath)) {
    console.error(`❌ MEMORY.md not found at ${CONFIG.memoryPath}`);
    return false;
  }

  let memoryContent = readFileSync(CONFIG.memoryPath, 'utf-8');
  const timestamp = new Date().toISOString().split('T')[0];
  
  // Find or create Learning Updates section
  const sectionMarker = '## 🧠 自动学习更新';
  const entry = facts
    .filter(f => f.storage === 'memory' || f.storage === 'both')
    .map(f => `- **${f.type}** (${timestamp}): ${f.fact} [置信度:${f.confidence}]`)
    .join('\n');

  if (!entry) return true;

  if (memoryContent.includes(sectionMarker)) {
    // Append to existing section
    memoryContent = memoryContent.replace(
      sectionMarker,
      `${sectionMarker}\n\n${entry}\n`
    );
  } else {
    // Create new section at end
    memoryContent += `\n\n${sectionMarker}\n\n${entry}\n`;
  }

  writeFileSync(CONFIG.memoryPath, memoryContent);
  console.log(`✅ Updated MEMORY.md with ${facts.filter(f => f.storage === 'memory' || f.storage === 'both').length} facts`);
  return true;
}

/**
 * Write to Obsidian inbox
 */
function writeToObsidian(facts) {
  const obsidianFacts = facts.filter(f => f.storage === 'obsidian' || f.storage === 'both');
  if (obsidianFacts.length === 0) return true;

  const timestamp = new Date();
  const dateStr = timestamp.toISOString().split('T')[0];
  const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
  const filename = `学习-${dateStr}-${timeStr}.md`;
  const filepath = join(CONFIG.obsidianVault, CONFIG.inboxPath, filename);

  const content = `---
tags: #learning #auto-extracted
date created: ${timestamp.toLocaleString('zh-CN')}
date modified: ${timestamp.toLocaleString('zh-CN')}
source: dialogue-learning
---

# 对话学习提取 - ${dateStr}

${obsidianFacts.map(f => `
## ${f.type.toUpperCase()} [置信度: ${f.confidence}]

**事实**: ${f.fact}

**上下文**: ${f.context || 'N/A'}

**来源**: ${f.source}

---
`).join('')}

*自动生成的学习记录*
`;

  try {
    writeFileSync(filepath, content);
    console.log(`✅ Created Obsidian note: ${filename}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to write to Obsidian: ${err.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const sessionArg = args.find(a => a.startsWith('--session='));
  const dryRun = args.includes('--dry-run');

  console.log('🧠 Dialogue Learning Module');
  console.log('==========================');

  // For testing, use a sample session content
  // In production, this would fetch from session logs
  const sampleContent = `
User: 我要设计一个自主学习技能
Assistant: 建议分为四个维度：对话学习、笔记学习、行为学习、网络聚合
User: 学习结果放在哪里？
Assistant: MEMORY.md 是索引，Obsidian 是图书馆
User: 好的，我确认这个分工
`;

  console.log('\n📖 Extracting learning points...');
  const facts = await extractLearningPoints(sampleContent);
  
  console.log(`\n🔍 Found ${facts.length} high-confidence facts:`);
  facts.forEach((f, i) => {
    console.log(`  ${i + 1}. [${f.type}] ${f.fact.substring(0, 60)}... (conf: ${f.confidence})`);
  });

  if (dryRun) {
    console.log('\n🧪 Dry run mode - no changes made');
    return;
  }

  console.log('\n💾 Updating memory systems...');
  
  const memoryOk = updateMemory(facts);
  const obsidianOk = writeToObsidian(facts);

  console.log('\n✨ Summary:');
  console.log(`  - MEMORY.md: ${memoryOk ? '✅' : '❌'}`);
  console.log(`  - Obsidian: ${obsidianOk ? '✅' : '❌'}`);
}

main().catch(console.error);
