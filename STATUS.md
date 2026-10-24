# Field Service OS — Status

## Completed
- [x] Multi-tenant kernel + RBAC + audit + api_keys
- [x] Technicians, work orders (state machine), job cards, parts, service reports (signature + GPS)
- [x] Mobile-first UI (dashboard, work orders, technicians, reports)
- [x] Prisma migration + seed + tests
- [x] Rate-limited, correlated API surface (`src/server/modules/http.ts`)
- [x] Dockerfile + Compose + CI on the standard pattern
- [x] Smoke under `scripts/smoke.ts`; passes locally

## Next
- Real M-Pesa on-completion STK confirm + invoice linkage (into SME Business OS)
- Repeat-service reminders and SLA notifications
