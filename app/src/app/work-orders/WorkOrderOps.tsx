'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Part = { id: string; sku: string; name: string; quantityOnHand: number };
type Tech = { id: string; name: string };
type WO = { id: string; status: string };

const ACTIONABLE: Record<string, string[]> = {
  REQUESTED: ['dispatch'],
  QUOTED: ['dispatch'],
  APPROVED: ['dispatch'],
  DISPATCHED: ['complete'],
  IN_PROGRESS: ['complete'],
};

export default function WorkOrderOps({ wo, technicians, parts, orgId }: { wo: WO; technicians: Tech[]; parts: Part[]; orgId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [techId, setTechId] = useState('');
  const [partId, setPartId] = useState('');
  const [qty, setQty] = useState('1');
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');

  const headers = {
    'content-type': 'application/json',
    'x-dev-user-email': 'ops@demo.co.ke',
    'x-org-id': orgId,
  };

  async function doAction(action: string) {
    setBusy(action); setMsg('');
    try {
      const res = await fetch(`/api/v1/work-orders/${wo.id}/${action}`, {
        method: 'POST', headers,
        body: JSON.stringify(action === 'dispatch' ? { technicianId: techId || null } : {}),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMsg(`✅ ${action}ed`);
      router.refresh();
    } catch (e) { setMsg(`❌ ${String(e)}`); }
    finally { setBusy(''); }
  }

  async function usePart(e: React.FormEvent) {
    e.preventDefault();
    setBusy('use-part'); setMsg('');
    try {
      const res = await fetch(`/api/v1/work-orders/${wo.id}/parts`, {
        method: 'POST', headers,
        body: JSON.stringify({ partId, quantity: parseInt(qty, 10) || 1 }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error ? `${j.error}: ${j.message || ''}` : `HTTP ${res.status}`);
      setQty('1');
      setMsg('✅ part logged');
      router.refresh();
    } catch (e) { setMsg(`❌ ${String(e)}`); }
    finally { setBusy(''); }
  }

  const actions = ACTIONABLE[wo.status] || [];

  return (
    <>
      <button className="ghost" onClick={() => setOpen(!open)} style={{ padding: '4px 10px', fontSize: 12 }}>
        {open ? 'Hide' : 'Ops'}
      </button>
      {open && (
        <div className="card" style={{ margin: '8px 0', padding: 10 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {actions.includes('dispatch') && (
              <>
                <select value={techId} onChange={e => setTechId(e.target.value)} style={{ minWidth: 140 }}>
                  <option value="">— technician —</option>
                  {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <button onClick={() => doAction('dispatch')} disabled={busy === 'dispatch'}>
                  {busy === 'dispatch' ? '…' : 'Dispatch'}
                </button>
              </>
            )}
            {actions.includes('complete') && (
              <button onClick={() => doAction('complete')} disabled={busy === 'complete'}>
                {busy === 'complete' ? '…' : 'Complete'}
              </button>
            )}
            {actions.length === 0 && <span style={{ color: 'var(--mut)', fontSize: 13 }}>No actions available for {wo.status}.</span>}
          </div>
          {parts.length > 0 && (
            <form onSubmit={usePart}>
              <select value={partId} onChange={e => setPartId(e.target.value)} required style={{ minWidth: 160 }}>
                <option value="">— use part —</option>
                {parts.map(p => <option key={p.id} value={p.id}>{p.sku} · {p.name} ({p.quantityOnHand} left)</option>)}
              </select>
              <input value={qty} onChange={e => setQty(e.target.value)} inputMode="numeric" style={{ width: 64 }} aria-label="quantity" />
              <button disabled={busy === 'use-part' || !partId}>{busy === 'use-part' ? '…' : 'Log usage'}</button>
            </form>
          )}
          {msg && <div style={{ marginTop: 8, fontSize: 13 }}>{msg}</div>}
        </div>
      )}
    </>
  );
}
