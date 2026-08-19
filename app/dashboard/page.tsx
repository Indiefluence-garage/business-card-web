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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              Executive Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Welcome back, {user.firstName || 'Executive'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your personal digital business card, subscription entitlements, and synced connections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleCopyProfileLink}
              className="rounded-xl flex items-center gap-2 text-xs font-semibold"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                  <span>Share Digital Card</span>
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="btn-primary-glow rounded-xl flex items-center gap-2 text-xs font-semibold"
            >
              <Edit3 className="h-4 w-4" />
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
        <div className="rounded-3xl glass-panel border border-border overflow-hidden shadow-xl">
          
          {/* Dynamic Ambient Cover Banner */}
          <div className="relative h-40 sm:h-48 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/10 overflow-hidden border-b border-border/60">
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 backdrop-blur-md ${
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
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              
              {/* Avatar upload */}
              <div className="relative inline-block">
                <div className="p-1 rounded-full bg-background ring-4 ring-background shadow-xl">
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
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/pricing')}
                  className="rounded-xl text-xs font-semibold"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {isPro ? 'Manage Subscription' : 'Upgrade to Unlimited'}
                </Button>
              </div>
            </div>

            {/* Name, Email & Bio */}
            <div className="space-y-3 max-w-3xl">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-foreground font-mono">
                    <Mail className="h-4 w-4 text-primary" />
                    {user.email}
                  </span>
                  {user.phoneNumber && (
                    <span className="flex items-center gap-1.5 font-mono">
                      <Phone className="h-4 w-4 text-primary" />
                      {user.phoneNumber}
                    </span>
                  )}
                  {user.country && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-primary" />
                      {user.country}
                    </span>
                  )}
                </div>
              </div>

              {user.bio ? (
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border text-sm text-foreground/90 leading-relaxed italic">
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
        <div className="rounded-3xl glass-panel-glow border border-primary/20 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Subscription & Vision Credits
                  </h3>
                  {isPro && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      Unlimited Plan
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
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

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xs font-mono font-semibold text-muted-foreground">Remaining Credits</div>
                <div className="text-xl font-display font-extrabold text-primary">
                  {user.creditsRemaining === 999999 || isPro ? 'Unlimited' : user.creditsRemaining || 0}
                </div>
              </div>

              <Button
                onClick={() => router.push('/pricing')}
                className="btn-primary-glow rounded-xl font-semibold text-xs h-11 px-5"
              >
                {isPro ? 'Manage Plan' : 'Upgrade to Pro'}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
