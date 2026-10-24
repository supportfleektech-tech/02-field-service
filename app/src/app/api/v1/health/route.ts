import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { handle } from '@/server/modules/core';

export async function GET(req: NextRequest) {
  return handle(req, async () => {
    try { await prisma.$queryRaw`SELECT 1`; } catch { return { status: 'degraded', db: 'down' }; }
    return { status: 'ok', db: 'up', service: 'field-service-os', time: new Date().toISOString() };
  }, { auth: false });
}
