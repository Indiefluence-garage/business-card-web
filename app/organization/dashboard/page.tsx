'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, Phone, Globe, MapPin, AlignLeft,
    Save, X, Lock
} from 'lucide-react';
import { userService } from '@/lib/services/user.service';
import { organizationService, Organization } from '@/lib/services/organization.service';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Input, Label, Textarea } from '@/components/ui/form-elements';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

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
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Organization Overview
                        </h1>
                        <p className="text-muted-foreground mt-2">Manage your workspace and team settings</p>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} size="lg" className="shadow-lg">
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                setFormData(user);
                                toast.info('Changes discarded');
                            }}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={loading} className="shadow-lg">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    )}
                </header>



                {/* Organization Details */}
                <Card className="border-none shadow-xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
                    <CardContent className="pt-0 px-6 pb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
                            <ProfileImageUpload
                                image={user.image}
                                userInitials={organization?.name?.[0] || user.name?.[0] || 'O'}
                                onUploadSuccess={fetchData}
                                onDeleteSuccess={fetchData}
                                size="lg"
                                className="ring-4 ring-background shadow-2xl"
                            />
                            <div className="text-center md:text-left pb-2 flex-1">
                                <div className="flex flex-col md:flex-row items-center md:items-end gap-3">
                                    <h2 className="text-3xl font-bold">{organization?.name || user.name}</h2>
                                    {user.planId && (
                                        <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-1">
                                            {user.planId.replace('tier', 'Tier ')} Plan
                                        </div>
                                    )}
                                </div>
                                <p className="text-muted-foreground mt-1">{user.email}</p>
                                {organization?.slug && (
                                    <p className="text-sm text-primary mt-1">@{organization.slug}</p>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Organization Name - READ ONLY */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        Organization Name
                                        <span className="text-xs text-muted-foreground">(Read-only)</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            value={organization?.name || 'Not available'}
                                            disabled
                                            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed pr-10"
                                        />
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Organization name is managed separately and cannot be edited here.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} placeholder="+1 234 567 890" />
                                </div>
                                <div className="space-y-2">
                                    <Label>WhatsApp Number</Label>
                                    <Input name="whatsappNumber" value={formData.whatsappNumber || ''} onChange={handleInputChange} placeholder="+1 234 567 890" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Country</Label>
                                    <Input name="country" value={formData.country || ''} onChange={handleInputChange} placeholder="United States" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Address</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleGetLocation}
                                            className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10"
                                        >
                                            <MapPin className="mr-2 h-3 w-3" /> Use Current Location
                                        </Button>
                                    </div>
                                    <Input name="address" value={formData.address || ''} onChange={handleInputChange} placeholder="123 Main St, City, Zip" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Bio / Description</Label>
                                    <Textarea name="bio" className="min-h-[120px]" value={formData.bio || ''} onChange={handleInputChange} placeholder="Tell us about your organization..." />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Organization Name Display - READ ONLY */}
                                <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl border border-primary/20">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Organization Name</p>
                                            <Lock className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                        <p className="font-bold text-xl mt-1">{organization?.name || 'Loading...'}</p>
                                        <p className="text-xs text-muted-foreground mt-1">This field is read-only and managed separately</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Phone</p>
                                            <p className="font-medium mt-1">{user.phoneNumber || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">WhatsApp</p>
                                            <p className="font-medium mt-1">{user.whatsappNumber || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Country</p>
                                            <p className="font-medium mt-1">{user.country || 'Not set'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Address</p>
                                        <p className="font-medium mt-1">{user.address || 'Not set'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <div className="p-2 bg-gray-500/10 rounded-lg">
                                        <AlignLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">About</p>
                                        <p className="font-medium mt-1 whitespace-pre-wrap">{user.bio || 'No description provided yet.'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Subscription Status Card - New for Organization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Team Workspace</CardTitle>
                            <CardDescription>Stats and active members</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-primary">2</p>
                                    <p className="text-sm text-muted-foreground">Active Members</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center text-muted-foreground">
                                    <p className="text-3xl font-bold italic">--</p>
                                    <p className="text-sm">Team Scans</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/organization/members')}>
                                Manage Members
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>Current plan details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-6 space-y-4">
                                <Shield className="h-16 w-16 text-primary/50" />
                                <div className="text-center space-y-2 w-full">
                                    <h3 className="text-2xl font-bold capitalize">
                                        {user.planId ? user.planId.replace('tier', 'Tier ') : 'Free'} Plan
                                    </h3>

                                    {/* Status Badge */}
                                    <div className="flex justify-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.subscriptionStatus === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : user.subscriptionStatus === 'expired'
                                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                                            }`}>
                                            {user.subscriptionStatus === 'active' ? '✓ Active' :
                                                user.subscriptionStatus === 'expired' ? '✗ Expired' :
                                                    'Free Tier'}
                                        </span>
                                    </div>

                                    {/* Credits */}
                                    <p className="text-sm text-muted-foreground">
                                        {user.creditsRemaining === 999999
                                            ? 'Unlimited Scans'
                                            : `${user.creditsRemaining || 0} Credits Remaining`}
                                    </p>

                                    {/* Expiration Date */}
                                    {user.planEndsAt && (
                                        <div className="pt-2 border-t mt-2">
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(user.planEndsAt) > new Date()
                                                    ? `Expires: ${new Date(user.planEndsAt).toLocaleDateString()}`
                                                    : `Expired: ${new Date(user.planEndsAt).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => router.push('/pricing')}>
                                {user.subscriptionStatus === 'active' ? 'Upgrade Plan' : 'View Plans'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
