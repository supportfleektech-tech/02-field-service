import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

/** Stable JSON error shape */
export function errorResponse(status: number, code: string, message: string, correlationId?: string) {
  return NextResponse.json({ ok: false, error: message, code, correlationId }, { status });
}

/** Tiny in-memory sliding-window rate limiter (per identity+route). */
const buckets = new Map<string, { n: number; reset: number }>();
export function rateLimitKey(req: NextRequest, identity: string): string {
  return `${req.method}:${new URL(req.url).pathname}:${identity}`;
}
export function rateLimit(key: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (b.n >= limit) return false;
  b.n += 1;
  return true;
}

/** Structured request log (minimal; real OTel can subscribe to console). */
export function logRequest(req: NextRequest, correlationId: string, durationMs: number, status: number) {
  console.log(JSON.stringify({
    level: 'info',
    msg: 'http',
    method: req.method,
    path: new URL(req.url).pathname,
    status,
    duration_ms: durationMs,
    correlationId,
  }));
}

export function withCorrelation(req: NextRequest): string {
  return req.headers.get('x-correlation-id') || randomUUID();
}
