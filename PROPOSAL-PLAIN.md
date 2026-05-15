# Kyrie Media Automation — Proposal (Plain-English + Technical)

**Prepared for:** Kyri Media (kyrimedia.us)

**How to read this:** every section has two parts —
**In plain English** (no tech background needed) and
**Under the hood** (the technical detail) — so both the decision-makers and
the engineers get what they need from one document.

---

## The big picture

**In plain English.** Today, two jobs eat a lot of human time: (1) a video
editor manually cuts every short video, and (2) a team member manually logs in
and posts each video for each client. We want software to do both — the social
media manager just fills in the brief, marks a video "ready," and the system
does the rest, the same way your team would, just unattended.

Think of it like hiring two tireless assistants:
- **The Editor assistant** watches for a new brief, finds the right background
  clips, and edits the video to match the style you asked for.
- **The Poster assistant** waits until a video is approved, then logs in as that
  client (from a US location) and posts it on time — and tells you if anything
  went wrong.

**Under the hood.** Two automation pipelines orchestrated by n8n with AI agents
for the decision steps. Execution (rendering, posting) stays deterministic; AI
is used for parsing, ranking, planning, scoring and verification. A single
orchestrator (Hermes) supervises both once running.

---

## Project 1 — Automated Video Editing

**In plain English.** A real-estate agent records themselves talking. The
social media manager writes a short brief: the topic, the caption, and a link
to an "inspiration" video showing the style/pace/music they want. Normally a
human editor then hunts the internet for local background clips (e.g. Florida
streets, Miami skyline) and edits it all together. We replace that editing job
with software that produces a finished or nearly-finished video on its own.

**Under the hood.** Brief is parsed by an LLM into a structured job. The
inspiration video becomes a reusable "style profile." Background footage
(B-roll) is sourced and ranked, the talking head is transcribed, an edit plan
is generated, and a deterministic render engine assembles the final video. A
scoring step decides whether it's good enough to auto-finish or needs a quick
human glance.

### The 8 questions — answered both ways

**1. Where do the local background clips come from?**
- *Plain:* The system searches stock libraries and (optionally) public social
  posts for clips that match the area and topic — and double-checks the clips
  actually look like the right place before using them.
- *Technical:* Tier-1 license-safe stock APIs (Pexels/Pixabay/Storyblocks);
  optional Tier-2 scrape (Playwright/Apify/yt-dlp) of public TikTok/IG/YouTube.
  An LLM + RAG ranker scores candidates vs the style profile; a vision check
  validates location; gaps filled by AI-generated video; cached in Supabase by
  region+topic. *Florida example:* "Florida" → expanded queries (Miami skyline,
  palm-tree street, waterfront home) → stock + opt-in geotagged social → vision
  check drops wrong-location clips → cache for instant reuse next time.

**2. What actually edits the video?**
- *Plain:* A reliable, repeatable video engine — not a magic black box — cuts
  the talking head, lays the background clips over it, syncs music to the beat,
  and burns in captions.
- *Technical:* FFmpeg driven by a programmatic timeline (Shotstack API or
  self-hosted Remotion/Creatomate). Whisper transcript → LLM edit-decision-list
  → beat-snapped cuts → burned captions → 9:16/1:1 encode. Stateless workers
  scale to 200+/month.

**3. How close will it look to the inspiration video?**
- *Plain:* Very close on pace, cuts, captions, music feel and structure. Not
  100% identical on bespoke artistic touches — those rare cases get a quick
  human check. We promise "same feel and pacing," not a frame-perfect clone.
- *Technical:* Each client/format has a predefined style template. Huashu-Design
  turns brand intent into a structured design spec; Claude Design builds the
  visual system; a custom agent (built with Claude Code/Codex) generates every
  edit to that spec. ~80% on grade/transition flair via LUTs + library.

**4. How much is fully automatic vs needs a human?**
- *Plain:* Aim ~85–90% fully automatic once tuned (first 1–2 months ~60–70%
  while it learns each client). A built-in "is this good?" score decides what to
  auto-finish vs send for a 1–2 minute human check.
- *Technical:* A RAG scoring agent (Ollama + vector DB) embeds inspiration +
  brand rules + template, semantic-searches the rendered draft → 0–1 conformance
  score + hard template pass/fail. The % is an observed metric, not a guess.

**5. What does each video cost to make?**
- *Plain:* Roughly **$1–$4 of tooling per video** at volume — about
  **$200–$800/month** for 200 videos — and it drops as the system reuses cached
  clips. (This excludes the one-time build.)
- *Technical:* Stock+assembly $0.30–$1.20; AI-gen B-roll +$0.50–$3.00 (~$0 on
  local WanGP). CodeBurn tracks real per-video AI spend.

**6. How fast is each video?**
- *Plain:* A few minutes of computer time, and many run at once — effectively
  "ready within minutes of submitting the brief."
- *Technical:* ~4–10 min machine time end-to-end, parallelized; AI-gen adds
  1–4 min; human approval adds the reviewer's 1–2 min.

**7. How long to build a working version?**
- *Plain:* A usable prototype in about **3–4 weeks**; a polished,
  production-ready system in about **6–8 weeks**.
- *Technical:* Wk1 intake+style+sourcing PoC; Wk2–3 assembly+caption/beat-sync;
  Wk4 review queue+scoring+calibration on 10–20 real briefs.

