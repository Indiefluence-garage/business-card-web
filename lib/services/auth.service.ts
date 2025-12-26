import api from '../api';
import { AuthResponse } from '../types';

export const authService = {
  register: async (data: any) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await api.post<AuthResponse & { message: string }>('/auth/login', data);
    return response.data;
  },
  googleLogin: async (data: { idToken?: string; code?: string }) => {
    const response = await api.post<AuthResponse & { message: string }>('/auth/google', data);
    return response.data;
  },
  verifyEmail: async (data: { email: string; otp: string }) => {
    const response = await api.post<{ message: string; token: string }>('/auth/verify-email', data);
    return response.data;
  },
  resendOtp: async (data: { email: string }) => {
    const response = await api.post<{ message: string }>('/auth/resend-otp', data);
    return response.data;
  },
  requestPasswordReset: async (data: { email: string }) => {
    const response = await api.post<{ message: string }>('/auth/request-password-reset', data);
    return response.data;
  },
  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    const response = await api.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post<{ message: string }>('/auth/change-password', data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post<{ message: string; instruction: string }>('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<{ user: any }>('/auth/me'); // User type is in response.data.user
    return response.data;
  },
};
