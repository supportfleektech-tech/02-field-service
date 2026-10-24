import { BaseAdapter, AdapterCapabilities } from './base';

/** Email adapter (generic API-key provider e.g. Resend/Postmark/SES). */
export class EmailAdapter extends BaseAdapter {
  provider = 'email';

  isConfigured(): boolean {
    return !!(process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM);
  }

  capabilities(): AdapterCapabilities {
    return { sandbox: false, features: ['send'] };
  }

  async send(params: { to: string; subject: string; html: string }) {
    this.assertConfigured();
    // Provider-agnostic REST call; real endpoint set via env in production.
    const endpoint = process.env.EMAIL_PROVIDER_URL || 'https://api.resend.com/emails';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_PROVIDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });
    if (!res.ok) throw new Error(`email send failed: ${res.status}`);
    return res.json();
  }
}

export const email = new EmailAdapter();
