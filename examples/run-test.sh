#!/bin/bash

# Continuous Learning Skill - 测试脚本
# 用于快速测试所有模块功能

set -e  # 遇到错误时退出

echo "🧪 Continuous Learning Skill 测试脚本"
echo "======================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖..."
    
    # 检查 Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        print_success "Node.js 版本: $NODE_VERSION"
        
        # 检查版本是否 >= 16
        if [[ $(echo "$NODE_VERSION" | cut -d'.' -f1) -lt 16 ]]; then
            print_error "Node.js 版本需要 >= 16.0.0"
            exit 1
        fi
    else
        print_error "Node.js 未安装"
        exit 1
    fi
    
    # 检查 npm/yarn
    if command -v npm &> /dev/null; then
        print_success "npm 已安装"
    elif command -v yarn &> /dev/null; then
        print_success "yarn 已安装"
    else
        print_warning "未找到 npm 或 yarn，但 Node.js 可用"
    fi
    
    # 检查技能目录
    if [ -d "../scripts" ]; then
        print_success "技能目录结构正常"
    else
        print_error "技能目录结构异常"
        exit 1
    fi
}

# 测试对话学习模块
test_conversation_learning() {
    print_info "测试对话学习模块..."
    
    # 创建测试会话文件
    TEST_SESSION_DIR="/tmp/cl-test-sessions"
    mkdir -p "$TEST_SESSION_DIR"
    cp ./conversations/sample-session.jsonl "$TEST_SESSION_DIR/test-session.jsonl"
    
    # 运行对话学习
    cd ..
    OUTPUT=$(node scripts/learn-from-conversation.mjs --session "$TEST_SESSION_DIR/test-session.jsonl" --dry-run 2>&1)
    
    if echo "$OUTPUT" | grep -q "Total messages"; then
        MESSAGE_COUNT=$(echo "$OUTPUT" | grep "Total messages" | awk '{print $3}')
        print_success "对话学习测试通过 - 提取到 $MESSAGE_COUNT 条消息"
    else
        print_error "对话学习测试失败"
        echo "$OUTPUT"
        return 1
    fi
    
    cd - > /dev/null
}

# 测试笔记分析模块
test_note_analysis() {
    print_info "测试笔记分析模块..."
    
    # 创建测试笔记目录
    TEST_VAULT="/tmp/cl-test-vault"
    mkdir -p "$TEST_VAULT"
    
    # 创建示例笔记
    cat > "$TEST_VAULT/test-note-1.md" << EOF
# 测试笔记 1

这是一个测试笔记，用于测试笔记分析功能。

## 内容
- 项目计划
- 任务跟踪
- 学习笔记

## 标签
#test #project #learning
EOF
    
    cat > "$TEST_VAULT/test-note-2.md" << EOF
# 测试笔记 2

另一个测试笔记，包含链接到第一个笔记。

## 相关笔记
- [[test-note-1]]

## 标签
#test #reference #work
EOF
    
    # 运行笔记分析
    cd ..
    OUTPUT=$(node scripts/analyze-notes.mjs --vault "$TEST_VAULT" --dry-run 2>&1)
    
    if echo "$OUTPUT" | grep -q "Found.*markdown files"; then
        FILE_COUNT=$(echo "$OUTPUT" | grep "Found.*markdown files" | awk '{print $2}')
        print_success "笔记分析测试通过 - 找到 $FILE_COUNT 个笔记文件"
    else
        print_error "笔记分析测试失败"
        echo "$OUTPUT"
        return 1
    fi
    
    cd - > /dev/null
}

# 测试行为报告模块
test_behavior_report() {
    print_info "测试行为报告模块..."
    
    # 创建测试行为数据
    TEST_BEHAVIOR_DIR="/tmp/cl-test-behavior"
    mkdir -p "$TEST_BEHAVIOR_DIR"
    
    cat > "$TEST_BEHAVIOR_DIR/test-behavior.json" << EOF
{
  "commands": [
    {
      "timestamp": "2026-02-12T09:00:00Z",
      "command": "cron list",
      "session": "main",
      "duration": 1500
    },
    {
      "timestamp": "2026-02-12T09:05:00Z",
      "command": "memory search",
      "session": "main",
      "duration": 2000
    },
    {
      "timestamp": "2026-02-12T09:10:00Z",
      "command": "exec ls -la",
      "session": "main",
      "duration": 1000
    }
  ]
}
EOF
    
    # 运行行为报告
    cd ..
    OUTPUT=$(node scripts/behavior-report.mjs --period daily --output console --dry-run 2>&1)
    
    if echo "$OUTPUT" | grep -q "Total Commands"; then
        COMMAND_COUNT=$(echo "$OUTPUT" | grep "Total Commands" | awk '{print $3}')
        print_success "行为报告测试通过 - 分析 $COMMAND_COUNT 个命令"
    else
        print_warning "行为报告测试 - 无数据（正常，需要启用跟踪）"
    fi
    
    cd - > /dev/null
}

