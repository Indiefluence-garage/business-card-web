'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/lib/services/user.service';
import { User } from '@/lib/types';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { EditProfileModal } from '@/components/dashboard/EditProfileModal';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  CreditCard,
  Sparkles,
  Edit3,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Loader2,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Copy,
  QrCode,
  Layers,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

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

  const handleCopyProfileLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/contact/${user?.id || 'me'}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center">
            <div className="animate-ping absolute h-full w-full rounded-full bg-primary/20" />
            <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Loading executive command center...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, url: user.socialLinks?.linkedin, color: 'hover:text-blue-500 hover:border-blue-500/40' },
    { key: 'x', label: 'X (Twitter)', icon: Twitter, url: user.socialLinks?.x, color: 'hover:text-cyan-400 hover:border-cyan-400/40' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, url: user.socialLinks?.instagram, color: 'hover:text-pink-500 hover:border-pink-500/40' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, url: user.socialLinks?.facebook, color: 'hover:text-blue-600 hover:border-blue-600/40' },
  ].filter(link => link.url);

  const isPro = user.subscriptionStatus === 'active';

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-primary tracking-wider uppercase mb-1">
              Executive Command Center
            </p>
            <h1 className="text-xl sm:text-3xl font-display font-bold text-foreground">
              Welcome back, {user.firstName || 'Executive'}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Manage your personal digital business card, subscription entitlements, and synced connections.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleCopyProfileLink}
              className="rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold h-10 px-3"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Share Card</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="btn-primary-glow rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold h-10 px-3"
            >
              <Edit3 className="h-4 w-4 shrink-0" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onUpdate={(updatedUser) => setUser(updatedUser)}
        />

        {/* Main Profile Hero Card */}
        <div className="rounded-2xl sm:rounded-3xl glass-panel border border-border overflow-hidden shadow-xl">
          
          {/* Executive Cover Banner */}
          <div className="relative h-28 sm:h-36 bg-secondary overflow-hidden border-b border-border">
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
              <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md ${
                isPro 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                  : 'bg-secondary/80 text-muted-foreground border-border'
              }`}>
                <span className={`h-2 w-2 rounded-full ${isPro ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                {isPro ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
          </div>

          {/* User Profile Header Content */}
          <div className="px-4 sm:px-10 pb-6 sm:pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 -mt-14 sm:-mt-20 mb-4 sm:mb-6">
              
              {/* Avatar upload */}
              <div className="relative inline-flex w-fit shrink-0">
                <div className="p-1 rounded-full bg-background ring-4 ring-background shadow-xl w-fit shrink-0 inline-flex">
                  <ProfileImageUpload
                    currentImageUrl={user.imageUrl}
                    userInitials={`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`}
                    onUploadSuccess={handleImageUpload}
                    onDeleteSuccess={handleImageDelete}
                    size="lg"
                    showHelperText={false}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/pricing')}
                  className="rounded-xl text-xs font-semibold h-9 px-3.5"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {isPro ? 'Manage Subscription' : 'Upgrade to Unlimited'}
                </Button>
              </div>
            </div>

            {/* Name, Email & Bio */}
            <div className="space-y-3 max-w-3xl">
              <div>
                <h2 className="text-xl sm:text-3xl font-display font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground font-mono break-all">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    {user.email}
                  </span>
                  {user.phoneNumber && (
                    <span className="flex items-center gap-1.5 font-mono">
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                      {user.phoneNumber}
                    </span>
                  )}
                  {user.country && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                      {user.country}
                    </span>
                  )}
                </div>
              </div>

              {user.bio ? (
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/40 border border-border text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                  &ldquo;{user.bio}&rdquo;
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No bio added yet. Click &ldquo;Edit Profile&rdquo; to add your executive summary.
                </p>
              )}
            </div>

            {/* Contact Details Grid */}
            <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-card border border-border/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Office Location
                </span>
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.address || 'Not specified'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Member Since
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recently joined'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-card border border-border/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Cloud Sync Status
                </span>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Active & Protected
                </p>
              </div>
            </div>

            {/* Social Presence Links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
                  Social Presence:
                </span>
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold transition-all ${link.color}`}
                  >
                    <link.icon className="h-3.5 w-3.5" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subscription & Entitlements Section */}
        <div className="rounded-2xl sm:rounded-3xl glass-panel-glow border border-primary/20 p-5 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                    Subscription & Credits
                  </h3>
                  {isPro && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      Unlimited Plan
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                  {isPro ? (
                    <>
                      Active until{' '}
                      <strong>
                        {user.planEndsAt ? new Date(user.planEndsAt).toLocaleDateString() : 'Active subscription'}
                      </strong>
                      . Continuous Flash Scan and AI Voice notes enabled.
                    </>
                  ) : (
                    'You are on the free tier. Upgrade for unlimited continuous flash scans and Google Calendar sync.'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-border/60 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
              
              {/* Premium Credits Badge */}
              <div className="flex flex-col justify-center px-5 h-12 bg-secondary/50 rounded-lg border border-border/50 shadow-sm">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">
                  Credits
                </span>
                <span className="text-base font-display font-black text-primary leading-none tracking-tight">
                  {user.creditsRemaining === 999999 || isPro ? 'Unlimited' : user.creditsRemaining || 0}
                </span>
              </div>

              <Button
                onClick={() => router.push('/pricing')}
                className="btn-primary-glow rounded-lg font-bold text-sm h-12 px-6 flex items-center justify-center shrink-0 shadow-sm"
              >
                {isPro ? 'Manage Plan' : 'Upgrade to Pro'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
