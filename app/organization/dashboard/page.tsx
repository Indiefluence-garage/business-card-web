'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, Phone, Globe, MapPin, AlignLeft,
    Save, X, Shield, Zap, Users, Crown, Mail,
    ExternalLink, Calendar, Check
} from 'lucide-react';
import { getProfile, updateProfile } from '@/lib/services/user';
import { getMyOrganization, Organization } from '@/lib/services/organization';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from '@/components/ui/form-elements';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrganizationDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

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
            const profileData = await getProfile();
            if (profileData && profileData.data) {
                const userData = profileData.data;
                // Allowed: Both 'organization' type users AND 'individual' users who are members of this org
                // Logic: If they can fetch `getMyOrganization`, they have access.
                // We rely on the API to return 404 or 403 if they don't belong here.
                setUser(userData);
                setFormData(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }

            try {
                const orgData = await getMyOrganization();
                if (orgData && orgData.data) {
                    setOrganization(orgData.data);
                }
            } catch (orgError: any) {
                if (orgError?.response?.status !== 404) {
                    toast.error('Could not load organization details');
                }
            }
        } catch (error) {
            toast.error('Failed to load profile');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await updateProfile(formData);
            if (response?.data) {
                setUser(response.data);
                setFormData(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            setIsEditing(false);
            toast.success('Workspace updated');
        } catch (error) {
            toast.error('Failed to update workspace');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
                    <p className="text-muted-foreground animate-pulse">Initializing Workspace...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
            {/* Header Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">Organization Settings</h1>
                            <p className="text-xs text-muted-foreground">Manage your team workspace and brand identity</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        {/* RBAC: Only Owners and Admins can edit the workspace */}
                        {(organization?.role === 'owner' || organization?.role === 'admin') && (
                            !isEditing ? (
                                <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="rounded-full px-6">
                                    Edit Workspace
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setFormData(user); }} disabled={loading}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSave} size="sm" className="rounded-full px-6" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            )
                        )}
                    </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Details Column */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Identity Card */}
                        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                            <div className="h-32 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20" />
                            <div className="px-8 pb-8">
                                <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-8">
                                    <div className="relative group/logo p-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl">
                                        <ProfileImageUpload
                                            image={user.image}
                                            userInitials={organization?.name?.[0] || user.name?.[0] || 'O'}
                                            onUploadSuccess={fetchData}
                                            onDeleteSuccess={fetchData}
                                            size="lg"
                                            className="rounded-2xl [&>p]:hidden"
                                        />
                                    </div>
                                    <div className="flex-1 mb-2">
                                        <h2 className="text-3xl font-bold text-foreground">{organization?.name || user.name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                                {user.planId || 'Standard Plan'}
                                            </span>
                                            {organization?.slug && (
                                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Globe className="h-3 w-3" /> lu-kr.wm/{organization.slug}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isEditing ? (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="space-y-6 pt-4"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold uppercase text-slate-500">Contact Email</Label>
                                                    <Input name="email" value={formData.email || ''} onChange={handleInputChange} className="rounded-xl" disabled />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold uppercase text-slate-500">Phone Number</Label>
                                                    <Input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} placeholder="+1..." className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold uppercase text-slate-500">Location</Label>
                                                    <Input name="address" value={formData.address || ''} onChange={handleInputChange} placeholder="Headquarters address" className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold uppercase text-slate-500">Country</Label>
                                                    <Input name="country" value={formData.country || ''} onChange={handleInputChange} placeholder="e.g. United States" className="rounded-xl" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold uppercase text-slate-500">Company Bio</Label>
                                                <Textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} className="min-h-[120px] rounded-xl" placeholder="Tell us about your organization..." />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4 border-t border-slate-100 dark:border-slate-800"
                                        >
                                            <div className="space-y-6">
                                                <div className="flex items-start gap-3">
                                                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Main Email</p>
                                                        <p className="text-sm font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                                {user.phoneNumber && (
                                                    <div className="flex items-start gap-3">
                                                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Support Phone</p>
                                                            <p className="text-sm font-medium">{user.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-6">
                                                {user.address && (
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Office Address</p>
                                                            <p className="text-sm font-medium">{user.address}</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {user.country && (
                                                    <div className="flex items-start gap-3">
                                                        <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Base Region</p>
                                                            <p className="text-sm font-medium">{user.country}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {user.bio && (
                                                <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight mb-2">Workspace Description</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                        {user.bio}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>

                        {/* Quick Actions (Moved from Right for better balance) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all cursor-pointer group" onClick={() => router.push('/organization/members')}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">Team Members</CardTitle>
                                        <CardDescription>Manage workspace access</CardDescription>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Users className="h-4 w-4 text-slate-500 group-hover:text-primary" />
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all cursor-pointer group" onClick={() => router.push('/organization/events')}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base">Events</CardTitle>
                                        <CardDescription>View and manage events</CardDescription>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Calendar className="h-4 w-4 text-slate-500 group-hover:text-primary" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>

                    {/* Right Subscription Column */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Plan & Usage Card */}
                        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
                            <div className="bg-slate-900 p-6 text-white overflow-hidden relative">
                                <Shield className="absolute top-0 right-0 h-24 w-24 text-white/5 -mr-4 -mt-4" />
                                <div className="flex items-center gap-2 text-primary font-bold tracking-tighter text-sm mb-1">
                                    <Crown className="h-4 w-4" /> ACTIVE PLAN
                                </div>
                                <h3 className="text-2xl font-bold capitalize">{user.planId || 'Standard'}</h3>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-amber-500" />
                                            <span className="font-medium">Card Scan Credits</span>
                                        </div>
                                        <span className="font-bold text-primary">
                                            {user.creditsRemaining === 999999 ? 'UNLIMITED' : user.creditsRemaining || 0}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }} animate={{ width: '80%' }}
                                            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="h-3 w-3 text-green-500" /> Team Access enabled
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Check className="h-3 w-3 text-green-500" /> API Access enabled
                                    </div>
                                    {user.planEndsAt && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                                            <Calendar className="h-3 w-3" /> Renewing on {new Date(user.planEndsAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {/* RBAC: Only Owners/Admins see the Upgrade button */}
                                {(organization?.role === 'owner' || organization?.role === 'admin') && (
                                    <Button className="w-full rounded-xl h-12 shadow-lg shadow-primary/10" onClick={() => router.push('/pricing')}>
                                        Upgrade Workspace
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
