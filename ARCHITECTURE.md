# Field Service & Job Management — Architecture

## Reference stack
- Web: Next.js + TypeScript + Tailwind/shadcn-style component system.
- API/domain services: TypeScript service layer (NestJS/Fastify acceptable) with PostgreSQL.
- Background jobs: Redis + BullMQ-compatible queue.
- Files: S3-compatible object storage.
- Auth: OIDC-compatible identity provider; tenant and role enforcement in the application.
- Observability: OpenTelemetry + centralized logs/metrics/traces.
- Delivery: Docker; CI/CD; infrastructure-as-code.
- AI: internal AI gateway with provider adapters.

## Core boundaries
`Web/App -> API -> Domain -> Integration Adapters -> External Systems`

Shared services:
`Identity | Tenant | Billing | Audit | Notifications | Files | Search | AI | Feature Flags | Support`

## Tenancy
Every business record must carry a tenant/org boundary. Never rely solely on frontend filtering. Add database-level protections where practical.

## Reliability
- Idempotency keys on mutation/integration endpoints.
- Outbox pattern for important integration events.
- Retries with exponential backoff and dead-letter queues.
- Reconciliation jobs for asynchronous external systems.
- Graceful degradation when third-party APIs are unavailable.

## Security
Threat-model authentication, authorization, secrets, webhook validation, file uploads, exports, admin access and cross-tenant access.

## Scaling
Start as a modular monolith. Split services only when measured load, team boundaries or regulatory isolation justify it.
