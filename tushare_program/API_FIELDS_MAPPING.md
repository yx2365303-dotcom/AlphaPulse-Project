# Tushare 接口字段映射文档

## 当前成功写入的接口 ✅

### 1. limit_step - 连板天梯
- ts_code
- name
- trade_date
- nums

### 2. limit_cpt_list - 最强板块
- ts_code
- name
- trade_date
- days
- up_stat
- cons_nums
- up_nums
- pct_chg
- rank

## 需要调整数据库表的接口 ❌

### 3. top_list - 龙虎榜每日明细
**API返回字段：**
- trade_date
- ts_code
- name
- close
- pct_change
- turnover_rate
- amount
- l_sell
- l_buy
- l_amount
- net_amount
- net_rate
- **amount_rate** ⚠️ 数据库缺少
- **float_values** ⚠️ 数据库缺少
- reason

**建议：** 在 Supabase `top_list` 表中添加 `amount_rate` 和 `float_values` 字段（float8 类型）

---

### 4. top_inst - 龙虎榜机构明细
**API返回字段：**
- trade_date
- ts_code
- exalter
- buy
- buy_rate
- sell
- sell_rate
- net_buy
- side
- reason

**额外问题：** ON CONFLICT 错误，可能是 unique 约束定义有问题（比如只用 trade_date+ts_code，但同一天同一股票有多条机构记录）

**建议：** 修改主键或唯一约束为 `(trade_date, ts_code, exalter)`

---

### 5. limit_list_ths - 同花顺涨跌停
**API返回字段：**
- trade_date
- ts_code
- name
- price
- pct_chg
- open_num
- lu_desc
- limit_type
- tag
- status
- limit_order
- limit_amount
- turnover_rate
- **free_float** ⚠️ 数据库缺少
- **lu_limit_order** ⚠️ 数据库缺少
- **limit_up_suc_rate** ⚠️ 数据库缺少
- **turnover** ⚠️ 数据库缺少
- **market_type** ⚠️ 数据库缺少

**建议：** 添加缺失字段（均为 float8 或 varchar 类型）

---

### 6. limit_list_d - 涨跌停炸板数据
**API返回字段：**
- trade_date
- ts_code
- industry
- name
- close
- pct_chg
- amount
- limit_amount
- **float_mv** ⚠️ 数据库缺少
- **total_mv** ⚠️ 数据库缺少
- **turnover_ratio** ⚠️ 数据库缺少
- **fd_amount** ⚠️ 数据库缺少
- **first_time** ⚠️ 数据库缺少
- **last_time** ⚠️ 数据库缺少
- **open_times** ⚠️ 数据库缺少
- **up_stat** ⚠️ 数据库缺少
- **limit_times** ⚠️ 数据库缺少
- **limit_flag** ⚠️ 数据库缺少

**建议：** 添加所有缺失字段

---

### 7. kpl_list - 开盘啦涨停
**API返回字段：**
- ts_code
- name
- trade_date
- lu_time
- ld_time
- open_time
- last_time
- lu_desc
- tag
- theme
- net_change
- bid_amount
- status
- bid_change
- bid_turnover
- lu_bid_vol
- pct_chg
- bid_pct_chg
- rt_pct_chg
- limit_order
- **amount** ⚠️ 数据库缺少
- turnover_rate
- free_float
- lu_limit_order

**建议：** 添加 `amount` 字段（float8）

---

### 8. kpl_concept - 开盘啦题材
**API返回字段：**
- trade_date
- ts_code
- name
- z_t_num
- **up_num** ⚠️ 数据库缺少

**建议：** 添加 `up_num` 字段（integer）

---

### 9. ths_index - 同花顺概念列表
**API返回字段：**
- ts_code
- name
- count
- exchange
- **list_date** ⚠️ 数据库缺少
- type

**建议：** 添加 `list_date` 字段（varchar 或 date）

---

### 10. ths_member - 同花顺板块成分
**API返回字段：**
- ts_code (板块代码)
- **con_code** ⚠️ 数据库缺少（成分股代码）
- **con_name** ⚠️ 数据库缺少（成分股名称）

**建议：** 添加 `con_code` 和 `con_name` 字段

---

### 11. ths_daily - 同花顺板块指数日线
**API返回字段：**
- ts_code
- trade_date
- open
- high
- low
- close
- pre_close
- **avg_price** ⚠️ 数据库缺少
- change
- pct_change
- **vol** ⚠️ 数据库缺少
- **turnover_rate** ⚠️ 数据库缺少

**建议：** 添加 `avg_price`、`vol`、`turnover_rate` 字段

---

## 快速修复方案

### 方案1：调整数据库表（推荐）
根据上述文档，在 Supabase 中为每个表添加缺失字段。

### 方案2：只抓取已有表/字段
修改 `DAILY_TASKS` 列表，注释掉暂时无法写入的接口，只保留 `limit_step` 和 `limit_cpt_list`。

### 方案3：动态字段过滤（折中方案）
代码中检测数据库已有字段，自动过滤掉多余字段再写入。

## SQL 示例（添加缺失字段）

```sql
-- top_list 添加字段
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS amount_rate float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS float_values float8;

-- limit_list_ths 添加字段
ALTER TABLE limit_list_ths ADD COLUMN IF NOT EXISTS free_float float8;
ALTER TABLE limit_list_ths ADD COLUMN IF NOT EXISTS lu_limit_order float8;
ALTER TABLE limit_list_ths ADD COLUMN IF NOT EXISTS limit_up_suc_rate float8;
ALTER TABLE limit_list_ths ADD COLUMN IF NOT EXISTS turnover float8;
ALTER TABLE limit_list_ths ADD COLUMN IF NOT EXISTS market_type varchar(10);

-- kpl_list 添加字段
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS amount float8;

-- kpl_concept 添加字段
ALTER TABLE kpl_concept ADD COLUMN IF NOT EXISTS up_num integer;

-- ths_index 添加字段
ALTER TABLE ths_index ADD COLUMN IF NOT EXISTS list_date varchar(20);

-- ths_member 添加字段
ALTER TABLE ths_member ADD COLUMN IF NOT EXISTS con_code varchar(20);
ALTER TABLE ths_member ADD COLUMN IF NOT EXISTS con_name varchar(100);

-- ths_daily 添加字段
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS avg_price float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS vol float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS turnover_rate float8;

-- limit_list_d 添加所有缺失字段
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS float_mv float8;
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS total_mv float8;
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS turnover_ratio float8;
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS fd_amount float8;
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS first_time varchar(20);
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS last_time varchar(20);
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS open_times integer;
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS up_stat varchar(20);
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS limit_times integer;
ALTER TABLE limit_list_d ADD COLUMN IF NOT EXISTS limit_flag varchar(1);

-- top_inst 修改唯一约束（如果需要）
-- 先删除旧约束，再添加新约束
-- ALTER TABLE top_inst DROP CONSTRAINT IF EXISTS top_inst_pkey;
-- ALTER TABLE top_inst ADD PRIMARY KEY (trade_date, ts_code, exalter);
```
