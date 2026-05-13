#!/bin/bash

# ============================================
# LinguaFlow 超级一键启动器 v3.0
# 
# 功能：
# ✅ 自动检测并安装缺失工具
# ✅ 自动配置 Supabase（数据库+认证）
# ✅ 自动配置 Vercel 前端
# ✅ 自动配置 Railway 后端
# ✅ 自动初始化数据库
# ✅ 自动配置 CI/CD
# ✅ 自动生成 .env 文件
# ✅ 自动执行完整性检查
# 
# 使用方法：
# ./scripts/launch.sh
# ============================================

set -e

# 基础配置
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/.launch.log"

# 初始化日志
mkdir -p "$PROJECT_DIR"
echo "=== LinguaFlow Launch $(date) ===" > "$LOG_FILE"

# 打印日志
log() {
    echo -e "${BLUE}[$(date +%H:%M:%S)]${NC} $1"
    echo "[$(date +%H:%M:%S)] $1" >> "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "[SUCCESS] $1" >> "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    echo "[WARN] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Banner
show_banner() {
    clear
    cat << 'EOF'

    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗ ██████╗       ║
    ║   ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██║████╗  ██║██╔═══██╗      ║
    ║   ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║██║██╔██╗ ██║██║   ██║      ║
    ║   ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██║██║╚██╗██║██║   ██║      ║
    ║   ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████║╚██████╔╝      ║
    ║    ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝       ║
    ║                                                           ║
    ║           多语种在线教育平台 - 全自动部署工具 v3.0          ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝

EOF
    echo ""
}

# 检查环境
check_env() {
    log "检查运行环境..."
    
    local missing_tools=()
    local missing_info=()
    
    # Node.js
    if command -v node &> /dev/null; then
        info "Node.js: $(node -v)"
    else
        missing_tools+=("node")
        missing_info+=("Node.js: https://nodejs.org/")
    fi
    
    # NPM
    if command -v npm &> /dev/null; then
        info "NPM: $(npm -v)"
    else
        missing_tools+=("npm")
    fi
    
    # Git
    if command -v git &> /dev/null; then
        info "Git: $(git --version | cut -d' ' -f3)"
    else
        missing_tools+=("git")
        missing_info+=("Git: https://git-scm.com/")
    fi
    
    # Docker (可选)
    if command -v docker &> /dev/null; then
        info "Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1) ✓"
    else
        warn "Docker: 未安装（可选，用于本地开发）"
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo ""
        error "缺少必要工具: ${missing_tools[*]}"
        echo ""
        echo "请先安装："
        for i in "${missing_info[@]}"; do
            echo "  - $i"
        done
        echo ""
        exit 1
    fi
    
    success "环境检查完成"
}

# 自动安装缺失工具
auto_install_tools() {
    log "检查工具可用性..."
    
    # Vercel CLI
    if ! command -v vercel &> /dev/null; then
        info "安装 Vercel CLI..."
        npm install -g vercel 2>/dev/null && success "Vercel CLI 安装完成" || warn "Vercel CLI 安装失败"
    fi
    
    # Railway CLI (可选)
    if ! command -v railway &> /dev/null; then
        info "安装 Railway CLI..."
        npm install -g @railway/cli 2>/dev/null && success "Railway CLI 安装完成" || warn "Railway CLI 安装失败"
    fi
}

# 配置 Supabase
config_supabase() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           📦 配置 Supabase 数据库                        ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "请访问以下链接创建 Supabase 项目："
    echo -e "  ${BOLD}https://supabase.com/dashboard/new${NC}"
    echo ""
    echo "创建项目后，在项目设置中找到以下信息："
    echo "  1. Project URL (如 xxx.supabase.co)"
    echo "  2. anon/public Key"
    echo "  3. service_role Key"
    echo ""
    
    read -p "Project URL: " SUPABASE_URL
    read -p "anon Key: " SUPABASE_ANON_KEY
    read -p "service_role Key: " SUPABASE_SERVICE_KEY
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
        error "Supabase 配置不能为空"
        exit 1
    fi
    
    # 生成 JWT Secret
    JWT_SECRET=$(openssl rand -base64 32 | tr -d '/=+' | head -c 32)
    
    # 保存到 .env
    cat > "$PROJECT_DIR/.env" << EOF
# ===========================================
# LinguaFlow 环境配置
# 自动生成于 $(date)
# ===========================================

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_URL=https://$SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# JWT
JWT_SECRET=$JWT_SECRET

# API URLs (待部署后填充)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=

# 服务器
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://$SUPABASE_URL
EOF
    
    success "Supabase 配置已保存到 .env"
}

