# Test Plan

## Test layers
1. Unit tests for business rules.
2. Integration tests for database and adapters.
3. Contract tests for external APIs.
4. End-to-end tests for critical customer journeys.
5. Security tests: authz, tenant isolation, rate limits, upload handling.
6. Resilience tests: retries, duplicate webhooks, provider outages.
7. Migration tests: upgrade from every supported prior schema version.
8. Performance tests on key list/search/report endpoints.
9. Backup/restore verification.

## Release gate
No release if critical path has failing tests, unresolved high-severity security findings, broken migrations, or unverified external integration behavior.
