'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PartForm({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [qty, setQty] = useState('0');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      const res = await fetch('/api/v1/parts', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-dev-user-email': 'ops@demo.co.ke',
          'x-org-id': orgId,
        },
        body: JSON.stringify({
          sku, name,
          unitCostCents: Math.round(parseFloat(cost || '0') * 100),
          quantityOnHand: parseInt(qty || '0', 10),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSku(''); setName(''); setCost(''); setQty('0');
      setMsg('✅ Part added');
      router.refresh();
    } catch (err) {
      setMsg(`❌ ${String(err)}`);
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit}>
      <input placeholder="SKU *" value={sku} onChange={e => setSku(e.target.value)} required style={{ width: 110 }} />
      <input placeholder="Name *" value={name} onChange={e => setName(e.target.value)} required style={{ flex: 1, minWidth: 140 }} />
      <input placeholder="Unit cost KES" value={cost} onChange={e => setCost(e.target.value)} inputMode="decimal" style={{ width: 130 }} />
      <input placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} inputMode="numeric" style={{ width: 80 }} />
      <button disabled={busy}>{busy ? '…' : 'Add part'}</button>
      {msg && <span style={{ alignSelf: 'center', fontSize: 13 }}>{msg}</span>}
    </form>
  );
}
