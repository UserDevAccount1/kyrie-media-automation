# Kyrie Media Automation — Proposal

**Prepared for:** Kyri Media (kyrimedia.us)
**Scope:** Project 1 — Automated Video Editing · Project 2 — Automated Video Posting
**Companion:** interactive dashboard (this repo) — `npm run dev`, or the deployed Vercel URL.

---

## Summary

Two automation systems:

1. **Automated Video Editing** — the social media manager fills the brief (topic,
   caption, inspiration video); the system sources local B-roll, assembles and
   edits a finished/near-finished talking-head short with no human editor.
2. **Automated Video Posting** — when a video is marked ready in Google Sheets,
   the system posts it as the correct client (US residential IP via MoreLogin),
   on schedule, confirms in the sheet, and flags failures.

Honest principle throughout: **AI agents do decisioning, orchestration, scoring
and verification; execution (render, post) stays deterministic.** That is what
makes the automation auditable and the percentages real metrics, not guesses.

---

## PROJECT 1 — Automated Video Editing

**Now:** agent records talking head → Drive; SMM writes brief in a Doc; a human
editor sources local B-roll and cuts in Premiere/CapCut; reviewed; posted.

**Pipeline (agent vs deterministic):**

| # | Step | What | AI agent role |
|---|------|------|---------------|
| 1 | Intake | n8n watches the brief Doc + Drive | LLM extraction → schema-validated job |
| 2 | Style profile | Skill Seekers + beat/scene analysis; Huashu-Design + Claude Design → visual spec | vision/beat → structured style+design spec, embedded |
| 3 | B-roll sourcing | stock + social/web + AI-gen | LLM+RAG rank vs topic/area/style |
| 4 | Transcribe & plan | Whisper → EDL | LangGraph planner emits deterministic EDL |
| 5 | Assembly | FFmpeg/Shotstack render | none — deterministic; agent triggers + verifies |
| 6 | Review | draft + score to queue | RAG scoring agent → auto-finalize or human |

### Q1 — Sourcing local B-roll
Two-tier. **Tier 1 (default, license-safe):** Pexels/Pixabay (free) + Storyblocks
(paid) geo+topic queries. **Tier 2 (opt-in):** Playwright/Apify/yt-dlp scrape of
public TikTok/IG/YouTube/Google for true-local feel. LLM+RAG ranks vs the style
profile; gaps filled by AI-gen (Kie.ai/Seedance/Higgsfield, or local WanGP $0);
cached in Supabase by region+topic.
**Worked example — Florida:** area parsed to a geo entity (Florida + city if
given) → expanded to visual queries (Miami skyline aerial, palm-tree street,
waterfront home, suburb drone) → Tier-1 stock + opt-in geotagged social → a
**vision check confirms it actually looks like Florida** (palms, FL
architecture/signage) and drops wrong-location clips → gaps AI-generated →
cached so the next Florida video is near-instant.
*Tools:* n8n, Pexels/Pixabay, Storyblocks, Apify, yt-dlp, Playwright, Gemini,
RAG agent, Kie.ai, Seedance, Higgsfield, WanGP, Supabase.

