# 🚀 LinguaFlow 公测部署指南

## 📋 部署概览

| 服务 | 平台 | 费用 | 状态 |
|------|------|------|------|
| 前端 | Vercel | 免费 | 待部署 |
| 后端 | Railway | 免费 | 待部署 |
| 数据库 | Supabase | 免费 | 待创建 |
| 域名 | Vercel 自带 | 免费 | 自动生成 |

---

## 第一步：创建 Supabase 数据库

1. 访问 👉 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 登录
4. 创建新组织 → 创建新项目
5. 填写项目名称：`linguaflow`
6. 选择地区：`East Asia (Singapore)`
7. 点击 "Create new project"
8. 等待数据库创建完成（约 1-2 分钟）

### 获取连接信息

项目创建后，进入 **Settings → API**：
- 复制 `Project URL` → 这是 `NEXT_PUBLIC_SUPABASE_URL`
- 复制 `anon public` → 这是 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 复制 `service_role secret` → 这是 `SUPABASE_SERVICE_ROLE_KEY`

### 导入数据库 Schema

进入 **SQL Editor → New query**，粘贴以下内容：

```sql
-- 用户扩展表
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  native_language TEXT DEFAULT 'zh',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程表
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  thumbnail_url TEXT,
  total_lessons INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程单元表
CREATE TABLE IF NOT EXISTS public.units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 课程表
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content JSONB,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 词汇表
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  example_sentence TEXT,
  language TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户词汇学习记录
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vocab_id)
);

-- 社区帖子表
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT DEFAULT 'general',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 评论表
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 成就表
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户成就表
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- 插入示例课程数据
INSERT INTO public.courses (title, description, language, level, total_lessons, duration_minutes, is_published) VALUES
('英语零基础入门', '从字母开始，循序渐进学习英语基础', 'en', 'beginner', 20, 300, true),
('日语五十音图', '掌握日语基础发音，打好日语学习根基', 'ja', 'beginner', 15, 200, true),
('韩语入门课程', '学习韩语发音和基础语法', 'ko', 'beginner', 18, 250, true),
('商务英语进阶', '职场英语沟通技巧与实战', 'en', 'intermediate', 25, 400, true);

-- 插入示例词汇
INSERT INTO public.vocabulary (word, translation, pronunciation, example_sentence, language, difficulty) VALUES
('hello', '你好', '/həˈloʊ/', 'Hello, how are you?', 'en', 'beginner'),
('thank you', '谢谢', '/θæŋk juː/', 'Thank you very much!', 'en', 'beginner'),
('こんにちは', '你好', 'konnichiwa', 'こんにちは、元気ですか？', 'ja', 'beginner'),
('ありがとう', '谢谢', 'arigatou', 'ありがとうございます', 'ja', 'beginner'),
('안녕하세요', '你好', 'annyeonghaseyo', '안녕하세요, 잘 지내세요?', 'ko', 'beginner'),
('감사합니다', '谢谢', 'gamsahamnida', '감사합니다!', 'ko', 'beginner');

-- 插入示例成就
INSERT INTO public.achievements (title, description, requirement_type, requirement_value, points) VALUES
('初学者', '完成第一堂课', 'lessons_completed', 1, 10),
('词汇达人', '学习50个单词', 'vocabulary_learned', 50, 50),
('坚持就是胜利', '连续学习7天', 'streak_days', 7, 30),
('社交达人', '发表第一篇帖子', 'posts_created', 1, 20);
```

点击 **Run** 执行。

---

## 第二步：部署前端到 Vercel

### 2.1 创建 Vercel 项目

1. 访问 👉 [https://vercel.com/new](https://vercel.com/new)
2. 点击 **Import Git Repository**
3. 选择 `yigenfeng0707-netizen/linguaflow`
4. 点击 **Import**

### 2.2 配置环境变量

在配置页面，添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |

### 2.3 部署

点击 **Deploy**，等待部署完成（约 2-3 分钟）。

部署成功后，你会获得一个类似 `https://linguaflow-xxxxx.vercel.app` 的域名。

---

## 第三步：部署后端到 Railway

### 3.1 创建 Railway 项目

1. 访问 👉 [https://railway.app](https://railway.app)
2. 使用 GitHub 登录
3. 点击 **New Project**
4. 选择 **Deploy from GitHub repo**
5. 选择 `linguaflow` 仓库
6. 点击 **Add Variables**，添加：
   - `SUPABASE_URL` = 你的 Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = 你的 Supabase service_role key
   - `JWT_SECRET` = 随机字符串（用于 JWT 签名）
   - `PORT` = `3001`

### 3.2 配置部署

1. 点击项目中的 **linguaflow** 服务
2. 进入 **Settings**
3. 设置 **Root Directory** 为 `api`
4. 设置 **Start Command** 为 `node server.js`

### 3.3 部署

点击 **Deploy**，等待部署完成。

部署成功后，你会获得一个类似 `https://linguaflow-api.up.railway.app` 的 API 地址。

---

## 第四步：更新前端配置

回到 Vercel 项目设置：

1. 进入 **Settings → Environment Variables**
2. 添加新变量：
   - `NEXT_PUBLIC_API_URL` = 你的 Railway API 地址
3. 点击 **Save**
4. 重新部署：进入 **Deployments**，点击 **Redeploy**

---

## ✅ 部署完成！

### 访问地址

- **前端**: `https://linguaflow-xxxxx.vercel.app`
- **后端 API**: `https://linguaflow-api.up.railway.app`

### 测试账号

注册一个新账号即可开始使用，所有数据都会保存在 Supabase 中。

---

## 🔧 可选：添加 CI/CD

在 GitHub 仓库中创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: echo "Auto deploy enabled"
```

---

## 📞 问题排查

| 问题 | 解决方案 |
|------|----------|
| 前端无法连接后端 | 检查 `NEXT_PUBLIC_API_URL` 是否正确设置 |
| 登录失败 | 检查 Supabase 环境变量是否正确 |
| 数据库连接错误 | 确认 Supabase 项目是否正常运行 |
| 部署失败 | 查看 Vercel/Railway 的部署日志 |

---

**🎉 现在你的 LinguaFlow 多语种在线教育平台已经上线公测了！**
