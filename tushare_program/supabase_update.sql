-- =====================================================
-- Supabase 数据库字段补全脚本 (增量更新)
-- 执行日期: 2026-01-16
-- 用途: 添加所有API返回但数据库缺失的字段
-- 注意: 这是增量脚本，可以在已有数据的表上安全执行
-- =====================================================

-- 如果之前已执行过 supabase_fix.sql，请直接执行此脚本的新增部分

-- ===== 1. top_list 表 - 添加完整字段 =====
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS close float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS pct_change float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS turnover_rate float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS amount float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS l_sell float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS l_buy float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS l_amount float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS net_amount float8;
-- 以下字段之前可能已添加
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS net_rate float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS amount_rate float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS float_values float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS reason varchar(200);

-- ===== 2. kpl_list 表 - 添加完整字段 =====
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS lu_time varchar(20);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS ld_time varchar(20);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS open_time varchar(20);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS last_time varchar(20);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS lu_desc varchar(200);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS tag varchar(100);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS theme varchar(200);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS net_change float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS status varchar(20);
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS pct_chg float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS amount float8;
-- 以下字段之前可能已添加
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS bid_amount float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS bid_change float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS bid_turnover float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS lu_bid_vol float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS bid_pct_chg float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS rt_pct_chg float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS limit_order float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS turnover_rate float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS free_float float8;
ALTER TABLE kpl_list ADD COLUMN IF NOT EXISTS lu_limit_order float8;

-- ===== 3. ths_daily 表 - 添加完整字段 =====
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS open float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS high float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS low float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS close float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS pre_close float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS avg_price float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS change float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS pct_change float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS vol float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS turnover_rate float8;

-- ===== 4. top_inst 表 - 彻底移除主键约束 =====
-- 原因: 同一天同一股票同一类型机构可以有多条不同的记录
ALTER TABLE top_inst DROP CONSTRAINT IF EXISTS top_inst_pkey;
ALTER TABLE top_inst DROP CONSTRAINT IF EXISTS top_inst_trade_date_ts_code_key;
ALTER TABLE top_inst DROP CONSTRAINT IF EXISTS top_inst_trade_date_ts_code_exalter_key;

-- 创建查询索引（可选，用于提升查询性能）
CREATE INDEX IF NOT EXISTS idx_top_inst_lookup ON top_inst (trade_date, ts_code);

-- ===== 执行完毕 =====
-- 请检查执行结果，应该看到 "Success. No rows returned"
-- 然后返回程序重新运行: python main.py
