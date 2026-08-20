import api from '../api';
import { CreateOrderResponse, VerifyOrderResponse } from '../types';

export const paymentService = {
  /**
   * Create Cashfree PG order
   */
  createOrder: async (planId: string): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>('/payments/create-order', { planId });
    return response.data;
  },

  /**
   * Verify Cashfree payment status
   */
  verifyOrder: async (orderId: string): Promise<VerifyOrderResponse> => {
    const response = await api.get<VerifyOrderResponse>(`/payments/verify/${orderId}`);
    return response.data;
  },

  /**
   * Get user payment history
   */
  getHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },
};
