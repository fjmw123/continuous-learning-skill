#!/usr/bin/env node
/**
 * 初始化 Continuous Learning 系统
 */

import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CONFIG_DIR = join(homedir(), '.config', 'continuous-learning');
const DATA_DIR = join(homedir(), '.local', 'share', 'continuous-learning');

const DEFAULT_CONFIG = {
  version: '1.0.0',
  
  conversation_learning: {
    enabled: true,
    trigger: 'auto_after_session',
    extract_facts: true,
    update_memory_md: true,
    save_to_obsidian: true,
    min_confidence: 0.7,
    max_sessions_per_run: 5
  },
  
  note_analysis: {
    enabled: true,
    obsidian_vault: null, // 自动检测
    scan_interval_hours: 24,
    build_knowledge_graph: true,
    generate_embeddings: true,
    excluded_folders: ['Attachments', 'node_modules', '.git', 'Archive'],
    included_extensions: ['.md']
  },
  
  behavior_observation: {
    enabled: true,
    track_commands: true,
    track_workflows: true,
    analyze_patterns: 'weekly',
    privacy_mode: 'standard', // 'minimal' | 'standard' | 'detailed'
    retention_days: 90
  },
  
  web_aggregation: {
    enabled: true,
    schedule: '0 9 * * *',
    output_to: 'obsidian', // 'obsidian' | 'memory' | 'both'
    max_results_per_topic: 10,
    min_relevance_score: 0.6,
    topics: [
      {
        name: 'AI',
        queries: ['artificial intelligence news', 'LLM updates', 'machine learning trends'],
        sources: ['news', 'blogs', 'reddit'],
        frequency: 'daily',
        language: 'zh'
      },
      {
        name: 'Economics',
        queries: ['economics news', 'market trends', 'financial analysis'],
        sources: ['news', 'blogs'],
        frequency: 'daily',
        language: 'zh'
      }
    ]
  },
  
  storage: {
    memory_md_path: null, // 自动检测
    obsidian_inbox_path: null, // 自动检测
    vector_db_path: join(DATA_DIR, 'vectors'),
    logs_path: join(DATA_DIR, 'logs')
  },
  
  llm: {
    provider: 'openclaw', // 'openclaw' | 'openai' | 'anthropic'
    model: null, // 使用默认
    max_tokens_per_analysis: 4000,
    temperature: 0.3
  }
};

async function detectPaths() {
  const detected = {};
  
  // 检测 MEMORY.md
  const possibleMemoryPaths = [
    join(process.cwd(), 'MEMORY.md'),
    join(homedir(), 'openclaw', 'MEMORY.md'),
    join(homedir(), 'workspace', 'MEMORY.md')
  ];
  
  for (const path of possibleMemoryPaths) {
    if (existsSync(path)) {
      detected.memory_md_path = path;
      break;
    }
  }
  
  // 检测 Obsidian vault
  const possibleVaultPaths = [
    join(homedir(), 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'Documents', 'Obsidian_SoSME'),
    join(homedir(), 'Documents', 'Obsidian'),
    join(homedir(), 'Obsidian')
  ];
  
  for (const path of possibleVaultPaths) {
    if (existsSync(path)) {
      detected.obsidian_vault = path;
      detected.obsidian_inbox_path = join(path, '000 Inbox');
      break;
    }
  }
  
  return detected;
}

async function init() {
  console.log('🚀 Initializing Continuous Learning System...\n');
  
  // 创建目录
  await mkdir(CONFIG_DIR, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(join(DATA_DIR, 'vectors'), { recursive: true });
  await mkdir(join(DATA_DIR, 'logs'), { recursive: true });
  await mkdir(join(DATA_DIR, 'behavior'), { recursive: true });
  await mkdir(join(DATA_DIR, 'knowledge-graph'), { recursive: true });
  
  console.log('✅ Created directories');
  
  // 检测路径
  const detected = await detectPaths();
  
  if (detected.memory_md_path) {
    console.log(`📄 Found MEMORY.md: ${detected.memory_md_path}`);
    DEFAULT_CONFIG.storage.memory_md_path = detected.memory_md_path;
  }
  
  if (detected.obsidian_vault) {
    console.log(`📝 Found Obsidian vault: ${detected.obsidian_vault}`);
    DEFAULT_CONFIG.note_analysis.obsidian_vault = detected.obsidian_vault;
    DEFAULT_CONFIG.storage.obsidian_inbox_path = detected.obsidian_inbox_path;
  }
  
  // 写入配置
  const configPath = join(CONFIG_DIR, 'config.json');
  await writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
  
  console.log(`\n✅ Configuration saved to: ${configPath}`);
  
  // 创建示例 topics 配置
  const topicsConfig = {
    topics: [
      {
        name: 'AI',
        display_name: '人工智能',
        queries: ['AI news', 'artificial intelligence', 'LLM updates'],
        keywords: ['AI', '机器学习', '大模型'],
        frequency: 'daily',
        max_results: 5,
        language: 'zh'
      },
      {
        name: 'Productivity',
        display_name: '效率工具',
        queries: ['productivity tools', 'automation', 'workflow optimization'],
        keywords: ['效率', '自动化', '工具'],
        frequency: 'weekly',
        max_results: 3,
        language: 'zh'
      }
    ]
  };
  
  await writeFile(
    join(CONFIG_DIR, 'topics.json'),
    JSON.stringify(topicsConfig, null, 2)
  );
  
  console.log('✅ Created topics configuration');
  
  // 创建 README
  const readme = `# Continuous Learning Configuration

## Files

- \`config.json\` - 主配置文件
- \`topics.json\` - 网络聚合主题配置

## Quick Start

1. Edit \`config.json\` to enable/disable features
2. Run learning scripts:
   \`\`\`bash
   node scripts/learn-from-conversation.mjs --since 1h
   \`\`\`

## Documentation

See skill directory for full documentation.
`;
  
  await writeFile(join(CONFIG_DIR, 'README.md'), readme);
  
  console.log('\n📋 Next Steps:');
  console.log('  1. Review and edit ~/.config/continuous-learning/config.json');
  console.log('  2. Set up cron jobs for automated learning');
  console.log('  3. Run: node scripts/learn-from-conversation.mjs --dry-run');
  
  console.log('\n🎉 Initialization complete!');
}

init().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
