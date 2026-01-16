-- 禁用股票数据表的 RLS（行级安全策略）
-- 这些表是公开的市场数据，不需要用户级别的权限控制

-- 禁用 limit_list_ths 表的 RLS
ALTER TABLE public.limit_list_ths DISABLE ROW LEVEL SECURITY;

-- 禁用 top_list 表的 RLS
ALTER TABLE public.top_list DISABLE ROW LEVEL SECURITY;

-- 禁用 limit_step 表的 RLS
ALTER TABLE public.limit_step DISABLE ROW LEVEL SECURITY;

-- 禁用 limit_cpt_list 表的 RLS
ALTER TABLE public.limit_cpt_list DISABLE ROW LEVEL SECURITY;

-- 禁用 limit_list_d 表的 RLS
ALTER TABLE public.limit_list_d DISABLE ROW LEVEL SECURITY;

-- 禁用 kpl_list 表的 RLS（如果存在）
ALTER TABLE public.kpl_list DISABLE ROW LEVEL SECURITY;

-- 禁用 top_inst 表的 RLS（如果存在）
ALTER TABLE public.top_inst DISABLE ROW LEVEL SECURITY;

-- 验证 RLS 状态
SELECT 
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('limit_list_ths', 'top_list', 'limit_step', 'limit_cpt_list', 'limit_list_d', 'kpl_list', 'top_inst')
ORDER BY tablename;
