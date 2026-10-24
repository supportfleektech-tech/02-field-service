const base = process.env.APP_URL || 'http://localhost:7311';
const ORG = '00000000-0000-0000-0000-000000000002';
const EMAIL = 'ops@demo.co.ke';
async function req(p: string, o: RequestInit = {}) {
  const res = await fetch(base + p, { ...o, headers: { 'content-type': 'application/json', 'x-dev-user-email': EMAIL, 'x-org-id': ORG, ...(o.headers || {}) } });
  return { status: res.status, json: await res.json().catch(() => ({})) };
}
async function main() {
  const out: { name: string; ok: boolean; detail?: string }[] = [];
  const t = async (n: string, fn: () => Promise<void>) => {
    try { await fn(); out.push({ name: n, ok: true }); }
    catch (e) { out.push({ name: n, ok: false, detail: String(e) }); }
  };
  await t('health', async () => { if ((await req('/api/v1/health')).status !== 200) throw new Error('bad'); });
  await t('work order full lifecycle', async () => {
    const list = (await req('/api/v1/work-orders')).json as { data: { id: string; status: string; customerId: string }[] };
    if (!Array.isArray(list.data) || list.data.length === 0) throw new Error('no work orders');
    const customerId = list.data[0].customerId;
    const wo = await req('/api/v1/work-orders', { method: 'POST', body: JSON.stringify({ customerId, title: `Smoke WO ${Date.now()}` }) });
    if (wo.status !== 200) throw new Error('create work order failed');
    const id = (wo.json as { data: { id: string } }).data.id;
    await req(`/api/v1/work-orders/${id}/dispatch`, { method: 'POST', body: JSON.stringify({ technicianId: null }) });
    await req(`/api/v1/work-orders/${id}/complete`, { method: 'POST' });
    const sr = await req('/api/v1/service-reports', {
      method: 'POST', body: JSON.stringify({ workOrderId: id, summary: 'Smoke report', gpsLat: -1.3, gpsLng: 36.8, signatureB64: 'abc=' }),
    });
    if (sr.status !== 200) throw new Error(`service report failed: ${JSON.stringify(sr.json)}`);
  });
  await t('technicians list', async () => {
    if ((await req('/api/v1/technicians')).status !== 200) throw new Error('bad');
  });
  out.forEach(r => console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.detail ? ' — ' + r.detail : ''}`));
  if (out.some(r => !r.ok)) process.exit(1);
}
main();
