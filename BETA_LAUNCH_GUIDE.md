# LinguaFlow 公测版上线指南

## 🎯 目标
快速上线免费公测版，收集用户反馈，验证市场需求。

---

## 第一步：准备环境（10分钟）

### 1.1 注册必要账号（全部免费）

| 服务 | 用途 | 费用 |
|------|------|------|
| **GitHub** | 代码托管 + CI/CD | 免费 |
| **Supabase** | 数据库 + 认证 | 免费额度 |
| **Vercel** | 前端托管 | 免费 |
| **Railway/Render** | 后端API托管 | 免费额度 |

### 1.2 创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 填写项目名称：`linguaflow-beta`
4. 选择区域：Asia Pacific (Singapore)
5. 等待创建完成（约2分钟）

### 1.3 初始化数据库

进入 Supabase 项目 → SQL Editor → New Query，粘贴 `supabase/schema.sql` 内容，点击 Run。

---

## 第二步：部署前端（5分钟）

### 2.1 部署到 Vercel（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd /workspace/linguaflow
vercel --prod
```

### 2.2 配置环境变量

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

---

## 第三步：部署后端 API（5分钟）

### 3.1 部署到 Railway（推荐，免费）

1. 访问 https://railway.app
2. 用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的仓库
5. 添加环境变量：
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   JWT_SECRET=your-random-secret-key
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. 自动部署完成！

### 3.2 或者部署到 Render

1. 访问 https://render.com
2. 创建 Web Service
3. 选择你的 GitHub 仓库
4. 配置：
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `api`
5. 添加环境变量（同上）

---

## 第四步：配置域名（可选，10分钟）

### 4.1 购买域名
- 推荐：阿里云/腾讯云/Namecheap
- 费用：约 ¥50-100/年

### 4.2 配置 DNS

在域名管理后台添加 CNAME 记录：

| 类型 | 主机记录 | 记录值 |
|------|---------|--------|
| CNAME | www | cname.vercel-dns.com |
| CNAME | api | your-railway-app.up.railway.app |

### 4.3 在 Vercel/Railway 绑定自定义域名

---

## 第五步：公测推广（立即开始）

### 5.1 创建公测邀请页面

在首页添加公测入口：
```
🎉 LinguaFlow 公测开启！
免费体验所有功能，前1000名用户赠送高级会员
立即注册 →
```

### 5.2 推广渠道

| 渠道 | 方式 | 预期效果 |
|------|------|---------|
| 小红书 | 发布学习笔记 | 精准用户 |
| B站 | 学习vlog/教程 | 年轻用户 |
| 知乎 | 回答语言学习问题 | 高质量用户 |
| 微信群 | 学习打卡群 | 高粘性用户 |
| 校园 | 大学社团合作 | 学生用户 |

### 5.3 裂变机制

- 邀请好友注册，双方各得7天高级会员
- 连续学习7天，解锁专属徽章
- 分享学习成果到社交媒体，获得积分

---

## 第六步：收集反馈

### 6.1 内置反馈入口

在应用中添加：
- 「意见反馈」按钮
- 用户满意度评分（1-5星）
- 功能需求投票

### 6.2 建立用户社群

- 微信群：每日学习打卡
- Discord/飞书：产品讨论
- 定期问卷：功能需求调研

### 6.3 关键指标监控

| 指标 | 目标 | 监控方式 |
|------|------|---------|
| 日活跃用户(DAU) | >1000 | Supabase Analytics |
| 注册转化率 | >20% | Vercel Analytics |
| 7日留存率 | >40% | 自建统计 |
| 付费转化率 | >3% | 支付系统 |
| NPS评分 | >50 | 用户问卷 |

---

## 第七步：迭代优化

### 7.1 每周迭代节奏

- **周一**： review 上周数据
- **周二-四**： 开发新功能/修复bug
- **周五**： 发布更新
- **周末**： 收集反馈

### 7.2 优先级排序

根据用户反馈数量排序：
1. 🔥 高频需求（>50人反馈）
2. ⭐ 中频需求（10-50人反馈）
3. 💡 低频需求（<10人反馈）

---

## 💰 公测期成本

| 项目 | 费用 | 说明 |
|------|------|------|
| 域名 | ¥60/年 | 可选 |
| Supabase | ¥0 | 免费额度足够 |
| Vercel | ¥0 | 免费额度足够 |
| Railway/Render | ¥0 | 免费额度足够 |
| 推广费用 | ¥0-1000 | 可选 |
| **总计** | **¥0-1060** | 最低可0成本启动 |

---

## ⚡ 快速启动检查清单

- [ ] Supabase 项目创建完成
- [ ] 数据库 Schema 初始化完成
- [ ] 前端部署到 Vercel
- [ ] 后端部署到 Railway/Render
- [ ] 环境变量配置正确
- [ ] 注册/登录功能测试通过
- [ ] 核心学习功能测试通过
- [ ] 反馈入口已添加
- [ ] 用户社群已建立
- [ ] 推广文案已准备

---

## 🚀 上线！

完成以上步骤后，你的 LinguaFlow 公测版就正式上线了！

访问地址：
- 前端：https://your-app.vercel.app
- API：https://your-api.railway.app
- 数据库：https://supabase.com/dashboard

祝公测顺利！🎉
