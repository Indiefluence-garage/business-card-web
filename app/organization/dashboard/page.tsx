'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, Users, Settings, Bell,
    Phone, Globe, MapPin, AlignLeft,
    Save, X, LogOut, LayoutDashboard
} from 'lucide-react';
import { userService } from '@/lib/services/user.service';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from '@/components/ui/form-elements';

export default function OrganizationDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.userType !== 'organization') {
                router.push('/dashboard');
                return;
            }
        }
        fetchProfile();
    }, [router]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const profileData = await userService.getProfile();
            if (profileData && profileData.data) {
                setUser(profileData.data);
                setFormData(profileData.data);
                localStorage.setItem('user', JSON.stringify(profileData.data));
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
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
            const response = await userService.updateProfile(formData);
            if (response?.data) {
                setUser(response.data);
                setFormData(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            setIsEditing(false);
            alert('Organization profile updated!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar Placeholder */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-lg truncate">{user.name}</span>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10">
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Overview
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Users className="mr-3 h-5 w-5" />
                        Members
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Bell className="mr-3 h-5 w-5" />
                        Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                    </Button>
                </nav>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.push('/login');
                    }}>
                        <LogOut className="mr-3 h-5 w-5" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-8">
                    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
                            <p className="text-muted-foreground mt-1">Manage your business information and public presence.</p>
                        </div>
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                                <Button onClick={handleSave} disabled={loading}><Save className="mr-2 h-4 w-4" /> Save</Button>
                            </div>
                        )}
                    </header>

                    <Card className="overflow-hidden border-none shadow-lg">
                        <CardHeader className="bg-primary/5 pb-12">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <ProfileImageUpload
                                    image={user.image}
                                    userInitials={user.name?.[0] || 'O'}
                                    onUploadSuccess={fetchProfile}
                                    onDeleteSuccess={fetchProfile}
                                    size="lg"
                                    className="ring-4 ring-background"
                                />
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isEditing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Organization Name</Label>
                                        <Input name="name" value={formData.name || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>WhatsApp Number</Label>
                                        <Input name="whatsappNumber" value={formData.whatsappNumber || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Country</Label>
                                        <Input name="country" value={formData.country || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Address</Label>
                                        <Input name="address" value={formData.address || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>Bio / description</Label>
                                        <Textarea name="bio" className="min-h-[100px]" value={formData.bio || ''} onChange={handleInputChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-2 bg-primary/10 rounded-lg"><Phone className="h-5 w-5 text-primary" /></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Phone</p>
                                            <p className="font-medium">{user.phoneNumber || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-2 bg-primary/10 rounded-lg"><Phone className="h-5 w-5 text-green-500" /></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">WhatsApp</p>
                                            <p className="font-medium">{user.whatsappNumber || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="p-2 bg-primary/10 rounded-lg"><Globe className="h-5 w-5 text-blue-500" /></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Country</p>
                                            <p className="font-medium">{user.country || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl md:col-span-3">
                                        <div className="p-2 bg-primary/10 rounded-lg"><MapPin className="h-5 w-5 text-red-500" /></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Address</p>
                                            <p className="font-medium">{user.address || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl md:col-span-3">
                                        <div className="p-2 bg-primary/10 rounded-lg"><AlignLeft className="h-5 w-5 text-muted-foreground" /></div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">About</p>
                                            <p className="font-medium">{user.bio || 'No description provided yet.'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
