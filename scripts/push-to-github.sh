#!/bin/bash

# ============================================
# LinguaFlow GitHub 推送脚本
# 使用方法: ./scripts/push-to-github.sh <YOUR_GITHUB_TOKEN>
# ============================================

set -e

TOKEN="$1"

if [ -z "$TOKEN" ]; then
    echo "❌ 请提供 GitHub Personal Access Token"
    echo ""
    echo "获取方式："
    echo "  1. 访问 https://github.com/settings/tokens"
    echo "  2. 点击 'Generate new token (classic)'"
    echo "  3. 勾选 'repo' 权限"
    echo "  4. 生成并复制 Token"
    echo ""
    echo "使用方法："
    echo "  ./scripts/push-to-github.sh ghp_xxxxxxxxxxxx"
    exit 1
fi

cd /workspace/linguaflow

echo "🔑 验证 Token..."
USERNAME=$(curl -s -H "Authorization: token $TOKEN" https://api.github.com/user | grep -o '"login":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USERNAME" ]; then
    echo "❌ Token 无效，请检查"
    exit 1
fi

echo "✅ 用户: $USERNAME"

echo "📦 创建 GitHub 仓库..."
RESPONSE=$(curl -s -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d '{
        "name": "linguaflow",
        "description": "LinguaFlow - 多语种在线教育平台 | 支持英语、日语、韩语等主流语言学习",
        "homepage": "https://linguaflow.vercel.app",
        "private": false,
        "has_issues": true,
        "has_projects": true,
        "has_wiki": true,
        "auto_init": false
    }')

REPO_URL=$(echo "$RESPONSE" | grep -o '"html_url":"[^"]*"' | head -1 | cut -d'"' -f4)
CLONE_URL=$(echo "$RESPONSE" | grep -o '"clone_url":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$REPO_URL" ]; then
    # 仓库可能已存在，尝试获取
    echo "⚠️ 仓库可能已存在，尝试推送..."
    CLONE_URL="https://github.com/$USERNAME/linguaflow.git"
    REPO_URL="https://github.com/$USERNAME/linguaflow"
fi

echo "✅ 仓库: $REPO_URL"

echo "🚀 推送代码..."
git remote add origin "$CLONE_URL" 2>/dev/null || git remote set-url origin "$CLONE_URL"
git push -u origin main 2>&1

echo ""
echo "=========================================="
echo "  🎉 推送完成！"
echo "=========================================="
echo ""
echo "📍 仓库地址: $REPO_URL"
echo ""
echo "📋 下一步："
echo "  1. 访问 $REPO_URL 查看代码"
echo "  2. 在 Vercel 导入该仓库部署前端"
echo "  3. 在 Railway 导入该仓库部署后端"
echo ""
