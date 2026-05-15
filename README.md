# Kyrie Media Automation — Proposal Dashboard

Interactive proposal presentation for **Kyri Media** (kyrimedia.us) covering
two automation projects:

- **Project 1 — Automated Video Editing**: brief in → finished talking-head short out.
- **Project 2 — Automated Video Posting**: Google Sheet "ready" → posted as the client via MoreLogin on schedule.

Each project shows its 8 questions, our technical answers, the pipeline, and
the MCP/skill/tool stack mapped to each answer (verified against the
configured environment catalog).

## Stack

Vue 3 · Vite · TypeScript · Tailwind CSS

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the build at http://localhost:4173
```

## Deploy (Vercel)

Auto-detected as a Vite app (`vercel.json` included).

- **Recommended**: import this GitHub repo at https://vercel.com/new → every
  push to `main` redeploys automatically.
- **CLI**: `vercel login` then `vercel --prod`.

## Docker (optional)

```bash
docker build -t kyrie-media-automation .
docker run --name kyrie-media-automation -p 8080:80 kyrie-media-automation
```

## Content

All Q&A and tool mappings live in `src/data/` (`projects.ts`, `tools.ts`) —
edit there, no component changes needed.
