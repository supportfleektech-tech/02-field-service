import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const CreateWorkOrder = z.object({
  customerId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW','NORMAL','HIGH','URGENT']).default('NORMAL'),
  scheduledAt: z.string().datetime().optional(),
});

async function nextNumber(orgId: string) {
  const c = await prisma.workOrder.count({ where: { organizationId: orgId } });
  return `WO-${new Date().getFullYear()}-${String(c + 1).padStart(5, '0')}`;
}

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => {
    const status = new URL(req.url).searchParams.get('status') || undefined;
    return prisma.workOrder.findMany({
      where: { organizationId: ctx.organizationId, ...(status ? { status: status as never } : {}) },
      orderBy: { createdAt: 'desc' }, take: 100,
      include: { customer: { select: { name: true } }, technician: { select: { name: true } } },
    });
  });
}

export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = CreateWorkOrder.parse(await req.json());
    const customer = await prisma.customer.findFirst({ where: { id: body.customerId, organizationId: ctx.organizationId } });
    if (!customer) throw new HttpError(404, 'customer not found', 'NOT_FOUND');
    const wo = await prisma.workOrder.create({
      data: {
        organizationId: ctx.organizationId,
        customerId: body.customerId,
        title: body.title, description: body.description,
        priority: body.priority,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
        number: await nextNumber(ctx.organizationId),
      },
    });
    await prisma.jobCard.create({ data: { workOrderId: wo.id } });
    await audit(ctx, 'workorder.create', 'work_order', wo.id, { number: wo.number });
    return wo;
  });
}

export async function dispatch(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const { technicianId } = await req.json().catch(() => ({}));
    const wo = await prisma.workOrder.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!wo) throw new HttpError(404, 'work order not found', 'NOT_FOUND');
    if (wo.status !== 'REQUESTED' && wo.status !== 'APPROVED') throw new HttpError(409, 'work order not dispatchable', 'BAD_STATE');
    if (technicianId) {
      const tech = await prisma.technician.findFirst({ where: { id: technicianId, organizationId: ctx.organizationId, active: true } });
      if (!tech) throw new HttpError(404, 'technician not found', 'NOT_FOUND');
    }
    const updated = await prisma.workOrder.update({
      where: { id: wo.id },
      data: { status: 'DISPATCHED', technicianId: technicianId || null },
    });
    await audit(ctx, 'workorder.dispatch', 'work_order', wo.id, { technicianId });
    return updated;
  });
}

export async function complete(req: NextRequest, id: string) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const wo = await prisma.workOrder.findFirst({ where: { id, organizationId: ctx.organizationId } });
    if (!wo) throw new HttpError(404, 'work order not found', 'NOT_FOUND');
    if (wo.status !== 'DISPATCHED' && wo.status !== 'IN_PROGRESS') throw new HttpError(409, 'work order not completable', 'BAD_STATE');
    const updated = await prisma.workOrder.update({
      where: { id: wo.id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
    await audit(ctx, 'workorder.complete', 'work_order', wo.id, {});
    return updated;
  });
}
