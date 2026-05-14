# 🚀 Vercel CLI 一键部署指南

## 快速部署（3步完成）

### 第 1 步：安装 Vercel CLI

打开终端/命令行，执行：

```bash
npm install -g vercel
```

### 第 2 步：登录 Vercel

```bash
vercel login
```

执行后会自动打开浏览器，点击 **"Authorize"** 授权即可。

### 第 3 步：部署项目

```bash
# 进入项目目录
cd linguaflow

# 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 输入: https://ivralexnwkklhgyhgofa.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# 输入你的 anon public key

# 部署到生产环境
vercel --prod
```

---

## 完整命令（复制粘贴执行）

```bash
# 安装
npm install -g vercel

# 登录（浏览器授权）
vercel login

# 进入项目
cd linguaflow

# 配置环境变量
echo "https://ivralexnwkklhgyhgofa.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "你的_anon_key_here" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# 部署
vercel --prod --yes
```

---

## 部署完成后

Vercel 会输出类似：
```
🔍  Inspect: https://vercel.com/yourname/linguaflow/xxxxx
✅  Production: https://linguaflow-xxxxx.vercel.app
```

把 `https://linguaflow-xxxxx.vercel.app` 这个链接发给我！
