# Implementation Status — Field Service & Job Management

## Phase 1 — Foundation (DONE ✅ 2026-09-26)
- [x] Scaffold Next.js 15 + TS + Prisma + PostgreSQL (independent app, port 7311)
- [x] Shared-kernel schema: orgs, users, memberships (RBAC), audit_events, api_keys, customer
- [x] Domain: technicians, work_orders (state machine REQUESTED→QUOTED→APPROVED→DISPATCHED→IN_PROGRESS→COMPLETED→INVOICED/CANCELLED), job_cards, parts, part_usages, service_reports (signature + GPS + photo URLs)
- [x] Server-side tenant scoping; dev-auth bypass + signed JWT path
- [x] APIs: /v1/health, /work-orders (+{dispatch|complete}), /technicians, /service-reports, /webhooks/mpesa
- [x] Adapters throw when unconfigured (M-Pesa, Email)
- [x] Mobile-first UI: Dashboard / Work Orders / Technicians / Service Reports
- [x] Migration applied + seeded demo org + tech + dispatched WO
- [x] Tests 3/3 (auth + adapter-throw) · Typecheck clean · Build clean · Smoke 3/3

## Phase 2 — Real integrations (PENDING)
- [ ] M-Pesa STK for on-completion collections; webhook → mark WO INVOICED
- [ ] Quote → Invoice handoff into SME Business OS (cross-app module)
- [ ] Repeat-service reminders (scheduled notifications)
- [ ] S3 photo uploads + signature storage hardening
- [ ] Rate limits + OTel + backups/restore

## Phase 3 — Hardening + pilot
- [ ] Staging deploy; penetration-test tenant isolation
- [ ] Onboard 5 pilot customers
