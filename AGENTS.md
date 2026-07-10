# AGENTS.md

## Project overview

**azilseniori** — aplicație web statică demo (HTML/CSS/JS) cu comutator Day/Night Mode, deploy pe Hostinger.

## Structură

- `index.html`, `style.css`, `script.js` — site-ul static
- `.github/workflows/deploy.yml` — deploy automat pe Hostinger la push pe `main`

## Comenzi locale

```bash
# fără server — deschide index.html în browser

# deploy manual (necesită OAuth Hostinger sau HOSTINGER_API_TOKEN)
npm run deploy
```

## Deploy

La fiecare push pe `main`, GitHub Actions urcă fișierele statice pe Hostinger.

Secret necesar în GitHub repo: `HOSTINGER_API_TOKEN` (din hPanel → API).
