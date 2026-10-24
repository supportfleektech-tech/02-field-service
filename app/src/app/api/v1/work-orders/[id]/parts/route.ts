import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const Use = z.object({ partId: z.string().uuid(), quantity: z.number().int().positive() });

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handle(req, async (ctx) => {
    const { id } = await params;
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const { partId, quantity } = Use.parse(await req.json());
    const wo = await prisma.workOrder.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!wo) throw new HttpError(404, 'work order not found', 'NOT_FOUND');
    const part = await prisma.part.findFirst({ where: { id: partId, organizationId: ctx.organizationId } });
    if (!part) throw new HttpError(404, 'part not found', 'NOT_FOUND');
    if (part.quantityOnHand < quantity) throw new HttpError(409, 'insufficient stock', 'OUT_OF_STOCK');
    const [usage, updated] = await prisma.$transaction([
      prisma.partUsage.create({ data: { workOrderId: wo.id, partId, quantity, unitCostCents: part.unitCostCents } }),
      prisma.part.update({ where: { id: part.id }, data: { quantityOnHand: part.quantityOnHand - quantity } }),
    ]);
    await audit(ctx, 'part.use', 'part', part.id, { workOrderId: wo.id, quantity });
    return { usage, stock: updated.quantityOnHand };
  });
}
