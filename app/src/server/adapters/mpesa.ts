import { BaseAdapter, AdapterCapabilities } from './base';

/**
 * Safaricom Daraja M-Pesa adapter (sandbox/production).
 * Throws AdapterNotConfigured when env vars are missing.
 * Real API: https://developer.safaricom.co.ke (Daraja).
 */
export class MpesaAdapter extends BaseAdapter {
  provider = 'mpesa-daraja';

  isConfigured(): boolean {
    return !!(
      process.env.MPESA_CONSUMER_KEY &&
      process.env.MPESA_CONSUMER_SECRET &&
      process.env.MPESA_SHORTCODE &&
      process.env.MPESA_PASSKEY &&
      process.env.MPESA_CALLBACK_URL
    );
  }

  capabilities(): AdapterCapabilities {
    return { sandbox: process.env.MPESA_ENV !== 'production', features: ['stk-push', 'query', 'webhook-c2b'] };
  }

  private baseUrl(): string {
    return process.env.MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  private async accessToken(): Promise<string> {
    this.assertConfigured();
    const key = process.env.MPESA_CONSUMER_KEY!;
    const secret = process.env.MPESA_CONSUMER_SECRET!;
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    const res = await fetch(`${this.baseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) throw new Error(`mpesa oauth failed: ${res.status}`);
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  /** Initiate STK push (customer prompt on phone). */
  async stkPush(params: { phone: string; amountKes: number; accountReference: string; description: string }) {
    this.assertConfigured();
    const token = await this.accessToken();
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
    const res = await fetch(`${this.baseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: params.amountKes,
        PartyA: params.phone,
        PartyB: shortcode,
        PhoneNumber: params.phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: params.accountReference,
        TransactionDesc: params.description,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`mpesa stkpush failed: ${JSON.stringify(data)}`);
    return data as { CheckoutRequestID: string; MerchantRequestID: string; ResponseCode: string };
  }
}

export const mpesa = new MpesaAdapter();