**8. What are the honest risks?**
- *Plain:* Borrowed social clips have copyright risk (so we default to safe
  stock + AI-generated). Very artsy inspiration videos won't be matched
  perfectly. Quality varies a little in the first weeks while it learns.
- *Technical:* Scraped social = licensing risk (opt-in only); style ceiling on
  motion-graphics-heavy refs; social-site markup volatility; calibration-period
  variance; AI-gen can look synthetic for real locality (fallback only).

---

## Project 2 — Automated Video Posting

**In plain English.** When a video is marked "ready" in your Google Sheet, the
system posts it for the right client to the right platform (Facebook,
Instagram, YouTube, TikTok) at the scheduled time — appearing to come from a US
location, exactly like your team does manually with MoreLogin. It then ticks
the sheet to confirm, and raises a flag if a post fails.

**Under the hood.** n8n watches the Sheet, builds a safe job queue, opens the
correct MoreLogin profile (US residential IP) via its local API, a browser
agent performs the upload, success is verified and written back, failures are
classified and alerted.

### The 8 questions — answered both ways

**1. How does it read the Sheet?**
- *Plain:* It watches the sheet and picks up rows marked "ready," reading the
  video, caption, platform and time — and it can never accidentally post twice.
- *Technical:* n8n Sheets node (poll/webhook) → typed job → Supabase queue with
  an idempotency key (row+platform).

**2. How does it post as the right client from a US IP?**
- *Plain:* It opens that client's own MoreLogin profile (which already has their
  US address/identity), so posts look US-local — same as your team today.
- *Technical:* MoreLogin Local API starts the profile → returns a CDP port →
  Playwright/BrowserMCP attaches → traffic exits the client's US residential
  proxy + anti-detect fingerprint. *A properly set-up US VPS or per-client US
  VPN is an equally valid alternative — only a shared datacenter IP is risky.*

**3. Official app or browser?**
- *Plain:* Mostly it drives the website like a person would (so the US identity
  is preserved); YouTube can use the official app where a client allows it.
- *Technical:* Browser automation primary; per-platform scripted flows with DOM
  assertions; YouTube Data API optional; human-like pacing + daily caps.

**4. Is the timing reliable?**
- *Plain:* Yes — usually within a minute or two of the scheduled time, and it
  spreads out jobs so it never overloads.
- *Technical:* n8n delay queue in client timezone, ±1–2 min (pre-warm for
  exact-minute); native platform schedule where available; concurrency limiter.

**5. How do we know it actually posted?**
- *Plain:* It grabs the live post link and a screenshot, confirms it's really
  up, then writes "POSTED" + link back into your sheet.
- *Technical:* Driver captures permalink/id + screenshot, verifies live, n8n
  writes status/URL/timestamp; audit log in Supabase.

**6. What happens when a post fails?**
- *Plain:* It retries a couple of times; if it still fails it marks the row
  FAILED with the reason and alerts a human immediately — nothing fails
  silently.
- *Technical:* Step assertions → backoff retry → FAILED + reason code
  (PROXY_DOWN, CAPTCHA, …) + screenshot → Slack/email alert + dashboard.

**7. How long to build?**
- *Plain:* A working version in about **2–3 weeks**; fully hardened across all
  clients/platforms in **4–6 weeks**.
- *Technical:* Wk1 trigger+queue+MoreLogin+1 platform; Wk2 all platforms +
  scheduling + write-back; Wk3 failures + retries + concurrency.

**8. Honest risks?**
- *Plain:* Auto-posting is against the platforms' rules in principle — the same
  risk your manual MoreLogin process already carries, now unattended. We reduce
  it (human-like behavior, limits) but can't remove it. Captcha/login prompts
  still need an occasional human.
- *Technical:* ToS exposure mitigated not eliminated; UI drift needs patched
  selectors; captcha/2FA human fallback; conservative rate limits + warm-up;
  MoreLogin API health checks + graceful pause.

---

## Money, time and what we need from you

**In plain English.**
- **Cost:** mostly Project 1 tooling — about $200–$800/month at 200 videos,
  dropping over time. Project 2 tooling is minimal (you already pay for
  MoreLogin). Plus a one-time build.
- **Time to live:** prototypes in 2–4 weeks; production in 4–8 weeks depending
  on which project(s) we start with.
- **We need from you:** confirm scope/priority; decide per client whether
  borrowed social clips are allowed or stock-only; give us one client + one
  format to pilot first.

**Under the hood.** 63 tools across 12 categories, each tagged free / freemium /
paid (full list and filter in the companion dashboard). Backbone already
configured: n8n, Playwright/BrowserMCP, Supabase, Gemini, Claude Code/Codex,
GitHub/Vercel. Proof of capability: analogous automations already built
(AI factory long-form video, Faceless POV AI machine → P1; AI avatar social
Automation → P2). Monitoring: Uptime Kuma + n8n error-workflow + agent traces
(RuView/Claude HUD) + a Supabase-backed KPI view.

---

*Companion: interactive dashboard in this repo (`npm run dev` or the Vercel
deploy). Detailed technical proposal: `PROPOSAL.md` /
`Kyri-Media-Automation-Proposal.docx`.*
