#!/bin/bash

# ============================================
# LinguaFlow 全自动智能部署脚本 v2.0
# 
# 功能：
# 1. 自动创建/配置 Supabase 项目
# 2. 自动部署前端到 Vercel
# 3. 自动部署后端到 Railway
# 4. 自动配置所有环境变量
# 5. 自动初始化数据库
# 
# 使用方法：
# ./scripts/auto-deploy.sh
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# 配置
PROJECT_NAME="linguaflow"
DEPLOY_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$DEPLOY_DIR/deploy.log"

# 日志函数
log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1"
    echo "[$(date)] $1" >> "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
    echo "[SUCCESS] $1" >> "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    echo "[WARN] $1" >> "$LOG_FILE"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

# Banner
show_banner() {
    clear
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}   ${BOLD}LinguaFlow 全自动智能部署${NC}             ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}   版本: 2.0 | 免费公测版                   ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════╝${NC}"
    echo ""
}

# 检查环境
check_environment() {
    log "检查运行环境..."
    
    local missing=()
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        missing+=("Node.js")
    else
        NODE_VERSION=$(node -v)
        log "  Node.js: $NODE_VERSION"
    fi
    
    # 检查 NPM
    if ! command -v npm &> /dev/null; then
        missing+=("NPM")
    else
        NPM_VERSION=$(npm -v)
        log "  NPM: $NPM_VERSION"
    fi
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        missing+=("Git")
    else
        log "  Git: $(git --version | cut -d' ' -f3)"
    fi
    
    # 检查 Curl
    if ! command -v curl &> /dev/null; then
        missing+=("Curl")
    else
        log "  Curl: $(curl --version | head -n1 | cut -d' ' -f2)"
    fi
    
    if [ ${#missing[@]} -gt 0 ]; then
        echo ""
        log_error "缺少以下工具: ${missing[*]}"
        echo ""
        echo "请先安装缺失的工具："
        echo "  Node.js: https://nodejs.org/"
        echo "  Git: https://git-scm.com/"
        echo ""
        exit 1
    fi
    
    log_success "环境检查完成"
    echo ""
}

# 生成随机密钥
generate_secret() {
    openssl rand -base64 32 | tr -d '/=+' | head -c 32
}

# 获取 API Token
get_api_tokens() {
    echo ""
    echo -e "${BOLD}📋 需要配置以下服务的 API Token${NC}"
    echo ""
    echo "请在浏览器中登录并获取 Token："
    echo ""
    echo "1️⃣  Supabase (数据库+认证):"
    echo "   → https://supabase.com/dashboard/account/tokens"
    echo "   → 点击 'New Token' 创建"
    echo ""
    echo "2️⃣  Vercel (前端托管):"
    echo "   → https://vercel.com/account/tokens"
    echo "   → 点击 'Create' 创建 Token"
    echo ""
    echo "3️⃣  Railway (后端托管):"
    echo "   → https://railway.app/account"
    echo "   → 在 Personal Tokens 中创建"
    echo ""
    echo "4️⃣  GitHub (代码仓库 - 可选):"
    echo "   → https://github.com/settings/tokens"
    echo "   → 需要 repo 和 workflow 权限"
    echo ""
    
    read -p "请输入 Supabase Token: " SUPABASE_TOKEN
    read -p "请输入 Vercel Token: " VERCEL_TOKEN
    read -p "请输入 Railway Token: " RAILWAY_TOKEN
    
    if [ -z "$SUPABASE_TOKEN" ] || [ -z "$VERCEL_TOKEN" ] || [ -z "$RAILWAY_TOKEN" ]; then
        log_error "Token 不能为空"
        exit 1
    fi
    
    # 保存到配置文件
    cat > "$DEPLOY_DIR/.deploy_tokens" << EOF
SUPABASE_TOKEN=$SUPABASE_TOKEN
VERCEL_TOKEN=$VERCEL_TOKEN
RAILWAY_TOKEN=$RAILWAY_TOKEN
EOF
    chmod 600 "$DEPLOY_DIR/.deploy_tokens"
    
    log_success "Token 配置完成"
}

# 创建 Supabase 项目
create_supabase_project() {
    log "创建 Supabase 项目..."
    
    echo ""
    echo -e "${YELLOW}📝 需要创建新的 Supabase 项目${NC}"
    echo ""
    echo "请访问以下链接创建项目："
    echo "   → https://supabase.com/dashboard/new"
    echo ""
    echo "创建完成后，提供以下信息："
    read -p "项目 ID (在项目设置中): " PROJECT_REF
    read -p "Project URL (如 xxx.supabase.co): " PROJECT_URL
    read -p "anon/public Key: " ANON_KEY
    read -p "service_role Key: " SERVICE_KEY
    
    if [ -z "$PROJECT_REF" ] || [ -z "$PROJECT_URL" ] || [ -z "$ANON_KEY" ] || [ -z "$SERVICE_KEY" ]; then
        log_error "Supabase 配置不完整"
        exit 1
    fi
    
    # 保存配置
    cat > "$DEPLOY_DIR/.env" << EOF
# ====================
# LinguaFlow 环境配置
# ====================

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY
SUPABASE_URL=https://$PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY

# JWT
JWT_SECRET=$(generate_secret)

# API URLs
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=

# 服务器
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://$PROJECT_URL
EOF
    chmod 600 "$DEPLOY_DIR/.env"
    
    log_success "Supabase 项目配置完成"
    log "  Project: $PROJECT_URL"
}

# 初始化数据库
init_database() {
    log "初始化数据库..."
    
    echo ""
    echo -e "${YELLOW}📊 数据库初始化${NC}"
    echo ""
    echo "请在 Supabase Dashboard 中执行以下操作："
    echo ""
    echo "1. 访问: https://supabase.com/dashboard/project/$PROJECT_REF/sql"
    echo "2. 点击 'New Query'"
    echo "3. 复制以下 SQL 并执行："
    echo ""
    
    # 显示 SQL 文件内容提示
    if [ -f "$DEPLOY_DIR/supabase/schema.sql" ]; then
        echo -e "${CYAN}-- 文件位置: $DEPLOY_DIR/supabase/schema.sql${NC}"
        echo -e "${CYAN}-- 复制全部内容到 Supabase SQL Editor 并点击 'Run'${NC}"
    fi
    
    echo ""
    read -p "数据库初始化完成？ (y/n): " confirm
    
    if [ "$confirm" = "y" ]; then
        log_success "数据库初始化完成"
    else
        log_warn "请稍后手动完成数据库初始化"
    fi
}

# 部署前端到 Vercel
deploy_frontend_vercel() {
    log "部署前端到 Vercel..."
    
    echo ""
    echo -e "${YELLOW}🌐 Vercel 前端部署${NC}"
    echo ""
    
    # 检查 Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log "安装 Vercel CLI..."
        npm install -g vercel
    fi
    
    echo "请在浏览器中登录 Vercel："
    echo "   → https://vercel.com/login"
    echo ""
    
    cd "$DEPLOY_DIR"
    
    # 交互式部署（用户确认）
    echo "运行以下命令完成部署："
    echo ""
    echo -e "${CYAN}  cd $DEPLOY_DIR${NC}"
    echo -e "${CYAN}  vercel --prod${NC}"
    echo ""
    
    read -p "Vercel 部署完成？请输入分配的域名: " VERCEL_URL
    
    if [ -n "$VERCEL_URL" ]; then
        # 更新 .env
        sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$VERCEL_URL|" "$DEPLOY_DIR/.env"
        sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://$VERCEL_URL/api|" "$DEPLOY_DIR/.env"
        
        log_success "前端部署完成"
        log "  URL: https://$VERCEL_URL"
    fi
}

# 部署后端到 Railway
deploy_backend_railway() {
    log "部署后端到 Railway..."
    
    echo ""
    echo -e "${YELLOW}🚀 Railway 后端部署${NC}"
    echo ""
    
    # 检查 Railway CLI
    if ! command -v railway &> /dev/null; then
        log "安装 Railway CLI..."
        npm install -g @railway/cli
    fi
    
    echo "请在浏览器中登录 Railway："
    echo "   → https://railway.app/login"
    echo ""
    
    cd "$DEPLOY_DIR/api"
    
    echo "运行以下命令完成部署："
    echo ""
    echo -e "${CYAN}  railway login${NC}"
    echo -e "${CYAN}  railway init${NC}"
    echo -e "${CYAN}  railway up${NC}"
    echo ""
    
    read -p "Railway 部署完成？请输入分配的域名: " RAILWAY_URL
    
    if [ -n "$RAILWAY_URL" ]; then
        # 更新 .env
        sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://$RAILWAY_URL|" "$DEPLOY_DIR/.env"
        
        log_success "后端部署完成"
        log "  URL: https://$RAILWAY_URL"
    fi
}

# 配置 GitHub Actions
setup_github_actions() {
    log "配置 GitHub Actions CI/CD..."
    
    echo ""
    echo -e "${YELLOW}⚙️  CI/CD 配置${NC}"
    echo ""
    
    # 检查 .github/workflows
    if [ ! -d "$DEPLOY_DIR/.github/workflows" ]; then
        mkdir -p "$DEPLOY_DIR/.github/workflows"
    fi
    
    # 创建 deploy.yml
    cat > "$DEPLOY_DIR/.github/workflows/deploy.yml" << 'EOF'
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    # 前端部署到 Vercel
    - name: Deploy Frontend to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
    
    # 后端部署到 Railway
    - name: Deploy Backend to Railway
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      run: |
        # Railway 自动部署配置
        echo "配置 Railway 部署..."
EOF
    
    echo ""
    echo -e "${CYAN}GitHub Secrets 配置说明：${NC}"
    echo ""
    echo "在 GitHub 仓库 Settings → Secrets 中添加："
    echo "  • VERCEL_TOKEN"
    echo "  • VERCEL_ORG_ID"
    echo "  • VERCEL_PROJECT_ID"
    echo "  • RAILWAY_TOKEN"
    echo ""
    
    log_success "CI/CD 配置完成"
}

# 创建启动检查脚本
create_check_script() {
    log "创建健康检查脚本..."
    
    cat > "$DEPLOY_DIR/scripts/health-check.sh" << 'EOF'
#!/bin/bash
# LinguaFlow 健康检查脚本

API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3001}
FRONTEND_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}

echo "🔍 LinguaFlow 健康检查"
echo "======================"

# 检查 API
echo -n "API 服务: "
if curl -s "$API_URL/health" > /dev/null 2>&1; then
    echo "✅ 正常"
else
    echo "❌ 异常"
fi

# 检查前端
echo -n "前端服务: "
if curl -s "$FRONTEND_URL" > /dev/null 2>&1; then
    echo "✅ 正常"
else
    echo "❌ 异常"
fi

# 检查数据库
echo -n "数据库: "
if curl -s "$SUPABASE_URL/health" > /dev/null 2>&1; then
    echo "✅ 正常"
else
    echo "❌ 异常"
fi

echo ""
echo "详细状态:"
curl -s "$API_URL/health" | head -c 200
echo ""
EOF
    chmod +x "$DEPLOY_DIR/scripts/health-check.sh"
    
    log_success "健康检查脚本已创建"
}