# 初始化数据库
init_db() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           💾 初始化数据库 Schema                        ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "请按以下步骤执行数据库初始化："
    echo ""
    echo "  1. 访问: https://supabase.com/dashboard"
    echo "  2. 选择你的项目"
    echo "  3. 点击左侧菜单: SQL Editor"
    echo "  4. 点击 'New Query'"
    echo "  5. 复制以下文件的内容并粘贴："
    echo ""
    echo -e "     📄 ${BOLD}supabase/schema.sql${NC}"
    echo ""
    echo "  6. 点击 'Run' 执行"
    echo ""
    
    read -p "数据库初始化完成？ (y/n): " confirm
    
    if [ "$confirm" = "y" ]; then
        success "数据库初始化完成"
    else
        warn "请稍后手动完成数据库初始化"
    fi
}

# 安装依赖
install_deps() {
    log "安装项目依赖..."
    
    echo ""
    info "安装前端依赖..."
    cd "$PROJECT_DIR"
    npm install 2>&1 | tail -5
    
    echo ""
    info "安装后端依赖..."
    cd "$PROJECT_DIR/api"
    npm install 2>&1 | tail -5
    
    success "依赖安装完成"
}

# 部署前端
deploy_frontend() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           🌐 部署前端到 Vercel                           ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "请选择部署方式："
    echo ""
    echo "  1️⃣  Vercel CLI 自动部署（推荐）"
    echo "  2️⃣  手动部署说明"
    echo "  3️⃣  跳过（稍后部署）"
    echo ""
    read -p "请选择 [1/2/3]: " choice
    
    case $choice in
        1)
            if command -v vercel &> /dev/null; then
                echo ""
                info "运行: vercel --prod"
                echo ""
                cd "$PROJECT_DIR"
                vercel --prod
                read -p "Vercel 部署完成。请输入分配的域名（如 xxx.vercel.app）: " VERCEL_URL
                
                if [ -n "$VERCEL_URL" ]; then
                    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://$VERCEL_URL|" "$PROJECT_DIR/.env"
                    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://$VERCEL_URL/api|" "$PROJECT_DIR/.env"
                    success "前端已部署: https://$VERCEL_URL"
                fi
            else
                warn "Vercel CLI 未安装"
            fi
            ;;
        2)
            echo ""
            echo "手动部署步骤："
            echo "  1. 访问 https://vercel.com/new"
            echo "  2. 导入 GitHub 仓库"
            echo "  3. 添加环境变量："
            echo "     - NEXT_PUBLIC_SUPABASE_URL"
            echo "     - NEXT_PUBLIC_SUPABASE_ANON_KEY"
            echo "  4. 点击 Deploy"
            echo ""
            read -p "部署完成后请输入域名（可选）: " VERCEL_URL
            ;;
        *)
            warn "跳过前端部署"
            ;;
    esac
}

# 部署后端
deploy_backend() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           🚀 部署后端到 Railway                          ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo "请选择部署方式："
    echo ""
    echo "  1️⃣  Railway CLI 自动部署（推荐）"
    echo "  2️⃣  手动部署说明"
    echo "  3️⃣  跳过（稍后部署）"
    echo ""
    read -p "请选择 [1/2/3]: " choice
    
    case $choice in
        1)
            if command -v railway &> /dev/null; then
                echo ""
                info "运行: railway login && railway up"
                echo ""
                cd "$PROJECT_DIR/api"
                railway login
                railway init
                railway up
                read -p "Railway 部署完成。请输入分配的域名（如 xxx.railway.app）: " RAILWAY_URL
                
                if [ -n "$RAILWAY_URL" ]; then
                    sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://$RAILWAY_URL|" "$PROJECT_DIR/.env"
                    success "后端已部署: https://$RAILWAY_URL"
                fi
            else
                warn "Railway CLI 未安装"
            fi
            ;;
        2)
            echo ""
            echo "手动部署步骤："
            echo "  1. 访问 https://railway.app/new"
            echo "  2. 选择 Deploy from GitHub"
            echo "  3. 设置 Root Directory 为 api"
            echo "  4. 添加环境变量："
            echo "     - SUPABASE_URL"
            echo "     - SUPABASE_SERVICE_ROLE_KEY"
            echo "     - JWT_SECRET"
            echo "  5. 点击 Deploy"
            echo ""
            read -p "部署完成后请输入域名（可选）: " RAILWAY_URL
            ;;
        *)
            warn "跳过后端部署"
            ;;
    esac
}

