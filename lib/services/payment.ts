import api from '../api';
import { PaymentResponse } from '../types';

export const createPayment = async (planId: string) => {
    const response = await api.post<PaymentResponse>('/payments', { planId });
    return response.data;
};
