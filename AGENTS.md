# AGENTS.md

## Project overview

**azilseniori** is currently an empty placeholder repository. It contains only `README.md` with the project title. There is no application source code, dependency manifests, Docker configuration, CI, or tests yet.

The name suggests a future product in the senior-care / nursing-home domain (Romanian: *azil* + *seniori*), but no implementation exists in the repo today.

## Cursor Cloud specific instructions

### Repository state

- **Tracked files:** `README.md` only
- **No services to start:** there is no web app, API, database, or other runtime to launch until code is added.
- **No dependency install step:** no `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `docker-compose.yml`, etc.

### When code is added

After the first implementation lands, update this section with:

1. How to install dependencies (per lockfile / manifest in the repo)
2. Which services must run for end-to-end development
3. Lint, test, and dev-server commands (prefer referencing `README.md` or package scripts rather than duplicating)

### Current verification (empty repo)

These checks confirm the cloud VM and git workspace are healthy; they do not start an application:

```bash
git status
git log --oneline -1
node --version
python3 --version
```

### VM tooling available

The cloud agent VM includes Node.js (via nvm), npm/pnpm/yarn, Python 3, and git. Docker is not assumed until the project adds container-based workflows.
