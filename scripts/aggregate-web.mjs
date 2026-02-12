#!/usr/bin/env node
/**
 * 网络聚合器 - 定期搜索并整理网络内容
 * 
 * Usage:
 *   node aggregate-web.mjs --topic "AI" --limit 10
 *   node aggregate-web.mjs --config ~/.config/continuous-learning/topics.json
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_PATH = join(homedir(), '.config', 'continuous-learning', 'config.json');
const TOPICS_PATH = join(homedir(), '.config', 'continuous-learning', 'topics.json');
const DATA_DIR = join(homedir(), '.local', 'share', 'continuous-learning');

async function loadConfig() {
  try {
    const content = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { web_aggregation: { enabled: false } };
  }
}

async function loadTopics() {
  try {
    const content = await readFile(TOPICS_PATH, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { topics: [] };
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    topic: null,
    limit: 10,
    config: TOPICS_PATH,
    output: 'obsidian',
    dryRun: false
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--topic':
        options.topic = args[++i];
        break;
      case '--limit':
        options.limit = parseInt(args[++i]);
        break;
      case '--config':
        options.config = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
    }
  }
  
  return options;
}

/**
 * 使用 Tavily API 搜索内容
 */
async function searchWithTavily(query, limit = 5) {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.error('❌ TAVILY_API_KEY not set');
    console.log('Set it with: export TAVILY_API_KEY="your-key"');
    return null;
  }
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'advanced',
        max_results: limit,
        include_answer: true,
        include_raw_content: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (err) {
    console.error('Search error:', err.message);
    return null;
  }
}

/**
 * 生成中文摘要
 */
async function summarizeContent(title, content) {
  // 简化版本：直接返回原文的前200字符
  // 实际应该调用 LLM 生成摘要
  
  if (!content || content.length < 50) {
    return '内容较短，无摘要';
  }
  
  return content.slice(0, 200).replace(/\n/g, ' ') + '...';
}

async function aggregateTopic(topic, options) {
  console.log(`\n🔍 Aggregating: ${topic.display_name || topic.name}`);
  
  const allResults = [];
  
  for (const query of topic.queries || [topic.name]) {
    console.log(`  Searching: "${query}"`);
    
    const results = await searchWithTavily(query, Math.ceil(options.limit / topic.queries.length));
    
    if (results && results.results) {
      for (const result of results.results) {
        allResults.push({
          title: result.title,
          url: result.url,
          content: result.content,
          score: result.score,
          published_date: result.published_date,
          query: query
        });
      }
    }
    
    // 避免请求过快
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // 去重（基于 URL）
  const seen = new Set();
  const unique = allResults.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
  
  // 按分数排序
  unique.sort((a, b) => b.score - a.score);
  
  // 取前 N 个
  const topResults = unique.slice(0, options.limit);
  
  console.log(`  Found ${topResults.length} unique results`);
  
  // 生成摘要
  for (const result of topResults) {
    result.summary = await summarizeContent(result.title, result.content);
  }
  
  return {
    topic: topic.name,
    displayName: topic.display_name || topic.name,
    keywords: topic.keywords || [],
    results: topResults,
    aggregatedAt: new Date().toISOString()
  };
}

function generateObsidianNote(aggregation) {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  
  let content = `---\n`;
  content += `date created: ${date.replace(/-/g, ',')}\n`;
  content += `tags:\n`;
  content += `  - web-aggregation\n`;
  content += `  - auto-learning\n`;
  content += `  - ${aggregation.topic.toLowerCase().replace(/\s+/g, '-')}\n`;
  content += `---\n\n`;
  
  content += `# 网络聚合: ${aggregation.displayName}\n\n`;
  content += `**聚合时间:** ${date} ${time}\n`;
  content += `**关键词:** ${aggregation.keywords.join(', ')}\n\n`;
  
  content += `## 今日精选\n\n`;
  
  for (let i = 0; i < aggregation.results.length; i++) {
    const r = aggregation.results[i];
    content += `### ${i + 1}. ${r.title}\n\n`;
    content += `**摘要:** ${r.summary}\n\n`;
    content += `🔗 [阅读原文](${r.url})\n`;
    content += `📊 相关度: ${(r.score * 100).toFixed(0)}%\n\n`;
    content += `---\n\n`;
  }
  
  content += `## 原始查询\n\n`;
  content += `\`\`\`\n`;
  content += `${aggregation.topic}: ${aggregation.keywords.join(', ')}\n`;
  content += `\`\`\`\n\n`;
  content += `*Generated by Continuous Learning Skill*\n`;
  
  return content;
}

async function saveToObsidian(content, topicName) {
  const date = new Date().toISOString().split('T')[0];
  const filename = `Web-Aggregation-${topicName}-${date}.md`;
  
  // 查找 Obsidian vault
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
    console.log('⚠️ Obsidian vault not found, saving to data directory');
    const fallbackPath = join(DATA_DIR, 'aggregations', filename);
    await mkdir(join(DATA_DIR, 'aggregations'), { recursive: true });
    await writeFile(fallbackPath, content);
    console.log(`✅ Saved to: ${fallbackPath}`);
    return;
  }
  
  const filepath = join(vaultPath, filename);
  await writeFile(filepath, content);
  console.log(`✅ Saved to Obsidian: ${filepath}`);
}

async function main() {
  const config = await loadConfig();
  const options = parseArgs();
  
  if (!config.web_aggregation?.enabled && !options.topic) {
    console.log('Web aggregation is disabled. Enable it in config or use --topic');
    process.exit(0);
  }
  
  // 加载主题配置
  let topics = [];
  
  if (options.topic) {
    // 单主题模式
    topics = [{
      name: options.topic,
      display_name: options.topic,
      queries: [options.topic],
      keywords: [options.topic]
    }];
  } else {
    // 从配置文件加载
    const topicsConfig = await loadTopics();
    topics = topicsConfig.topics || [];
  }
  
  if (topics.length === 0) {
    console.log('No topics configured. Add topics to topics.json');
    process.exit(0);
  }
  
  console.log(`📰 Aggregating ${topics.length} topic(s)...`);
  
  if (options.dryRun) {
    console.log('\n📝 Dry run mode');
    console.log('Would aggregate:');
    for (const topic of topics) {
      console.log(`  - ${topic.display_name || topic.name}`);
    }
    process.exit(0);
  }
  
  // 检查 API key
  if (!process.env.TAVILY_API_KEY) {
    console.error('❌ TAVILY_API_KEY environment variable not set');
    process.exit(1);
  }
  
  // 聚合每个主题
  for (const topic of topics) {
    try {
      const aggregation = await aggregateTopic(topic, options);
      
      if (aggregation.results.length === 0) {
        console.log(`  ⚠️ No results for ${topic.name}`);
        continue;
      }
      
      // 生成 Obsidian 笔记
      const note = generateObsidianNote(aggregation);
      
      // 保存
      if (options.output === 'obsidian' || options.output === 'both') {
        await saveToObsidian(note, topic.name);
      }
      
      // 保存原始数据
      const dataPath = join(DATA_DIR, 'aggregations');
      await mkdir(dataPath, { recursive: true });
      await writeFile(
        join(dataPath, `aggregation-${topic.name}-${Date.now()}.json`),
        JSON.stringify(aggregation, null, 2)
      );
      
    } catch (err) {
      console.error(`❌ Error aggregating ${topic.name}:`, err.message);
    }
  }
  
  console.log('\n✅ Aggregation complete');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
