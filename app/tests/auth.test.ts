import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { signDevToken, verifyDevToken } from '../src/lib/auth';

const secret = 'test-secret';

describe('auth dev tokens', () => {
  it('signs and verifies a token', () => {
    const t = signDevToken({ sub: 'u1', email: 'a@b.c' }, secret);
    const p = verifyDevToken(t, secret);
    expect(p.sub).toBe('u1');
  });
  it('rejects tampered tokens', () => {
    const t = signDevToken({ sub: 'u1' }, secret);
    const [body] = t.split('.');
    const bad = `${body}.${crypto.randomBytes(16).toString('base64url')}`;
    expect(() => verifyDevToken(bad, secret)).toThrow();
  });
});
