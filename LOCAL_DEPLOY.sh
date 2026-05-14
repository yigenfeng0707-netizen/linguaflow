#!/bin/bash
# LinguaFlow 本地一键部署脚本
# 将此文件保存到本地，双击运行或在终端执行: bash LOCAL_DEPLOY.sh

echo "🚀 LinguaFlow 本地一键部署"
echo "=========================="
echo ""

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
SUPABASE_URL="https://ivralexnwkklhgyhgofa.supabase.co"

echo -e "${BLUE}📋 部署配置:${NC}"
echo "  Supabase URL: $SUPABASE_URL"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️ 请先安装 Node.js: https://nodejs.org${NC}"
    exit 1
fi

# 第 1 步: 安装 Vercel CLI
echo -e "${BLUE}📦 步骤 1/4: 安装 Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi
echo -e "${GREEN}✅ Vercel CLI 已就绪${NC}"

# 第 2 步: Vercel 登录
echo ""
echo -e "${BLUE}📦 步骤 2/4: 登录 Vercel...${NC}"
echo "  将自动打开浏览器，请点击 'Authorize' 授权"
vercel login

# 第 3 步: 配置环境变量并部署
echo ""
echo -e "${BLUE}📦 步骤 3/4: 配置环境变量...${NC}"
read -p "请输入 Supabase ANON KEY: " SUPABASE_ANON_KEY

echo ""
echo -e "${BLUE}📦 步骤 4/4: 部署前端...${NC}"
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# 部署
vercel --prod --yes

echo ""
echo -e "${GREEN}==========================${NC}"
echo -e "${GREEN}✅ 前端部署完成!${NC}"
echo -e "${GREEN}==========================${NC}"
echo ""
echo -e "${BLUE}📝 后端部署:${NC}"
echo "  访问 https://railway.app 部署后端 API"
echo "  项目目录: api/"
echo "  启动命令: node server.js"
echo ""
echo -e "${YELLOW}💡 提示: 前端已可访问，后端可稍后部署${NC}"
