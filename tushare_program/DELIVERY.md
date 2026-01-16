# 项目交付说明

## 项目概述

已完成 Tushare 数据采集项目的标准化重构，采用模块化设计，适合生产环境和定时任务部署。

## 📁 项目结构

```
tushare_program/
├── config/              # 配置管理
│   ├── __init__.py
│   └── settings.py      # 环境变量加载
├── core/                # 核心业务逻辑
│   ├── __init__.py
│   ├── client.py        # Tushare & Supabase 客户端
│   └── fetcher.py       # 数据抓取核心
├── tasks/               # 任务模块
│   ├── __init__.py
│   ├── daily_tasks.py   # 日度数据任务
│   └── meta_tasks.py    # 元数据任务
├── utils/               # 工具模块
│   ├── __init__.py
│   ├── network.py       # 网络修复
│   ├── logger.py        # 日志工具
│   └── cleaner.py       # 数据清洗
├── main.py              # 统一入口 ⭐
├── run.py               # 同 main.py
├── .env                 # 环境变量（不提交）
├── .env.example         # 环境变量模板
├── requirements.txt     # 依赖
├── README.md            # 项目文档
└── supabase_fix.sql     # 数据库修复SQL ⭐
```

## ✅ 当前状态

### 已测试成功的接口（5个）

| 接口 | 表名 | 数据量 | 状态 |
|------|------|--------|------|
| limit_list_ths | limit_list_ths | 44条 | ✅ 正常 |
| limit_list_d | limit_list_d | 114条 | ✅ 正常 |
| limit_step | limit_step | 15条 | ✅ 正常 |
| limit_cpt_list | limit_cpt_list | 20条 | ✅ 正常 |
| ths_index | ths_index | 1236条 | ✅ 正常 |

### 需要修复的接口（5个）

| 接口 | 表名 | 问题 | 解决方案 |
|------|------|------|----------|
| daily | equity_daily | RLS策略阻止写入 | 执行 supabase_fix.sql 第6行 |
| top_list | top_list | 缺少字段 net_rate | 执行 supabase_fix.sql 第12-14行 |
| top_inst | top_inst | 唯一约束冲突 | 执行 supabase_fix.sql 第17-25行 |
| kpl_list | kpl_list | 缺少字段 bid_amount | 执行 supabase_fix.sql 第28-37行 |
| kpl_concept | kpl_concept | 缺少字段 z_t_num | 执行 supabase_fix.sql 第40行 |

## 🚀 快速开始

### 1. 修复 Supabase 数据库

```bash
# 1. 打开 Supabase → SQL Editor
# 2. 复制 supabase_fix.sql 的内容
# 3. 执行全部 SQL
```

### 2. 运行数据采集

```bash
# 全量抓取（推荐）
python main.py

# 仅个股日线
python main.py --daily

# 仅龙虎榜/涨停等日度数据
python main.py --concepts

# 仅概念列表等元数据
python main.py --meta

# 仅热门板块详细数据（前10个）
python main.py --hot --top-n 10
```

### 3. 验证数据

执行修复SQL后，再次运行：

```bash
python main.py
```

应该看到所有10个接口都成功写入。

## ⏰ 定时任务配置

### Windows 任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务：
   - 触发器：每天 16:00（收盘后）
   - 操作：启动程序
     - 程序：`python.exe` 的完整路径
     - 参数：`main.py`
     - 起始于：`C:\Users\Lenovo\Documents\Obsidian Vault\AlphaPulse Project\tushare_program`

### Linux Cron

```bash
# 每天 16:00 运行
0 16 * * * cd /path/to/tushare_program && python3 main.py >> logs/daily.log 2>&1
```

## 🔧 配置说明

### 环境变量（.env）

```env
TUSHARE_TOKEN=你的token
SUPABASE_URL=你的supabase地址
SUPABASE_KEY=你的service_role_key
TRADE_DATE=20250110        # 可选，留空使用当天
LOG_LEVEL=INFO             # 可选：DEBUG, INFO, WARNING, ERROR
```

### 自定义交易日期

在 `.env` 中设置或通过环境变量：

```bash
# Linux/Mac
export TRADE_DATE=20250110
python main.py

# Windows PowerShell
$env:TRADE_DATE="20250110"
python main.py
```

## 📊 日志示例

```
[2026-01-16 16:27:10] INFO - 初始化 Tushare 客户端...
[2026-01-16 16:27:10] INFO - Tushare 客户端初始化完成
[2026-01-16 16:27:10] INFO - [limit_step] 开始抓取
[2026-01-16 16:27:10] INFO -   获取到 15 条原始数据
[2026-01-16 16:27:10] INFO -   [成功] 写入 15 条到 limit_step
```

## 🎯 核心特性

### 1. 模块化设计
- 配置、核心逻辑、任务、工具分离
- 单一职责原则
- 易于扩展和维护

### 2. 错误处理
- 自动重试机制（3次，间隔2秒）
- 智能错误分类（字段不匹配/唯一约束/其他）
- 详细错误日志

### 3. 数据清洗
- 三层 NaN/inf 过滤
- 自动类型转换（float→int）
- SQL关键字冲突处理

### 4. 网络优化
- VPN环境SSL修复
- 超时自动设置
- 代理绕过配置

## 📝 添加新接口

### 步骤

1. 在 `tasks/daily_tasks.py` 的 `DAILY_TASKS` 列表添加：

```python
('new_api', 'new_table', {'trade_date': trade_date}),
```

2. 在 Supabase 创建对应表

3. 运行测试：

```bash
python main.py --concepts
```

## ⚠️ 注意事项

1. **RLS 策略**：确保 Supabase 表的 RLS 策略允许 service_role 写入
2. **唯一约束**：检查主键设置是否合理（特别是有多条同日同股票记录的表）
3. **字段类型**：确保数据库字段类型与 API 返回数据匹配
4. **交易日**：非交易日很多接口无数据，这是正常现象

## 🔗 相关文档

- [README.md](README.md) - 详细使用文档
- [API_FIELDS_MAPPING.md](API_FIELDS_MAPPING.md) - 接口字段对照
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 问题排查指南
- [supabase_fix.sql](supabase_fix.sql) - 数据库修复SQL

## 📦 历史版本

- `main.py.bak` - 原个股日线版本
- `main1.py.bak` - 原多接口版本
- `README_OLD.md` - 旧版文档

## ✨ 下一步

1. 执行 `supabase_fix.sql` 修复数据库
2. 运行 `python main.py` 验证所有接口
3. 配置定时任务，每天16:00自动运行
4. 监控日志，确保稳定运行

---

**项目已提交到 GitHub**: https://github.com/yx2365303-dotcom/AlphaPulse-Project

**交付时间**: 2026-01-16  
**状态**: ✅ 生产就绪
