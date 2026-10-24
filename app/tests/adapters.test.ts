import { describe, it, expect } from 'vitest';
import { AdapterNotConfigured } from '../src/server/adapters/base';
import { mpesa } from '../src/server/adapters/mpesa';

describe('adapters throw when unconfigured', () => {
  it('mpesa throws without env', async () => {
    expect(mpesa.isConfigured()).toBe(false);
    await expect(mpesa.stkPush({ phone: '2547', amountKes: 1, accountReference: 'x', description: 'y' }))
      .rejects.toBeInstanceOf(AdapterNotConfigured);
  });
});
