-- =====================================================
-- AlphaPulse 网站用户管理表
-- 执行日期: 2026-01-16
-- 用途: 创建用户表并与Supabase Auth集成
-- =====================================================

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- 3. 启用RLS（行级安全）
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. 创建RLS策略
-- 允许用户读取自己的数据
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- 允许用户更新自己的数据
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- 允许任何认证用户插入数据（用于注册）
CREATE POLICY "Anyone can insert user data"
ON public.users
FOR INSERT
WITH CHECK (true);

-- 5. 创建触发器函数：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 创建触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. 创建触发器函数：注册时自动创建用户记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. 创建Auth触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. 创建用户活动日志表（可选）
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 创建索引
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON public.user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON public.user_activity_logs(created_at);

-- ===== 执行完毕 =====
-- 请在 Supabase SQL Editor 中执行以上SQL
-- 然后用户注册时会自动创建用户记录
