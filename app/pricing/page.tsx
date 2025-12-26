'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, CreditCard } from 'lucide-react';
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

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getPlans();
        if (data.plans) {
             setPlans(data.plans);
        }
      } catch (error) {
        console.error('Failed to fetch plans', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (plan.price === 0) {
        // Free plan logic, maybe just redirect or "buy" for 0
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

        // Handle specific error types from backend
        const errorData = error.response?.data;

        if (errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS') {
            alert(`⚠️ You already have an active ${errorData.data?.currentPlan || 'subscription'}!\n\nExpires: ${errorData.data?.expiresAt ? new Date(errorData.data.expiresAt).toLocaleDateString() : 'N/A'}\nCredits: ${errorData.data?.creditsRemaining || 0}\n\nPlease wait for your current plan to expire before purchasing a new one.`);
        } else if (errorData?.error === 'INVALID_PLAN_ID') {
            alert('❌ Invalid plan selected. Please try again.');
        } else if (errorData?.error === 'PAYMENT_PROCESSING_FAILED') {
            alert('❌ Payment processing failed. Please try again later.');
        } else {
            alert('❌ Payment failed. Please try again.');
        }
    } finally {
        setProcessingId(null);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose the plan that fits your networking needs.
              </p>
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
          ) : (
            <div className="grid max-w-7xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mx-auto">
              {plans.length > 0 ? (
                  plans.map((plan) => (
                    <Card key={plan.id} className={`flex flex-col relative ${plan.isPopular ? 'border-primary shadow-lg scale-105' : ''}`}>
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Most Popular
                            </div>
                        )}
                      <CardHeader>
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription>
                             {plan.price === 0 ? (
                                <span className="text-3xl font-bold text-foreground">Free</span>
                             ): (
                                 <>
                                    <span className="text-3xl font-bold text-foreground">${(plan.price / 100).toFixed(2)}</span>
                                    <span className="text-muted-foreground capitalize"> / {plan.interval}</span>
                                 </>
                             )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <ul className="space-y-2">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-primary" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                            className="w-full"
                            variant={plan.isPopular ? 'default' : 'outline'}
                            onClick={() => handleSubscribe(plan)}
                            disabled={!!processingId}
                        >
                            {processingId === plan.id ? 'Processing...' : (plan.price === 0 ? 'Get Started' : 'Subscribe Now')}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              ) : (
                  <div className="col-span-3 text-center text-muted-foreground py-12">
                      No plans available at the moment.
                  </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
