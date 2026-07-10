# azilseniori.ro — Agent Instructions

## Monorepo

- `apps/web` — Next.js public site + dashboards (future)
- `apps/api` — NestJS REST API
- `packages/database` — Prisma schema, migrations, seed

## Commands

```bash
npm install
npm run db:generate
npm run dev          # web :3000
npm run dev:api      # api :4000
npm run build
npm run typecheck
```

## Deploy

Hostinger Node.js app on subdomain. Env vars in hPanel. Spec in `docs/product-spec/` when present.
