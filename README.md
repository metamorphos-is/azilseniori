# azilseniori.ro

Platformă marketplace pentru cămine de seniori din România.

## Stack

- **apps/web** — Next.js (App Router, SSR/SSG)
- **apps/api** — NestJS REST `/api/v1`
- **packages/database** — Prisma + MySQL

## Dezvoltare locală

```bash
cp .env.example .env
npm install
npm run db:generate
npm run dev
```

API local: `npm run dev:api` (port 4000)

## Deploy Hostinger

Subdomeniu: `mediumorchid-kingfisher-188706.hostingersite.com`

### Variabile de mediu (hPanel → Websites → Node.js → Environment)

```
NODE_ENV=production
DATABASE_URL=mysql://u422988064_azilseniori:PAROLA@localhost:3306/u422988064_azilseniori
SESSION_SECRET=<random-32-chars>
```

### Setări build (hPanel → Node.js Web App)

| Câmp | Valoare |
|------|---------|
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start -- -p $PORT` |
| Node.js | 20 |
| Root directory | `.` |
| Output directory | `apps/web/.next` |

### Deploy din Git (recomandat)

1. Conectează repo GitHub în hPanel → Deploy → Git
2. Build: `npm run build`
3. Start: `npm run start` (rulează migrații Prisma automat)

### Deploy manual (script local)

```bash
npm run deploy:hostinger
```

## Repo

https://github.com/metamorphos-is/azilseniori
