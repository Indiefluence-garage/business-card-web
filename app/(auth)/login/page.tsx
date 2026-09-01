'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CreditCard,
  Zap
} from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Input, Label } from '@/components/ui/form-elements';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email verified successfully! You can now log in.');
    }
    if (searchParams.get('error') === 'oauth_failed') {
      setError('Google sign-in failed. Please try again.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('auth-change'));
      const target = searchParams.get('redirect') || '/dashboard';
      router.push(target);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const callbackURL = window.location.origin + '/callback';
      const response = await api.post('/better-auth/sign-in/social', {
        provider: 'google',
        callbackURL,
      });

      const redirectUrl = response.data.url;
      if (redirectUrl) window.location.href = redirectUrl;
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setError('Failed to initiate Google sign-in.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      
      {/* Left Pane - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#033F63] p-6 sm:p-5 sm:p-6 lg:p-8 lg:p-12 flex-col justify-between text-white overflow-hidden">

        {/* Top brand */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Lukewarm Logo"
            width={38}
            height={31}
            className="h-8 w-auto object-contain"
          />
          <span className="font-display text-xl font-bold tracking-tight text-white">Lukewarm</span>
        </Link>

        {/* Center quote / feature badge */}
        <div className="relative z-10 max-w-md space-y-6">
          <p className="text-xs font-bold text-cyan-300 tracking-wider uppercase">
            Executive Contact Intelligence
          </p>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
            &ldquo;The fastest way to turn conference handshakes into closed deals.&rdquo;
          </h2>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Sub-second continuous flash scanning</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>AI voice memos linked to contact records</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>Bi-directional Google Calendar meeting sync</span>
            </div>
          </div>
        </div>

        {/* Bottom footer badge */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span className="flex items-center gap-1.5 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            AES-256 Encrypted Storage
          </span>
          <span>© 2026 Lukewarm</span>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-6 sm:p-5 sm:p-6 lg:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in space-y-6">
          
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground">
              Sign In to Your Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Access your account, active events, and synced contacts.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 text-xs font-semibold text-destructive border border-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Google 1-Click OAuth */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-3 font-semibold text-xs border-border hover:bg-secondary transition-all"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isLoading}
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-background px-3 text-muted-foreground">Or sign in with email</span>
            </div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@company.com"
                  type="email"
                  className="pl-10 rounded-2xl h-11"
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                className="rounded-2xl h-11"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs"
              disabled={isLoading || googleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Sign In</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </form>

          {/* Signup link */}
          <div className="pt-2 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Create free account
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
