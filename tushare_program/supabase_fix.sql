-- Supabase 数据库修复SQL
-- 执行日期: 2026-01-16
-- 用途: 修复缺失字段和约束问题

-- ===== 1. equity_daily 表 - 修复 RLS 策略 =====
-- 问题: row-level security policy 阻止写入
-- 解决: 禁用 RLS 或添加写入策略

ALTER TABLE equity_daily DISABLE ROW LEVEL SECURITY;
-- 或者添加允许写入的策略：
-- CREATE POLICY "允许service_role写入" ON equity_daily
--   FOR INSERT TO service_role USING (true);

-- ===== 2. top_list 表 - 添加缺失字段 =====
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS net_rate float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS amount_rate float8;
ALTER TABLE top_list ADD COLUMN IF NOT EXISTS float_values float8;

-- ===== 3. top_inst 表 - 修复唯一约束 =====
-- 问题: 同一天同一股票有多条机构记录，导致唯一约束冲突
-- 解决: 修改主键为 (trade_date, ts_code, exalter)

-- 先删除旧约束
ALTER TABLE top_inst DROP CONSTRAINT IF EXISTS top_inst_pkey;
ALTER TABLE top_inst DROP CONSTRAINT IF EXISTS top_inst_trade_date_ts_code_key;

-- 添加新的主键约束
ALTER TABLE top_inst ADD PRIMARY KEY (trade_date, ts_code, exalter);

-- ===== 4. kpl_list 表 - 添加缺失字段 =====
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

-- ===== 5. kpl_concept 表 - 添加缺失字段 =====
ALTER TABLE kpl_concept ADD COLUMN IF NOT EXISTS z_t_num integer;

-- ===== 6. ths_member 表 - 添加缺失字段（如果需要热门板块功能） =====
ALTER TABLE ths_member ADD COLUMN IF NOT EXISTS con_code varchar(20);
ALTER TABLE ths_member ADD COLUMN IF NOT EXISTS con_name varchar(100);

-- ===== 7. ths_daily 表 - 添加缺失字段（如果需要板块日线功能） =====
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS avg_price float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS vol float8;
ALTER TABLE ths_daily ADD COLUMN IF NOT EXISTS turnover_rate float8;

-- ===== 执行完毕 =====
-- 请在 Supabase SQL Editor 中执行以上SQL，然后重新运行程序
