# Deployment & Operations

## Environments
- local
- CI
- staging
- production

## Required production components
- Web/API runtime
- PostgreSQL
- Redis/queue
- Object storage
- Email/SMS provider
- Domain + TLS
- Monitoring/alerting
- Secrets manager
- Backups
- CI/CD

## Delivery
- Build immutable container images.
- Run migrations before application activation using a controlled migration job.
- Health/readiness probes.
- Automated rollback to prior image.
- Separate production credentials.
- No secrets committed to Git.

## Launch checklist
- [ ] DNS/TLS
- [ ] Billing
- [ ] Error monitoring
- [ ] Audit logs
- [ ] Backups tested
- [ ] Restore tested
- [ ] Cron/queues running
- [ ] External API credentials validated
- [ ] Customer support channel live
- [ ] Terms/privacy/subprocessors published
- [ ] Smoke tests passed
