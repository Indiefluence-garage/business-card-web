import api from '../api';
import { signIn, signUp, signOut, emailOtp, authClient } from '../auth-client';

// Response types
interface AuthSuccessResponse {
  token?: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    userType?: string;
    isEmailVerified?: boolean;
    emailVerified?: boolean;
    activeOrganizationId?: string;
    subscriptionStatus?: string;
    creditsRemaining?: number;
  };
}

export const authService = {
  // Register individual user with Better Auth
  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const name = `${data.firstName} ${data.lastName}`.trim();

    const result = await signUp.email({
      email: data.email,
      password: data.password,
      name,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Registration failed');
    }

    // Send verification OTP after signup
    await emailOtp.sendVerificationOtp({
      email: data.email,
      type: "email-verification"
    });

    return {
      success: true,
      message: 'Registration successful. Please check your email for OTP.',
      user: result.data?.user
    };
  },

  // Login with Better Auth
  login: async (data: { email: string; password: string }) => {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      // Check if email not verified
      if (result.error.message?.includes('not verified')) {
        throw new Error('EMAIL_NOT_VERIFIED');
      }
      throw new Error(result.error.message || 'Login failed');
    }

    return {
      success: true,
      message: 'Login successful',
      token: result.data?.token,
      user: result.data?.user
    };
  },

  // Google login - uses custom endpoint for native mobile
  googleLogin: async (data: { idToken?: string; code?: string }) => {
    const response = await api.post<AuthSuccessResponse & { message: string }>('/auth/google', data);
    return response.data;
  },

  // Verify email with Better Auth
  verifyEmail: async (data: { email: string; otp: string }) => {
    const result = await emailOtp.verifyEmail({
      email: data.email,
      otp: data.otp,
    });

    if (result.error) {
      throw new Error(result.error.message || 'Email verification failed');
    }

    return {
      success: true,
      message: 'Email verified successfully',
      token: result.data?.token,
      user: result.data?.user
    };
  },

  // Resend OTP with Better Auth
  resendOtp: async (data: { email: string }) => {
    const result = await emailOtp.sendVerificationOtp({
      email: data.email,
      type: "email-verification"
    });

    if (result.error) {
      throw new Error(result.error.message || 'Failed to resend OTP');
    }

    return {
      success: true,
      message: 'OTP sent to your email'
    };
  },

  // Request password reset - uses custom endpoint
  requestPasswordReset: async (data: { email: string }) => {
    const response = await api.post<{ message: string }>('/auth/request-password-reset', data);
    return response.data;
  },

  // Reset password with Better Auth  
  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    // For OTP-based reset, we need to use custom endpoint
    const response = await api.post<{ message: string }>('/auth/reset-password', {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword
    });
    return response.data;
  },

  // Change password - uses custom endpoint
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post<{ message: string }>('/auth/change-password', data);
    return response.data;
  },

  // Logout - sign out from Better Auth
  logout: async () => {
    const result = await signOut();

    // Also call custom logout for JWT invalidation
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore if custom logout fails
    }

    return {
      success: true,
      message: 'Logout successful'
    };
  },

  // Get current user - uses custom endpoint for JWT compatibility  
  getMe: async () => {
    const response = await api.get<{ user: any }>('/auth/me');
    return response.data;
  },

  // Register organization - uses custom endpoint
  registerOrganization: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    orgName: string;
    orgSlug: string;
  }) => {
    const response = await api.post<AuthSuccessResponse & { organization: any; message: string }>('/auth/register-organization', data);
    return response.data;
  }
};