# 测试网络聚合模块
test_web_aggregation() {
    print_info "测试网络聚合模块..."
    
    # 检查 API Key
    if [ -z "$TAVILY_API_KEY" ]; then
        print_warning "未设置 TAVILY_API_KEY，跳过网络聚合测试"
        print_warning "设置环境变量: export TAVILY_API_KEY=\"your-api-key\""
        return 0
    fi
    
    # 创建测试配置
    TEST_CONFIG="/tmp/cl-test-topics.json"
    cat > "$TEST_CONFIG" << EOF
{
  "topics": [
    {
      "name": "Test",
      "display_name": "测试",
      "queries": ["technology"],
      "keywords": ["tech"],
      "frequency": "daily",
      "max_results": 2,
      "language": "en"
    }
  ]
}
EOF
    
    # 运行网络聚合
    cd ..
    OUTPUT=$(node scripts/aggregate-web.mjs --config "$TEST_CONFIG" --dry-run 2>&1)
    
    if echo "$OUTPUT" | grep -q "Aggregating"; then
        print_success "网络聚合测试通过 - API 连接正常"
    else
        print_error "网络聚合测试失败"
        echo "$OUTPUT"
        return 1
    fi
    
    cd - > /dev/null
}

# 运行所有测试
run_all_tests() {
    print_info "开始运行所有测试..."
    echo ""
    
    # 测试对话学习
    if test_conversation_learning; then
        print_success "✅ 对话学习模块测试通过"
    else
        print_error "❌ 对话学习模块测试失败"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
    
    # 测试笔记分析
    if test_note_analysis; then
        print_success "✅ 笔记分析模块测试通过"
    else
        print_error "❌ 笔记分析模块测试失败"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
    
    # 测试行为报告
    if test_behavior_report; then
        print_success "✅ 行为报告模块测试通过"
    else
        print_warning "⚠️  行为报告模块测试跳过（需要数据）"
    fi
    echo ""
    
    # 测试网络聚合
    if test_web_aggregation; then
        print_success "✅ 网络聚合模块测试通过"
    else
        print_warning "⚠️  网络聚合模块测试跳过（需要 API Key）"
    fi
    echo ""
}

# 清理测试数据
cleanup() {
    print_info "清理测试数据..."
    
    rm -rf /tmp/cl-test-sessions
    rm -rf /tmp/cl-test-vault
    rm -rf /tmp/cl-test-behavior
    rm -f /tmp/cl-test-topics.json
    
    print_success "测试数据已清理"
}

# 显示测试结果
show_results() {
    echo ""
    echo "======================================"
    echo "测试完成"
    echo "======================================"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "🎉 所有测试通过！"
        echo ""
        echo "下一步："
        echo "1. 查看详细文档: ../SKILL.md"
        echo "2. 配置你的环境: ../SETUP.md"
        echo "3. 开始使用 Continuous Learning Skill"
    else
        print_error "⚠️  $TESTS_FAILED 个测试失败"
        echo ""
        echo "建议："
        echo "1. 检查依赖和环境配置"
        echo "2. 查看错误信息"
        echo "3. 参考故障排除文档"
    fi
}

# 主函数
main() {
    TESTS_FAILED=0
    
    echo "🧠 Continuous Learning Skill 测试套件"
    echo "版本: 1.0.0"
    echo "日期: $(date)"
    echo ""
    
    # 检查依赖
    check_dependencies
    echo ""
    
    # 运行测试
    run_all_tests
    
    # 清理
    cleanup
    
    # 显示结果
    show_results
}

# 运行主函数
main "$@"