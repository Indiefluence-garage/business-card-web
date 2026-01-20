'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, User, Mail, Lock, Building2, AlertCircle, Globe } from 'lucide-react';
import * as authService from '@/lib/services/auth';

import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/form-elements';

const orgSignupSchema = z.object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    orgName: z.string().min(2, 'Organization name is required'),
    orgSlug: z.string().min(3, 'Slug must be at least 3 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type OrgSignupFormValues = z.infer<typeof orgSignupSchema>;

export default function RegisterOrganizationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OrgSignupFormValues>({
        resolver: zodResolver(orgSignupSchema),
    });

    // Auto-generate slug from Org Name
    const orgName = watch('orgName');
    const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setValue('orgName', name);
        // Simple slugify: lowercase, replace spaces/symbols with hyphens
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setValue('orgSlug', slug);
    };

    const onSubmit = async (data: OrgSignupFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.registerOrganization({
                email: data.email,
                password: data.password,
                firstName: data.name.split(' ')[0],
                lastName: data.name.split(' ').slice(1).join(' '),
                orgName: data.orgName,
                orgSlug: data.orgSlug,
            });

            // Store verification session securely
            sessionStorage.setItem('pendingVerification', JSON.stringify({
                email: data.email,
                timestamp: Date.now(),
                type: 'organization',
            }));

            router.push('/verify-otp');
        } catch (err: any) {
            console.error('Register organization error:', err);
            setError(err.message || 'Failed to register organization.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-primary">Register Organization</CardTitle>
                    <CardDescription className="text-center">
                        Create a new workspace for your team
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

                        {/* Organization Details Section */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Organization Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="orgName">Organization Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="orgName"
                                        placeholder="Acme Corp"
                                        className="pl-9"
                                        {...register('orgName')}
                                        onChange={handleOrgNameChange}
                                    />
                                </div>
                                {errors.orgName && <p className="text-xs text-red-500">{errors.orgName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="orgSlug">Workspace URL</Label>
                                <div className="relative flex items-center">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="orgSlug"
                                        placeholder="acme-corp"
                                        className="pl-9"
                                        {...register('orgSlug')}
                                    />
                                    <span className="absolute right-3 text-xs text-muted-foreground">.cardio.com</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Unique identifier for your organization's workspace.</p>
                                {errors.orgSlug && <p className="text-xs text-red-500">{errors.orgSlug.message}</p>}
                            </div>
                        </div>

                        <div className="border-t border-border my-4"></div>

                        {/* Admin User Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Admin Account</h3>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="name" placeholder="John Doe" className="pl-9" {...register('name')} />
                                </div>
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        placeholder="name@company.com"
                                        type="email"
                                        className="pl-9"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    {...register('password')}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <PasswordInput
                                    id="confirmPassword"
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Workspace
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            <Link href="/select-type" className="font-medium text-primary hover:underline">
                                &larr; Back to account selection
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
