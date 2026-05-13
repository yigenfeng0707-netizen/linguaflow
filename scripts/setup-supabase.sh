#!/bin/bash

# ============================================
# LinguaFlow Supabase 自动初始化脚本
# 直接通过 Supabase API 执行 SQL
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[Supabase] 开始初始化数据库...${NC}"

# 检查参数
if [ -z "$1" ]; then
    echo "使用方法: $0 <SUPABASE_URL> <SERVICE_ROLE_KEY>"
    echo "示例: $0 https://xxxx.supabase.co sk-xxxxxxx"
    exit 1
fi

SUPABASE_URL="$1"
SERVICE_KEY="$2"

# 读取 SQL 文件
if [ ! -f "$(dirname "$0")/../supabase/schema.sql" ]; then
    echo -e "${RED}错误: 找不到 schema.sql 文件${NC}"
    exit 1
fi

SCHEMA_SQL=$(cat "$(dirname "$0")/../supabase/schema.sql")

# 移除注释行和多余的空白
SCHEMA_SQL=$(echo "$SCHEMA_SQL" | sed 's/--.*$//' | sed '/^[[:space:]]*$/d' | tr '\n' ' ')

echo -e "${BLUE}执行数据库 Schema...${NC}"

# 通过 Supabase API 执行 SQL
RESPONSE=$(curl -s -X POST \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$SCHEMA_SQL\"}")

if echo "$RESPONSE" | grep -q "error"; then
    echo -e "${RED}数据库初始化失败: $RESPONSE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 数据库初始化完成！${NC}"
