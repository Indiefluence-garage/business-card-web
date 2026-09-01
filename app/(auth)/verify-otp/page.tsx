'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Loader2, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { authService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/form-elements';
import Link from 'next/link';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OTPFormValues = z.infer<typeof otpSchema>;

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export default function VerifyOTPPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    const pendingVerification = sessionStorage.getItem('pendingVerification');

    if (!pendingVerification) {
      router.push('/signup?error=no_session');
      return;
    }

    try {
      const { email: storedEmail, timestamp } = JSON.parse(pendingVerification);
      const elapsed = Date.now() - timestamp;

      if (elapsed > SESSION_TIMEOUT) {
        sessionStorage.removeItem('pendingVerification');
        router.push('/signup?error=session_expired');
        return;
      }

      setEmail(storedEmail);
      setTimeRemaining(Math.floor((SESSION_TIMEOUT - elapsed) / 1000));
    } catch (err) {
      sessionStorage.removeItem('pendingVerification');
      router.push('/signup?error=invalid_session');
    }
  }, [router]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem('pendingVerification');
          router.push('/signup?error=session_expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, router]);

  const onSubmit = async (data: OTPFormValues) => {
    if (isLocked) {
      setError('Too many failed attempts. Please request a new OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.verifyEmail({
        email,
        otp: data.otp,
      });

      sessionStorage.removeItem('pendingVerification');
      router.push('/login?verified=true');
    } catch (err: any) {
      console.error(err);

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (newAttemptCount >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setError(`Too many failed attempts (${MAX_ATTEMPTS}/${MAX_ATTEMPTS}). Please request a new OTP.`);
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttemptCount;
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
        );
      }

      reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      await authService.resendOtp({ email });

      setAttemptCount(0);
      setIsLocked(false);
      setResendSuccess(true);

      const pendingVerification = sessionStorage.getItem('pendingVerification');
      if (pendingVerification) {
        const data = JSON.parse(pendingVerification);
        data.timestamp = Date.now();
        sessionStorage.setItem('pendingVerification', JSON.stringify(data));
        setTimeRemaining(SESSION_TIMEOUT / 1000);
      }

      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-6 animate-fade-in rounded-3xl glass-panel p-5 sm:p-6 lg:p-8 border border-border shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
            <Mail className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Verify Your Email
          </h1>
          <p className="text-xs text-muted-foreground">
            We sent a 6-digit security code to <strong className="text-foreground font-mono">{email}</strong>
          </p>

          {timeRemaining > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-mono text-muted-foreground mt-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Expires in {formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-3.5 text-xs font-semibold text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {resendSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <p>New OTP dispatched to your inbox!</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center block">
              Enter 6-Digit Code
            </Label>
            <Input
              id="otp"
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl tracking-[0.3em] font-mono font-bold rounded-2xl h-14"
              {...register('otp')}
              autoComplete="one-time-code"
              disabled={isLocked}
            />
            {errors.otp && <p className="text-xs text-destructive text-center">{errors.otp.message}</p>}
            {attemptCount > 0 && !isLocked && (
              <p className="text-xs text-amber-500 font-medium text-center">
                Attempts remaining: {MAX_ATTEMPTS - attemptCount}/{MAX_ATTEMPTS}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn-primary-glow rounded-2xl h-12 font-bold text-xs"
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : isLocked ? (
              'Locked — Request New OTP'
            ) : (
              'Confirm & Activate Account'
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending || isLoading}
              className="font-bold text-primary hover:underline disabled:opacity-50"
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
          </div>
        </form>

        <div className="pt-2 text-center border-t border-border">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}
