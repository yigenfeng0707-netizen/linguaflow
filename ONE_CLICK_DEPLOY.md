#!/bin/bash

# ============================================
# LinguaFlow 一键全自动部署脚本 v1.0
# 支持：Vercel + Railway + Supabase
# 费用：完全免费
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置
PROJECT_NAME="linguaflow"
FRONTEND_URL=""
API_URL=""
SUPABASE_URL=""
SUPABASE_KEY=""
JWT_SECRET=""

echo "=========================================="
echo "  LinguaFlow 全自动一键部署"
echo "=========================================="
echo ""

# 检查必要工具
check_tools() {
    echo -e "${BLUE}[1/6] 检查环境...${NC}"
    
    local missing=0
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}✗ Git 未安装${NC}"
        missing=1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}✗ Node.js/NPM 未安装${NC}"
        missing=1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}⚠ Docker 未安装（可选，用于本地开发）${NC}"
    fi
    
    if [ $missing -eq 1 ]; then
        echo -e "${RED}请先安装必要工具后重试${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ 环境检查完成${NC}"
    echo ""
}

# 生成随机密钥
generate_secret() {
    openssl rand -base64 32 | tr -d '/=+' | head -c 32
}

# 初始化 Supabase
setup_supabase() {
    echo -e "${BLUE}[2/6] 配置 Supabase 数据库...${NC}"
    echo ""
    echo "请访问以下链接创建 Supabase 项目："
    echo "https://supabase.com/dashboard/new"
    echo ""
    echo "创建完成后，请提供以下信息："
    echo ""
    
    read -p "1. Supabase Project URL: " SUPABASE_URL
    read -p "2. Supabase anon/public key: " SUPABASE_KEY
    read -p "3. Supabase service_role key: " SERVICE_KEY
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
        echo -e "${RED}✗ Supabase 配置不能为空${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Supabase 配置已保存${NC}"
    echo ""
}

# 配置环境变量
setup_env() {
    echo -e "${BLUE}[3/6] 生成环境变量配置...${NC}"
    
    JWT_SECRET=$(generate_secret)
    
    # 创建 .env 文件
    cat > .env << EOF
# ====================
# LinguaFlow 环境配置
# ====================

# 前端
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY
NEXT_PUBLIC_API_URL=$API_URL
NEXT_PUBLIC_APP_URL=https://linguaflow.vercel.app

# 后端 API
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=https://linguaflow.vercel.app
PORT=3001
NODE_ENV=production

# Vercel
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=

# Railway
RAILWAY_TOKEN=
RAILWAY_PROJECT_ID=
EOF
    
    echo -e "${GREEN}✓ .env 文件已创建${NC}"
    echo ""
}

# 安装依赖
install_deps() {
    echo -e "${BLUE}[4/6] 安装项目依赖...${NC}"
    
    echo "安装前端依赖..."
    npm install
    
    echo "安装后端依赖..."
    cd api && npm install && cd ..
    
    echo -e "${GREEN}✓ 依赖安装完成${NC}"
    echo ""
}

# 部署到 Vercel
deploy_frontend() {
    echo -e "${BLUE}[5/6] 部署前端到 Vercel...${NC}"
    echo ""
    
    echo "请按以下步骤操作："
    echo "1. 访问 https://vercel.com 并登录"
    echo "2. 创建新项目，导入当前仓库"
    echo "3. 在项目设置中添加环境变量："
    echo "   - NEXT_PUBLIC_SUPABASE_URL = $SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY = $SUPABASE_KEY"
    echo "4. 点击 Deploy 部署"
    echo ""
    
    read -p "部署完成后，请输入 Vercel 分配的域名（如 xxx.vercel.app）: " FRONTEND_URL
    
    if [ -n "$FRONTEND_URL" ]; then
        echo "FRONTEND_URL=$FRONTEND_URL"
        echo -e "${GREEN}✓ 前端域名已记录${NC}"
    fi
    echo ""
}

# 部署到 Railway
deploy_backend() {
    echo -e "${BLUE}[6/6] 部署后端到 Railway...${NC}"
    echo ""
    
    echo "请按以下步骤操作："
    echo "1. 访问 https://railway.app 并登录（推荐用 GitHub 登录）"
    echo "2. 点击 New Project → Deploy from GitHub repo"
    echo "3. 选择 linguaflow 仓库"
    echo "4. 设置 Root Directory 为 'api'"
    echo "5. 在 Variables 中添加环境变量："
    echo "   - SUPABASE_URL = $SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY = $SERVICE_KEY"
    echo "   - JWT_SECRET = $JWT_SECRET"
    echo "   - FRONTEND_URL = https://$FRONTEND_URL"
    echo "6. 点击 Deploy Now"
    echo ""
    
    read -p "部署完成后，请输入 Railway 分配的域名（如 xxx.railway.app）: " API_URL
    
    if [ -n "$API_URL" ]; then
        echo "API_URL=$API_URL"
        echo -e "${GREEN}✓ 后端域名已记录${NC}"
    fi
    echo ""
}

# 初始化数据库
init_database() {
    echo -e "${BLUE}[初始化] 配置数据库...${NC}"
    echo ""
    echo "请在 Supabase Dashboard 中执行以下操作："
    echo ""
    echo "1. 访问: https://supabase.com/dashboard"
    echo "2. 选择你的项目 → SQL Editor"
    echo "3. 点击 New Query"
    echo "4. 复制以下内容并执行："
    echo ""
    echo "----------------------------------------"
    cat supabase/schema.sql
    echo "----------------------------------------"
    echo ""
    
    read -p "数据库配置完成？ (y/n): " confirm
    
    if [ "$confirm" != "y" ]; then
        echo -e "${YELLOW}请稍后手动完成数据库配置${NC}"
    else
        echo -e "${GREEN}✓ 数据库配置完成${NC}"
    fi
}

# 显示完成信息
show_summary() {
    echo ""
    echo "=========================================="
    echo -e "${GREEN}  🎉 部署完成！${NC}"
    echo "=========================================="
    echo ""
    echo "访问地址："
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    if [ -n "$FRONTEND_URL" ]; then
        echo "前端应用: https://$FRONTEND_URL"
    fi
    if [ -n "$API_URL" ]; then
        echo "后端 API:   https://$API_URL"
    fi
    echo "数据库:    $SUPABASE_URL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "下一步："
    echo "1. 在 Vercel 和 Railway 中配置自定义域名（可选）"
    echo "2. 在 Supabase 中验证数据库配置"
    echo "3. 开始推广你的应用！"
    echo ""
    echo "常用命令："
    echo "  npm run dev          # 本地开发"
    echo "  npm run build        # 构建项目"
    echo "  docker-compose up   # Docker 部署"
    echo ""
}

# 主函数
main() {
    check_tools
    setup_supabase
    setup_env
    install_deps
    deploy_frontend
    deploy_backend
    init_database
    show_summary
}

# 执行
main "$@"
