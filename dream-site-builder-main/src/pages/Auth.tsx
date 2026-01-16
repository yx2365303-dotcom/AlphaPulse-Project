import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('请输入有效的邮箱地址');
const passwordSchema = z.string().min(6, '密码至少需要6个字符');
const usernameSchema = z.string().min(2, '用户名至少需要2个字符').optional();

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    try {
      emailSchema.parse(loginEmail);
      passwordSchema.parse(loginPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: '验证失败',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (error) {
      console.error('Login error:', error);
      let message = '登录失败，请重试';
      if (error.message.includes('Invalid login credentials')) {
        message = '邮箱或密码错误';
      } else if (error.message.includes('Email not confirmed')) {
        message = '邮箱未验证，请先在 Supabase 控制台关闭邮箱验证，或检查您的邮箱完成验证';
      } else if (error.message.includes('Email link is invalid or has expired')) {
        message = '邮箱验证链接已过期';
      } else {
        message = `${error.message}`;
      }
      toast({
        title: '登录失败',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '登录成功',
        description: '欢迎回来！',
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    try {
      emailSchema.parse(signupEmail);
      passwordSchema.parse(signupPassword);
      if (signupUsername) {
        usernameSchema.parse(signupUsername);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: '验证失败',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await signUp(signupEmail, signupPassword, signupUsername);
    setIsSubmitting(false);

    if (error) {
      console.error('Signup error:', error);
      let message = '注册失败，请重试';
      if (error.message.includes('User already registered')) {
        message = '该邮箱已被注册';
      } else if (error.message.includes('Password should be')) {
        message = '密码不符合要求';
      }
      toast({
        title: '注册失败',
        description: message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '注册成功',
        description: '账号创建成功！如果启用了邮箱验证，请先验证邮箱后再登录。',
        duration: 6000,
      });
      // 自动切换到登录标签
      setTimeout(() => {
        setLoginEmail(signupEmail);
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <TrendingUp className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AlphaPulse</h1>
            <p className="text-sm text-muted-foreground">A股投研平台</p>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">欢迎回来</CardTitle>
                  <CardDescription>
                    输入您的邮箱和密码登录账户
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">邮箱</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">密码</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    登录
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">创建账户</CardTitle>
                  <CardDescription>
                    填写以下信息注册新账户
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">用户名（可选）</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="您的用户名"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">邮箱</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">密码</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="至少6个字符"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    注册
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>
    </div>
  );
}