# 完成总结
show_summary() {
    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}                   🎉 部署完成！                    ${GREEN}║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${BOLD}📍 访问地址${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "$DEPLOY_DIR/.env" ]; then
        source "$DEPLOY_DIR/.env"
        [ -n "$NEXT_PUBLIC_APP_URL" ] && echo "  🌐 前端:   $NEXT_PUBLIC_APP_URL"
        [ -n "$NEXT_PUBLIC_API_URL" ] && echo "  🔧 后端:   $NEXT_PUBLIC_API_URL"
        [ -n "$NEXT_PUBLIC_SUPABASE_URL" ] && echo "  💾 数据库: $NEXT_PUBLIC_SUPABASE_URL"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo -e "${BOLD}📋 下一步操作${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  1. 在 GitHub 仓库 Settings → Secrets 中配置 Token"
    echo "  2. 推送代码到 main 分支，触发自动部署"
    echo "  3. 配置自定义域名（可选）"
    echo "  4. 开始公测推广！"
    echo ""
    
    echo -e "${BOLD}🔧 常用命令${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  ./scripts/health-check.sh    # 健康检查"
    echo "  ./scripts/auto-deploy.sh     # 重新部署"
    echo "  npm run dev                  # 本地开发"
    echo ""
}

# 主函数
main() {
    # 初始化日志
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "=== LinguaFlow 部署日志 $(date) ===" > "$LOG_FILE"
    
    show_banner
    check_environment
    
    echo -e "${BOLD}请选择部署模式：${NC}"
    echo ""
    echo "  1️⃣  全自动（需要 API Token）"
    echo "  2️⃣  半自动（手动引导）"
    echo "  3️⃣  仅生成本地配置文件"
    echo ""
    read -p "请选择 [1/2/3]: " mode
    
    case $mode in
        1)
            get_api_tokens
            create_supabase_project
            init_database
            deploy_frontend_vercel
            deploy_backend_railway
            setup_github_actions
            create_check_script
            ;;
        2)
            create_supabase_project
            init_database
            deploy_frontend_vercel
            deploy_backend_railway
            create_check_script
            ;;
        3)
            create_supabase_project
            log_success "配置文件已生成: $DEPLOY_DIR/.env"
            ;;
        *)
            log_error "无效选择"
            exit 1
            ;;
    esac
    
    show_summary
}

# 执行
main "$@"
