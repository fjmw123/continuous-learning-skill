#!/usr/bin/env node
/**
 * 笔记分析器 - 分析 Obsidian vault 并构建知识图谱
 * 
 * Usage:
 *   node analyze-notes.mjs --vault /path/to/vault
 *   node analyze-notes.mjs --incremental
 */

import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, relative } from 'path';
import { homedir } from 'os';

const CONFIG_PATH = join(homedir(), '.config', 'continuous-learning', 'config.json');
const DATA_DIR = join(homedir(), '.local', 'share', 'continuous-learning');

async function loadConfig() {
  try {
    const config = await readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(config);
  } catch {
    return { note_analysis: { enabled: false } };
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    vault: null,
    incremental: false,
    output: 'graph'
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--vault':
        options.vault = args[++i];
        break;
      case '--incremental':
        options.incremental = true;
        break;
      case '--output':
        options.output = args[++i];
        break;
    }
  }
  
  return options;
}

async function findVault() {
  const possiblePaths = [
    join(homedir(), 'Library', 'Mobile Documents', 'com~apple~CloudDocs', 'Documents', 'Obsidian_SoSME'),
    join(homedir(), 'Documents', 'Obsidian'),
    join(homedir(), 'Obsidian')
  ];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  return null;
}

async function scanNotes(vaultPath, options) {
  const notes = [];
  const excluded = ['Attachments', 'node_modules', '.git', 'Archive', '.obsidian'];
  
  async function scanDir(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relPath = relative(vaultPath, fullPath);
      
      if (entry.isDirectory()) {
        if (!excluded.includes(entry.name)) {
          await scanDir(fullPath);
        }
      } else if (entry.isFile() && extname(entry.name) === '.md') {
        const stats = await stat(fullPath);
        notes.push({
          path: fullPath,
          relativePath: relPath,
          name: entry.name,
          mtime: stats.mtime
        });
      }
    }
  }
  
  await scanDir(vaultPath);
  return notes;
}

async function analyzeNote(notePath) {
  try {
    const content = await readFile(notePath, 'utf-8');
    
    // 提取 frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? parseFrontmatter(frontmatterMatch[1]) : {};
    
    // 提取 wikilinks [[...]]
    const wikiLinks = [...content.matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1]);
    
    // 提取 markdown 链接
    const mdLinks = [...content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(m => m[2]);
    
    // 提取标签 #tag
    const tags = [...content.matchAll(/#([a-zA-Z0-9_\-\/]+)/g)].map(m => m[1]);
    
    // 提取标题
    const titles = [...content.matchAll(/^#{1,6}\s+(.+)$/gm)].map(m => m[1]);
    
    return {
      frontmatter,
      wikiLinks,
      mdLinks,
      tags,
      titles,
      wordCount: content.split(/\s+/).length
    };
  } catch (err) {
    console.error(`Error analyzing ${notePath}:`, err.message);
    return null;
  }
}

function parseFrontmatter(text) {
  const result = {};
  const lines = text.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^([\w-]+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      result[key] = value.trim();
    }
  }
  
  return result;
}

async function buildKnowledgeGraph(notes, analyses) {
  const graph = {
    nodes: [],
    edges: [],
    clusters: {}
  };
  
  // 构建节点
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const analysis = analyses[i];
    
    if (!analysis) continue;
    
    graph.nodes.push({
      id: note.relativePath,
      name: note.name.replace('.md', ''),
      tags: analysis.tags,
      wordCount: analysis.wordCount,
      modified: note.mtime
    });
  }
  
  // 构建边（链接关系）
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
  
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const analysis = analyses[i];
    
    if (!analysis) continue;
    
    for (const link of analysis.wikiLinks) {
      // 查找目标笔记
      const targetId = Array.from(nodeMap.keys()).find(id => 
        id.replace('.md', '').endsWith(link) || 
        id.replace('.md', '').split('/').pop() === link
      );
      
      if (targetId) {
        graph.edges.push({
          source: note.relativePath,
          target: targetId,
          type: 'wikiLink'
        });
      }
    }
  }
  
  // 基于标签聚类
  const tagClusters = {};
  for (const node of graph.nodes) {
    for (const tag of node.tags) {
      if (!tagClusters[tag]) tagClusters[tag] = [];
      tagClusters[tag].push(node.id);
    }
  }
  
  graph.clusters = tagClusters;
  
  return graph;
}

async function generateSuggestedLinks(graph) {
  const suggestions = [];
  
  // 基于共同标签建议链接
  for (const [tag, nodeIds] of Object.entries(graph.clusters)) {
    if (nodeIds.length < 2) continue;
    
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        // 检查是否已有链接
        const alreadyLinked = graph.edges.some(e => 
          (e.source === nodeIds[i] && e.target === nodeIds[j]) ||
          (e.source === nodeIds[j] && e.target === nodeIds[i])
        );
        
        if (!alreadyLinked) {
          suggestions.push({
            note1: nodeIds[i],
            note2: nodeIds[j],
            reason: `共同标签: #${tag}`,
            confidence: Math.min(nodeIds.length / 5, 1.0)
          });
        }
      }
    }
  }
  
  // 按置信度排序
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 20);
}

