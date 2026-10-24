import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: { id: '00000000-0000-0000-0000-000000000002', name: 'Demo Field Services Ltd', kraPin: 'P000987654A' },
  });
  const user = await prisma.user.upsert({
    where: { email: 'ops@demo.co.ke' }, update: {},
    create: { email: 'ops@demo.co.ke', name: 'Ops Lead' },
  });
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
    update: { role: 'OWNER' },
    create: { userId: user.id, organizationId: org.id, role: 'OWNER' },
  });
  const cust = await prisma.customer.create({
    data: { organizationId: org.id, name: 'Green Malls', phone: '254798000111' },
  });
  const tech = await prisma.technician.create({
    data: { organizationId: org.id, name: 'Jane Njoki', phone: '254722334455', specialization: 'HVAC' },
  });
  const wo = await prisma.workOrder.create({
    data: {
      organizationId: org.id, customerId: cust.id, technicianId: tech.id,
      number: 'WO-2026-00001', title: 'AC service — rooftop unit', status: 'DISPATCHED',
    },
  });
  await prisma.jobCard.create({ data: { workOrderId: wo.id } });
  console.log('seeded', { org: org.id, user: user.email });
}

main().finally(() => prisma.$disconnect());
