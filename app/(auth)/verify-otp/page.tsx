'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import * as authService from '@/lib/services/auth';

import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/form-elements';
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

  // Security: Check for valid verification session
  useEffect(() => {
    const pendingVerification = sessionStorage.getItem('pendingVerification');

    if (!pendingVerification) {
      // No pending verification session, redirect to signup
      router.push('/signup?error=no_session');
      return;
    }

    try {
      const { email: storedEmail, timestamp } = JSON.parse(pendingVerification);
      const elapsed = Date.now() - timestamp;

      // Check if session expired
      if (elapsed > SESSION_TIMEOUT) {
        sessionStorage.removeItem('pendingVerification');
        router.push('/signup?error=session_expired');
        return;
      }

      setEmail(storedEmail);
      setTimeRemaining(Math.floor((SESSION_TIMEOUT - elapsed) / 1000));
    } catch (err) {
      // Invalid session data
      sessionStorage.removeItem('pendingVerification');
      router.push('/signup?error=invalid_session');
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
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
      const response = await authService.verifyEmail({
        email,
        otp: data.otp,
      });

      console.log('✅ [VERIFY OTP] Email verified, response:', response);

      // CRITICAL: Store the token and user in localStorage so user is authenticated
      if (response.token) {
        console.log('🔑 [VERIFY OTP] Storing auth token...');
        localStorage.setItem('token', response.token);

        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Trigger auth state update
        window.dispatchEvent(new Event('auth-change'));
      }

      // Success! Clear session and redirect based on type
      const pendingVerification = sessionStorage.getItem('pendingVerification');
      const pendingInviteToken = sessionStorage.getItem('pendingInviteToken');

      let redirectPath = '/dashboard'; // Default

      if (pendingVerification) {
        const { type } = JSON.parse(pendingVerification);
        if (type === 'organization') {
          redirectPath = '/onboarding/organization';
        } else if (type === 'individual') {
          // Check if there's a pending invitation
          if (pendingInviteToken) {
            // Set flag to trigger auto-accept
            console.log('🎯 [VERIFY OTP] Setting justSignedUp flag for auto-accept...');
            sessionStorage.setItem('justSignedUp', 'true');
            redirectPath = `/accept-invite/${pendingInviteToken}`;
          } else {
            redirectPath = '/onboarding/individual';
          }
        }
      }

      console.log('➡️ [VERIFY OTP] Redirecting to:', redirectPath);
      sessionStorage.removeItem('pendingVerification');
      router.push(`${redirectPath}?verified=true`);
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

      reset(); // Clear OTP input
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

      // Reset attempt counter and unlock
      setAttemptCount(0);
      setIsLocked(false);
      setResendSuccess(true);

      // Update timestamp in session
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-primary">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
          {timeRemaining > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
              <Clock className="h-4 w-4" />
              <span>Session expires in {formatTime(timeRemaining)}</span>
            </div>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {resendSuccess && (
              <div className="flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <p>OTP resent successfully! Check your email.</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
                {...register('otp')}
                autoComplete="one-time-code"
                disabled={isLocked}
              />
              {errors.otp && (
                <p className="text-xs text-red-500">{errors.otp.message}</p>
              )}
              {attemptCount > 0 && !isLocked && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Failed attempts: {attemptCount}/{MAX_ATTEMPTS}
                </p>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending || isLoading}
                className="font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isLocked}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLocked ? 'Locked - Request New OTP' : 'Verify Email'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Back to Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
