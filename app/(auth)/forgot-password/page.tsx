'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import * as authService from '@/lib/services/auth';

import { Button } from '@/components/ui/button';
import { Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/form-elements';

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

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-primary">Check your email</CardTitle>
            <CardDescription>
              We have sent a password reset OTP to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Please check your inbox and spam folder. The OTP expires in 15 minutes.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
            >
              Enter OTP to Reset Password
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/login">
                    Back to Login
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-primary">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a One-Time Password (OTP)
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  className="pl-9"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send OTP
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
    </div>
  );
}
