# Phase 3 — Production-hardening backlog (applies to all apps)

- [ ] Wire real integration credentials via .env (adapters currently throw)
- [ ] OIDC auth adapter; disable AUTH_DEV_BYPASS in non-dev
- [ ] OTel spans + exporter + dashboards
- [ ] Rate-limit tuning per endpoint sensitivity
- [ ] Signed webhook verification + replay protection
- [ ] Backup/restore drill on a schedule
- [ ] CI matrix: typecheck + test + build per project on push
- [ ] Staging deploy behind feature flags
- [ ] Data retention / deletion workflows for PII
- [ ] Pen-test tenant isolation
