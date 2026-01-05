'use client';

import Link from 'next/link';
import { User, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/form-elements';

export default function SelectTypePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">Choose Account Type</CardTitle>
                    <CardDescription>
                        Select how you want to use Card CRM
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 p-6">
                    {/* Individual Card */}
                    <div className="relative group">
                        <Link href="/signup" className="block h-full">
                            <div className="flex h-full flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:border-primary hover:bg-accent/5 transition-all duration-200 cursor-pointer">
                                <div className="flex flex-col items-center space-y-4 text-center">
                                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <User className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-xl">Individual</h3>
                                        <p className="text-sm text-muted-foreground">
                                            For personal use. Scan cards, manage contacts, and organize your network.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 w-full">
                                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                                        Select Individual
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Organization Card */}
                    <div className="relative group">
                        <Link href="/register-organization" className="block h-full">
                            <div className="flex h-full flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:border-primary hover:bg-accent/5 transition-all duration-200 cursor-pointer">
                                <div className="flex flex-col items-center space-y-4 text-center">
                                    <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Building2 className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-xl">Organization</h3>
                                        <p className="text-sm text-muted-foreground">
                                            For teams and businesses. Manage members, share contacts, and centralize data.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 w-full">
                                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                                        Select Organization
                                    </Button>
                                </div>
                            </div>
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t p-6">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
