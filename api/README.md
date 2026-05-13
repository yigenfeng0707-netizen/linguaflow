# LinguaFlow Backend API

后端 RESTful API 服务，基于 Node.js + Express + Supabase。

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户

### 课程
- `GET /api/courses` - 课程列表
- `GET /api/courses/:id` - 课程详情
- `GET /api/courses/:courseId/lessons/:lessonId` - 课程单元

### 用户
- `GET /api/users/stats` - 用户统计
- `PATCH /api/users/profile` - 更新资料
- `GET /api/users/learning-path` - 学习路径

### 学习
- `POST /api/learning/progress` - 记录进度
- `GET /api/learning/progress` - 获取进度
- `POST /api/learning/vocabulary` - 记录单词

### 社区
- `GET /api/community/posts` - 帖子列表
- `POST /api/community/posts` - 创建帖子
- `GET /api/community/posts/:id` - 帖子详情
- `POST /api/community/posts/:id/like` - 点赞
- `POST /api/community/posts/:id/comments` - 评论
- `GET /api/community/topics` - 热门话题

## 快速开始

```bash
cd api
npm install
npm run dev
```

## 生产部署

```bash
npm start
```
