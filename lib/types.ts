export interface User {
  // Identity
  id: string;
  email: string;
  authProvider?: 'email' | 'google';
  isEmailVerified: boolean;

  // Basic Info
  firstName: string;
  lastName: string;
  imageUrl?: string | null;
  userType?: 'individual' | 'organization'; // User account type

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
}

export interface ProfileResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface Plan {
  id: string; // 'free' | 'tier1' | 'tier2' | 'tier3'
  name: string;
  targetType: 'individual' | 'organization';
  price: number; // in cents
  interval: string; // '30 days' | '90 days' | '365 days'
  features: string[];
  isPopular: boolean;
  validityDays: number;
}

export interface SubscriptionResponse {
  plans: Plan[];
}

export interface PaymentData {
  transactionId: string;
  planId: string;
  expiresAt: string;
  credits: number;
}

export interface PaymentResponse {
  success: true;
  message: string;
  data: PaymentData;
}
