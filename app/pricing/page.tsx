'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Zap, Crown, Star, CheckCircle } from 'lucide-react';
import { subscriptionService } from '@/lib/services/subscription.service';
import { paymentService } from '@/lib/services/payment.service';
import { userService } from '@/lib/services/user.service';
import { Plan, User } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans
        const plansData = await subscriptionService.getPlans();
        if (plansData.plans) {
          setPlans(plansData.plans);
        }

        // Try to fetch current user (might not be logged in)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const profileData = await userService.getProfile();
            if (profileData?.data) {
              setCurrentUser(profileData.data);
            } else {
              setCurrentUser(profileData as unknown as User);
            }
          } catch (e) {
            // User not logged in or token expired
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

    // Check if this is the current plan
    if (currentUser?.planId === plan.id) {
      return; // Already subscribed
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
      } else if (errorData?.error === 'INVALID_PLAN_ID') {
        alert('❌ Invalid plan selected. Please try again.');
      } else {
        alert('❌ Payment failed. Please try again.');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getPlanIcon = (index: number) => {
    const icons = [Star, Zap, Crown, Sparkles];
    const Icon = icons[index % icons.length];
    return <Icon className="h-6 w-6" />;
  };

  const isCurrentPlan = (planId: string) => {
    if (!currentUser) return false;

    // Handle free plan
    if (planId === 'free' && (!currentUser.planId || currentUser.subscriptionStatus === 'free')) {
      return true;
    }

    return currentUser.planId === planId && currentUser.subscriptionStatus === 'active';
  };

  return (
    <div className="min-h-screen gradient-bg-subtle">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-primary/5 text-primary rounded-full border border-primary/10">
              <Sparkles className="h-4 w-4" />
              Simple, transparent pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Unlock powerful features to manage your professional network effortlessly.
              No hidden fees, cancel anytime.
            </p>

            {/* Current plan indicator */}
            {currentUser && currentUser.planId && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                You're on the {currentUser.planId.replace('tier', 'Tier ')} plan
                {currentUser.planEndsAt && (
                  <span className="text-green-600 dark:text-green-500">
                    • Expires {new Date(currentUser.planEndsAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading plans...</p>
              </div>
            </div>
          ) : (
            <div className="grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4 mx-auto">
              {plans.length > 0 ? (
                plans.map((plan, index) => {
                  const isCurrent = isCurrentPlan(plan.id);

                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col rounded-2xl border bg-card p-6 card-hover ${isCurrent
                          ? 'border-green-500 ring-2 ring-green-500/20'
                          : plan.isPopular
                            ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]'
                            : 'border-border'
                        }`}
                    >
                      {/* Current Plan Badge */}
                      {isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Your Plan
                          </span>
                        </div>
                      )}

                      {/* Popular Badge (only if not current) */}
                      {plan.isPopular && !isCurrent && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                            <Crown className="h-3 w-3" />
                            Most Popular
                          </span>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="mb-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isCurrent
                            ? 'bg-green-500 text-white'
                            : plan.isPopular
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          }`}>
                          {getPlanIcon(index)}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                          {plan.price === 0 ? (
                            <span className="text-4xl font-bold text-foreground">Free</span>
                          ) : (
                            <>
                              <span className="text-4xl font-bold text-foreground">
                                ${(plan.price / 100).toFixed(0)}
                              </span>
                              <span className="text-muted-foreground capitalize">/{plan.interval}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 flex-1 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isCurrent ? 'bg-green-500/10' : 'bg-primary/10'
                              }`}>
                              <Check className={`h-3 w-3 ${isCurrent ? 'text-green-500' : 'text-primary'}`} />
                            </div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        className={`w-full ${isCurrent
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : plan.isPopular
                              ? 'btn-gentle'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                        variant={isCurrent ? 'default' : plan.isPopular ? 'default' : 'secondary'}
                        onClick={() => handleSubscribe(plan)}
                        disabled={!!processingId || isCurrent}
                      >
                        {isCurrent
                          ? 'Current Plan'
                          : processingId === plan.id
                            ? 'Processing...'
                            : plan.price === 0
                              ? 'Get Started Free'
                              : 'Subscribe Now'
                        }
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-4 text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No plans available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Contact us at <a href="mailto:support@cardcrm.com" className="text-primary hover:underline">support@cardcrm.com</a>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser ? (
                <>
                  <Button variant="outline" className="transition-gentle" onClick={() => router.push('/login')}>
                    Sign In
                  </Button>
                  <Button className="btn-gentle" onClick={() => router.push('/signup')}>
                    Get Started Free
                  </Button>
                </>
              ) : (
                <Button className="btn-gentle" onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
