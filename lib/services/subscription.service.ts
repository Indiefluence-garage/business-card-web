import api from '../api';
import { SubscriptionResponse } from '../types';

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get<SubscriptionResponse>('/subscriptions');
    return response.data;
  },
};
