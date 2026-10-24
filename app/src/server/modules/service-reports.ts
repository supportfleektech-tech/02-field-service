import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const CreateReport = z.object({
  workOrderId: z.string().uuid(),
  summary: z.string().min(1),
  signatureB64: z.string().optional(),
  gpsLat: z.number().optional(),
  gpsLng: z.number().optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.serviceReport.findMany({
    where: { workOrder: { organizationId: ctx.organizationId } },
    orderBy: { createdAt: 'desc' }, take: 100,
    include: { workOrder: { select: { number: true, title: true } } },
  }));
}

export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN', 'MEMBER');
    const body = CreateReport.parse(await req.json());
    const wo = await prisma.workOrder.findFirst({ where: { id: body.workOrderId, organizationId: ctx.organizationId } });
    if (!wo) throw new HttpError(404, 'work order not found', 'NOT_FOUND');
    const r = await prisma.serviceReport.create({
      data: {
        workOrderId: wo.id, summary: body.summary,
        signatureB64: body.signatureB64, gpsLat: body.gpsLat, gpsLng: body.gpsLng,
        photoUrls: body.photoUrls || [],
      },
    });
    await audit(ctx, 'servicereport.create', 'service_report', r.id, { workOrderId: wo.id });
    return r;
  });
}
