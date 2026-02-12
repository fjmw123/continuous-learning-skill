#!/usr/bin/env node
/**
 * LLM 客户端 - 用于 Continuous Learning 的模型调用
 * 支持多种 provider：openclaw, openai, anthropic
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_PATH = join(homedir(), '.config', 'continuous-learning', 'config.json');

async function loadConfig() {
  try {
    const content = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { llm: { provider: 'openclaw' } };
  }
}

/**
 * 调用 LLM 分析对话内容
 */
export async function analyzeConversation(messages, config = null) {
  if (!config) {
    config = await loadConfig();
  }
  
  const provider = config.llm?.provider || 'openclaw';
  
  switch (provider) {
    case 'openclaw':
      return await analyzeWithOpenClaw(messages, config);
    case 'openai':
      return await analyzeWithOpenAI(messages, config);
    case 'anthropic':
      return await analyzeWithAnthropic(messages, config);
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

/**
 * 使用 OpenClaw 内部机制分析
 * 这里通过写入临时文件，然后调用系统命令
 */
async function analyzeWithOpenClaw(messages, config) {
  // 构建分析提示
  const prompt = buildAnalysisPrompt(messages);
  
  // 在实际实现中，这里应该调用 OpenClaw 的 API
  // 或者通过某种 IPC 机制与主进程通信
  
  // 简化版本：返回模拟结果
  // TODO: 实现真正的 OpenClaw 集成
  
  console.log('🤖 Using OpenClaw provider (simulated)');
  
  // 模拟分析结果
  return simulateAnalysis(messages);
}

/**
 * 使用 OpenAI API 分析
 */
async function analyzeWithOpenAI(messages, config) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set');
  }
  
  const prompt = buildAnalysisPrompt(messages);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.llm?.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '你是一个对话分析助手，擅长从对话中提取关键信息。' },
        { role: 'user', content: prompt }
      ],
      temperature: config.llm?.temperature || 0.3,
      max_tokens: config.llm?.max_tokens_per_analysis || 2000,
      response_format: { type: 'json_object' }
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  return JSON.parse(content);
}

/**
 * 使用 Anthropic API 分析
 */
async function analyzeWithAnthropic(messages, config) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }
  
  const prompt = buildAnalysisPrompt(messages);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.llm?.model || 'claude-3-haiku-20240307',
      max_tokens: config.llm?.max_tokens_per_analysis || 2000,
      temperature: config.llm?.temperature || 0.3,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }
  
  const data = await response.json();
  const content = data.content[0]?.text;
  
  // 提取 JSON 部分
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error('Could not parse LLM response as JSON');
}

/**
 * 构建分析提示
 */
function buildAnalysisPrompt(messages) {
  const conversationText = messages
    .map(m => `[${m.role === 'user' ? '用户' : '助手'}] ${m.content.slice(0, 800)}${m.content.length > 800 ? '...' : ''}`)
    .join('\n\n');
  
  return `请分析以下对话，提取关于用户的关键学习点。输出必须是有效的JSON格式。

对话内容：
${conversationText}

请提取以下内容并以JSON格式输出（只输出JSON，不要有其他文字）：
{
  "facts": ["事实1", "事实2"],
  "preferences": ["偏好1", "偏好2"],
  "decisions": ["决策1"],
  "commitments": ["承诺1"],
  "insights": ["洞察1"],
  "questions": ["问题1"]
}

提取规则：
- facts: 用户明确陈述的事实信息（如"我在上海工作"）
- preferences: 用户的喜好和偏好（如"我喜欢表格展示"）
- decisions: 用户做出的决策或选择
- commitments: 用户承诺要做的事情或跟进事项
- insights: 对用户行为模式的深层洞察
- questions: 用户表达的疑问或兴趣点

请用中文输出，如果没有某类内容，返回空数组。`;
}

/**
 * 模拟分析（用于测试）
 */
function simulateAnalysis(messages) {
  // 简单的关键词匹配，实际应该用 LLM
  const text = messages.map(m => m.content).join(' ').toLowerCase();
  
  const result = {
    facts: [],
    preferences: [],
    decisions: [],
    commitments: [],
    insights: [],
    questions: []
  };
  
  // 简单的模式匹配
  if (text.includes('喜欢') || text.includes('偏好')) {
    const match = text.match(/喜欢(.{2,20}?)[，。；]/);
    if (match) result.preferences.push(`喜欢${match[1]}`);
  }
  
  if (text.includes('决定') || text.includes('选择')) {
    const match = text.match(/决定(.{2,20}?)[，。；]/);
    if (match) result.decisions.push(`决定${match[1]}`);
  }
  
  if (text.includes('明天') || text.includes('下次') || text.includes('稍后')) {
    const match = text.match(/(明天.+?)[，。；]/);
    if (match) result.commitments.push(match[1]);
  }
  
  // 如果没有提取到任何内容，添加一个提示
  if (Object.values(result).every(arr => arr.length === 0)) {
    result.insights.push('对话内容较为简短，未提取到明确的可学习信息');
  }
  
  return result;
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('LLM Client for Continuous Learning');
  console.log('Usage: import { analyzeConversation } from "./llm-client.mjs"');
}
