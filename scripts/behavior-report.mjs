#!/usr/bin/env node
/**
 * 行为报告生成器 - 分析用户操作模式
 * 
 * Usage:
 *   node behavior-report.mjs --period daily
 *   node behavior-report.mjs --period weekly
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const DATA_DIR = join(homedir(), '.local', 'share', 'continuous-learning');
const BEHAVIOR_DIR = join(DATA_DIR, 'behavior');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    period: 'weekly', // 'daily' | 'weekly' | 'monthly'
    output: 'console' // 'console' | 'file' | 'obsidian'
  };
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--period':
        options.period = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
    }
  }
  
  return options;
}

async function loadCommandLogs() {
  const logs = [];
  
  try {
    const files = await readdir(BEHAVIOR_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await readFile(join(BEHAVIOR_DIR, file), 'utf-8');
        const data = JSON.parse(content);
        logs.push(...(data.commands || []));
      }
    }
  } catch {
    // 目录不存在或为空
  }
  
  return logs;
}

function analyzePatterns(commands, period) {
  const now = Date.now();
  const periodMs = {
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000,
    monthly: 30 * 24 * 60 * 60 * 1000
  }[period] || periodMs.weekly;
  
  const cutoff = now - periodMs;
  const recentCommands = commands.filter(c => new Date(c.timestamp).getTime() > cutoff);
  
  // 命令频率统计
  const commandFreq = {};
  for (const cmd of recentCommands) {
    const key = cmd.command || 'unknown';
    commandFreq[key] = (commandFreq[key] || 0) + 1;
  }
  
  // 时段分布
  const hourDistribution = new Array(24).fill(0);
  for (const cmd of recentCommands) {
    const hour = new Date(cmd.timestamp).getHours();
    hourDistribution[hour]++;
  }
  
  // 工作流识别（简单的序列模式）
  const workflows = identifyWorkflows(recentCommands);
  
  // 自动化建议
  const suggestions = generateSuggestions(commandFreq, workflows);
  
  return {
    totalCommands: recentCommands.length,
    uniqueCommands: Object.keys(commandFreq).length,
    commandFrequency: Object.entries(commandFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20),
    hourDistribution,
    workflows,
    suggestions
  };
}

function identifyWorkflows(commands) {
  // 简单的相邻命令序列识别
  const sequences = [];
  const windowSize = 3;
  
  for (let i = 0; i <= commands.length - windowSize; i++) {
    const sequence = commands.slice(i, i + windowSize)
      .map(c => c.command)
      .filter(Boolean)
      .join(' → ');
    
    if (sequence) {
      sequences.push(sequence);
    }
  }
  
  // 统计频率
  const freq = {};
  for (const seq of sequences) {
    freq[seq] = (freq[seq] || 0) + 1;
  }
  
  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
}

function generateSuggestions(commandFreq, workflows) {
  const suggestions = [];
  
  // 高频命令建议自动化
  const topCommands = Object.entries(commandFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  for (const [cmd, count] of topCommands) {
    if (count > 10) {
      suggestions.push({
        type: 'automation',
        command: cmd,
        frequency: count,
        suggestion: `Consider creating a shortcut or alias for "${cmd}" (used ${count} times)`
      });
    }
  }
  
  // 基于工作流的建议
  for (const [workflow, count] of workflows.slice(0, 3)) {
    suggestions.push({
      type: 'workflow',
      workflow,
      frequency: count,
      suggestion: `Detected repeated workflow. Consider creating a script to automate this sequence.`
    });
  }
  
  return suggestions;
}

function generateReport(analysis, period) {
  const date = new Date().toISOString().split('T')[0];
  
  let report = `# Behavior Analysis Report\n\n`;
  report += `**Period:** ${period}\n`;
  report += `**Generated:** ${date}\n\n`;
  
  report += `## Summary\n\n`;
  report += `- **Total Commands:** ${analysis.totalCommands}\n`;
  report += `- **Unique Commands:** ${analysis.uniqueCommands}\n`;
  report += `- **Workflows Detected:** ${analysis.workflows.length}\n\n`;
  
  report += `## Top Commands\n\n`;
  report += `| Command | Count |\n`;
  report += `|---------|-------|\n`;
  for (const [cmd, count] of analysis.commandFrequency.slice(0, 10)) {
    report += `| ${cmd} | ${count} |\n`;
  }
  report += `\n`;
  
  report += `## Active Hours\n\n`;
  const maxCount = Math.max(...analysis.hourDistribution);
  for (let i = 0; i < 24; i += 4) {
    const block = analysis.hourDistribution.slice(i, i + 4);
    const avg = Math.round(block.reduce((a, b) => a + b, 0) / 4);
    const bar = '█'.repeat(Math.round((avg / maxCount) * 10));
    report += `${i.toString().padStart(2, '0')}:00-${(i + 3).toString().padStart(2, '0')}:59 ${bar} ${avg}\n`;
  }
  report += `\n`;
  
  report += `## Common Workflows\n\n`;
  for (const [workflow, count] of analysis.workflows) {
    report += `- ${workflow} (${count} times)\n`;
  }
  report += `\n`;
  
  report += `## Automation Suggestions\n\n`;
  for (const s of analysis.suggestions) {
    report += `### ${s.type === 'automation' ? '🤖' : '⚡'} ${s.suggestion}\n`;
    if (s.command) {
      report += `- Command: \`${s.command}\` (used ${s.frequency} times)\n`;
    }
    if (s.workflow) {
      report += `- Workflow: ${s.workflow}\n`;
    }
    report += `\n`;
  }
  
  report += `---\n*Generated by Continuous Learning Skill*\n`;
  
  return report;
}

async function main() {
  const options = parseArgs();
  
  console.log(`📊 Generating ${options.period} behavior report...\n`);
  
  // 加载命令日志
  const commands = await loadCommandLogs();
  
  if (commands.length === 0) {
    console.log('⚠️ No command logs found yet.');
    console.log('Command tracking will start after you enable behavior observation.');
    process.exit(0);
  }
  
  console.log(`📁 Loaded ${commands.length} command records`);
  
  // 分析模式
  const analysis = analyzePatterns(commands, options.period);
  
  // 生成报告
  const report = generateReport(analysis, options.period);
  
  // 输出
  if (options.output === 'console') {
    console.log('\n' + report);
  } else if (options.output === 'file') {
    const outputPath = join(DATA_DIR, `behavior-report-${options.period}-${Date.now()}.md`);
    await writeFile(outputPath, report);
    console.log(`✅ Report saved to: ${outputPath}`);
  }
  
  // 显示关键指标
  console.log('\n📈 Key Metrics:');
  console.log(`  Total Commands: ${analysis.totalCommands}`);
  console.log(`  Unique Commands: ${analysis.uniqueCommands}`);
  console.log(`  Top Command: ${analysis.commandFrequency[0]?.[0] || 'N/A'} (${analysis.commandFrequency[0]?.[1] || 0} times)`);
  
  if (analysis.suggestions.length > 0) {
    console.log('\n💡 Top Suggestion:');
    console.log(`  ${analysis.suggestions[0].suggestion}`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
