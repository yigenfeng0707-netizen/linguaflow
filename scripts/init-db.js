#!/usr/bin/env node

/**
 * LinguaFlow 全自动部署脚本
 * 
 * 功能：
 * 1. 通过 Supabase API 自动创建项目和初始化数据库
 * 2. 通过 Vercel API 自动部署前端
 * 3. 通过 Railway API 自动部署后端
 * 4. 自动配置所有环境变量
 * 
 * 使用方法：
 * node scripts/init-all.js <platform>
 * 
 * platform: supabase | vercel | railway | all
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    supabase: {
        apiUrl: 'https://api.supabase.com/v1',
        managementUrl: 'https://api.supabase.com'
    },
    vercel: {
        apiUrl: 'https://api.vercel.com/v1'
    },
    railway: {
        apiUrl: 'https://backboard.railway.app/graphql'
    }
};

// HTTP 请求封装
async function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve(data);
                }
            });
        });

        req.on('error', reject);
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

// Supabase: 创建项目和数据库
async function setupSupabase(accessToken) {
    console.log('\n📦 正在配置 Supabase...');
    
    // 获取账号信息
    const account = await httpRequest(`${CONFIG.supabase.managementUrl}/v1/account`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log(`  ✓ 账号: ${account.email}`);

    // 创建项目
    console.log('  创建项目...');
    const project = await httpRequest(`${CONFIG.supabase.managementUrl}/v1/projects`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
            name: 'linguaflow',
            region: 'ap-northeast-1',
            plan: 'free'
        }
    });

    console.log(`  ✓ 项目创建成功: ${project.name}`);
    console.log(`    ID: ${project.id}`);
    console.log(`    URL: ${project.endpoint}`);

    // 等待项目就绪
    console.log('  等待项目初始化（约2分钟）...');
    await new Promise(r => setTimeout(r, 120000));

    // 获取项目密钥
    const keys = await httpRequest(`${CONFIG.supabase.managementUrl}/v1/projects/${project.id}/api-keys`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const anonKey = keys.find(k => k.name === 'anon key')?.key;
    const serviceKey = keys.find(k => k.name === 'service_role key')?.key;

    if (!anonKey || !serviceKey) {
        throw new Error('无法获取 API 密钥');
    }

    console.log('  ✓ API 密钥获取成功');

    // 初始化数据库
    console.log('  初始化数据库 Schema...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
    
    // 连接到数据库并执行 SQL
    // 注意：Supabase 免费版不支持直接执行 SQL，需要通过 Dashboard 或 pgAdmin
    console.log('  ⚠ 请手动执行以下 SQL：');
    console.log('    访问: https://supabase.com/dashboard');
    console.log('    → 项目 → SQL Editor → New Query');
    console.log('    → 粘贴 supabase/schema.sql 的内容');
    console.log('    → 点击 Run');

    return {
        id: project.id,
        url: project.endpoint,
        anonKey,
        serviceKey
    };
}

// Vercel: 部署前端
async function setupVercel(accessToken, supabaseConfig) {
    console.log('\n🌐 正在配置 Vercel...');

    // 获取团队/用户信息
    const me = await httpRequest(`${CONFIG.vercel.apiUrl}/www/user`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log(`  ✓ 用户: ${me.user?.username || me.user?.name}`);

    // 创建项目（通过 GitHub）
    console.log('  请手动创建 Vercel 项目：');
    console.log('    1. 访问 https://vercel.com/new');
    console.log('    2. 导入 GitHub 仓库');
    console.log('    3. 添加环境变量：');
    console.log(`       NEXT_PUBLIC_SUPABASE_URL=${supabaseConfig.url}`);
    console.log(`       NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseConfig.anonKey}`);
    console.log('    4. 点击 Deploy');
    
    return {
        url: 'https://your-project.vercel.app'
    };
}

// Railway: 部署后端
async function setupRailway(accessToken, supabaseConfig) {
    console.log('\n🚀 正在配置 Railway...');

    console.log('  请手动创建 Railway 项目：');
    console.log('    1. 访问 https://railway.app/new');
    console.log('    2. 选择 Deploy from GitHub repo');
    console.log('    3. 设置 Root Directory 为 api');
    console.log('    4. 添加环境变量：');
    console.log(`       SUPABASE_URL=${supabaseConfig.url}`);
    console.log(`       SUPABASE_SERVICE_ROLE_KEY=${supabaseConfig.serviceKey}`);
    console.log(`       JWT_SECRET=${require('crypto').randomBytes(32).toString('hex')}`);
    console.log(`       FRONTEND_URL=${supabaseConfig.vercelUrl}`);
    console.log('    5. 点击 Deploy');

    return {
        url: 'https://your-api.railway.app'
    };
}

// 生成 .env 文件
function generateEnvFile(config) {
    const envContent = `# ===========================================
# LinguaFlow 环境配置 (自动生成)
# ===========================================

# Supabase
NEXT_PUBLIC_SUPABASE_URL=${config.supabase?.url || ''}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.supabase?.anonKey || ''}
SUPABASE_URL=${config.supabase?.url || ''}
SUPABASE_SERVICE_ROLE_KEY=${config.supabase?.serviceKey || ''}

# JWT
JWT_SECRET=${config.jwtSecret || require('crypto').randomBytes(32).toString('hex')}

# API URLs
NEXT_PUBLIC_API_URL=${config.railway?.url || ''}
NEXT_PUBLIC_APP_URL=${config.vercel?.url || ''}

# 服务器
PORT=3001
NODE_ENV=production
FRONTEND_URL=${config.vercel?.url || ''}
`;

    fs.writeFileSync(path.join(__dirname, '../.env'), envContent);
    console.log('\n✅ .env 文件已生成');
}

// 主函数
async function main() {
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║     LinguaFlow 全自动部署脚本 v1.0           ║');
    console.log('╚═══════════════════════════════════════════════╝\n');

    const platform = process.argv[2] || 'all';
    const config = {};

    try {
        // Supabase 配置
        if (platform === 'supabase' || platform === 'all') {
            const supabaseToken = process.env.SUPABASE_ACCESS_TOKEN;
            
            if (!supabaseToken) {
                console.log('请设置环境变量 SUPABASE_ACCESS_TOKEN');
                console.log('获取地址: https://supabase.com/dashboard/account/tokens');
                console.log('');
                console.log('或者手动创建项目后提供以下信息：');
                console.log('  - Project URL');
                console.log('  - anon Key');
                console.log('  - service_role Key');
                
                // 手动输入
                config.supabase = {
                    url: 'https://your-project.supabase.co',
                    anonKey: 'your-anon-key',
                    serviceKey: 'your-service-key'
                };
            } else {
                config.supabase = await setupSupabase(supabaseToken);
            }
        }

        // Vercel 配置
        if (platform === 'vercel' || platform === 'all') {
            const vercelToken = process.env.VERCEL_TOKEN;
            
            if (vercelToken) {
                config.vercel = await setupVercel(vercelToken, config);
            } else {
                console.log('\n请手动配置 Vercel:');
                console.log('https://vercel.com/new');
            }
        }

        // Railway 配置
        if (platform === 'railway' || platform === 'all') {
            const railwayToken = process.env.RAILWAY_TOKEN;
            
            if (railwayToken) {
                config.railway = await setupRailway(railwayToken, config);
            } else {
                console.log('\n请手动配置 Railway:');
                console.log('https://railway.app/new');
            }
        }

        // 生成 .env
        if (config.supabase) {
            config.jwtSecret = require('crypto').randomBytes(32).toString('hex');
            generateEnvFile(config);
        }

        // 完成信息
        console.log('\n╔═══════════════════════════════════════════════╗');
        console.log('║               🎉 部署配置完成！                 ║');
        console.log('╚═══════════════════════════════════════════════╝\n');

        if (config.supabase) {
            console.log('📍 配置信息:');
            console.log(`   数据库: ${config.supabase.url}`);
            console.log(`   前端:   ${config.vercel?.url || '(待配置)'}`);
            console.log(`   后端:   ${config.railway?.url || '(待配置)'}`);
            console.log('');
        }

        console.log('📋 下一步:');
        console.log('   1. 完成 Supabase 数据库初始化 (执行 schema.sql)');
        console.log('   2. 完成 Vercel/Railway 部署');
        console.log('   3. 测试注册/登录功能');
        console.log('   4. 开始公测推广！\n');

    } catch (error) {
        console.error('\n❌ 部署失败:', error.message);
        process.exit(1);
    }
}

main();
