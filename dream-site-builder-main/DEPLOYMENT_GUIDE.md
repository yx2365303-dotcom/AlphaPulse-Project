# 网站功能完善 - 部署指南

## 概述

已完成两个主要功能的开发：
1. **用户登录验证** - 与Supabase用户表集成，确保只有授权用户可以登录
2. **真实股票数据展示** - 从Supabase数据库拉取实时股票数据

---

## 第一步：执行数据库脚本 ⚠️ 必须先执行

在使用网站功能之前，需要先在Supabase中创建用户表。

### 1. 登录 Supabase 控制台

访问：https://supabase.com/dashboard/project/iuwwevhgjzqbnuclkate

### 2. 打开 SQL Editor

- 在左侧菜单中点击 **SQL Editor**
- 点击 **New Query** 创建新查询

### 3. 执行用户表脚本

复制 `supabase/user_table.sql` 文件的全部内容，粘贴到SQL编辑器中，然后点击 **Run** 执行。

该脚本会创建：
- ✅ `public.users` 用户信息表
- ✅ `public.user_activity_logs` 用户活动日志表
- ✅ 自动触发器（注册时自动创建用户记录）
- ✅ RLS安全策略（行级安全）

### 4. 验证表创建成功

执行以下查询确认表已创建：
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_activity_logs');
```

应该看到两个表名。

---

## 第二步：理解新功能

### 1. 用户认证增强

**文件：** `src/hooks/useAuth.tsx`

**新增功能：**
- ✅ 登录时验证用户是否存在于 `public.users` 表
- ✅ 如果用户不在数据库中，拒绝登录并显示提示
- ✅ 自动记录用户登录、注册、退出活动
- ✅ 注册时自动创建用户记录（通过数据库触发器）

**工作流程：**
```
用户注册 → Supabase Auth → 触发器自动创建users表记录 → 记录注册日志
用户登录 → Supabase Auth → 验证users表存在 → 记录登录日志 → 登录成功
          ↓ (如果不存在)
          拒绝登录，提示"用户账号不存在，请联系管理员"
```

### 2. 数据服务层

**文件：** `src/services/dataService.ts`

**提供的服务：**
- `fetchLimitStocks()` - 获取涨停股票列表
- `fetchLimitSteps()` - 获取连板天梯
- `fetchTopList()` - 获取龙虎榜明细
- `fetchTopInst()` - 获取机构席位
- `fetchSectors()` - 获取板块数据
- `fetchKplList()` - 获取科创板数据
- `fetchMarketOverview()` - 获取市场概览
- `verifyUserExists()` - 验证用户是否存在
- `getUserProfile()` - 获取用户信息
- `updateUserProfile()` - 更新用户信息
- `logUserActivity()` - 记录用户活动

### 3. React Query 数据Hooks

**文件：** `src/hooks/useStockData.tsx`

**提供的Hooks：**
- `useLimitStocks()` - 涨停数据
- `useLimitSteps()` - 连板天梯
- `useTopList()` - 龙虎榜
- `useTopInst()` - 机构席位
- `useSectors()` - 板块数据
- `useMarketOverview()` - 市场概览
- `useStockDataBundle()` - 一次性获取所有数据

**特性：**
- ✅ 自动缓存（5分钟内不重复请求）
- ✅ 自动刷新（每10分钟自动更新）
- ✅ 错误处理和重试
- ✅ 加载状态管理

### 4. 主页更新

**文件：** `src/pages/Index.tsx`

**变更：**
- ❌ 移除 mock 数据导入
- ✅ 使用 `useStockDataBundle()` 获取真实数据
- ✅ 添加加载状态展示
- ✅ 添加错误状态展示
- ✅ 自动根据选择的日期获取对应数据

---

## 第三步：测试功能

### 启动开发服务器

```bash
cd "c:\Users\Lenovo\Documents\Obsidian Vault\AlphaPulse Project\dream-site-builder-main"
npm run dev
```

### 测试用户认证

1. **测试注册：**
   - 访问注册页面
   - 填写邮箱、密码、用户名
   - 点击注册
   - ✅ 应该看到 "注册成功，请检查邮箱验证"
   - ✅ 数据库 `users` 表应该有新记录

2. **测试登录（已注册用户）：**
   - 使用注册的邮箱和密码登录
   - ✅ 应该成功登录
   - ✅ `user_activity_logs` 表记录登录日志

3. **测试登录（未注册用户）：**
   - 直接在 Supabase Auth 中创建用户（不通过网站注册）
   - 尝试使用该账号登录
   - ❌ 应该被拒绝，显示 "用户账号不存在"

### 测试股票数据展示

1. **访问首页：**
   - 登录后进入首页
   - ✅ 应该看到加载动画
   - ✅ 加载完成后显示真实股票数据

2. **切换日期：**
   - 点击日期选择器
   - 选择不同的交易日
   - ✅ 数据应该自动刷新

3. **切换标签页：**
   - 点击 "打板专题"、"龙虎榜"、"板块风口"
   - ✅ 各标签页显示对应的真实数据

4. **检查数据刷新：**
   - 等待10分钟
   - ✅ 数据应该自动刷新（可以在开发者工具Network中看到新的请求）

---

## 数据库表结构

### users 表
```sql
id            UUID (主键，关联 auth.users)
email         VARCHAR(255) UNIQUE
username      VARCHAR(50) UNIQUE
full_name     VARCHAR(100)
avatar_url    TEXT
created_at    TIMESTAMPTZ
updated_at    TIMESTAMPTZ
```

### user_activity_logs 表
```sql
id            BIGSERIAL (主键)
user_id       UUID (外键 → users.id)
action        VARCHAR(50)  -- 'login', 'logout', 'signup'
description   TEXT
ip_address    INET
user_agent    TEXT
created_at    TIMESTAMPTZ
```

---

## 技术架构

```
用户界面 (React Components)
    ↓
