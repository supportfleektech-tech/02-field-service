import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const Create = z.object({ sku: z.string().min(1), name: z.string().min(1), unitCostCents: z.number().int().nonnegative(), quantityOnHand: z.number().int().nonnegative().default(0) });

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.part.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { name: 'asc' } }));
}

export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = Create.parse(await req.json());
    const p = await prisma.part.create({ data: { ...body, organizationId: ctx.organizationId } });
    await audit(ctx, 'part.create', 'part', p.id, { sku: p.sku });
    return p;
  });
}
