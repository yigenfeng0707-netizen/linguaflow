#!/bin/bash
set -e

echo "🚀 LinguaFlow 自动公测部署脚本"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 安装 Supabase CLI
install_supabase() {
    if ! command_exists supabase; then
        echo -e "${BLUE}📦 安装 Supabase CLI...${NC}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install supabase/tap/supabase
        else
            curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | sudo tar -xzf - -C /usr/local/bin supabase
        fi
        echo -e "${GREEN}✅ Supabase CLI 安装完成${NC}"
    fi
}

# 安装 Vercel CLI
install_vercel() {
    if ! command_exists vercel; then
        echo -e "${BLUE}📦 安装 Vercel CLI...${NC}"
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI 安装完成${NC}"
    fi
}

# 安装 Railway CLI
install_railway() {
    if ! command_exists railway; then
        echo -e "${BLUE}📦 安装 Railway CLI...${NC}"
        npm install -g @railway/cli
        echo -e "${GREEN}✅ Railway CLI 安装完成${NC}"
    fi
}

# 步骤1: 创建 Supabase 项目
setup_supabase() {
    echo -e "\n${YELLOW}步骤 1/4: 创建 Supabase 数据库${NC}"
    echo "----------------------------------------"
    
    # 登录 Supabase
    echo -e "${BLUE}🔐 请登录 Supabase...${NC}"
    supabase login
    
    # 创建项目
    echo -e "${BLUE}🏗️ 创建 Supabase 项目...${NC}"
    supabase projects create linguaflow --org-id default --region ap-southeast-1 --plan free
    
    # 获取项目信息
    echo -e "${BLUE}📋 获取项目连接信息...${NC}"
    supabase projects list
    
    echo -e "${GREEN}✅ Supabase 项目创建完成！${NC}"
    echo -e "${YELLOW}⚠️ 请手动复制以下信息:${NC}"
    echo "  - Project URL"
    echo "  - anon public key"
    echo "  - service_role key"
    echo ""
    read -p "按回车键继续..."
}

# 步骤2: 导入数据库 Schema
import_schema() {
    echo -e "\n${YELLOW}步骤 2/4: 导入数据库 Schema${NC}"
    echo "----------------------------------------"
    
    # 链接项目
    echo -e "${BLUE}🔗 链接到 Supabase 项目...${NC}"
    supabase link
    
    # 执行 SQL
    echo -e "${BLUE}📊 导入数据库 Schema...${NC}"
    supabase db execute --file ./supabase/schema.sql
    
    echo -e "${GREEN}✅ 数据库 Schema 导入完成！${NC}"
}

# 步骤3: 部署前端到 Vercel
deploy_frontend() {
    echo -e "\n${YELLOW}步骤 3/4: 部署前端到 Vercel${NC}"
    echo "----------------------------------------"
    
    # 登录 Vercel
    echo -e "${BLUE}🔐 请登录 Vercel...${NC}"
    vercel login
    
    # 部署
    echo -e "${BLUE}🚀 部署前端...${NC}"
    vercel --prod --yes
    
    echo -e "${GREEN}✅ 前端部署完成！${NC}"
}

# 步骤4: 部署后端到 Railway
deploy_backend() {
    echo -e "\n${YELLOW}步骤 4/4: 部署后端到 Railway${NC}"
    echo "----------------------------------------"
    
    # 登录 Railway
    echo -e "${BLUE}🔐 请登录 Railway...${NC}"
    railway login
    
    # 初始化项目
    echo -e "${BLUE}🏗️ 初始化 Railway 项目...${NC}"
    railway init --name linguaflow-api
    
    # 部署
    echo -e "${BLUE}🚀 部署后端...${NC}"
    cd api && railway up
    
    echo -e "${GREEN}✅ 后端部署完成！${NC}"
}

# 主流程
main() {
    echo -e "${BLUE}🔧 检查并安装必要工具...${NC}"
    install_supabase
    install_vercel
    install_railway
    
    echo -e "${GREEN}✅ 所有工具已就绪！${NC}\n"
    
    # 执行部署步骤
    setup_supabase
    import_schema
    deploy_frontend
    deploy_backend
    
    echo -e "\n${GREEN}================================${NC}"
    echo -e "${GREEN}🎉 部署全部完成！${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "${BLUE}你的 LinguaFlow 平台已上线公测！${NC}"
}

# 运行
main