### Q2 — Assembly engine
Deterministic, not a black box: **FFmpeg** driven by a programmatic timeline
(**Shotstack** API or self-hosted **Remotion**/**Creatomate**). Whisper
word-level transcript → LLM Edit Decision List → beat-snapped cuts → burned
captions in the inspiration style → encode to 9:16 / 1:1. HeyGen available for
avatar intro/outro. n8n conducts; renderer is a stateless worker → scales to
200+/mo in parallel.

### Q3 — Style match (can / partial / cannot)
**CAN:** cut pace, beat-synced cuts, caption style, aspect, hook structure,
B-roll ratio. **PARTIAL:** exact grade/transition flair (~80% via LUTs +
transition library). **CANNOT:** bespoke motion graphics, frame-perfect comedic
timing — flagged for review.
**Template-driven guarantee:** each client/format = a predefined style template;
a custom agent (scaffolded with **Claude Code / Codex**) generates every edit to
that spec. **Huashu-Design** turns brand intent into a structured design spec;
**Claude Design** generates the visual system (captions, lower-thirds,
end-cards). Honest framing: "same feel and pacing", not pixel-identical.

### Q4 — % automated (measured, not guessed)
Steady state ~85–90% auto, 10–15% review. Months 1–2 ~60–70% during calibration.
**How measured:** a **RAG scoring agent** (Ollama + vector DB: pgvector/Pinecone/
Weaviate/Faiss) embeds inspiration + brand rules + template; the rendered draft's
features are embedded and semantic-searched → 0–1 conformance score; the template
adds hard pass/fail conditions. Auto-finalize when `score ≥ threshold AND
conditions pass`. The % is an **observed per-video metric**.

### Q5 — Cost per video
Stock+assembly path ~$0.30–$1.20. AI-gen B-roll +$0.50–$3.00 (≈$0 on local
WanGP). Blended at 200/mo ≈ **$1–$4/video (~$200–$800/mo)** in tooling, excl.
one-time build. Drops over time via cache + reusable profiles. (CodeBurn tracks
real per-video AI spend.)

### Q6 — Time per video
~4–10 min machine time end-to-end; jobs run in parallel so 200/mo is absorbed —
effectively ready within minutes of brief submission. AI-gen adds 1–4 min;
human approval adds the reviewer's 1–2 min.

### Q7 — Prototype timeline
Wk1 intake + style profile + sourcing PoC · Wk2–3 assembly + caption/beat-sync +
first end-to-end drafts · Wk4 review queue + scoring + calibration on 10–20 real
briefs. **Working prototype ~3–4 weeks; production-hardened ~6–8 weeks.**

### Q8 — Risks / limitations (honest)
Licensing of scraped social (default stock+AI-gen, scraped opt-in) · style
fidelity ceiling on motion-graphics-heavy refs · social-site markup volatility ·
early quality variance during calibration · AI-gen B-roll can look synthetic for
real locality (fallback only).

---

## PROJECT 2 — Automated Video Posting

**Now:** a team member manually logs into each client's socials and posts;
MoreLogin anti-detect browser assigns each client a US IP + residential proxy;
done manually for FB/IG/YT/TikTok.

**Pipeline:** Trigger (deterministic) → Resolve (LLM validate row) → Schedule
(deterministic queue) → Launch MoreLogin profile (API) → Post (browser agent) →
Confirm/flag (verify + classify agent).

### Q1 — Read from Google Sheets
n8n Sheets node (poll or on-edit webhook) selects rows `status = Ready to post`
→ typed job `{client, videoUrl, caption, platform, scheduledTimeLocal}`; video
pre-fetched; written to a Supabase queue with an idempotency key (row+platform)
so it never double-posts.

### Q2 — MoreLogin integration (+ honest VPS/VPN note)
MoreLogin Local API starts the client's profile (proxy + US IP preconfigured) →
returns a CDP port → Playwright/BrowserMCP attaches → traffic exits via that
client's US residential proxy + anti-detect fingerprint.
**US VPS / VPN — equally valid when set up properly:** a US VPS (or per-client
US VPN) is a legitimate parallel path, NOT a fallback — *one isolated VPS/profile
per client + clean/residential US IP bound per client + matched fingerprint*.
Done that way it stands alongside MoreLogin; only the lazy single-shared-
datacenter-IP setup risks linking/bans. A US VPS is recommended regardless to
host the runtime (n8n, Hermes, render/orchestration).

### Q3 — How it actually posts
Browser automation inside the MoreLogin profile is primary (preserves per-client
residential IP + fingerprint). Per-platform scripted flows (Browser Agent) with
explicit DOM assertions. YouTube optionally via official Data API where granted;
FB/IG/TikTok stay on automated UI. Human-like pacing + per-account daily caps.

### Q4 — Scheduling & reliability
Scheduled local time held in n8n's delay queue, released in the client's
timezone; ±1–2 min (profile pre-warm for exact-minute). Native platform
"schedule" used where available. Concurrency limiter staggers same-minute jobs.

### Q5 — Success confirmation
Driver captures permalink/video id + screenshot, verifies the post is live, then
n8n writes `POSTED + URL + timestamp` back to the Sheet; screenshot/log to
Supabase for audit; idempotency key prevents re-posts.

### Q6 — Failure detection
Explicit assertions each step → auto-retry with backoff → still failing = row
`FAILED` + reason code (PROXY_DOWN, LOGIN_CHALLENGE, UPLOAD_REJECTED, CAPTCHA) +
screenshot → Slack/email alert + dashboard list. Captcha/2FA isolated, never
silently retried.

### Q7 — Prototype timeline
Wk1 Sheet trigger + queue + MoreLogin API + one platform/one client · Wk2
remaining platforms + scheduling + write-back · Wk3 failure handling + retries +
alerting + multi-client concurrency. **Prototype ~2–3 weeks; hardened ~4–6
weeks.**

### Q8 — Risks / limitations (honest)
Automated posting is against FB/IG/TikTok ToS in principle — mitigated
(anti-detect + residential IP + pacing + caps) not eliminated; same risk the
manual process already accepts, now unattended. UI drift needs monitored/patched
selectors. Captcha/2FA need human fallback. Conservative rate limits + warm-up
essential. MoreLogin Local API dependency → health checks + graceful pause.

---

## Orchestrator — Hermes Agent

A single orchestrator agent (Hermes, hermes-agent.org) supervises the whole
workflow once it's set: dispatches the per-step agents, sequences both projects,
handles retries/escalation/recovery, and keeps state across long runs. It is the
"manager" the proposal-dashboard's Orchestrator tab describes.

## Monitoring

A dedicated workflow-monitor is feasible and recommended: **Uptime Kuma**
(service/heartbeat + 90+ alerts), the n8n error-workflow, **RuView/Claude HUD**
(agent traces), **CodeBurn** (per-video cost), a Supabase-backed KPI view in this
Vue app. Pattern: **Emit → Probe → Observe → Visualize → Alert.**

## Capability Stack

63 tools across 12 categories, each tagged **free / freemium / paid** and
**configured / recommended** — filterable in the dashboard's Stack & Proof tab.
Backbone is configured today (n8n, Playwright/BrowserMCP, Supabase, Gemini,
Claude Code/Codex, Skill Seekers, GitHub/Vercel). Proof: existing analogous
automations already built (`AI factory long-form video`, `Faceless POV AI
machine` → P1; `AI avatar social Automation` → P2).

## Next Steps

1. Confirm scope + priority (P1, P2, or both in parallel).
2. Pick the B-roll posture per client (stock-only vs opt-in social scrape).
3. Stand up the prototype on 1 client / 1 format, calibrate, then scale.

*Companion dashboard: see `README.md` to run locally or open the Vercel deploy.*
