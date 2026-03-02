# Agent Match Screen Interface (prototype)

Prototype UI for MLS / Agent Match screens.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm install
npm run build
```

## Static preview (SPA)

```bash
python3 spa_server.py --port 8090 --bind 0.0.0.0
```

Then open:
- http://localhost:8090/
- http://localhost:8090/home

## GitHub Pages (no own server)

This repo is configured to auto-deploy to GitHub Pages from `main`/`master` via GitHub Actions.

One-time setup in GitHub repo:
1. Open `Settings` -> `Pages`.
2. In `Build and deployment`, set `Source` to `GitHub Actions`.
3. Push to `main` (or run workflow manually).

After deploy, app URL will be:
- `https://<your-github-username>.github.io/<repo-name>/`
