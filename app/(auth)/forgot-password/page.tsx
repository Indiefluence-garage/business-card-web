'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  CreditCard,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { authService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/form-elements';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset({ email: data.email });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      
      {/* Left Pane - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Lukewarm</span>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-mono font-semibold border border-white/10">
            <KeyRound className="h-3.5 w-3.5" />
            Zero-Trust Password Recovery
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
            Account recovery made fast, simple, and secure.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            We will send a high-entropy 6-digit One-Time Password (OTP) to your registered email address. Your contacts and encryption keys remain protected.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span className="flex items-center gap-1.5 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            15-Minute Expiry Window
          </span>
          <span>© 2026 Lukewarm CRM</span>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in space-y-6">
          
          {isSubmitted ? (
            <div className="text-center space-y-6 rounded-3xl glass-panel p-8 border border-border">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">One-Time Code Sent!</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We have dispatched a 6-digit OTP to <strong className="text-foreground">{email}</strong>.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please check your inbox or spam folder. The code expires in 15 minutes.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs"
                  onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
                >
                  Enter OTP to Reset Password
                </Button>
                <Button variant="ghost" className="w-full rounded-2xl text-xs" asChild>
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Reset Your Password
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email address to receive a secure password recovery code.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-4 text-xs font-semibold text-destructive border border-destructive/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Registered Email Address
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

                <Button
                  type="submit"
                  className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send One-Time Password'
                  )}
                </Button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to login
                </Link>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
