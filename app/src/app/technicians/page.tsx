import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TechniciansPage() {
  const org = await prisma.organization.findFirst();
  const techs = org ? await prisma.technician.findMany({ where: { organizationId: org.id }, orderBy: { createdAt: 'desc' } }) : [];
  return (
    <>
      <h1>Technicians</h1>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Specialization</th><th>Active</th></tr></thead>
          <tbody>
            {techs.map(t => <tr key={t.id}><td>{t.name}</td><td>{t.phone || '—'}</td><td>{t.specialization || '—'}</td><td>{t.active ? '✅' : '—'}</td></tr>)}
            {techs.length === 0 && <tr><td colSpan={4}>No technicians yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
