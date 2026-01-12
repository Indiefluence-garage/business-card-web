import api from '../api';
import { SubscriptionResponse } from '../types';

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get<SubscriptionResponse>('/subscriptions');
    return response.data;
  },
  getStatus: async () => {
    const response = await api.get<{
      success: boolean;
      data: {
        individual: { planId: string; status: string };
        organization: { planId: string; status: string; role: string } | null;
      }
    }>('/subscriptions/status');
    return response.data;
  },
};
