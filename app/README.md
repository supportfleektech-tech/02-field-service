# Field Service OS — App

Kenya-first field service & job management. Next.js 15 + TypeScript + Prisma + PostgreSQL (own DB `field_service_dev`).

## Quick start
```bash
cd app
cp .env.example .env
docker start kenya254-pg                    # shared dev Postgres on :5433
docker exec kenya254-pg psql -U postgres -c "CREATE DATABASE field_service_dev;"
npm install
DATABASE_URL=... npx prisma migrate dev
npm run db:seed
npm run dev                                  # http://localhost:7311
```

Demo org: id `00000000-0000-0000-0000-000000000002`, email `ops@demo.co.ke`.

## Tests
`npm run typecheck && npm test && npm run build && npx tsx scripts/smoke.ts` (with dev server running)
