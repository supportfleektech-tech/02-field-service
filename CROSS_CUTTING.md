# Hard Cross-Cut — Applied to every app

These apply to all projects under `projects/*/app` (Next.js + TypeScript + Prisma + PostgreSQL).

## Platform invariants (already shipped)
- Multi-tenant kernel: Organization, User, Membership (OWNER/ADMIN/MEMBER/VIEWER), AuditEvent, ApiKey
- Server-side tenant scoping on every query; RBAC enforced in modules
- Adapter-throw contract for external providers (M-Pesa, eTIMS, Email, AI, etc.)
- Idempotent financial mutations (unique idempotency_key on Payment / PaymentIntent)
- Mobile-first UI (dark, responsive) + /api/v1/* route surface
- Per-app DB, migration, seed, smoke; Dockerfile + GitHub Actions CI

## Phase 2 hardening (rolling out)
1. **Rate limiting** — per-identity sliding window on every authenticated route (src/server/modules/http.ts::rateLimit).
2. **Request tracing** — correlationId stamped on every response; structured JSON logs.
3. **RLS templates** — per-app Postgres row-level security helpers (src/server/modules/rls.ts) to switch on when moving to multi-tenant-shared-cluster production.
4. **Audit enrichment** — consequential actions now record userId + org + entity + metadata; used across all modules.
5. **CI matrix** — typecheck + tests + build for each app (per-app workflow present).

## Producer wiring (next)
- **M-Pesa Daraja** (`/api/v1/webhooks/mpesa` + adapter): set MPESA_* env vars and re-run smoke; adapter throws until then.
- **KRA eTIMS** (invoices): set ETIMS_* env vars in P1.
- **Email** (invoices/notifications): set EMAIL_PROVIDER_API_KEY/EMAIL_FROM.
- **AI Gateway** (copilot): set OPENROUTER_API_KEY or HUGGINGFACE_API_KEY.

## Ops
- `scripts/start-all.sh` restarts every dev app on its port.
- Track every change via dashboard API: http://localhost:7263.

## Project status (post Phase 1)
| # | Project | Port | Status |
|---|---|---|---|
| 1 | SME Business OS | 7310 | done |
| 2 | Field Service OS | 7311 | done |
| 3 | B2B Commerce | 7312 | done |
| 4 | People & HR | 7313 | done |
| 5 | AI Automation | 7314 | done |
| 6 | Payment Orchestration | 7315 | done |
| 7 | Managed Cloud | 7316 | done |
| 8 | Clinic OS | 7317 | done |
| 9 | Agri/Coop OS | 7318 | done |
