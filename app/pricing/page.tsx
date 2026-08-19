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

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'one-time',
    features: [
      '20 card scans (One-time)',
      'Basic contact storage',
      'vCard digital sharing',
      'Ads displayed'
    ],
    isPopular: false,
    validityDays: -1,
  },
  {
    id: 'tier1',
    name: 'Starter',
    price: 299, // $2.99
    interval: '30 days',
    features: [
      'Unlimited card scans',
      'Continuous Flash Scan (Card + Audio)',
      'AI Voice Note Transcription',
      'No ads experience',
      'Google Calendar & Event Sync',
      'Valid for 30 days'
    ],
    isPopular: false,
    validityDays: 30,
  },
  {
    id: 'tier2',
    name: 'Standard',
    price: 999, // $9.99
    interval: '90 days',
    features: [
      'Unlimited card scans',
      'Continuous Flash Scan (Card + Audio)',
      'AI Voice Note Transcription',
      'No ads experience',
      'Google Calendar & Event Sync',
      'Valid for 90 days'
    ],
    isPopular: true,
    validityDays: 90,
  },
  {
    id: 'tier3',
    name: 'Premium',
    price: 1999, // $19.99
    interval: '365 days',
    features: [
      'Unlimited card scans',
      'Continuous Flash Scan (Card + Audio)',
      'AI Voice Note Transcription',
      'No ads experience',
      'Google Calendar & Event Sync',
      'Valid for 365 days (1 Year)'
    ],
    isPopular: false,
    validityDays: 365,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
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
        if (plansData?.plans && plansData.plans.length > 0) {
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
        console.error('Failed to fetch data, using default plans', error);
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

  const formatPrice = (priceInCents: number) => {
    if (priceInCents === 0) return '$0';
    if (priceInCents === 299) return '$2.99';
    if (priceInCents === 999) return '$9.99';
    if (priceInCents === 1999) return '$19.99';
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-border">
          <Sparkles className="h-3.5 w-3.5" />
          Subscription Plans & Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
          4 Straightforward Plans for Every Networker
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Choose between trial free access or upfront paid validity (30, 90, or 365 days). All paid tiers include unlimited continuous scanning and AI voice note transcription.
        </p>

        {/* Current Plan Indicator Banner */}
        {currentUser && currentUser.planId && currentUser.subscriptionStatus === 'active' && (
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>
              You currently have an active <strong>{currentUser.planId.replace('tier', 'Tier ').toUpperCase()}</strong> subscription
            </span>
            {currentUser.planEndsAt && (
              <span className="text-muted-foreground font-normal">
                • Valid until {new Date(currentUser.planEndsAt).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4-Column Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, index) => {
            const isCurrent = isCurrentPlan(plan.id);
            const isRecommended = plan.isPopular || plan.id === 'tier2';
            const badge = getPlanBadge(index);
            const Icon = badge.icon;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl p-6 transition-all duration-200 ${
                  isCurrent
                    ? 'bg-card border-2 border-emerald-600 shadow-sm'
                    : isRecommended
                    ? 'bg-card border-2 border-primary shadow-md ring-1 ring-primary/20'
                    : 'bg-card border border-border shadow-xs hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {/* Badge */}
                {isCurrent ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full shadow-xs">
                      <CheckCircle2 className="h-3 w-3" />
                      Current Plan
                    </span>
                  </div>
                ) : isRecommended ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full shadow-xs">
                      <Crown className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                ) : null}

                {/* Plan Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-secondary text-primary flex items-center justify-center font-bold">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    {plan.id.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-6 min-h-[32px] leading-relaxed">
                  {plan.price === 0
                    ? 'Basic access with 20 one-time card scans to try the platform.'
                    : `Full AI suite access with continuous updates for ${plan.interval || 'period'}.`}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 pb-6 mb-6 border-b border-border">
                  <span className="text-3xl font-bold text-foreground font-mono">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    / {plan.interval || 'period'}
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="flex-1 space-y-3 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Features Included:
                  </span>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action Button */}
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={!!processingId || isCurrent}
                  className={`w-full rounded-lg h-11 font-semibold text-xs ${
                    isCurrent
                      ? 'bg-emerald-600 text-white cursor-default hover:bg-emerald-600'
                      : isRecommended
                      ? 'btn-primary-glow'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
                  }`}
                  variant={isCurrent ? 'default' : isRecommended ? 'default' : 'secondary'}
                >
                  {isCurrent ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Active Subscription
                    </span>
                  ) : processingId === plan.id ? (
                    'Processing Activation...'
                  ) : plan.price === 0 ? (
                    'Get Started Free'
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <span>Activate {plan.name} ({formatPrice(plan.price)})</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Detailed Capability Comparison Matrix
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Clear feature breakdown across all 4 plans.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="p-3.5 font-bold text-foreground">Feature</th>
                  <th className="p-3.5 font-bold text-center text-muted-foreground">Free ($0)</th>
                  <th className="p-3.5 font-bold text-center text-foreground">Starter ($2.99)</th>
                  <th className="p-3.5 font-bold text-center text-primary">Standard ($9.99)</th>
                  <th className="p-3.5 font-bold text-center text-foreground">Premium ($19.99)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: 'Card Scan Quota', free: '20 One-time', t1: 'Unlimited', t2: 'Unlimited', t3: 'Unlimited' },
                  { name: 'Plan Validity', free: 'Perpetual', t1: '30 Days', t2: '90 Days', t3: '365 Days (1 Year)' },
                  { name: 'Continuous Flash Scan Mode', free: 'Manual only', t1: 'Included', t2: 'Included', t3: 'Included' },
                  { name: 'AI Voice Memo Transcription', free: '—', t1: 'Included', t2: 'Included', t3: 'Included' },
                  { name: 'Google Calendar Auto-Sync', free: '—', t1: 'Included', t2: 'Included', t3: 'Included' },
                  { name: 'Ad-Free Experience', free: 'Ads shown', t1: 'No Ads', t2: 'No Ads', t3: 'No Ads' },
                  { name: 'vCard (.vcf) & CSV Export', free: 'vCard only', t1: 'Full Export', t2: 'Full Export', t3: 'Full Export' },
                  { name: 'Customer Support', free: 'Community', t1: 'Standard Email', t2: 'Priority Email', t3: 'Priority SLA' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-3.5 font-medium text-foreground">{row.name}</td>
                    <td className="p-3.5 text-center text-muted-foreground">{row.free}</td>
                    <td className="p-3.5 text-center font-semibold text-foreground">{row.t1}</td>
                    <td className="p-3.5 text-center font-bold text-primary">{row.t2}</td>
                    <td className="p-3.5 text-center font-semibold text-foreground">{row.t3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="max-w-4xl mx-auto mt-14 p-6 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-lg bg-secondary text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">Instant Plan Entitlement</h4>
            <p className="text-xs text-muted-foreground">7-Day money-back guarantee. Secure Stripe payment gateway.</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-lg text-xs" asChild>
          <a href="mailto:support@lukewarm.app">Contact for Enterprise Invoices</a>
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
