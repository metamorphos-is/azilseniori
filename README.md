# Azil Seniori — Demo Day/Night Mode

Aplicație web statică simplă, cu deploy automat pe Hostinger din Git.

## Live

https://mediumorchid-kingfisher-188706.hostingersite.com

## Ce face

- Comută între **Day Mode** și **Night Mode**
- Salvează preferința în browser (localStorage)
- Deploy automat la push pe `main`

## Structură

```
index.html   — pagina principală
style.css    — teme day/night
script.js    — comutator temă
```

## Deploy din Git (recomandat)

1. Modifici codul local
2. Commit + push pe `main`
3. GitHub Actions deploy-ează automat pe Hostinger

### Setup o singură dată

În GitHub → repo **Settings → Secrets → Actions**, adaugă:

- `HOSTINGER_API_TOKEN` — token din hPanel → Advanced → API

## Deploy manual (local)

```powershell
Compress-Archive -Path index.html,style.css,script.js -DestinationPath site.zip -Force
node deploy.mjs site.zip
```

Necesită autentificare Hostinger (OAuth sau `HOSTINGER_API_TOKEN`).

## Repo

https://github.com/metamorphos-is/azilseniori
