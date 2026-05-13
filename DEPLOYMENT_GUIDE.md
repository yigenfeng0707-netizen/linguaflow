# LinguaFlow 部署指南

## 目录

1. [环境要求](#环境要求)
2. [快速部署](#快速部署)
3. [Supabase 配置](#supabase-配置)
4. [本地开发](#本地开发)
5. [生产部署](#生产部署)
6. [常见问题](#常见问题)

---

## 环境要求

- Node.js 18+
- Docker & Docker Compose
- Supabase 账号（免费）

---

## 快速部署

### 方式一：Docker 部署（推荐）

```bash
# 1. 克隆项目
cd /workspace/linguaflow

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写 Supabase 配置

# 3. 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方式二：手动部署

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env

# 3. 构建项目
npm run build

# 4. 启动服务
npm start
```

---

## Supabase 配置

### 步骤 1：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "New Project" 创建新项目
3. 填写项目名称和数据库密码
4. 选择离你最近的区域
5. 等待项目创建完成（约 2 分钟）

### 步骤 2：获取 API 密钥

1. 进入项目仪表板
2. 点击左侧菜单 "Settings" → "API"
3. 复制以下信息到 `.env` 文件：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 步骤 3：初始化数据库

1. 进入 "SQL Editor"
2. 点击 "New Query"
3. 复制 `supabase/schema.sql` 的内容
4. 点击 "Run" 执行

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 生产部署

### Docker Compose

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 环境变量

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公开密钥 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务密钥 | ✅ |

---

## 项目结构

```
linguaflow/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # 首页
│   │   ├── auth/            # 认证页面
│   │   ├── courses/         # 课程页面
│   │   ├── learn/           # 学习中心
│   │   └── community/       # 社区页面
│   ├── components/          # React 组件
│   │   ├── layout/          # 布局组件
│   │   ├── ui/              # UI 组件
│   │   └── learning/        # 学习模块组件
│   ├── lib/                 # 工具库
│   ├── types/               # TypeScript 类型
│   └── hooks/               # React Hooks
├── supabase/
│   └── schema.sql           # 数据库 Schema
├── public/                  # 静态资源
├── Dockerfile               # Docker 配置
├── docker-compose.yml       # Docker Compose 配置
├── deploy.sh                # 一键部署脚本
└── package.json             # 项目配置
```

---

## 功能模块

### 1. 用户认证
- 邮箱注册/登录
- 第三方登录（Google、GitHub）
- 密码找回

### 2. 课程系统
- 分级课程（A1-C2）
- 多语言支持（英语、日语、韩语等）
- 课程搜索和筛选

### 3. 学习模块
- 单词记忆
- 语法练习
- 听力训练
- 口语跟读

### 4. 进度追踪
- 学习统计
- 每日目标
- 连续学习天数

### 5. 社区系统
- 帖子发布
- 评论互动
- 热门话题

### 6. 成就系统
- 徽章收集
- 经验值系统
- 排行榜

---

## 常见问题

### Q: 如何重置数据库？

```bash
docker-compose down -v
docker-compose up -d
```

### Q: 如何查看应用日志？

```bash
docker-compose logs -f web
```

### Q: 如何更新代码后重新部署？

```bash
docker-compose up -d --build
```

### Q: 如何备份数据库？

```bash
docker exec linguaflow-db-1 pg_dump -U linguaflow linguaflow > backup.sql
```

---

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 库**: Tailwind CSS
- **状态管理**: Zustand
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth
- **容器化**: Docker & Docker Compose

---

## 联系支持

如有问题，请提交 Issue 或联系开发团队。