async function main() {
  const config = await loadConfig();
  const options = parseArgs();
  
  if (!config.note_analysis?.enabled) {
    console.log('Note analysis is disabled');
    process.exit(0);
  }
  
  // 确定 vault 路径
  let vaultPath = options.vault || config.note_analysis?.obsidian_vault;
  
  if (!vaultPath) {
    vaultPath = await findVault();
  }
  
  if (!vaultPath) {
    console.error('❌ Could not find Obsidian vault');
    console.log('Please specify with --vault /path/to/vault');
    process.exit(1);
  }
  
  console.log(`📁 Analyzing vault: ${vaultPath}`);
  
  // 扫描笔记
  console.log('🔍 Scanning notes...');
  const notes = await scanNotes(vaultPath, options);
  console.log(`📄 Found ${notes.length} markdown files`);
  
  if (notes.length === 0) {
    console.log('No notes to analyze');
    process.exit(0);
  }
  
  // 分析每个笔记
  console.log('🧠 Analyzing notes...');
  const analyses = [];
  
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    process.stdout.write(`  ${i + 1}/${notes.length} ${note.name}...\r`);
    
    const analysis = await analyzeNote(note.path);
    analyses.push(analysis);
  }
  
  console.log('\n✅ Analysis complete');
  
  // 构建知识图谱
  console.log('🕸️ Building knowledge graph...');
  const graph = await buildKnowledgeGraph(notes, analyses);
  
  console.log(`  Nodes: ${graph.nodes.length}`);
  console.log(`  Edges: ${graph.edges.length}`);
  console.log(`  Clusters: ${Object.keys(graph.clusters).length}`);
  
  // 生成链接建议
  console.log('💡 Generating link suggestions...');
  const suggestions = await generateSuggestedLinks(graph);
  console.log(`  ${suggestions.length} suggestions`);
  
  // 保存结果
  const outputDir = join(DATA_DIR, 'knowledge-graph');
  
  await writeFile(
    join(outputDir, 'graph.json'),
    JSON.stringify(graph, null, 2)
  );
  
  await writeFile(
    join(outputDir, 'suggested-links.json'),
    JSON.stringify(suggestions, null, 2)
  );
  
  // 生成 Markdown 报告
  const report = generateReport(graph, suggestions);
  await writeFile(join(outputDir, 'report.md'), report);
  
  console.log('\n📊 Results saved to:');
  console.log(`  ${outputDir}/graph.json`);
  console.log(`  ${outputDir}/suggested-links.json`);
  console.log(`  ${outputDir}/report.md`);
  
  // 输出前5个建议
  if (suggestions.length > 0) {
    console.log('\n🔗 Top link suggestions:');
    suggestions.slice(0, 5).forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.note1.split('/').pop()} ↔ ${s.note2.split('/').pop()}`);
      console.log(`     Reason: ${s.reason} (confidence: ${(s.confidence * 100).toFixed(0)}%)`);
    });
  }
}

function generateReport(graph, suggestions) {
  const date = new Date().toISOString().split('T')[0];
  
  return `# Knowledge Graph Analysis Report

**Generated:** ${date}

## Summary

- **Total Notes:** ${graph.nodes.length}
- **Total Links:** ${graph.edges.length}
- **Unique Tags:** ${Object.keys(graph.clusters).length}
- **Link Suggestions:** ${suggestions.length}

## Tag Distribution

${Object.entries(graph.clusters)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10)
  .map(([tag, nodes]) => `- **#${tag}**: ${nodes.length} notes`)
  .join('\n')}

## Top Link Suggestions

${suggestions.slice(0, 10).map((s, i) => `
### ${i + 1}. ${s.note1.split('/').pop()} ↔ ${s.note2.split('/').pop()}
- **Reason:** ${s.reason}
- **Confidence:** ${(s.confidence * 100).toFixed(0)}%
`).join('\n')}

---
*Generated by Continuous Learning Skill*
`;
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
