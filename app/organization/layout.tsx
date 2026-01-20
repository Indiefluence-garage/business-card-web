'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Building2, Users, Settings, Bell, LogOut, LayoutDashboard, Activity
} from 'lucide-react';
import { userService } from '@/lib/services/user.service';
import { organizationService, Organization } from '@/lib/services/organization.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OrganizationSwitcher from '@/components/organization/org-switcher';

export default function OrganizationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch user profile FIRST to get accurate userType
            const profileData = await userService.getProfile();
            if (profileData && profileData.data) {
                const userData = profileData.data;

                // Check userType from fresh API data
                if (userData.userType !== 'organization') {
                    console.log('User is not an organization, redirecting to individual dashboard');
                    router.push('/dashboard');
                    return;
                }

                // User is confirmed as organization type, proceed
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }

            // Fetch organization details
            try {
                const orgData = await organizationService.getMyOrganization();
                if (orgData && orgData.data) {
                    setOrganization(orgData.data);
                }
            } catch (orgError: any) {
                console.error('Organization fetch error:', orgError);
                if (orgError?.response?.status === 404) {
                    console.log('User is not part of any organization yet');
                } else {
                    toast.error('Could not load organization details');
                }
            }

        } catch (error) {
            console.error('Failed to fetch profile', error);
            toast.error('Failed to load profile');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const isActive = (path: string) => pathname === path;

    if (loading && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col shadow-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <OrganizationSwitcher
                        currentOrgId={organization?.id}
                        className="w-full"
                    />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/organization/dashboard">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/organization/dashboard')
                                    ? 'text-primary bg-primary/10 hover:bg-primary/20'
                                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <LayoutDashboard className="mr-3 h-5 w-5" />
                            Overview
                        </Button>
                    </Link>
                    <Link href="/organization/members">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${isActive('/organization/members')
                                    ? 'text-primary bg-primary/10 hover:bg-primary/20'
                                    : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Users className="mr-3 h-5 w-5" />
                            Members
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700" disabled>
                        <Activity className="mr-3 h-5 w-5" />
                        Activity
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700" disabled>
                        <Bell className="mr-3 h-5 w-5" />
                        Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700" disabled>
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                    </Button>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            toast.success('Logged out successfully');
                            router.push('/login');
                        }}
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
