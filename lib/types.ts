export interface User {
  // Identity
  id: string;
  email: string;
  name?: string | null;
  authProvider?: 'email' | 'google';
  isEmailVerified: boolean;

  // Basic Info
  firstName: string;
  lastName: string;
  imageUrl?: string | null;

  // Contact Info
  phoneNumber?: string | null;
  whatsappNumber?: string | null;
  country?: string | null;
  address?: string | null;
  bio?: string | null;

  // Social Links
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    x?: string;  // Twitter/X
  } | null;

  // System
  profileCompletionStatus?: number;  // 0-100
  createdAt?: string;
  updatedAt?: string;

  // Subscription fields
  planId?: string | null;
  planName?: string | null;
  subscriptionStatus?: 'free' | 'active' | 'expired' | 'cancelled';
  creditsRemaining?: number;
  planEndsAt?: string | null;
  trialEndsAt?: string | null;
  lifetimeCreditsUsed?: number;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
  success?: boolean;
  message?: string;
}

export interface ProfileResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface Plan {
  id: string; // 'free' | 'tier1' | 'tier2' | 'tier3'
  name: string;
  description?: string;
  price: number; // e.g. 299, 999, 1999
  currency?: string; // 'INR' or 'USD'
  interval: string; // '30 days' | '90 days' | '365 days'
  features: string[];
  isPopular: boolean;
  validityDays: number;
}

export interface SubscriptionResponse {
  plans: Plan[];
}

export interface CashfreeOrderData {
  orderId: string;
  cfOrderId?: string;
  paymentSessionId: string;
  transactionId?: string;
  amount: string | number;
  currency: string;
  planName: string;
  environment: 'SANDBOX' | 'PRODUCTION';
}

export interface CreateOrderResponse {
  success: boolean;
  data: CashfreeOrderData;
  error?: string;
  message?: string;
}

export interface VerifyOrderResponse {
  success: boolean;
  data?: {
    status: string;
    message: string;
    alreadyProcessed?: boolean;
    data?: {
      subscriptionId: string;
      planId: string;
      expiresAt: string;
      credits: number;
    };
  };
  error?: string;
  message?: string;
}
