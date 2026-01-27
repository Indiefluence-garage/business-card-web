'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/lib/services/user.service';
import { User } from '@/lib/types';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Calendar,
  CreditCard,
  Sparkles,
  Edit3,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Loader2
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getProfile();
        if (response?.data) {
          setUser(response.data as User);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleImageUpload = (imageUrl: string) => {
    if (user) {
      setUser({ ...user, imageUrl });
    }
  };

  const handleImageDelete = () => {
    if (user) {
      setUser({ ...user, imageUrl: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const socialLinks = [
    { key: 'instagram', icon: Instagram, url: user.socialLinks?.instagram, color: 'hover:text-pink-500' },
    { key: 'linkedin', icon: Linkedin, url: user.socialLinks?.linkedin, color: 'hover:text-blue-600' },
    { key: 'facebook', icon: Facebook, url: user.socialLinks?.facebook, color: 'hover:text-blue-500' },
    { key: 'x', icon: Twitter, url: user.socialLinks?.x, color: 'hover:text-gray-800 dark:hover:text-gray-200' },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen gradient-bg-subtle p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account details</p>
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-2 transition-gentle">
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Cover + Avatar Section */}
          <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 h-32 md:h-40">
            {/* Avatar positioned at bottom */}
            <div className="absolute -bottom-12 left-6 md:left-8">
              <ProfileImageUpload
                currentImageUrl={user.imageUrl}
                userInitials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                onUploadSuccess={handleImageUpload}
                onDeleteSuccess={handleImageDelete}
                size="lg"
              />
            </div>
          </div>

          {/* Content */}
          <div className="pt-16 pb-6 px-6 md:px-8">
            {/* Name & Email */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-muted-foreground mb-6 max-w-2xl">
                {user.bio}
              </p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {user.phoneNumber && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-foreground">{user.phoneNumber}</p>
                  </div>
                </div>
              )}

              {user.country && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="text-sm font-medium text-foreground">{user.country}</p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium text-foreground truncate">{user.address}</p>
                  </div>
                </div>
              )}

              {user.createdAt && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Social</span>
                <div className="flex gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-colors ${link.color}`}
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Card */}
        <div className="mt-6 bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Subscription</h3>
                <p className="text-sm text-muted-foreground">
                  {user.subscriptionStatus === 'active' ? (
                    <>
                      <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                      {user.planEndsAt && ` • Expires ${new Date(user.planEndsAt).toLocaleDateString()}`}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Free Plan</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user.creditsRemaining !== undefined && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {user.creditsRemaining === 999999 ? 'Unlimited' : user.creditsRemaining} credits
                  </span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/pricing')}
                className="transition-gentle"
              >
                {user.subscriptionStatus === 'active' ? 'Manage' : 'Upgrade'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
