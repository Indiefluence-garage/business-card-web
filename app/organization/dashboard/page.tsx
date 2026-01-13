'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, Phone, Globe, MapPin, AlignLeft,
    Save, X, Lock, Shield, Zap, Users, Crown
} from 'lucide-react';
import { userService } from '@/lib/services/user.service';
import { organizationService, Organization } from '@/lib/services/organization.service';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Input, Label, Textarea } from '@/components/ui/form-elements';
import { toast } from 'sonner';
// Redesigned UI

export default function OrganizationDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        // Check if user is logged in, but don't redirect yet
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Fetch profile first to get accurate userType from server
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch user profile FIRST to get accurate userType
            const profileData = await userService.getProfile();
            if (profileData && profileData.data) {
                const userData = profileData.data;

                // NOW check userType from fresh API data
                if (userData.userType !== 'organization') {
                    console.log('User is not an organization, redirecting to individual dashboard');
                    router.push('/dashboard');
                    return;
                }

                // User is confirmed as organization type, proceed
                setUser(userData);
                setFormData(userData);
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
                // Gracefully handle - 404 means user isn't in an org yet, which is fine
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
            toast.success('Profile updated successfully!', {
                description: 'Your changes have been saved.',
            });
        } catch (error) {
            console.error('Failed to update profile', error);
            toast.error('Failed to update profile', {
                description: 'Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        toast.loading('Fetching location...', { id: 'location-fetch' });

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                // Using Nominatim (OpenStreetMap) for free reverse geocoding
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
                const data = await response.json();

                if (data && data.address) {
                    const address = data.address;
                    const street = address.road || address.pedestrian || address.suburb || "";
                    const city = address.city || address.town || address.village || "";
                    const postcode = address.postcode || "";
                    const country = address.country || "";

                    const formattedAddress = [street, city, postcode].filter(Boolean).join(", ");

                    setFormData((prev: any) => ({
                        ...prev,
                        address: formattedAddress,
                        country: country
                    }));
                    toast.success('Location updated!', { id: 'location-fetch' });
                }
            } catch (error) {
                console.error('Failed to reverse geocode:', error);
                toast.error('Failed to get address details', { id: 'location-fetch' });
            }
        }, (error) => {
            console.error('Geolocation error:', error);
            toast.error('Could not get your location', { id: 'location-fetch' });
        });
    };

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
        <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
            {/* Decorative Background - Premium Aesthetic */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>

                {/* Mesh Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 p-4 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Floating Header */}
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-3xl bg-card/40 backdrop-blur-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-10 duration-1000">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <Building2 className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                                    Workspace <span className="text-primary tracking-tighter italic">Hub</span>
                                </h1>
                            </div>
                            <p className="text-muted-foreground font-medium text-lg max-w-xl">
                                Command center for <span className="text-foreground font-bold">{organization?.name || 'your team'}</span>. Manage identities, growth, and team performance.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    size="lg"
                                    className="h-14 px-8 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] font-bold"
                                >
                                    <Shield className="mr-2 h-5 w-5" /> Edit Workspace
                                </Button>
                            ) : (
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-14 px-6 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all font-bold"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData(user);
                                            toast.info('Changes discarded');
                                        }}
                                    >
                                        <X className="mr-2 h-5 w-5" /> Cancel
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="h-14 px-8 rounded-2xl bg-green-600 text-white hover:bg-green-500 transition-all shadow-xl shadow-green-600/20 font-bold"
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        <Save className="mr-2 h-5 w-5" /> Deploy Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT COLUMN - Profile & Basic Info */}
                        <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
                            <Card className="border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden group">
                                <div className="h-48 bg-gradient-to-br from-primary via-primary/80 to-accent relative overflow-hidden">
                                    {/* Abstract background shapes inside card header */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                        <Building2 className="w-64 h-64 text-white rotate-12" />
                                    </div>
                                </div>

                                <CardContent className="relative pt-0 px-8 pb-10">
                                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-24 mb-10">
                                        <div className="relative group/logo">
                                            <ProfileImageUpload
                                                image={user.image}
                                                userInitials={organization?.name?.[0] || user.name?.[0] || 'O'}
                                                onUploadSuccess={fetchData}
                                                onDeleteSuccess={fetchData}
                                                size="lg"
                                                className="ring-8 ring-background/60 backdrop-blur-lg shadow-2xl transition-transform duration-500 group-hover/logo:scale-[1.05]"
                                            />
                                            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-xl ring-2 ring-background pointer-events-none">
                                                <Zap className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="text-center md:text-left flex-1 space-y-2">
                                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                                                <h2 className="text-4xl font-black tracking-tight text-foreground drop-shadow-sm">
                                                    {organization?.name || user.name}
                                                </h2>
                                                <div className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-primary text-white shadow-lg shadow-primary/30">
                                                    {user.planId ? user.planId.replace('tier', 'Tier ') : 'Individual'}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <AlignLeft className="h-4 w-4 opacity-70" /> {user.email}
                                                </span>
                                                {organization?.slug && (
                                                    <span className="flex items-center gap-1.5 py-0.5 px-2 bg-white/5 rounded-lg border border-white/10 text-primary">
                                                        <span className="opacity-50 font-bold">@</span>{organization.slug}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-8 animate-in fade-in duration-500">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-1 rounded-2xl">
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            name="phoneNumber"
                                                            value={formData.phoneNumber || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="+1 234 567 890"
                                                            className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all text-base"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp Integration</Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                                                            <div className="absolute w-2 h-2 bg-green-500 rounded-full"></div>
                                                        </div>
                                                        <Input
                                                            name="whatsappNumber"
                                                            value={formData.whatsappNumber || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="+1 234 567 890"
                                                            className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all text-base"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Geographic Region</Label>
                                                    <div className="relative group">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            name="country"
                                                            value={formData.country || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="United States"
                                                            className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all text-base"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between ml-1">
                                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Location HQ</Label>
                                                        <button
                                                            type="button"
                                                            onClick={handleGetLocation}
                                                            className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:opacity-70 transition-opacity"
                                                        >
                                                            <MapPin className="h-3 w-3" /> Auto-Detect
                                                        </button>
                                                    </div>
                                                    <div className="relative group">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            name="address"
                                                            value={formData.address || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="123 Corporate Blvd, Suite 100"
                                                            className="h-14 pl-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all text-base"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Executive Summary / Bio</Label>
                                                <Textarea
                                                    name="bio"
                                                    className="min-h-[160px] p-5 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all text-base resize-none"
                                                    value={formData.bio || ''}
                                                    onChange={handleInputChange}
                                                    placeholder="Describe your organization's mission and vision..."
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item">
                                                    <div className="p-3 bg-blue-500/10 rounded-xl group-hover/item:scale-110 transition-transform">
                                                        <Phone className="h-5 w-5 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</p>
                                                        <p className="font-bold text-foreground mt-0.5">{user.phoneNumber || 'Not configured'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item">
                                                    <div className="p-3 bg-green-500/10 rounded-xl group-hover/item:scale-110 transition-transform">
                                                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .011 5.403.008 12.039a11.81 11.81 0 001.592 5.918L0 24l6.108-1.604a11.802 11.802 0 005.937 1.644h.005c6.634 0 12.037-5.402 12.04-12.039a11.777 11.777 0 00-3.489-8.502z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">WhatsApp</p>
                                                        <p className="font-bold text-foreground mt-0.5">{user.whatsappNumber || 'Not linked'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item">
                                                    <div className="p-3 bg-purple-500/10 rounded-xl group-hover/item:scale-110 transition-transform">
                                                        <Globe className="h-5 w-5 text-purple-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Region</p>
                                                        <p className="font-bold text-foreground mt-0.5">{user.country || 'Global'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item">
                                                    <div className="p-3 bg-orange-500/10 rounded-xl group-hover/item:scale-110 transition-transform">
                                                        <MapPin className="h-5 w-5 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Headquarters</p>
                                                        <p className="font-bold text-foreground mt-0.5 truncate max-w-[200px]">{user.address || 'Address pending'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10 mt-4 group/bio relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/bio:opacity-30 transition-opacity">
                                                    <AlignLeft className="h-12 w-12" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Corporate Identity</p>
                                                <p className="text-foreground leading-relaxed font-medium">
                                                    {user.bio || "Crafting excellence through collaboration and innovation. No official description has been set for this organization yet."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT COLUMN - Stats & Subscription */}
                        <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-10 duration-1000 delay-400">

                            {/* Team Pulse Card */}
                            <Card className="border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/20 rounded-2xl">
                                            <Users className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black">Team Pulse</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-wider opacity-60">Workspace Health</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-white/5 group overflow-hidden">
                                            <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                                                <Users className="h-20 w-20" />
                                            </div>
                                            <p className="text-4xl font-black text-primary drop-shadow-sm">2</p>
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Active Collaborators</p>
                                        </div>

                                        <div className="relative p-6 rounded-3xl bg-white/5 border border-white/5 group overflow-hidden">
                                            <p className="text-4xl font-black text-foreground italic opacity-30 tracking-tighter">--</p>
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">Total Team Scans</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all duration-300 font-bold uppercase tracking-widest text-xs"
                                        onClick={() => router.push('/organization/members')}
                                    >
                                        Growth Panel
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Plan Card (Themed) */}
                            <Card className="border-white/10 bg-card/30 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden group">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-500/20 rounded-2xl">
                                            <Crown className="h-6 w-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black">Plan Status</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-wider opacity-60">Membership Level</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="relative p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border border-amber-500/20 text-center space-y-4 overflow-hidden">
                                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-amber-500/5 rounded-full blur-[60px] pointer-events-none group-hover:animate-pulse"></div>

                                        <div className="relative z-10 flex flex-col items-center gap-4">
                                            <div className="p-4 bg-amber-500/10 rounded-[2rem] shadow-inner ring-1 ring-amber-500/30">
                                                <Shield className="h-12 w-12 text-amber-500 animate-pulse" />
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-3xl font-black capitalize tracking-tight">
                                                    {user.planId ? user.planId.replace('tier', 'Tier ') : 'Free'}
                                                </h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/80">Corporate Access</p>
                                            </div>

                                            <div className="flex flex-col gap-2 w-full pt-4 border-t border-amber-500/10">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-muted-foreground">Scans Availability</span>
                                                    <span className="font-black text-amber-600 dark:text-amber-400">
                                                        {user.creditsRemaining === 999999 ? 'UNLIMITED' : `${user.creditsRemaining || 0} TOTAL`}
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-amber-500/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full w-[80%] shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                                                </div>
                                            </div>

                                            {user.planEndsAt && (
                                                <div className="pt-2">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                                                        {new Date(user.planEndsAt) > new Date()
                                                            ? `Valid Until: ${new Date(user.planEndsAt).toLocaleDateString()}`
                                                            : `Expired On: ${new Date(user.planEndsAt).toLocaleDateString()}`}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-14 rounded-2xl bg-amber-500 text-white hover:bg-amber-400 mt-6 shadow-xl shadow-amber-500/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02]"
                                        onClick={() => router.push('/pricing')}
                                    >
                                        {user.subscriptionStatus === 'active' ? 'Level Up Workspace' : 'Get Corporate Shield'}
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
