import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { handle, audit, HttpError, requireRole } from '@/server/modules/core';

const CreateTech = z.object({ name: z.string().min(1), phone: z.string().optional(), specialization: z.string().optional() });

export async function GET(req: NextRequest) {
  return handle(req, async (ctx) => prisma.technician.findMany({ where: { organizationId: ctx.organizationId }, orderBy: { createdAt: 'desc' } }));
}
export async function POST(req: NextRequest) {
  return handle(req, async (ctx) => {
    requireRole(ctx, 'OWNER', 'ADMIN');
    const body = CreateTech.parse(await req.json());
    const t = await prisma.technician.create({ data: { ...body, organizationId: ctx.organizationId } });
    await audit(ctx, 'technician.create', 'technician', t.id, { name: t.name });
    return t;
  });
}
