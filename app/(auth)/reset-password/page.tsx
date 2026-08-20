'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  KeyRound, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck 
} from 'lucide-react';
import { authService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/form-elements';
import { PasswordInput } from '@/components/ui/PasswordInput';

const resetPasswordSchema = z
  .object({
    otp: z.string().min(6, 'OTP must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!email) {
    return (
      <div className="rounded-3xl glass-panel p-8 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h2 className="text-xl font-bold font-display">Missing Email Parameter</h2>
        <p className="text-sm text-muted-foreground">No email address was provided for password reset.</p>
        <Button asChild className="w-full rounded-2xl btn-primary-glow">
          <Link href="/forgot-password">Go to Forgot Password</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to reset password. Invalid OTP or expired session.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl glass-panel p-8 text-center space-y-6 max-w-md mx-auto shadow-2xl">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Password Reset Successfully!</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your credentials have been securely updated. You can now log in with your new password.
          </p>
        </div>
        <Button asChild className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Set New Password
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verifying security code for <strong className="text-foreground">{email}</strong>
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
          <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5" />
            6-Digit One-Time Password (OTP)
          </Label>
          <Input
            id="otp"
            placeholder="000000"
            maxLength={6}
            className="rounded-2xl h-11 text-center font-mono tracking-widest text-lg font-bold"
            {...register('otp')}
          />
          {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            New Password
          </Label>
          <PasswordInput
            id="newPassword"
            className="rounded-2xl h-11"
            {...register('newPassword')}
          />
          {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Confirm New Password
          </Label>
          <PasswordInput
            id="confirmPassword"
            className="rounded-2xl h-11"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : (
            'Update Password & Sign In'
          )}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-background">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
