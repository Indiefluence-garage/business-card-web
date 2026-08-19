'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Loader2, CreditCard, ArrowLeft, Zap, ShieldCheck } from 'lucide-react';
import { paymentService } from '@/lib/services/payment.service';
import { StatusModal, StatusModalType } from '@/components/ui/StatusModal';
import Link from 'next/link';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId') || 'tier1';

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: StatusModalType;
    title: string;
    message: string;
    details?: string;
    actionLabel?: string;
    actionUrl?: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const simulateSuccess = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await paymentService.createPayment(planId);
      setResult({
        type: 'success',
        title: 'Payment Successful!',
        message: `${planId} plan activated successfully`,
        data: response.data,
      });
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Payment Successful! 🎉',
        message: `Your ${planId} subscription has been activated successfully.`,
        actionLabel: 'Go to Dashboard',
        actionUrl: '/dashboard',
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult({
        type: 'error',
        title: 'Payment Error',
        message: error.message,
        data: errorData,
      });
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Payment Failed',
        message: errorData?.message || error.message || 'Payment simulation failed.',
        details: JSON.stringify(errorData, null, 2),
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateDuplicate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await paymentService.createPayment(planId);
      setResult({
        type: 'success',
        title: 'Payment Successful!',
        message: 'Plan activated (no duplicate detected)',
        data: response.data,
      });
      setModalState({
        isOpen: true,
        type: 'success',
        title: 'Payment Successful',
        message: 'Plan activated (no duplicate detected)',
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult({
        type: errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS' ? 'warning' : 'error',
        title: errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS' ? 'Duplicate Subscription Detected' : 'Error',
        message: errorData?.message || error.message,
        data: errorData,
      });
      setModalState({
        isOpen: true,
        type: errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS' ? 'warning' : 'error',
        title: errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS' ? 'Active Subscription Exists' : 'Duplicate Purchase Error',
        message: errorData?.message || 'You already have an active subscription.',
        details: JSON.stringify(errorData, null, 2),
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateInvalidPlan = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await paymentService.createPayment('invalid-plan-id');
      setResult({
        type: 'success',
        title: 'Unexpected Success',
        message: 'Invalid plan was accepted (this should not happen)',
        data: response.data,
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult({
        type: 'error',
        title: 'Invalid Plan Error',
        message: errorData?.message || error.message,
        data: errorData,
      });
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Invalid Plan Error',
        message: errorData?.message || 'Selected plan ID does not exist in the database.',
        details: JSON.stringify(errorData, null, 2),
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateNetworkError = () => {
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult({
        type: 'error',
        title: 'Network Error',
        message: 'Failed to connect to server (simulated)',
        data: { error: 'NETWORK_ERROR', details: 'Connection timeout' },
      });
      setModalState({
        isOpen: true,
        type: 'error',
        title: 'Network Connection Timeout',
        message: 'Failed to connect to server. Please check your internet connection and retry.',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      
      <Link
        href="/pricing"
        className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back to Pricing
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/20">
          <CreditCard className="h-3.5 w-3.5" />
          Checkout & Integration Workbench
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Subscription Checkout Simulator
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Verify transactional states, duplicate subscription protection, and server exception handling.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-3xl glass-panel p-6 border border-border flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Selected Subscription
            </span>
            <p className="text-3xl font-display font-extrabold text-foreground capitalize">
              {planId.replace('tier', 'Tier ')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Pass parameter <code className="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono font-bold">?planId=tier1 | tier2 | tier3</code> in URL.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Encrypted Webhook Verification Active</span>
          </div>
        </div>

        <div className="rounded-3xl glass-panel p-6 border border-border space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Execution Scenarios
          </span>

          <Button
            onClick={simulateSuccess}
            disabled={loading}
            className="w-full btn-primary-glow rounded-2xl h-11 text-xs font-bold"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
            Simulate Legitimate Purchase
          </Button>

          <Button
            onClick={simulateDuplicate}
            disabled={loading}
            className="w-full rounded-2xl h-11 text-xs font-semibold"
            variant="outline"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <AlertCircle className="h-4 w-4 mr-2" />}
            Test Duplicate Purchase Guard
          </Button>

          <Button
            onClick={simulateInvalidPlan}
            disabled={loading}
            className="w-full rounded-2xl h-11 text-xs font-semibold"
            variant="outline"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
            Test Invalid Plan Exception
          </Button>

          <Button
            onClick={simulateNetworkError}
            disabled={loading}
            className="w-full rounded-2xl h-11 text-xs font-semibold"
            variant="outline"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
            Simulate Network Latency Timeout
          </Button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div
          className={`rounded-3xl p-6 border mb-8 transition-all ${
            result.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : result.type === 'warning'
              ? 'border-amber-500/30 bg-amber-500/5'
              : 'border-destructive/30 bg-destructive/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.type === 'success' && <Check className="h-5 w-5 text-emerald-500" />}
            {result.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500" />}
            {result.type === 'error' && <X className="h-5 w-5 text-destructive" />}
            <h3 className="font-display font-bold text-foreground text-lg">{result.title}</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">{result.message}</p>

          <div className="p-4 rounded-2xl bg-card border border-border">
            <p className="text-[10px] font-mono text-muted-foreground mb-2 uppercase font-bold">API Payload / Response:</p>
            <pre className="text-xs font-mono overflow-auto max-h-48 text-foreground/80">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        details={modalState.details}
        actionLabel={modalState.actionLabel}
        onAction={
          modalState.actionUrl
            ? () => {
                const url = modalState.actionUrl!;
                setModalState((prev) => ({ ...prev, isOpen: false }));
                router.push(url);
              }
            : undefined
        }
      />
    </div>
  );
}

export default function CheckoutTestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-xs text-muted-foreground">Loading checkout...</span>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
