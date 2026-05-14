#!/bin/bash
# LinguaFlow 本地 Docker 一键启动脚本

echo "🚀 LinguaFlow 本地一键启动"
echo "=========================="
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 请先安装 Docker: https://docker.com"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 请先安装 Docker Compose"
    exit 1
fi

# 使用 docker-compose 或 docker compose
if docker compose version &> /dev/null; then
    COMPOSE="docker compose"
else
    COMPOSE="docker-compose"
fi

echo "📦 拉取镜像并启动服务..."
echo ""

# 启动服务
$COMPOSE -f docker-compose.local.yml up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 10

echo ""
echo "✅ 启动完成！"
echo "=========================="
echo ""
echo "🎉 访问地址:"
echo "   前端界面: http://localhost:3000"
echo "   后端 API:  http://localhost:3001"
echo "   API 文档:  http://localhost:3001/api/docs"
echo ""
echo "📊 服务状态:"
$COMPOSE -f docker-compose.local.yml ps
echo ""
echo "💡 停止服务: $COMPOSE -f docker-compose.local.yml down"
