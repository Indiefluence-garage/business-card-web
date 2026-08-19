'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { subscriptionService } from '@/lib/services/subscription.service';
import { paymentService } from '@/lib/services/payment.service';
import { userService } from '@/lib/services/user.service';
import { Plan, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { StatusModal, StatusModalType } from '@/components/ui/StatusModal';

interface StatusModalState {
  isOpen: boolean;
  type: StatusModalType;
  title: string;
  message: string;
  details?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [statusModal, setStatusModal] = useState<StatusModalState>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansData = await subscriptionService.getPlans();
        if (plansData.plans) {
          setPlans(plansData.plans);
        }

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const profileData = await userService.getProfile();
            if (profileData?.data) {
              setCurrentUser(profileData.data);
            } else {
              setCurrentUser(profileData as unknown as User);
            }
          } catch {
            console.log('User not authenticated');
          }
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (plan.price === 0) {
      router.push('/dashboard');
      return;
    }

    if (currentUser?.planId === plan.id && currentUser?.subscriptionStatus === 'active') {
      return;
    }

    try {
      setProcessingId(plan.id);
      const token = localStorage.getItem('token');
      if (!token) {
        setStatusModal({
          isOpen: true,
          type: 'auth',
          title: 'Account Sign In Required',
          message: 'Please sign in or create your Lukewarm account to link and activate your subscription.',
          actionLabel: 'Sign In to Account',
          actionUrl: '/login?redirect=/pricing',
        });
        return;
      }

      const response = await paymentService.createPayment(plan.id);
      if (response.success) {
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: 'Subscription Activated! 🎉',
          message: `Your ${plan.name} plan has been activated successfully and is valid until ${new Date(
            response.data.expiresAt
          ).toLocaleDateString()}. You have unlimited card scanning and AI features!`,
          actionLabel: 'Go to Dashboard',
          actionUrl: '/dashboard',
        });
      } else {
        setStatusModal({
          isOpen: true,
          type: 'error',
          title: 'Payment Processing Failed',
          message: response.message || 'Unable to complete the payment transaction. Please try again.',
        });
      }
    } catch (error: unknown) {
      console.error('Payment error', error);
      const err = error as { response?: { status?: number; data?: { error?: string; message?: string; data?: { currentPlan?: string; expiresAt?: string } } }; message?: string };
      const errorData = err.response?.data;

      if (errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS') {
        const planName = (errorData.data?.currentPlan || 'an active').toUpperCase();
        const expiry = errorData.data?.expiresAt ? new Date(errorData.data.expiresAt).toLocaleDateString() : 'N/A';
        setStatusModal({
          isOpen: true,
          type: 'warning',
          title: 'Active Subscription Exists',
          message: `You currently have an active ${planName} plan that expires on ${expiry}. You already have full access to all features!`,
          actionLabel: 'View Dashboard',
          actionUrl: '/dashboard',
        });
      } else if (errorData?.error === 'INVALID_PLAN_ID') {
        setStatusModal({
          isOpen: true,
          type: 'error',
          title: 'Invalid Plan Selection',
          message: 'The selected subscription plan is no longer available. Please select another plan.',
        });
      } else if (err.response?.status === 401 || errorData?.error === 'UNAUTHORIZED') {
        setStatusModal({
          isOpen: true,
          type: 'auth',
          title: 'Authentication Required',
          message: 'Your session has expired. Please sign in again to activate your plan.',
          actionLabel: 'Sign In Again',
          actionUrl: '/login?redirect=/pricing',
        });
      } else {
        setStatusModal({
          isOpen: true,
          type: 'error',
          title: 'Payment Request Error',
          message: errorData?.message || err.message || 'Unable to process payment at this moment. Please try again later.',
        });
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getPlanBadge = (index: number) => {
    if (index === 1) return { label: 'Starter', icon: Zap };
    if (index === 2) return { label: 'Most Popular', icon: Crown };
    if (index === 3) return { label: 'Best Value', icon: Sparkles };
    return { label: 'Free Tier', icon: Star };
  };

  const isCurrentPlan = (planId: string) => {
    if (!currentUser) return false;
    if (planId === 'free' && (!currentUser.planId || currentUser.subscriptionStatus === 'free')) {
      return true;
    }
    return currentUser.planId === planId && currentUser.subscriptionStatus === 'active';
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          Simple, Transparent Pricing
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
          Invest in Your <span className="text-gradient">Professional Network.</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Every paid tier includes full unrestricted access to continuous flash scan, voice memo AI, and Google Calendar sync. Choose your preferred duration.
        </p>

        {/* Current Plan Indicator Banner */}
        {currentUser && currentUser.planId && currentUser.subscriptionStatus === 'active' && (
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              You have an active <strong>{currentUser.planId.replace('tier', 'Tier ')}</strong> subscription
            </span>
            {currentUser.planEndsAt && (
              <span className="text-muted-foreground font-normal">
                • Valid until {new Date(currentUser.planEndsAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Loading subscription plans...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => {
              const isCurrent = isCurrentPlan(plan.id);
              const isRecommended = plan.isPopular || plan.id === 'tier2';
              const badge = getPlanBadge(index);
              const Icon = badge.icon;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-card border-2 border-emerald-500 shadow-lg'
                      : isRecommended
                      ? 'glass-panel-glow border-2 border-primary shadow-xl scale-[1.02] z-10'
                      : 'glass-panel card-hover'
                  }`}
                >
                  {/* Badge */}
                  {isCurrent ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        Current Plan
                      </span>
                    </div>
                  ) : isRecommended ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 text-xs font-bold bg-primary text-white rounded-full shadow-md">
                        <Crown className="h-3 w-3" />
                        Recommended
                      </span>
                    </div>
                  ) : null}

                  {/* Plan Name & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {plan.id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-6 min-h-[32px]">
                    {plan.price === 0
                      ? 'Free essential business card scanner to get started.'
                      : `Full AI suite access with continuous updates for ${plan.interval || 'period'}.`}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 pb-6 mb-6 border-b border-border">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-extrabold font-display text-foreground">$0</span>
                    ) : (
                      <>
                        <span className="text-4xl font-extrabold font-display text-foreground">
                          ${(plan.price / 100).toFixed(0)}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          / {plan.interval || 'month'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Features Checklist */}
                  <div className="flex-1 space-y-3 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                        <div className="h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Subscribe Button */}
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!processingId || isCurrent}
                    className={`w-full rounded-2xl h-12 font-bold text-xs ${
                      isCurrent
                        ? 'bg-emerald-500 text-white cursor-default'
                        : isRecommended
                        ? 'btn-primary-glow'
                        : 'btn-gentle'
                    }`}
                    variant={isCurrent ? 'default' : isRecommended ? 'default' : 'secondary'}
                  >
                    {isCurrent ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Active Plan
                      </span>
                    ) : processingId === plan.id ? (
                      'Activating...'
                    ) : plan.price === 0 ? (
                      'Get Started Free'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <span>Subscribe for ${(plan.price / 100).toFixed(0)}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto mt-24">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Detailed Capability Matrix
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Compare all features across free and paid subscriptions.
          </p>
        </div>

        <div className="rounded-3xl glass-panel border border-border overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="p-4 font-bold text-foreground">Feature</th>
                  <th className="p-4 font-bold text-center text-muted-foreground">Free Tier</th>
                  <th className="p-4 font-bold text-center text-primary">All Paid Tiers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: 'Vision OCR Scanning', free: '10 Cards Total', pro: 'Unlimited 4K OCR' },
                  { name: 'Continuous Flash Scan (Burst Mode)', free: 'Manual only', pro: 'Full Continuous Speed' },
                  { name: 'AI Voice Memo Transcription', free: 'Unavailable', pro: 'Unlimited Voice Memos' },
                  { name: 'Google Calendar Auto-Sync', free: 'Unavailable', pro: 'Automatic Action Sync' },
                  { name: 'Contextual Selfie Attachments', free: 'Limited (3)', pro: 'Unlimited Context Photos' },
                  { name: 'Conference / Live Event Tagging', free: '1 Event', pro: 'Unlimited Events' },
                  { name: 'vCard (.vcf) & CSV Export', free: 'Basic vCard', pro: 'Full CRM & CSV Export' },
                  { name: 'Customer Support Priority', free: 'Standard', pro: 'Priority Engineering SLA' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium text-foreground">{row.name}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.free}</td>
                    <td className="p-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-4xl mx-auto mt-16 p-8 rounded-3xl glass-panel border border-border/70 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-foreground text-sm">Safe & Instant Activation</h4>
            <p className="text-xs text-muted-foreground">Instant entitlement unlocking. Secure Stripe processing.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl text-xs" asChild>
          <a href="mailto:support@cardcrm.com">Contact Sales for Enterprise Teams</a>
        </Button>
      </div>

      {/* Interactive Status Modal */}
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal((prev) => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        details={statusModal.details}
        actionLabel={statusModal.actionLabel}
        onAction={
          statusModal.actionUrl
            ? () => {
                const url = statusModal.actionUrl!;
                setStatusModal((prev) => ({ ...prev, isOpen: false }));
                router.push(url);
              }
            : undefined
        }
      />

    </div>
  );
}
