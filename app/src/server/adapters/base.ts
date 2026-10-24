/**
 * Adapter base: every external provider adapter throws when unconfigured.
 * No synthetic data, no silent mocks. Mocking belongs in tests only.
 */
export class AdapterNotConfigured extends Error {
  constructor(provider: string) {
    super(`${provider} adapter not configured — set required env vars`);
    this.name = 'AdapterNotConfigured';
  }
}

export interface AdapterCapabilities {
  sandbox: boolean;
  features: string[];
}

export abstract class BaseAdapter {
  abstract provider: string;
  abstract isConfigured(): boolean;
  abstract capabilities(): AdapterCapabilities;
  protected assertConfigured() {
    if (!this.isConfigured()) throw new AdapterNotConfigured(this.provider);
  }
}
