'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, CreditCard, Zap, Shield, Globe, Crown, Users, Building, Building2, Sparkles, Star } from 'lucide-react';
import { subscriptionService } from '@/lib/services/subscription.service';
import { paymentService } from '@/lib/services/payment.service';
import { Plan } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/form-elements';

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    individual: { planId: string; status: string };
    organization: { planId: string; status: string; role: string } | null;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'individual' | 'organization'>('individual');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, statusData] = await Promise.all([
          subscriptionService.getPlans(),
          subscriptionService.getStatus().catch(() => null)
        ]);

        if (plansData.plans) {
          setPlans(plansData.plans);
        }
        if (statusData?.success) {
          setSubscriptionStatus(statusData.data);
        }
      } catch (error) {
        console.error('Failed to fetch pricing data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPlans = plans.filter(p => p.targetType === activeTab);

  const isCurrentPlan = (planId: string) => {
    if (!subscriptionStatus) return false;

    if (activeTab === 'individual') {
      return subscriptionStatus.individual.planId === planId;
    } else {
      return subscriptionStatus.organization?.planId === planId;
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (plan.price === 0) {
      router.push('/dashboard');
      return;
    }

    try {
      setProcessingId(plan.id);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await paymentService.createPayment(plan.id);
      if (response.success) {
        alert(`✓ Success! ${plan.name} plan activated.\nExpires: ${new Date(response.data.expiresAt).toLocaleDateString()}\nCredits: ${response.data.credits === 999999 ? 'Unlimited' : response.data.credits}`);
        router.push('/dashboard');
      } else {
        alert('Payment failed: ' + response.message);
      }
    } catch (error: any) {
      console.error('Payment error', error);
      const errorData = error.response?.data;
      if (errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS') {
        alert(`⚠️ You already have an active ${errorData.data?.currentPlan || 'subscription'}!\n\nExpires: ${errorData.data?.expiresAt ? new Date(errorData.data.expiresAt).toLocaleDateString() : 'N/A'}\nCredits: ${errorData.data?.creditsRemaining || 0}\n\nPlease wait for your current plan to expire before purchasing a new one.`);
      } else {
        alert('❌ Payment failed. Please try again.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getPlanIcon = (id: string) => {
    switch (id) {
      case 'free':
      case 'org_free':
        return <Zap className="h-6 w-6 text-orange-500" />;
      case 'tier1':
        return <Shield className="h-6 w-6 text-blue-500" />;
      case 'tier2':
        return <Globe className="h-6 w-6 text-indigo-500" />;
      case 'tier3':
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 'org_tier1':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'org_tier2':
        return <Building className="h-6 w-6 text-indigo-500" />;
      case 'org_tier3':
        return <Building2 className="h-6 w-6 text-purple-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-background">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full blur-2xl" />
      </div>

      <main className="relative flex-1 py-16 md:py-24 z-10">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="h-3 w-3 fill-primary" />
              <span>Pricing Plans</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent italic">Choose Your</span><br />
                <span className="bg-gradient-to-br from-primary via-primary to-accent bg-clip-text text-transparent">Power Tier</span>
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto leading-relaxed">
                Scale your {activeTab === 'individual' ? 'personal brand' : 'organization'} with precision. Transparent costs, powerful benefits.
              </p>
            </div>

            {/* Toggle Switch - Premium Design */}
            <div className="relative flex p-1.5 bg-secondary/50 backdrop-blur-md border border-border/50 rounded-2xl mt-8 shadow-inner overflow-hidden max-w-md w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('individual')}
                className={`relative z-10 flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'individual' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {activeTab === 'individual' && (
                  <div className="absolute inset-0 bg-primary rounded-xl shadow-lg -z-10 animate-in fade-in zoom-in-95 duration-300" />
                )}
                Individual
              </button>
              <button
                onClick={() => setActiveTab('organization')}
                className={`relative z-10 flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'organization' ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {activeTab === 'organization' && (
                  <div className="absolute inset-0 bg-primary rounded-xl shadow-lg -z-10 animate-in fade-in zoom-in-95 duration-300" />
                )}
                Organization
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium animate-pulse">Loading amazing plans...</p>
            </div>
          ) : (
            <div className={`grid gap-8 py-4 mx-auto animate-in fade-in duration-1000 ${filteredPlans.length === 1 ? 'max-w-md' :
              filteredPlans.length === 2 ? 'md:grid-cols-2 max-w-4xl' :
                filteredPlans.length === 3 ? 'lg:grid-cols-3 max-w-6xl' :
                  'md:grid-cols-2 xl:grid-cols-4'
              }`}>
              {filteredPlans.length > 0 ? (
                filteredPlans.sort((a, b) => a.price - b.price).map((plan, idx) => (
                  <Card
                    key={plan.id}
                    className={`group flex flex-col relative overflow-hidden transition-all duration-500 border-border/60 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${plan.isPopular ? 'ring-2 ring-primary ring-opacity-20 bg-card/50' : 'bg-card/30'
                      } ${isCurrentPlan(plan.id) ? 'ring-2 ring-accent ring-opacity-50' : ''} backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {isCurrentPlan(plan.id) && (
                      <div className="absolute top-4 left-[-35px] -rotate-45 bg-accent text-white text-[10px] font-black px-10 py-1.5 uppercase tracking-tighter shadow-lg z-20 overflow-hidden">
                        Current Plan
                      </div>
                    )}

                    {plan.isPopular && !isCurrentPlan(plan.id) && (
                      <div className="absolute top-4 right-[-35px] rotate-45 bg-primary text-white text-[10px] font-black px-10 py-1.5 uppercase tracking-tighter shadow-lg z-20 overflow-hidden">
                        Recommended
                      </div>
                    )}

                    {/* Card Inner Glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <CardHeader className="relative pb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                          {getPlanIcon(plan.id)}
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight">{plan.name}</CardTitle>
                      </div>
                      <CardDescription className="relative">
                        {plan.price === 0 ? (
                          <div className="flex flex-col">
                            <span className="text-4xl font-black text-foreground mb-1">FREE</span>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Lifetime access</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-foreground">$</span>
                              <span className="text-5xl font-black text-foreground tracking-tighter">{Math.floor(plan.price / 100)}</span>
                              <span className="text-lg font-bold text-muted-foreground">.{(plan.price % 100).toString().padStart(2, '0')}</span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                              per {plan.interval === 'one-time' ? 'account' : plan.interval}
                            </span>
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 relative z-10 pt-0">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start group/item">
                            <div className="mt-1 flex-shrink-0 bg-primary/10 rounded-full p-1 mr-3 group-hover/item:bg-primary/20 transition-colors">
                              <Check className="h-3 w-3 text-primary stroke-[3px]" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover/item:text-foreground transition-colors leading-snug">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-8 relative z-10">
                      <Button
                        className={`w-full h-14 rounded-2xl text-sm font-black transition-all duration-300 ${isCurrentPlan(plan.id)
                          ? 'bg-accent text-white cursor-default'
                          : plan.isPopular
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20'
                            : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border/50'
                          } border-t border-white/10`}
                        onClick={() => !isCurrentPlan(plan.id) && handleSubscribe(plan)}
                        disabled={!!processingId || isCurrentPlan(plan.id)}
                      >
                        {processingId === plan.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <span className="flex items-center gap-2 uppercase tracking-widest">
                            {isCurrentPlan(plan.id) ? 'Your Active Plan' : (plan.price === 0 ? 'Launch for Free' : `Activate ${plan.name}`)}
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-center py-24 space-y-4 border-2 border-dashed border-border rounded-3xl bg-secondary/20">
                  <div className="p-4 rounded-full bg-secondary/50">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground">No plans discovered yet</p>
                    <p className="text-sm text-muted-foreground">Our team is crafting something special. Check back shortly.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-24 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 delay-500">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">2k+ Active Teams</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative py-12 border-t border-border/40 bg-card/20 z-10">
        <div className="container px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} Cardio. Elevate your networking intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}