React Query Hooks (useStockData.tsx)
    ↓
数据服务层 (dataService.ts)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase PostgreSQL 数据库
```

---

## 环境变量

确保 `.env` 文件包含以下配置：

```env
VITE_SUPABASE_URL=https://iuwwevhgjzqbnuclkate.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=iuwwevhgjzqbnuclkate
```

---

## 常见问题

### Q1: 登录失败提示 "用户账号不存在"
**A:** 该用户只在 `auth.users` 中存在，但不在 `public.users` 中。需要通过网站注册，或手动在数据库中添加记录。

### Q2: 数据显示为空
**A:** 检查以下几点：
1. 确保 Tushare 历史数据回填已完成
2. 检查数据库表中是否有对应日期的数据
3. 查看浏览器控制台是否有错误信息

### Q3: 数据一直加载中
**A:** 可能的原因：
1. 网络连接问题
2. Supabase API 限流
3. 数据库查询超时

查看浏览器开发者工具 → Network 标签，检查请求状态。

### Q4: RLS 权限错误
**A:** 确保已执行 `user_table.sql` 中的所有 RLS 策略。可以临时禁用RLS测试：
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

---

## 性能优化建议

1. **数据缓存：** React Query 已配置5分钟缓存
2. **按需加载：** 可以为不同标签页单独请求数据
3. **数据分页：** 对于大量数据，建议添加分页功能
4. **索引优化：** 确保数据库表在 `trade_date` 字段上有索引

---

## 后续扩展

可以考虑添加的功能：
- 📊 数据可视化图表（K线图、涨跌分布）
- 🔔 价格提醒和推送通知
- 📱 移动端适配优化
- 🎯 自选股收藏功能
- 📈 历史数据回测
- 🤖 AI 分析和预测

---

## 支持

如遇问题，请检查：
1. 浏览器控制台错误日志
2. Supabase 控制台 Logs 页面
3. 网络请求状态（开发者工具 Network）

---

**开发完成时间：** 2025-01-XX
**技术栈：** React 18 + TypeScript + Supabase + TanStack Query + Shadcn UI
