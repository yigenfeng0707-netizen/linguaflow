#!/bin/bash
# LinguaFlow 一键部署脚本
# 运行前请确保已执行: vercel login

echo "🚀 LinguaFlow 自动部署脚本"
echo "=========================="

# 配置
SUPABASE_URL="https://ivralexnwkklhgyhgofa.supabase.co"
read -p "请输入 Supabase ANON KEY: " SUPABASE_ANON_KEY

echo ""
echo "📦 步骤 1/3: 部署前端到 Vercel..."
echo "----------------------------------------"

# 设置 Vercel 环境变量
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# 部署前端
vercel --prod --yes

echo ""
echo "📦 步骤 2/3: 部署后端到 Railway..."
echo "----------------------------------------"

# 检查 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "安装 Railway CLI..."
    npm install -g @railway/cli
fi

# 登录 Railway
railway login

# 初始化并部署后端
cd api
railway init --name linguaflow-api
railway up

echo ""
echo "📦 步骤 3/3: 配置完成..."
echo "----------------------------------------"

echo ""
echo "✅ 部署完成！"
echo "=========================="
echo "前端地址: 查看上面 Vercel 输出的链接"
echo "后端地址: 查看 Railway 输出的链接"
