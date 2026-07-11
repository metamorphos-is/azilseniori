## Deploy Hostinger (Express — ca CRM-ul care funcționa)

Subdomeniu: `mediumorchid-kingfisher-188706.hostingersite.com`

### Setări hPanel → Node.js Web App

| Câmp | Valoare |
|------|---------|
| Framework | **Express** |
| Node.js | **20** sau **22** |
| Root directory | `.` |
| Package manager | `npm` |
| Entry file | `server.js` |
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm start` |

### Variabile de mediu

```
NODE_ENV=production
DATABASE_URL=mysql://u422988064_azilseniori:PAROLA@localhost:3306/u422988064_azilseniori
SESSION_SECRET=<random-32-chars>
PUBLIC_BASE_URL=https://mediumorchid-kingfisher-188706.hostingersite.com
```

### Rute de test

- `/` — homepage
- `/caut` — căutare cămine
- `/health` — health check JSON
- `/diagnostics` — diagnostics JSON
- `/api/health` — health + DB status

### Deploy manual

```bash
npm run deploy:hostinger
```
