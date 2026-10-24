# Field Service OS — Runbook

## Bring-up
```bash
cd projects/02-field-service/app
cp .env.example .env           # ensure DATABASE_URL -> localhost:5433/field_service_dev
docker start kenya254-pg       # shared Postgres :5433
npm install                    # first time only (or --offline once cache warm)
npx prisma migrate dev
npm run db:seed
npm run dev                    # http://localhost:7311
```

## Verify
```bash
npm run typecheck && npm test && npm run build
APP_URL=http://localhost:7311 npx tsx scripts/smoke.ts
```

## Daily ops
- Health: `GET http://localhost:7311/api/v1/health`
- Logs: structured JSON with `x-correlation-id` per request
- Audit: `audit_events` table for consequential actions
- Restart: `scripts/start-all.sh` from package root
- Dashboard: http://localhost:7263 — log progress via /api/log & /api/progress

## Backup/restore
`docker exec kenya254-pg pg_dump -U postgres field_service_dev > backup.sql`
`docker exec -i kenya254-pg psql -U postgres field_service_dev < backup.sql`
