'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Input, Label } from '@/components/ui/form-elements';
import { User as UserIcon, Mail, Shield, Phone, MapPin, Globe, Linkedin, Instagram, Twitter, Facebook, Save, X } from 'lucide-react';
import { userService } from '@/lib/services/user.service';
import { User } from '@/lib/types';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});


  useEffect(() => {
    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      console.log('🔄 [FETCH PROFILE] Starting profile fetch...');
      const profileData = await userService.getProfile();
      console.log('✅ [FETCH PROFILE] Raw response:', profileData);

      // @ts-ignore - The API returns { success: true, data: User } but type definition might be slightly off in usage here or response structure
      // Adjusting based on userService.getProfile returning response.data which is ProfileResponse<User>
      if (profileData && profileData.data) {
        const userData = profileData.data;

        // Check if user is organization type - redirect them to org dashboard
        if (userData.userType === 'organization') {
          console.log('User is organization type, redirecting to org dashboard');
          router.push('/organization/dashboard');
          return;
        }

        // User is individual type, proceed
        console.log('📦 [FETCH PROFILE] User data:', {
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          planId: userData.planId,
          subscriptionStatus: userData.subscriptionStatus
        });
        setUser(userData);
        setFormData(userData);
      } else {
        // Fallback if structure is different
        console.log('⚠️ [FETCH PROFILE] Using fallback');
        setUser(profileData as unknown as User);
        setFormData(profileData as unknown as User);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      // specific error handling could go here (e.g. token expired)
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value || undefined
      }
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('💾 [UPDATE PROFILE] Sending update...');
      console.log('📤 [UPDATE PROFILE] Data:', {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber,
        country: formData.country,
        address: formData.address,
        bio: formData.bio,
        socialLinks: formData.socialLinks
      });

      const response = await userService.updateProfile(formData);
      console.log('✅ [UPDATE PROFILE] Response:', response);

      // If backend returns updated user data, use it immediately
      if (response?.data) {
        console.log('📦 [UPDATE PROFILE] Updated data:', response.data);
        setUser(response.data);
        setFormData(response.data);
      } else {
        // Fallback: refetch profile
        console.log('⚠️ [UPDATE PROFILE] No data, refetching...');
        await fetchProfile();
      }

      setIsEditing(false);
      alert('✓ Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('❌ Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="flex h-full items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => router.push('/pricing')}>Upgrade Plan</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><X className="h-4 w-4 mr-2" />Cancel</Button>
                <Button size="sm" onClick={handleSave}><Save className="h-4 w-4 mr-2" />Save Changes</Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border rounded-lg bg-card/50">
                <ProfileImageUpload
                image={user.image}
                userInitials={user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                onUploadSuccess={async (image) => {
                  console.log('✅ [DASHBOARD] Image uploaded:', image);
                  await fetchProfile();
                }}
                onDeleteSuccess={async () => {
                  console.log('✅ [DASHBOARD] Image deleted');
                  await fetchProfile();
                }}
                size="lg"
              />
              <div className="text-center sm:text-left space-y-1 flex-1">
                <h3 className="font-semibold text-xl">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {user.bio && <p className="text-sm italic mt-2 text-foreground/80">{user.bio}</p>}
              </div>
            </div>

            {isEditing ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleInputChange} placeholder="+1 234 567 890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input id="whatsappNumber" name="whatsappNumber" value={formData.whatsappNumber || ''} onChange={handleInputChange} placeholder="+1 234 567 890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} placeholder="Tell us about yourself" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address || ''} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <Input value={formData.socialLinks?.linkedin || ''} onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)} placeholder="LinkedIn URL" className="h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="h-4 w-4 text-sky-500" />
                      <Input value={formData.socialLinks?.x || ''} onChange={(e) => handleSocialLinkChange('x', e.target.value)} placeholder="Twitter (X) URL" className="h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      <Input value={formData.socialLinks?.instagram || ''} onChange={(e) => handleSocialLinkChange('instagram', e.target.value)} placeholder="Instagram URL" className="h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-800" />
                      <Input value={formData.socialLinks?.facebook || ''} onChange={(e) => handleSocialLinkChange('facebook', e.target.value)} placeholder="Facebook URL" className="h-8 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="overflow-hidden">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phoneNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{user.whatsappNumber || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Country</p>
                      <p className="font-medium">{user.country || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md md:col-span-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium truncate">{user.address || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {(user.socialLinks?.linkedin || user.socialLinks?.x || user.socialLinks?.instagram || user.socialLinks?.facebook) && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 text-muted-foreground">Connected Accounts</h4>
                    <div className="flex gap-4">
                      {user.socialLinks?.linkedin && (
                        <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full hover:opacity-80 transition-opacity">
                          <Linkedin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </a>
                      )}
                      {user.socialLinks?.x && (
                        <a href={user.socialLinks.x} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-100 dark:bg-sky-900/20 rounded-full hover:opacity-80 transition-opacity">
                          <Twitter className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                        </a>
                      )}
                      {user.socialLinks?.instagram && (
                        <a href={user.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 dark:bg-pink-900/20 rounded-full hover:opacity-80 transition-opacity">
                          <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </a>
                      )}
                      {user.socialLinks?.facebook && (
                        <a href={user.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full hover:opacity-80 transition-opacity">
                          <Facebook className="h-5 w-5 text-blue-800 dark:text-blue-400" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Current plan details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <Shield className="h-16 w-16 text-primary/50" />
              <div className="text-center space-y-2">
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
                    {new Date(user.planEndsAt) > new Date() && (
                      <p className="text-xs font-medium text-primary">
                        {Math.ceil((new Date(user.planEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </p>
                    )}
                  </div>
                )}

                {/* Expiration Warning */}
                {user.planEndsAt && new Date(user.planEndsAt) > new Date() &&
                  Math.ceil((new Date(user.planEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7 && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-400">
                      ⚠️ Renew soon to avoid interruption
                    </div>
                  )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" className="w-full" onClick={() => router.push('/pricing')}>
              {user.subscriptionStatus === 'active' ? 'Upgrade Plan' : 'View Plans'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
