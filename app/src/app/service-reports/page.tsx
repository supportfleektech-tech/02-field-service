import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const org = await prisma.organization.findFirst();
  const reports = org ? await prisma.serviceReport.findMany({
    where: { workOrder: { organizationId: org.id } },
    orderBy: { createdAt: 'desc' },
    include: { workOrder: { select: { number: true, title: true } } },
  }) : [];
  return (
    <>
      <h1>Service Reports</h1>
      <div className="card">
        <table>
          <thead><tr><th>WO</th><th>Title</th><th>Summary</th><th>GPS</th></tr></thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id}>
                <td>{r.workOrder.number}</td><td>{r.workOrder.title}</td><td>{r.summary}</td>
                <td>{r.gpsLat && r.gpsLng ? `${r.gpsLat.toFixed(4)},${r.gpsLng.toFixed(4)}` : '—'}</td>
              </tr>
            ))}
            {reports.length === 0 && <tr><td colSpan={4}>No reports yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
