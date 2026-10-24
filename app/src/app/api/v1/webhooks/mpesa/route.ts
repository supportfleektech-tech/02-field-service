import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { handle, audit } from '@/server/modules/core';

export async function POST(req: NextRequest) {
  return handle(req, async () => {
    const body = await req.json().catch(() => ({}));
    const ref: string | undefined = body?.TransID || body?.reference;
    if (!ref) return { received: false, reason: 'no reference' };
    await audit({ organizationId: 'system', userId: 'mpesa-webhook', email: 'webhook@mpesa', role: 'ADMIN' },
      'payment.webhook', 'payment', undefined, { reference: ref });
    return { received: true };
  }, { auth: false });
}
