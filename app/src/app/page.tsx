import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const org = await prisma.organization.findFirst();
  let stats = { customers: 0, technicians: 0, open: 0, completed: 0, parts: 0 };
  let recent: { id: string; number: string; title: string; status: string; customer: { name: string }; technician?: { name: string } | null }[] = [];
  if (org) {
    const [customers, technicians, open, completed, parts, rec] = await Promise.all([
      prisma.customer.count({ where: { organizationId: org.id } }),
      prisma.technician.count({ where: { organizationId: org.id, active: true } }),
      prisma.workOrder.count({ where: { organizationId: org.id, status: { in: ['REQUESTED','QUOTED','APPROVED','DISPATCHED','IN_PROGRESS'] } } }),
      prisma.workOrder.count({ where: { organizationId: org.id, status: 'COMPLETED' } }),
      prisma.part.count({ where: { organizationId: org.id } }),
      prisma.workOrder.findMany({
        where: { organizationId: org.id }, orderBy: { createdAt: 'desc' }, take: 5,
        include: { customer: { select: { name: true } }, technician: { select: { name: true } } },
      }),
    ]);
    stats = { customers, technicians, open, completed, parts };
    recent = rec;
  }
  return (
    <>
      <h1>Dashboard</h1>
      {!org && <div className="card">No organization yet. Use the API with <code>x-dev-user-email</code> to seed, then refresh.</div>}
      {org && <>
        <div className="grid">
          <div className="card"><h3>Customers</h3><div className="big">{stats.customers}</div></div>
          <div className="card"><h3>Technicians</h3><div className="big">{stats.technicians}</div></div>
          <div className="card"><h3>Open Jobs</h3><div className="big">{stats.open}</div></div>
          <div className="card"><h3>Parts</h3><div className="big">{stats.parts}</div></div>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Recent work orders</h3>
          <table>
            <thead><tr><th>#</th><th>Title</th><th>Customer</th><th>Technician</th><th>Status</th></tr></thead>
            <tbody>
              {recent.map(w => (
                <tr key={w.id}>
                  <td>{w.number}</td><td>{w.title}</td><td>{w.customer.name}</td>
                  <td>{w.technician?.name || '—'}</td>
                  <td><span className={`badge s-${w.status}`}>{w.status}</span></td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={5}>No work orders yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </>}
    </>
  );
}
