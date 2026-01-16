-- 修复股票数据表的 RLS 策略
-- 允许所有已认证用户读取股票数据

-- 为 limit_list_ths 表添加读取策略
DROP POLICY IF EXISTS "Allow authenticated users to read limit_list_ths" ON public.limit_list_ths;
CREATE POLICY "Allow authenticated users to read limit_list_ths"
ON public.limit_list_ths
FOR SELECT
TO authenticated
USING (true);

-- 为 top_list 表添加读取策略
DROP POLICY IF EXISTS "Allow authenticated users to read top_list" ON public.top_list;
CREATE POLICY "Allow authenticated users to read top_list"
ON public.top_list
FOR SELECT
TO authenticated
USING (true);

-- 为 limit_step 表添加读取策略
DROP POLICY IF EXISTS "Allow authenticated users to read limit_step" ON public.limit_step;
CREATE POLICY "Allow authenticated users to read limit_step"
ON public.limit_step
FOR SELECT
TO authenticated
USING (true);

-- 为 limit_cpt_list 表添加读取策略
DROP POLICY IF EXISTS "Allow authenticated users to read limit_cpt_list" ON public.limit_cpt_list;
CREATE POLICY "Allow authenticated users to read limit_cpt_list"
ON public.limit_cpt_list
FOR SELECT
TO authenticated
USING (true);

-- 为 limit_list_d 表添加读取策略
DROP POLICY IF EXISTS "Allow authenticated users to read limit_list_d" ON public.limit_list_d;
CREATE POLICY "Allow authenticated users to read limit_list_d"
ON public.limit_list_d
FOR SELECT
TO authenticated
USING (true);

-- 为 kpl_list 表添加读取策略（如果存在）
DROP POLICY IF EXISTS "Allow authenticated users to read kpl_list" ON public.kpl_list;
CREATE POLICY "Allow authenticated users to read kpl_list"
ON public.kpl_list
FOR SELECT
TO authenticated
USING (true);

-- 为 top_inst 表添加读取策略（如果存在）
DROP POLICY IF EXISTS "Allow authenticated users to read top_inst" ON public.top_inst;
CREATE POLICY "Allow authenticated users to read top_inst"
ON public.top_inst
FOR SELECT
TO authenticated
USING (true);