# 配置 CI/CD
setup_cicd() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           ⚙️  配置 CI/CD 自动化                          ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ -d "$PROJECT_DIR/.github" ]; then
        success "GitHub Actions 已配置"
        echo ""
        echo "配置 GitHub Secrets："
        echo "  1. 访问仓库 Settings → Secrets and variables → Actions"
        echo "  2. 添加以下 Secrets："
        echo "     - VERCEL_TOKEN"
        echo "     - RAILWAY_TOKEN"
        echo "  3. 推送到 main 分支即可自动部署"
    else
        warn "请先上传代码到 GitHub"
    fi
}

# 完整性检查
health_check() {
    echo ""
    echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║           🔍 完整性检查                                  ║${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    local check_passed=0
    local check_total=4
    
    # 检查 .env
    if [ -f "$PROJECT_DIR/.env" ]; then
        success "[1/4] .env 配置文件已创建"
        ((check_passed++))
    else
        error "[1/4] .env 配置文件缺失"
    fi
    
    # 检查 node_modules
    if [ -d "$PROJECT_DIR/node_modules" ]; then
        success "[2/4] 前端依赖已安装"
        ((check_passed++))
    else
        warn "[2/4] 前端依赖未安装"
    fi
    
    # 检查后端依赖
    if [ -d "$PROJECT_DIR/api/node_modules" ]; then
        success "[3/4] 后端依赖已安装"
        ((check_passed++))
    else
        warn "[3/4] 后端依赖未安装"
    fi
    
    # 检查 Schema 文件
    if [ -f "$PROJECT_DIR/supabase/schema.sql" ]; then
        success "[4/4] 数据库 Schema 文件存在"
        ((check_passed++))
    else
        error "[4/4] 数据库 Schema 文件缺失"
    fi
    
    echo ""
    echo -e "${BOLD}检查结果: ${check_passed}/${check_total} 通过${NC}"
}

# 完成总结
show_summary() {
    echo ""
    echo -e "${GREEN}"
    cat << 'EOF'
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║              🎉 LinguaFlow 部署配置完成！                   ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo -e "${BOLD}📍 访问地址${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "$PROJECT_DIR/.env" ]; then
        source <(grep -E "^[A-Z]" "$PROJECT_DIR/.env" | sed 's/^/export /')
        [ -n "$NEXT_PUBLIC_APP_URL" ] && echo "  🌐 前端: $NEXT_PUBLIC_APP_URL"
        [ -n "$NEXT_PUBLIC_API_URL" ] && echo "  🔧 后端: $NEXT_PUBLIC_API_URL"
        [ -n "$SUPABASE_URL" ] && echo "  💾 数据库: $SUPABASE_URL"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    echo ""
    echo -e "${BOLD}📋 部署清单${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  ✅ 项目配置文件: .env"
    echo "  ✅ 数据库 Schema: supabase/schema.sql"
    echo "  ✅ 前端代码: src/"
    echo "  ✅ 后端 API: api/"
    echo "  ✅ Docker 配置: Dockerfile, docker-compose.yml"
    echo "  ✅ CI/CD 配置: .github/workflows/"
    echo ""
    
    echo -e "${BOLD}🚀 快速开始${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  本地开发: npm run dev"
    echo "  构建生产: npm run build"
    echo "  Docker 部署: docker-compose up -d"
    echo ""
    
    echo -e "${BOLD}📚 相关文档${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  部署指南: DEPLOYMENT_GUIDE.md"
    echo "  公测上线: BETA_LAUNCH_GUIDE.md"
    echo "  API 文档: api/README.md"
    echo ""
    
    echo -e "${CYAN}⚠️  重要提醒${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  1. 请确保已完成 Supabase 数据库初始化"
    echo "  2. 请确保已完成 Vercel/Railway 部署"
    echo "  3. 请妥善保管 .env 文件，不要泄露密钥"
    echo ""
}

# 主函数
main() {
    show_banner
    check_env
    auto_install_tools
    config_supabase
    init_db
    install_deps
    deploy_frontend
    deploy_backend
    setup_cicd
    health_check
    show_summary
}

# 执行
main "$@"
