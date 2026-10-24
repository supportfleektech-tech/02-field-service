import crypto from 'crypto';

/**
 * Auth context resolution. Server-side only.
 * Dev: AUTH_DEV_BYPASS=true → header `x-dev-user-email` identifies/creates user,
 *      header `x-org-id` selects organization (must be a member).
 * Prod: replace with OIDC token validation (KEYCLOAK/CLERK/etc).
 */
export interface AuthContext {
  userId: string;
  email: string;
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
}

export class AuthError extends Error {
  status = 401;
}

export function signDevToken(payload: object, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifyDevToken(token: string, secret: string): Record<string, unknown> {
  const [body, sig] = token.split('.');
  if (!body || !sig) throw new AuthError('malformed token');
  const expect = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) throw new AuthError('bad signature');
  return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
}

export function requireSecret(): string {
  const s = process.env.AUTH_JWT_SECRET;
  if (!s) throw new AuthError('AUTH_JWT_SECRET not configured');
  return s;
}

export function isDevBypass(): boolean {
  return process.env.AUTH_DEV_BYPASS === 'true' && process.env.NODE_ENV !== 'production';
}
