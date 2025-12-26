'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, KeyRound, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '@/lib/services/auth.service';

import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/form-elements';
import { PasswordInput } from '@/components/ui/PasswordInput';

const resetPasswordSchema = z.object({
  otp: z.string().min(6, 'OTP must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Missing Information</h2>
          <p className="text-muted-foreground">No email address provided for password reset.</p>
          <Button asChild className="w-full">
            <Link href="/forgot-password">
              Go to Forgot Password
            </Link>
          </Button>
        </CardContent>
      </Card>
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
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Password Reset Successful!</h2>
            <p className="text-muted-foreground">Your password has been updated. You can now log in with your new password.</p>
            <Button asChild className="w-full">
              <Link href="/login">
                Go to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center text-primary">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Verifying for <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive bg-red-50 text-red-600 border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password (OTP)</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                className="pl-9"
                {...register('otp')}
              />
            </div>
            {errors.otp && (
              <p className="text-xs text-red-500">{errors.otp.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Check your email for the code.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              placeholder="Enter new password"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm new password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
          <div className="text-center">
             <Button variant="link" className="text-sm text-muted-foreground hover:text-primary gap-2" asChild>
               <Link href="/login">
                 <ArrowLeft className="h-3 w-3" />
                 Back to login
               </Link>
             </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
