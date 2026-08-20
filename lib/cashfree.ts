// lib/cashfree.ts
import { load } from '@cashfreepayments/cashfree-js';

let cashfreeInstance: any = null;
let currentMode: string | null = null;

export const getCashfree = async (mode: 'sandbox' | 'production' = 'sandbox') => {
  if (cashfreeInstance && currentMode === mode) {
    return cashfreeInstance;
  }

  cashfreeInstance = await load({
    mode: mode,
  });
  currentMode = mode;
  return cashfreeInstance;
};

export const launchCashfreeCheckout = async ({
  paymentSessionId,
  mode = 'sandbox',
  redirectTarget = '_modal',
}: {
  paymentSessionId: string;
  mode?: 'sandbox' | 'production';
  redirectTarget?: '_modal' | '_self';
}) => {
  const cashfree = await getCashfree(mode);
  return cashfree.checkout({
    paymentSessionId,
    redirectTarget,
  });
};
