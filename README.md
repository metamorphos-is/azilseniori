# Deploy din Git pe Hostinger

Site-ul este **static** (HTML/CSS/JS), dar **versiunile și deploy-ul** vin din Git.

## Varianta recomandată: Git nativ Hostinger

Hostinger trage direct din GitHub la fiecare push.

1. **hPanel** → site-ul tău → **Advanced → Git**
2. **Continue with GitHub** → autorizează
3. Selectează repo: `metamorphos-is/azilseniori`
4. Branch: `main`
5. Root directory: `public_html`
6. **Deploy** + activează **Auto deployment**
7. Copiază **Webhook URL** din hPanel
8. În GitHub → **Settings → Secrets → Actions** → adaugă:
   - `HOSTINGER_GIT_WEBHOOK` = URL-ul webhook

După setup, la fiecare `git push` pe `main`:
- GitHub Actions declanșează webhook-ul
- Hostinger face pull din repo și publică fișierele

## Verificare

Footer-ul site-ului arată commit-ul Git, ex: `Git f65ec65`.

## Flux zilnic

```bash
git add .
git commit -m "schimbare"
git push
```

Modificările apar live după deploy (câteva secunde).

## Repo

https://github.com/metamorphos-is/azilseniori
