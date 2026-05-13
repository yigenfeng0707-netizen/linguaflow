#!/bin/bash

# LinguaFlow 生产环境一键部署脚本
# 使用方法: ./deploy-prod.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 LinguaFlow 生产环境部署"
echo "============================"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}错误: Docker 未安装${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}错误: Docker Compose 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker 环境检查通过${NC}"

# 检查配置文件
if [ ! -f .env ]; then
    if [ -f .env.prod.example ]; then
        echo -e "${YELLOW}警告: .env 文件不存在，从示例创建...${NC}"
        cp .env.prod.example .env
        echo -e "${YELLOW}请编辑 .env 文件配置环境变量后重新运行${NC}"
        exit 0
    else
        echo -e "${RED}错误: 未找到 .env 或 .env.prod.example 文件${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ 配置文件检查通过${NC}"

# 创建必要目录
echo ""
echo "📁 创建必要目录..."
mkdir -p nginx/ssl
mkdir -p monitoring/grafana/dashboards
mkdir -p monitoring/grafana/datasources
mkdir -p logs

# 拉取最新镜像
echo ""
echo "📦 拉取最新镜像..."
docker-compose -f docker-compose.prod.yml pull

# 构建应用
echo ""
echo "🔨 构建应用..."
docker-compose -f docker-compose.prod.yml build --no-cache

# 启动服务
echo ""
echo "🚀 启动服务..."
docker-compose -f docker-compose.prod.yml up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 15

# 健康检查
echo ""
echo "🏥 健康检查..."
if curl -s http://localhost/health > /dev/null; then
    echo -e "${GREEN}✓ 服务运行正常${NC}"
else
    echo -e "${YELLOW}⚠ 服务可能尚未完全启动，请稍后检查${NC}"
fi

# 显示状态
echo ""
echo "📊 服务状态:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "访问地址:"
echo "  - 前端应用: http://localhost"
echo "  - API 文档: http://localhost/api/health"
echo "  - Grafana 监控: http://localhost:3002"
echo "  - Prometheus: http://localhost:9090"
echo ""
echo "常用命令:"
echo "  - 查看日志: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - 停止服务: docker-compose -f docker-compose.prod.yml down"
echo "  - 重启服务: docker-compose -f docker-compose.prod.yml restart"
echo "  - 更新部署: ./deploy-prod.sh"
