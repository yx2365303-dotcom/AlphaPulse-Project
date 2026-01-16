# Tushare 数据采集程序

标准化、模块化的 Tushare 数据采集项目，适用于生产环境和定时任务。

## 项目结构

```
tushare_program/
├── config/              # 配置模块
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
├── main.py              # 统一入口（推荐）
├── run.py               # 同 main.py
├── .env                 # 环境变量（不提交）
├── .env.example         # 环境变量模板
└── requirements.txt     # 依赖
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写：

```env
TUSHARE_TOKEN=你的token
SUPABASE_URL=你的supabase地址
SUPABASE_KEY=你的service_role_key
TRADE_DATE=          # 可选，留空使用当天
```

### 3. 运行

```bash
# 全量抓取（推荐）
python main.py

# 仅抓取个股日线
python main.py --daily

# 仅抓取龙虎榜/涨停等日度数据
python main.py --concepts

# 仅抓取概念列表等元数据
python main.py --meta

# 仅抓取热门板块详细数据（前10个）
python main.py --hot --top-n 10
```

## 数据表清单

### 已实现的接口

| 接口 | 表名 | 说明 | 数据类型 |
|------|------|------|----------|
| `daily` | equity_daily | 个股日线行情 | 日度 |
| `top_list` | top_list | 龙虎榜每日明细 | 日度 |
| `top_inst` | top_inst | 龙虎榜机构明细 | 日度 |
| `limit_list_ths` | limit_list_ths | 同花顺涨停池 | 日度 |
| `limit_list_d` | limit_list_d | 涨跌停炸板 | 日度 |
| `limit_step` | limit_step | 连板天梯 | 日度 |
| `limit_cpt_list` | limit_cpt_list | 最强板块 | 日度 |
| `kpl_list` | kpl_list | 开盘啦涨停 | 日度 |
| `kpl_concept` | kpl_concept | 开盘啦题材 | 日度 |
| `ths_index` | ths_index | 同花顺概念列表 | 元数据 |
| `ths_member` | ths_member | 板块成分股 | 元数据 |
| `ths_daily` | ths_daily | 板块指数日线 | 日度 |

### 表结构参考

详见 [API_FIELDS_MAPPING.md](API_FIELDS_MAPPING.md)

## 定时任务配置

### Windows 任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务
3. 触发器：每天 16:00（收盘后）
4. 操作：启动程序
   - 程序：`python.exe`（或虚拟环境中的完整路径）
   - 参数：`main.py`
   - 起始于：`C:\Users\Lenovo\Documents\Obsidian Vault\AlphaPulse Project\tushare_program`

### Linux Cron

```bash
# 每天 16:00 运行
0 16 * * * cd /path/to/tushare_program && python3 main.py >> logs/daily.log 2>&1
```

### 使用 Python 定时任务

```python
# scheduler.py
import schedule
import time
from main import main

schedule.every().day.at("16:00").do(main)

while True:
    schedule.run_pending()
    time.sleep(60)
```

## 常见问题

### 1. 字段不匹配错误

**错误信息**: `Could not find the 'xxx' column`

**解决**: 检查 Supabase 表结构，参考 [API_FIELDS_MAPPING.md](API_FIELDS_MAPPING.md) 添加缺失字段

### 2. NaN 序列化错误

**错误信息**: `Out of range float values are not JSON compliant`

**解决**: 已自动处理，如仍有问题请检查 `utils/cleaner.py`

### 3. 唯一约束冲突

**错误信息**: `ON CONFLICT DO UPDATE command cannot affect row a second time`

**解决**: 检查数据库主键/唯一约束设置，参考文档调整

### 4. 当日无数据

部分接口（如龙虎榜）当天可能无数据，这是正常现象。程序会自动跳过并记录警告。

## 开发指南

### 添加新接口

1. 在 `tasks/daily_tasks.py` 或 `tasks/meta_tasks.py` 添加任务
2. 在 Supabase 创建对应表结构
3. 运行测试

### 日志级别

在 `.env` 中设置：

```env
LOG_LEVEL=DEBUG  # DEBUG, INFO, WARNING, ERROR
```

### 测试单个接口

```python
from core import DataFetcher

fetcher = DataFetcher()
fetcher.fetch_and_save('limit_step', 'limit_step', trade_date='20250110')
```

## 性能优化

- 网络优化：已配置 VPN 直连和超时重试
- 数据清洗：三层 NaN 过滤机制
- 错误重试：默认 3 次，延迟 2 秒
- 接口限频：热门板块抓取间隔 0.5 秒

## 许可

本项目仅供学习和个人使用，请遵守 Tushare 的使用条款。

## 历史版本

- `main.py.bak`: 原个股日线抓取版本
- `main1.py.bak`: 原多接口抓取版本
- 当前版本：模块化重构版本
