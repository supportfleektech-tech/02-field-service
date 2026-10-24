# API & Integration Contract

## Rules
- REST/JSON externally unless an integration requires another protocol.
- OpenAPI is the source of truth.
- Version public APIs (`/v1/...`).
- Validate all inputs server-side.
- Return stable error codes and machine-readable validation details.
- Require authentication for protected endpoints.
- Scope every request to an organization.
- Use idempotency for financial or externally-triggered mutations.
- Verify signatures on inbound webhooks.
- Log correlation IDs, not secrets or full sensitive payloads.

## Integration adapter interface
Each external provider must be wrapped behind an adapter with:
- capability discovery
- request/response normalization
- timeout policy
- retry policy
- error taxonomy
- observability
- reconciliation
- credential rotation

## Real integrations
Do not ship against invented endpoints. Obtain current partner documentation and sandbox credentials before implementation.
