import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AuthContext, AuthError, isDevBypass, verifyDevToken, requireSecret } from '@/lib/auth';
import { randomUUID } from 'crypto';
import { rateLimit, rateLimitKey, logRequest, withCorrelation, errorResponse } from './http';

export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

export async function resolveAuth(req: NextRequest): Promise<AuthContext> {
  let userId: string | undefined, email: string | undefined;
  if (isDevBypass()) {
    email = req.headers.get('x-dev-user-email') || undefined;
    if (!email) throw new AuthError('missing x-dev-user-email (dev bypass)');
    const user = await prisma.user.upsert({ where: { email }, create: { email }, update: {} });
    userId = user.id;
  } else {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) throw new AuthError('missing bearer token');
    const payload = verifyDevToken(auth.slice(7), requireSecret());
    userId = payload.sub as string;
    email = payload.email as string;
  }

  const orgId = req.headers.get('x-org-id') || undefined;
  if (!orgId) throw new HttpError(400, 'missing x-org-id header', 'ORG_REQUIRED');

  const membership = await prisma.membership.findFirst({ where: { userId, organizationId: orgId } });
  if (!membership) throw new HttpError(403, 'not a member of this organization', 'FORBIDDEN');

  return { userId: userId!, email: email!, organizationId: orgId, role: membership.role as AuthContext['role'] };
}

export function requireRole(ctx: AuthContext, ...roles: AuthContext['role'][]) {
  if (!roles.includes(ctx.role)) throw new HttpError(403, 'insufficient role', 'FORBIDDEN');
}

export async function handle(
  req: NextRequest,
  fn: (ctx: AuthContext) => Promise<unknown>,
  opts: { auth?: boolean } = { auth: true }
): Promise<NextResponse> {
  const started = Date.now();
  const id = withCorrelation(req);
  const identity = req.headers.get('x-org-id') || req.headers.get('x-dev-user-email') || 'anon';
  if (!rateLimit(rateLimitKey(req, identity))) {
    return errorResponse(429, 'RATE_LIMITED', 'too many requests', id);
  }
  try {
    const ctx = opts.auth ? await resolveAuth(req) : ({} as AuthContext);
    const data = await fn(ctx);
    const res = NextResponse.json({ ok: true, data, correlationId: id });
    res.headers.set('x-correlation-id', id);
    logRequest(req, id, Date.now() - started, res.status);
    return res;
  } catch (e) {
    if (e instanceof AuthError) return errorResponse(401, 'UNAUTHENTICATED', e.message, id);
    if (e instanceof HttpError) return errorResponse(e.status, e.code || 'ERROR', e.message, id);
    console.error(`[${id}]`, e);
    return errorResponse(500, 'INTERNAL', 'internal error', id);
  }
}

export async function audit(ctx: AuthContext, action: string, entityType?: string, entityId?: string, metadata?: unknown) {
  await prisma.auditEvent.create({
    data: {
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      action, entityType, entityId,
      metadata: metadata as object | undefined,
    },
  }).catch((e) => console.error('audit failed', e));
}
