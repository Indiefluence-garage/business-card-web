'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/form-elements';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { paymentService } from '@/lib/services/payment.service';

export default function CheckoutTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId') || 'tier1';

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const simulateSuccess = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await paymentService.createPayment(planId);
      setResult({
        type: 'success',
        title: 'Payment Successful!',
        message: `${planId} plan activated successfully`,
        data: response.data
      });

      // Redirect after 3 seconds
      setTimeout(() => router.push('/dashboard'), 3000);
    } catch (error: any) {
      setResult({
        type: 'error',
        title: 'Unexpected Error',
        message: error.message,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateDuplicate = async () => {
    setLoading(true);
    setResult(null);

    try {
      // This should trigger the duplicate error if user already has a plan
      const response = await paymentService.createPayment(planId);
      setResult({
        type: 'success',
        title: 'Payment Successful!',
        message: 'Plan activated (no duplicate detected)',
        data: response.data
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult({
        type: errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS' ? 'warning' : 'error',
        title: errorData?.error === 'ACTIVE_SUBSCRIPTION_EXISTS' ? 'Duplicate Subscription Detected' : 'Error',
        message: errorData?.message || error.message,
        data: errorData
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
        data: response.data
      });
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult({
        type: 'error',
        title: 'Invalid Plan Error',
        message: errorData?.message || error.message,
        data: errorData
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
        data: { error: 'NETWORK_ERROR', details: 'Connection timeout' }
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Checkout Page</h1>
        <p className="text-muted-foreground">
          Test different payment scenarios and error conditions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Selected Plan</CardTitle>
            <CardDescription>Plan to test purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold capitalize">{planId.replace('tier', 'Tier ')}</p>
              <p className="text-sm text-muted-foreground">
                Change plan by adding ?planId=tier1, tier2, or tier3 to the URL
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Scenarios</CardTitle>
            <CardDescription>Click to simulate different outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={simulateSuccess}
              disabled={loading}
              className="w-full"
              variant="default"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Simulate Success
            </Button>

            <Button
              onClick={simulateDuplicate}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <AlertCircle className="h-4 w-4 mr-2" />}
              Test Duplicate Purchase
            </Button>

            <Button
              onClick={simulateInvalidPlan}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
              Test Invalid Plan
            </Button>

            <Button
              onClick={simulateNetworkError}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
              Simulate Network Error
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Result Display */}
      {result && (
        <Card className={`${
          result.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' :
          result.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' :
          'border-red-500 bg-red-50 dark:bg-red-950/20'
        }`}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {result.type === 'success' && <Check className="h-6 w-6 text-green-600" />}
              {result.type === 'warning' && <AlertCircle className="h-6 w-6 text-yellow-600" />}
              {result.type === 'error' && <X className="h-6 w-6 text-red-600" />}
              <CardTitle className={
                result.type === 'success' ? 'text-green-900 dark:text-green-100' :
                result.type === 'warning' ? 'text-yellow-900 dark:text-yellow-100' :
                'text-red-900 dark:text-red-100'
              }>
                {result.title}
              </CardTitle>
            </div>
            <CardDescription className={
              result.type === 'success' ? 'text-green-700 dark:text-green-300' :
              result.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
              'text-red-700 dark:text-red-300'
            }>
              {result.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-xs font-mono mb-2 text-muted-foreground">Response Data:</p>
              <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>

            {result.type === 'success' && (
              <p className="mt-4 text-sm text-muted-foreground">
                Redirecting to dashboard in 3 seconds...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Testing Guide:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <strong>Simulate Success</strong>: Attempts real purchase (will fail if you already have active plan)</li>
          <li>• <strong>Test Duplicate Purchase</strong>: Same as success, but specifically to test duplicate prevention</li>
          <li>• <strong>Test Invalid Plan</strong>: Sends invalid plan ID to test error handling</li>
          <li>• <strong>Simulate Network Error</strong>: Client-side simulated network failure</li>
        </ul>
      </div>
    </div>
  );
}
