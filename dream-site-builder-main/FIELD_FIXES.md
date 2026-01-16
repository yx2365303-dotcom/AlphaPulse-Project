# 数据库字段修复说明

## 修复的字段映射错误

### 1. limit_list_ths 表
**错误字段 → 正确字段**
- `item.close` → `item.price`
- `item.reason` → `item.lu_desc`
- `item.first_time` → `item.first_lu_time`
- `item.last_time` → `item.last_lu_time`
- `item.open_times` → `item.open_num`
- `item.fd_amount` → `item.limit_amount`
- `item.up_stat` → `item.tag`

### 2. limit_step 表
**问题**: 表中没有 `up_stat` 字段
**修复**: 返回空字符串 `''`

### 3. limit_cpt_list 表
**错误字段 → 正确字段**
- `item.z_num` → `item.up_nums` (涨停数量)
- `item.z_amount` → `item.cons_nums` (连板数)

### 4. fetchMarketOverview 函数
**问题**: `limit_list_d` 表没有 `up_count`、`down_count` 字段
**修复**: 改为通过 `limit_flag` 字段统计涨停('U')和跌停('D')数量

## 数据库实际字段结构

### limit_list_ths (同花顺涨停数据)
```
trade_date, ts_code, name, price, pct_chg, limit_type, tag, status,
lu_desc, limit_order, limit_amount, turnover_rate, first_lu_time,
last_lu_time, open_num, free_float, lu_limit_order, limit_up_suc_rate,
turnover, market_type
```

### top_list (龙虎榜数据)
```
trade_date, ts_code, name, close, pct_chg, turnover_rate, amount,
l_sell, l_buy, l_amount, net_amount, reason, ranking_times,
list_name, amount_rate, float_values, net_rate, pct_change
```

### limit_step (连板天梯)
```
trade_date, ts_code, name, nums
```

### limit_cpt_list (涨停板块统计)
```
trade_date, ts_code, name, days, up_stat, cons_nums, up_nums,
pct_chg, rank
```

### limit_list_d (涨跌停明细)
```
trade_date, ts_code, industry, name, close, pct_chg, amount,
limit_amount, fd_amount, first_time, last_time, open_times,
up_stat, limit_times, limit_flag, float_mv, total_mv, turnover_ratio
```

## 修改文件
- `src/services/dataService.ts` - 数据服务层字段映射
