#!/usr/bin/env node
/**
 * 对话学习器 - 从会话历史中提取洞察
 * 
 * Usage:
 *   node learn-from-conversation.mjs --since "1h" --output memory
 *   node learn-from-conversation.mjs --session <session-key> --output obsidian
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { analyzeConversation } from './llm-client.mjs';

const CONFIG_PATH = join(homedir(), '.config', 'continuous-learning', 'config.json');
const LOGS_DIR = join(homedir(), '.local', 'share', 'continuous-learning', 'logs');

async function loadConfig() {
  try {
    const config = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(config);
  } catch {
    return {
      conversation_learning: {
        enabled: true,
        extract_facts: true,
        update_memory_md: true,
        min_confidence: 0.7
      }
    };
  }
}

async function ensureDirs() {
  await mkdir(LOGS_DIR, { recursive: true });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    since: '1h',
    output: 'memory', // 'memory' | 'obsidian' | 'both'
    session: null,
    dryRun: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--since':
        options.since = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--session':
        options.session = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
    }
  }
  
  return options;
}

function parseSince(since) {
  const match = since.match(/(\d+)([hmd])/);
  if (!match) return 60 * 60 * 1000; // default 1 hour
  
  const [, num, unit] = match;
  const multipliers = { h: 60 * 60 * 1000, m: 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return parseInt(num) * (multipliers[unit] || multipliers.h);
}

async function getRecentSessions(sinceMs) {
  // 从 OpenClaw 会话目录获取最近的会话
  const sessionsDir = join(homedir(), '.openclaw', 'agents', 'main', 'sessions');
  
  try {
    const { readdir, stat } = await import('fs/promises');
    const entries = await readdir(sessionsDir);
    const cutoff = Date.now() - sinceMs;
    
    const sessions = [];
    for (const entry of entries) {
      if (!entry.endsWith('.jsonl')) continue;
      
      const path = join(sessionsDir, entry);
      const stats = await stat(path);
      
      if (stats.mtime.getTime() > cutoff) {
        sessions.push({
          id: entry.replace('.jsonl', ''),
          path,
          mtime: stats.mtime
        });
      }
    }
    
    return sessions.sort((a, b) => b.mtime - a.mtime);
  } catch (err) {
    console.error('Error reading sessions:', err.message);
    return [];
  }
}

async function readSession(sessionPath) {
  try {
    const content = await readFile(sessionPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);
  } catch (err) {
    console.error('Error reading session:', err.message);
    return [];
  }
}

function extractMessages(session) {
  const messages = [];
  
  for (const entry of session) {
    // OpenClaw 会话格式：消息在 entry.message 中
    if (entry.type === 'message' && entry.message && entry.message.role) {
      const msg = entry.message;
      
      // 提取文本内容（content 可能是数组）
      let textContent = '';
      if (Array.isArray(msg.content)) {
        // 查找 text 类型的 content
        for (const item of msg.content) {
          if (item.type === 'text' && item.text) {
            textContent = item.text;
            break;
          }
        }
      } else if (typeof msg.content === 'string') {
        textContent = msg.content;
      }
      
      // 只处理有实际内容的消息
      if (textContent && textContent.trim()) {
        messages.push({
          role: msg.role,
          content: textContent,
          timestamp: entry.timestamp || msg.timestamp
        });
      }
    }
  }
  
  return messages;
}

function generateLearningPrompt(conversation) {
  return `分析以下对话，提取关键学习点。请用中文输出。

对话内容：
${conversation.map(m => `[${m.role}] ${m.content.slice(0, 500)}${m.content.length > 500 ? '...' : ''}`).join('\n\n')}

请提取以下内容并以JSON格式输出：
{
  "facts": ["事实1", "事实2"],           // 用户陈述的事实性信息
  "preferences": ["偏好1", "偏好2"],     // 用户的偏好、喜好
  "decisions": ["决策1"],                // 用户做出的决策或选择
  "commitments": ["承诺1"],              // 用户承诺要做的事情
  "insights": ["洞察1"],                 // 关于用户的深层洞察
  "questions": ["问题1"]                 // 用户表达的疑问或兴趣点
}

只输出JSON，不要其他文字。`;
}

async function analyzeWithLLM(messages, config) {
  console.log('🔍 正在分析对话...');
  
  try {
    const result = await analyzeConversation(messages, config);
    console.log('✅ LLM 分析完成');
    return result;
  } catch (err) {
    console.error('❌ LLM 分析失败:', err.message);
    // 返回空结果
    return {
      facts: [],
      preferences: [],
      decisions: [],
      commitments: [],
      insights: ['分析过程中出现错误: ' + err.message],
      questions: []
    };
  }
}

async function updateMemoryMd(insights, timestamp) {
  const memoryPath = join(process.cwd(), '..', '..', 'MEMORY.md');
  
  if (!existsSync(memoryPath)) {
    console.log('⚠️ MEMORY.md not found, skipping update');
    return;
  }
  
  let content = await readFile(memoryPath, 'utf-8');
  
  // 创建学习记录条目
  const entry = `

## 🧠 Auto-Learned (${new Date(timestamp).toISOString().split('T')[0]})

${insights.facts.length ? `- **Facts**: ${insights.facts.join(', ')}` : ''}
${insights.preferences.length ? `- **Preferences**: ${insights.preferences.join(', ')}` : ''}
${insights.decisions.length ? `- **Decisions**: ${insights.decisions.join(', ')}` : ''}
${insights.commitments.length ? `- **Commitments**: ${insights.commitments.join(', ')}` : ''}
`;
  
  // 追加到文件末尾
  content += entry;
  
  await writeFile(memoryPath, content, 'utf-8');
  console.log('✅ Updated MEMORY.md');
}

async function saveToObsidian(insights, timestamp) {
  const date = new Date(timestamp).toISOString().split('T')[0];
  const filename = `Auto-Learning-${date}.md`;
  
  // 尝试找到 Obsidian vault
  const possiblePaths = [
    join(homedir(), 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'Documents', 'Obsidian_SoSME', '000 Inbox'),
    join(homedir(), 'Documents', 'Obsidian', '000 Inbox'),
    join(homedir(), 'Obsidian', '000 Inbox')
  ];
  
  let vaultPath = null;
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      vaultPath = path;
      break;
    }
  }
  
  if (!vaultPath) {
    console.log('⚠️ Obsidian vault not found');
    return;
  }
  
  const content = `---
date created: ${date.replace(/-/g, ',')}
tags:
  - auto-learning
  - ai-generated
---

# 自动学习记录 - ${date}

## 提取的洞察

${insights.facts.length ? `### 事实\n${insights.facts.map(f => `- ${f}`).join('\n')}` : ''}

${insights.preferences.length ? `### 偏好\n${insights.preferences.map(p => `- ${p}`).join('\n')}` : ''}

${insights.decisions.length ? `### 决策\n${insights.decisions.map(d => `- ${d}`).join('\n')}` : ''}

${insights.commitments.length ? `### 承诺\n${insights.commitments.map(c => `- ${c}`).join('\n')}` : ''}

${insights.insights.length ? `### 洞察\n${insights.insights.map(i => `- ${i}`).join('\n')}` : ''}

${insights.questions.length ? `### 疑问\n${insights.questions.map(q => `- ${q}`).join('\n')}` : ''}

---
*Generated by Continuous Learning Skill*
`;
  
  const filepath = join(vaultPath, filename);
  await writeFile(filepath, content, 'utf-8');
  console.log(`✅ Saved to Obsidian: ${filepath}`);
}

async function main() {
  const config = await loadConfig();
  const options = parseArgs();
  
  if (!config.conversation_learning?.enabled) {
    console.log('Conversation learning is disabled');
    process.exit(0);
  }
  
  await ensureDirs();
  
  console.log(`🎯 Learning from conversations since ${options.since}`);
  
  const sinceMs = parseSince(options.since);
  const sessions = await getRecentSessions(sinceMs);
  
  console.log(`📁 Found ${sessions.length} recent sessions`);
  
  if (sessions.length === 0) {
    console.log('No recent sessions to analyze');
    process.exit(0);
  }
  
  // 读取所有会话内容
  const allMessages = [];
  for (const session of sessions.slice(0, 5)) { // 最多分析5个会话
    console.log(`  Reading: ${session.id}`);
    const data = await readSession(session.path);
    const messages = extractMessages(data);
    allMessages.push(...messages);
  }
  
  console.log(`💬 Total messages: ${allMessages.length}`);
  
  if (allMessages.length === 0) {
    console.log('No messages to analyze');
    process.exit(0);
  }
  
  if (options.dryRun) {
    console.log('\n📝 Dry run mode');
    console.log(`Would analyze ${allMessages.length} messages`);
    console.log('Sample message:', allMessages[0]?.content?.slice(0, 100) + '...');
    process.exit(0);
  }
  
  // 分析对话
  const insights = await analyzeWithLLM(allMessages, config);
  
  console.log('\n📊 Learning Results:');
  console.log(`  Facts: ${insights.facts.length}`);
  console.log(`  Preferences: ${insights.preferences.length}`);
  console.log(`  Decisions: ${insights.decisions.length}`);
  console.log(`  Commitments: ${insights.commitments.length}`);
  
  // 保存结果
  if (options.output === 'memory' || options.output === 'both') {
    await updateMemoryMd(insights, Date.now());
  }
  
  if (options.output === 'obsidian' || options.output === 'both') {
    await saveToObsidian(insights, Date.now());
  }
  
  // 保存日志
  const logEntry = {
    timestamp: new Date().toISOString(),
    sessions_analyzed: sessions.length,
    messages_analyzed: allMessages.length,
    insights
  };
  
  const logPath = join(LOGS_DIR, `learning-${Date.now()}.json`);
  await writeFile(logPath, JSON.stringify(logEntry, null, 2));
  
  console.log('\n✅ Learning complete');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
