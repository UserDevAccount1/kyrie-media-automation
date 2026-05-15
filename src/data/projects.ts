import type { Project } from './types'

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    tag: 'PROJECT 1',
    title: 'Automated Video Editing',
    subtitle: 'Brief in → finished talking-head short out. No human editor.',
    currentProcess: [
      'Agent records raw talking-head footage → uploaded to Google Drive.',
      'Social media manager writes a brief in a Google Doc: topic, caption, inspiration video (style / music / pace).',
      'Human editor sources local B-roll (TikTok / IG / YouTube / Google) for the client area, then edits in Premiere/CapCut: cut talking head, overlay B-roll, beat-synced music, captions.',
      'Finished video reviewed, then posted.',
    ],
    goal:
      'The social media manager fills the brief and the system produces a finished or near-finished video with no manual editing.',
    pipeline: [
      { label: 'Intake', detail: 'n8n watches the brief Doc + Drive folder; parses topic, caption, inspiration link, client area.', agent: 'AI agent: LLM extraction (Gemini/Claude) turns the free-text brief into a schema-validated job.' },
      { label: 'Style profile', detail: 'Skill Seekers + beat/scene analysis extract pacing, cut cadence, caption style; Huashu-Design + Claude Design turn it into a structured visual spec/template.', agent: 'AI agent: vision/beat analysis → structured style + design spec, embedded for later scoring.' },
      { label: 'B-roll sourcing', detail: 'Geo + topic queries against stock + social/web; license-safe filtering; AI-gen fallback for gaps.', agent: 'AI agent: LLM ranker + RAG match scores clips vs topic/area/style; gen-video fallback on gaps.' },
      { label: 'Transcribe & plan', detail: 'Whisper transcribes the talking head; an LLM builds an edit decision list (EDL) against the style profile.', agent: 'AI agent: LangGraph planner emits a deterministic EDL to the format template.' },
      { label: 'Assembly', detail: 'FFmpeg / Shotstack renders: cut talking head, B-roll overlays, beat-synced music, burned captions.', agent: 'No agent — deterministic render. The agent triggers + verifies it, never freestyles it.' },
      { label: 'Review', detail: 'Draft + score posted to a review queue (Supabase); approve or auto-finalize.', agent: 'AI agent: RAG scoring agent emits a 0–1 conformance score + template pass/fail → auto-finalize or route to human.' },
    ],
    questions: [
      {
        n: 1,
        question:
          'How will the system find and source real local B-roll footage from the internet? What is the technical approach and what tools are involved?',
        answer: [
          'Two-tier sourcing. Tier 1 (license-safe, default): geo + topic queries against stock APIs (Pexels, Pixabay, Storyblocks) parameterized by the client area parsed from the brief (e.g. "Austin TX skyline", "Minnesota suburb homes"). Tier 2 (authentic local feel): targeted scraping of public TikTok / Instagram / YouTube / Google results via the Playwright MCP browser agent, scored for relevance, resolution and recency.',
          'An LLM ranks candidates against the topic and the style profile and assembles a shortlist; gaps are filled with AI-generated B-roll (Kie.ai / Higgsfield, or local WanGP for zero per-clip cost).',
          'n8n orchestrates the sourcing graph; results cached in Supabase so repeat areas/topics get instant reuse.',
          'Honest note: scraped social B-roll carries licensing/usage risk — we default to stock + AI-gen and treat scraped clips as opt-in per client.',
        ],
        tools: ['n8n', 'pexels', 'storyblocks', 'apify', 'ytdlp', 'playwright', 'gemini', 'ragAgent', 'kie', 'seedance', 'higgsfield', 'wangp', 'supabase'],
      },
      {
        n: 2,
        question: 'What tool or API handles the actual video assembly and editing? How does it work?',
        answer: [
          'A deterministic render engine, not a black box: FFmpeg driven by a programmatic timeline (Shotstack API, or self-hosted Remotion) so every edit is reproducible and reviewable.',
          'Flow: Whisper transcribes the talking head with word-level timestamps → an LLM produces an Edit Decision List (which lines stay, where B-roll overlays, zoom/cut points) → music beats are detected and cut points snapped to the beat grid → captions are burned in the inspiration style → final encode to platform aspect ratios (9:16 / 1:1).',
          'HeyGen MCP is available for AI avatar intro/outro hooks or as a fallback when raw footage is unusable.',
          'n8n is the conductor; the renderer is a stateless worker so we can scale to 200+/month in parallel.',
        ],
        tools: ['ffmpeg', 'shotstack', 'remotion', 'creatomate', 'gemini', 'langgraph', 'whisper', 'heygen', 'supertonic', 'uppbeat', 'n8n'],
      },
      {
        n: 3,
        question:
          'How closely will the output match the style of the inspiration video? What can and cannot be replicated automatically?',
        answer: [
          'CAN replicate reliably: cut pace / clip duration rhythm, music energy and beat-synced cuts, caption style (font weight, position, pop-on timing), aspect ratio, hook structure, B-roll-to-talking-head ratio. Skill Seekers turns each inspiration video into a reusable structured "style profile".',
          'PARTIAL: exact color grade and transition flair — approximated with LUTs and a transition library, ~80% match.',
          'CANNOT fully replicate automatically: highly bespoke motion graphics, frame-perfect comedic timing, and creative narrative choices a senior editor would make. These are flagged for the optional human review step.',
          'Template-driven guarantee: each client/format gets a predefined style template (aspect ratio, caption preset, hook structure, B-roll ratio, LUT, transition set). A custom AI agent — scaffolded and iterated with Claude Code / Codex — generates and orchestrates every edit to that exact spec, so output reliably conforms to the agreed format instead of improvising. New formats = a new template, not a rebuild.',
          'How the template itself is produced: Huashu-Design turns plain-language brand/style intent into a STRUCTURED design spec, and Claude Design generates + iterates the visual system from it (caption presets, lower-thirds, end-cards, thumbnails). The render engine consumes that spec — so the look is engineered and repeatable, not a per-video guess.',
          'Expectation we set honestly: "same feel and pacing", not "pixel-identical to a hand-crafted edit".',
        ],
        tools: ['skillSeekers', 'huashu', 'claudeDesign', 'gemini', 'claudeCode', 'codex', 'langgraph', 'whisper', 'ecc'],
      },
      {
        n: 4,
        question:
          'What percentage of the process is fully automated versus requiring human review or correction?',
        answer: [
          'Target steady state: ~85–90% fully automated, 10–15% human review. Sourcing, transcription, EDL, assembly, captioning, encoding are 100% automated.',
          'Months 1–2 (calibration): expect ~60–70% auto-approved while the style profiles and B-roll filters are tuned per client.',
          'A confidence score per draft auto-finalizes high-confidence videos and routes only low-confidence ones (bad B-roll match, caption overrun, audio issues) to a 1–2 min human check.',
          'How that score is measured (honest mechanic): a RAG scoring agent — Ollama LLM + a vector DB (pgvector / Pinecone / Weaviate / Faiss). The inspiration video, the per-client brand rules and the agreed format template are chunked, embedded and stored. The rendered draft’s extracted features (cut cadence, caption layout, B-roll ratio, pacing) are embedded and semantic-searched against that style profile to produce a 0–1 conformance score. The predefined template adds hard pass/fail conditions (aspect ratio exact, caption safe-area, duration window, profanity/brand check).',
          'So the automation % is an OBSERVED metric the agent emits per video — not a guess. Auto-finalize when score ≥ threshold AND all template conditions pass; otherwise route to human review. The threshold is tuned during calibration, which is why month 1–2 is ~60–70% and steady state ~85–90%.',
          'The human role shifts from "editor" to "approver" — minutes per video instead of an hour.',
        ],
        tools: ['ragAgent', 'localLlm', 'vectorDb', 'hermes', 'ruview', 'claudeHud', 'supabase', 'n8n', 'langgraph', 'ecc'],
      },
      {
        n: 5,
        question: 'What is the estimated tooling cost per video once the system is running?',
        answer: [
          'Stock + assembly path (default): ~$0.30–$1.20 / video — stock API calls + LLM planning + Shotstack/compute render.',
          'AI-generated B-roll path (when needed): +$0.50–$3.00 / video on hosted gen APIs; near $0 if routed to local WanGP on a GPU box.',
          'Blended realistic estimate at 200 videos/month: ~$1–$4 / video ≈ $200–$800 / month in tooling, excluding the one-time build.',
          'Cost drops over time as the B-roll cache and reusable style profiles reduce fresh generation/sourcing.',
        ],
        tools: ['codeburn', 'kie', 'seedance', 'wangp', 'localLlm', 'shotstack', 'ffmpeg', 'gemini', 'supabase'],
      },
      {
        n: 6,
        question: 'How long will each video take to produce once the automation is live?',
        answer: [
          'End-to-end per video: ~4–10 minutes of machine time (sourcing 1–3 min, transcription/planning ~1 min, render 2–5 min depending on length/effects).',
          'Throughput matters more than latency: jobs run in parallel, so 200 videos/month is comfortably absorbed — effectively "ready within minutes of the brief being submitted".',
          'AI-generated B-roll adds 1–4 min when used. Optional human approval adds only the reviewer\'s 1–2 min.',
        ],
        tools: ['hermes', 'n8n', 'langgraph', 'shotstack', 'ffmpeg'],
      },
      {
        n: 7,
        question: 'What is a realistic timeline to build and test a working prototype?',
        answer: [
          'Week 1: brief intake (Doc/Drive parsing), style-profile extraction, B-roll sourcing PoC on one client area.',
          'Weeks 2–3: assembly engine (EDL → FFmpeg/Shotstack), caption + beat-sync, first end-to-end draft videos.',
          'Week 4: review queue, confidence scoring, calibration on 10–20 real briefs; tighten to client style.',
          'Realistic: working prototype in ~3–4 weeks; production-hardened (200/mo, monitoring) in ~6–8 weeks.',
        ],
        tools: ['claudeCode', 'codex', 'hermes', 'superpowers', 'n8nSkills', 'github'],
      },
      {
        n: 8,
        question: 'What are the risks or limitations we should know about before committing to this approach?',
        answer: [
          'Licensing: scraped social B-roll is legally grey — we default to stock + AI-gen; scraped clips are opt-in per client.',
          'Style fidelity ceiling: bespoke motion-graphics-heavy inspiration videos won\'t be matched 1:1 — sets the "near-finished, human approves" expectation.',
          'Source volatility: social sites change markup / add anti-bot defenses — sourcing scrapers need maintenance (mitigated by stock-first strategy).',
          'Quality variance early on: first weeks need human-in-loop while profiles calibrate.',
          'AI-gen B-roll can look synthetic for real-estate locality — used as fallback, not primary, for "real local" feel.',
        ],
        tools: ['ecc', 'hermes', 'uptimeKuma', 'wangp', 'supabase'],
      },
    ],
  },
  {
    id: 'p2',
    tag: 'PROJECT 2',
    title: 'Automated Video Posting',
    subtitle: 'Sheet says "ready" → posted as the client, from a US IP, on schedule.',
    currentProcess: [
      'A team member manually logs into each client\'s social accounts and posts the approved video + caption.',
      'Team is in the Philippines, clients in the US — MoreLogin anti-detect browser assigns each client a US IP + residential proxy so posts look US-local.',
      'Done manually for Facebook, Instagram, YouTube and TikTok.',
    ],
    goal:
      'When a video is marked ready in Google Sheets, the system reads the details, opens the correct MoreLogin profile, posts to the right platform on schedule, confirms in the sheet, and flags failures.',
    pipeline: [
      { label: 'Trigger', detail: 'n8n polls/▶ webhook on the Sheet; picks rows marked "ready to post".', agent: 'No agent — deterministic Sheet trigger + idempotency key (never double-posts).' },
      { label: 'Resolve', detail: 'Map client → MoreLogin profile id; read video link, caption, platform, scheduled time.', agent: 'AI agent: LLM normalizes/validates row fields (caption cleanup, platform/handle sanity).' },
      { label: 'Schedule', detail: 'Queue the job in n8n for the exact local posting time (per-client timezone).', agent: 'No agent — deterministic scheduled queue with concurrency limiter.' },
      { label: 'Launch profile', detail: 'MoreLogin local API starts the profile (US IP + residential proxy); returns a debug port.', agent: 'No agent — API call; agent only consumes the returned CDP port.' },
      { label: 'Post', detail: 'Browser agent (Playwright/BrowserMCP) drives the platform upload + caption inside that profile.', agent: 'AI agent: browser-automation agent runs the per-platform upload flow with explicit DOM assertions + screenshot proof.' },
      { label: 'Confirm / flag', detail: 'Verify post URL → write SUCCESS + link to the Sheet; on failure, flag + alert for investigation.', agent: 'AI agent: verifies the post is live, classifies failures into reason codes, decides retry vs flag.' },
    ],
    questions: [
      {
        n: 1,
        question:
          'How does the system read the video link, caption, platform and scheduled posting time from Google Sheets? What is the approach and tools?',
        answer: [
          'n8n Google Sheets node, triggered either on a short poll interval or a Sheet "on edit" webhook. It selects rows where a status column = "Ready to post".',
          'Each row maps to a typed job: { client, videoUrl (Drive/CDN), caption, platform, scheduledTimeLocal }. The video is pre-fetched from Drive to local/CDN so the upload step is fast and retry-safe.',
          'Jobs are written to a Supabase queue with an idempotency key (sheet row id + platform) so a row is never double-posted.',
        ],
        tools: ['n8n', 'sheets', 'gemini', 'hermes', 'supabase'],
      },
      {
        n: 2,
        question:
          'How does it integrate with MoreLogin to open the correct client profile with the right US IP and residential proxy?',
        answer: [
          'MoreLogin exposes a Local API (localhost) to start/stop browser profiles. Each client is mapped once to a MoreLogin profile id (proxy + US IP already configured inside MoreLogin).',
          'The workflow calls the API to start that client\'s profile; MoreLogin returns a debug/automation port (CDP endpoint).',
          'Our Playwright/BrowserMCP driver attaches to that exact port, so all posting traffic exits through the client\'s assigned US residential proxy with the profile\'s anti-detect fingerprint — identical to how the team does it manually, just unattended.',
          'Alternative considered — US VPS / VPN (honest assessment): a US-hosted virtual server or commercial VPN gives a US exit IP, and we DO recommend a US VPS to host the automation runtime (n8n, Hermes, render/orchestration) for US-local timing and clean official-API posts. For the actual FB/IG/TikTok UI posting it stays SECONDARY: datacenter VPS/VPN IPs are easily fingerprinted as non-residential and one shared IP across clients risks cross-account linking and bans. MoreLogin\'s per-client residential proxy + anti-detect profile remains primary — the same risk posture the team already accepts today.',
        ],
        tools: ['moreloginApi', 'antidetectAlt', 'usVps', 'vpnUsIp', 'playwright', 'browserMcp', 'browserAgent', 'hermes'],
      },
      {
        n: 3,
        question:
          'How does it actually post to Facebook, Instagram, YouTube or TikTok inside the anti-detect browser — official APIs or browser automation?',
        answer: [
          'Browser automation inside the MoreLogin profile is the primary method — it is the only approach that preserves the per-client residential IP + anti-detect fingerprint the current manual process relies on. Official APIs would post from our server IP and need per-client app review/tokens, breaking the US-local model.',
          'Per-platform upload flows are scripted with the Browser Agent (Playwright/BrowserMCP): open composer → upload file → paste caption → set options → publish, with explicit waits and DOM assertions.',
          'YouTube optionally uses the official Data API where a client has granted it (more robust for long-form); FB/IG/TikTok stay on automated UI for fingerprint consistency. Human-like pacing + per-account daily caps reduce detection risk.',
        ],
        tools: ['browserAgent', 'playwright', 'browserMcp', 'officialApis', 'usVps', 'hermes'],
      },
      {
        n: 4,
        question: 'How is the scheduled posting time handled and how reliable is timing?',
        answer: [
          'Each job carries a scheduled local time; n8n holds it in a delay/scheduled queue and releases it at the target time in the client\'s timezone.',
          'Reliability: typically within ±1–2 minutes (profile cold-start + upload time). For exact-minute needs, the profile is pre-warmed a few minutes before.',
          'Where a platform offers native "schedule" in its composer (e.g. FB/YT), we can set that instead and let the platform publish — most precise, fewer live sessions.',
          'A concurrency limiter staggers many same-minute jobs so one machine isn\'t opening 10 profiles at once.',
        ],
        tools: ['n8n', 'hermes', 'supabase'],
      },
      {
        n: 5,
        question: 'How does the system confirm a successful post and write status back to the Sheet?',
        answer: [
          'After publish, the driver captures the resulting post/permalink (or video id) and a screenshot as proof.',
          'It verifies the post is live (URL reachable / appears on profile) before declaring success.',
          'n8n writes back to the Sheet row: status = POSTED, post URL, timestamp, and stores the screenshot + log in Supabase for audit. The idempotency key prevents re-posting an already-confirmed row.',
        ],
        tools: ['n8n', 'sheets', 'supabase', 'browserAgent', 'hermes'],
      },
      {
        n: 6,
        question: 'How are failed posts detected and flagged for investigation?',
        answer: [
          'Every step has explicit assertions (login valid, upload accepted, publish confirmed). Any failure → automatic retry with backoff (configurable, e.g. 2 attempts).',
          'If still failing: row marked FAILED with a reason code (e.g. PROXY_DOWN, LOGIN_CHALLENGE, UPLOAD_REJECTED, CAPTCHA), screenshot attached.',
          'An alert fires (Slack/email) with the client, platform and reason so a human can step in fast. A dashboard view lists all flagged rows.',
          'Captcha / login-challenge cases are isolated so they never silently spam a platform.',
        ],
        tools: ['n8n', 'n8nExec', 'uptimeKuma', 'hermes', 'supabase', 'ecc'],
      },
      {
        n: 7,
        question: 'What is a realistic timeline to build and test a working prototype?',
        answer: [
          'Week 1: Sheet trigger + job queue, MoreLogin Local API integration, attach driver to a profile, post to ONE platform (e.g. TikTok) for ONE client.',
          'Week 2: remaining platforms (FB/IG/YT), scheduling, success confirmation + Sheet write-back.',
          'Week 3: failure handling, retries, alerting, multi-client concurrency, hardening on real accounts.',
          'Realistic: working prototype in ~2–3 weeks; production-hardened across all clients/platforms in ~4–6 weeks.',
        ],
        tools: ['claudeCode', 'codex', 'hermes', 'superpowers', 'n8nSkills', 'github'],
      },
      {
        n: 8,
        question:
          'What are the risks or limitations (platform ToS, detection, account bans) we should know before committing?',
        answer: [
          'Platform ToS: automated posting is against FB/IG/TikTok ToS in principle. Risk is mitigated (anti-detect profile + residential US IP + human-like pacing + daily caps) but not eliminated — same underlying risk the manual MoreLogin process already accepts, now unattended.',
          'UI drift: platforms change upload UIs; selectors need monitoring + quick patching (kept in versioned, isolated per-platform modules).',
          'Challenges: occasional captcha / 2FA / "is this you?" prompts will require a human fallback — surfaced immediately via alerts, never bypassed silently.',
          'Account safety: conservative per-account rate limits and warm-up are essential; aggressive volume = ban risk.',
          'Dependency on MoreLogin\'s Local API staying available/stable; we add health checks and graceful pause if proxies/profiles are down.',
        ],
        tools: ['ecc', 'moreloginApi', 'antidetectAlt', 'usVps', 'vpnUsIp', 'uptimeKuma', 'hermes', 'supabase'],
      },
    ],
  },
]
