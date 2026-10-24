import { NextRequest } from 'next/server';
import { dispatch, complete } from '@/server/modules/work-orders';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  if (action === 'dispatch') return dispatch(req, id);
  if (action === 'complete') return complete(req, id);
  return new Response(JSON.stringify({ ok: false, error: 'unknown action' }), { status: 404 });
}
