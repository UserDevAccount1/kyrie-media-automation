/* Generates Kyri-Media-Automation-Proposal-Plain.docx (layman + technical). */
const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, LevelFormat,
} = require('docx')

const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] })
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] })
const P = (t) => new Paragraph({ spacing: { after: 120 }, children: [new TextRun(t)] })
const Q = (t) => new Paragraph({ spacing: { before: 160, after: 40 }, children: [new TextRun({ text: t, bold: true })] })
const Plain = (t) =>
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'In plain English. ', bold: true, color: '1F7A4D' }), new TextRun(t)] })
const Tech = (t) =>
  new Paragraph({ spacing: { after: 140 }, children: [new TextRun({ text: 'Under the hood. ', bold: true, color: '2E5395' }), new TextRun(t)] })
const B = (t) => new Paragraph({ numbering: { reference: 'b', level: 0 }, children: [new TextRun(t)] })

const c = []
c.push(
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Kyrie Media Automation', bold: true, size: 44 })] }),
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Proposal — Plain-English + Technical · prepared for Kyri Media (kyrimedia.us)', size: 24, color: '555555' })] }),
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'How to read this: every section has two parts — “In plain English” (no tech background needed) and “Under the hood” (the technical detail).', italics: true, size: 20 })] }),
)

c.push(H1('The big picture'))
c.push(Plain('Today two jobs eat a lot of human time: a person manually edits every short video, and a person manually logs in and posts each video for each client. We want software to do both — the social media manager just fills the brief, marks a video “ready,” and the system handles the rest, the same way your team would, just unattended.'))
c.push(P('Think of it like two tireless assistants: an Editor assistant that finds the right clips and edits the video to your style, and a Poster assistant that logs in as the client (from a US location) and posts on time — and tells you if anything breaks.'))
c.push(Tech('Two automation pipelines orchestrated by n8n with AI agents for the decision steps. Execution (render, post) stays deterministic; AI handles parsing, ranking, planning, scoring and verification. A single orchestrator (Hermes) supervises both once running.'))

function project(title, plainIntro, techIntro, qa) {
  c.push(H1(title))
  c.push(Plain(plainIntro))
  c.push(Tech(techIntro))
  c.push(H2('The 8 questions — answered both ways'))
  qa.forEach((x) => { c.push(Q(x.q)); c.push(Plain(x.p)); c.push(Tech(x.t)) })
}

project(
  'Project 1 — Automated Video Editing',
  'A real-estate agent records themselves talking. The social media manager writes a short brief: topic, caption, and a link to an “inspiration” video for the style/pace/music. Normally a human editor hunts the internet for local background clips and edits it all together. We replace that editing job with software that produces a finished or nearly-finished video on its own.',
  'Brief parsed by an LLM into a structured job; inspiration video becomes a reusable style profile; B-roll sourced and ranked; talking head transcribed; an edit plan generated; a deterministic render engine assembles the video; a scoring step decides auto-finish vs quick human glance.',
  [
    { q: '1. Where do the local background clips come from?',
      p: 'It searches stock libraries and (optionally) public social posts for clips that match the area and topic — and double-checks the clips actually look like the right place before using them.',
      t: 'Tier-1 license-safe stock APIs (Pexels/Pixabay/Storyblocks); optional Tier-2 scrape (Playwright/Apify/yt-dlp). LLM+RAG ranker vs style profile; a vision check validates location; gaps filled by AI-gen video; cached in Supabase by region+topic. Florida example: “Florida” → expanded queries (Miami skyline, palm-tree street, waterfront home) → stock + opt-in geotagged social → vision check drops wrong-location clips → cache for instant reuse.' },
    { q: '2. What actually edits the video?',
      p: 'A reliable, repeatable video engine — not a magic black box — cuts the talking head, lays background clips over it, syncs music to the beat, and burns in captions.',
      t: 'FFmpeg driven by a programmatic timeline (Shotstack API or self-hosted Remotion/Creatomate). Whisper transcript → LLM edit-decision-list → beat-snapped cuts → burned captions → 9:16/1:1 encode. Stateless workers scale to 200+/month.' },
    { q: '3. How close will it look to the inspiration video?',
      p: 'Very close on pace, cuts, captions, music feel and structure. Not 100% identical on bespoke artistic touches — those rare cases get a quick human check. We promise “same feel and pacing,” not a frame-perfect clone.',
      t: 'Each client/format has a predefined style template. Huashu-Design turns brand intent into a structured design spec; Claude Design builds the visual system; a custom agent (built with Claude Code/Codex) generates every edit to that spec. ~80% on grade/transition flair via LUTs + library.' },
    { q: '4. How much is fully automatic vs needs a human?',
      p: 'Aim ~85–90% fully automatic once tuned (first 1–2 months ~60–70% while it learns each client). A built-in “is this good?” score decides what to auto-finish vs send for a 1–2 minute human check.',
      t: 'A RAG scoring agent (Ollama + vector DB) embeds inspiration + brand rules + template, semantic-searches the rendered draft → 0–1 conformance score + hard template pass/fail. The % is an observed metric, not a guess.' },
    { q: '5. What does each video cost to make?',
      p: 'Roughly $1–$4 of tooling per video at volume — about $200–$800/month for 200 videos — and it drops as the system reuses cached clips. Excludes the one-time build.',
      t: 'Stock+assembly $0.30–$1.20; AI-gen B-roll +$0.50–$3.00 (~$0 on local WanGP). CodeBurn tracks real per-video AI spend.' },
    { q: '6. How fast is each video?',
      p: 'A few minutes of computer time, and many run at once — effectively “ready within minutes of submitting the brief.”',
      t: '~4–10 min machine time end-to-end, parallelized; AI-gen adds 1–4 min; human approval adds the reviewer’s 1–2 min.' },
    { q: '7. How long to build a working version?',
      p: 'A usable prototype in about 3–4 weeks; a polished, production-ready system in about 6–8 weeks.',
      t: 'Wk1 intake+style+sourcing PoC; Wk2–3 assembly+caption/beat-sync; Wk4 review queue+scoring+calibration on 10–20 real briefs.' },
    { q: '8. What are the honest risks?',
      p: 'Borrowed social clips have copyright risk (so we default to safe stock + AI-generated). Very artsy inspiration videos won’t be matched perfectly. Quality varies a little in the first weeks while it learns.',
      t: 'Scraped social = licensing risk (opt-in only); style ceiling on motion-graphics-heavy refs; social-site markup volatility; calibration-period variance; AI-gen can look synthetic for real locality (fallback only).' },
  ],
)

project(
  'Project 2 — Automated Video Posting',
  'When a video is marked “ready” in your Google Sheet, the system posts it for the right client to the right platform (Facebook, Instagram, YouTube, TikTok) at the scheduled time — appearing to come from a US location, exactly like your team does manually with MoreLogin. It ticks the sheet to confirm, and raises a flag if a post fails.',
  'n8n watches the Sheet, builds a safe job queue, opens the correct MoreLogin profile (US residential IP) via its local API, a browser agent performs the upload, success is verified and written back, failures are classified and alerted.',
  [
    { q: '1. How does it read the Sheet?',
      p: 'It watches the sheet and picks up rows marked “ready,” reading the video, caption, platform and time — and it can never accidentally post twice.',
      t: 'n8n Sheets node (poll/webhook) → typed job → Supabase queue with an idempotency key (row+platform).' },
    { q: '2. How does it post as the right client from a US IP?',
      p: 'It opens that client’s own MoreLogin profile (which already has their US identity), so posts look US-local — same as your team today.',
      t: 'MoreLogin Local API starts the profile → CDP port → Playwright/BrowserMCP attaches → exits the client’s US residential proxy + anti-detect fingerprint. A properly set-up US VPS or per-client US VPN is an equally valid alternative — only a shared datacenter IP is risky.' },
    { q: '3. Official app or browser?',
      p: 'Mostly it drives the website like a person would (so the US identity is preserved); YouTube can use the official app where a client allows it.',
      t: 'Browser automation primary; per-platform scripted flows with DOM assertions; YouTube Data API optional; human-like pacing + daily caps.' },
    { q: '4. Is the timing reliable?',
      p: 'Yes — usually within a minute or two of the scheduled time, and it spreads out jobs so it never overloads.',
      t: 'n8n delay queue in client timezone, ±1–2 min (pre-warm for exact-minute); native platform schedule where available; concurrency limiter.' },
    { q: '5. How do we know it actually posted?',
      p: 'It grabs the live post link and a screenshot, confirms it’s really up, then writes “POSTED” + link back into your sheet.',
      t: 'Driver captures permalink/id + screenshot, verifies live, n8n writes status/URL/timestamp; audit log in Supabase.' },
    { q: '6. What happens when a post fails?',
      p: 'It retries a couple of times; if it still fails it marks the row FAILED with the reason and alerts a human immediately — nothing fails silently.',
      t: 'Step assertions → backoff retry → FAILED + reason code (PROXY_DOWN, CAPTCHA, …) + screenshot → Slack/email alert + dashboard.' },
    { q: '7. How long to build?',
      p: 'A working version in about 2–3 weeks; fully hardened across all clients/platforms in 4–6 weeks.',
      t: 'Wk1 trigger+queue+MoreLogin+1 platform; Wk2 all platforms + scheduling + write-back; Wk3 failures + retries + concurrency.' },
    { q: '8. Honest risks?',
      p: 'Auto-posting is against the platforms’ rules in principle — the same risk your manual MoreLogin process already carries, now unattended. We reduce it but can’t remove it. Captcha/login prompts still need an occasional human.',
      t: 'ToS exposure mitigated not eliminated; UI drift needs patched selectors; captcha/2FA human fallback; conservative rate limits + warm-up; MoreLogin API health checks + graceful pause.' },
  ],
)

c.push(H1('Money, time and what we need from you'))
c.push(Plain('Cost is mostly Project 1 tooling — about $200–$800/month at 200 videos, dropping over time; Project 2 tooling is minimal (you already pay for MoreLogin). Plus a one-time build. Prototypes in 2–4 weeks; production in 4–8 weeks.'))
c.push(P('We need from you:'))
c.push(B('Confirm scope and priority (Project 1, Project 2, or both in parallel).'))
c.push(B('Decide per client whether borrowed social clips are allowed, or stock-only.'))
c.push(B('Give us one client + one format to pilot first.'))
c.push(Tech('63 tools across 12 categories, each tagged free / freemium / paid (full list + filter in the companion dashboard). Backbone configured: n8n, Playwright/BrowserMCP, Supabase, Gemini, Claude Code/Codex, GitHub/Vercel. Proof: analogous automations already built. Monitoring: Uptime Kuma + n8n error-workflow + agent traces + Supabase KPI view.'))

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial', color: '1F3864' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: '2E5395' },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'b', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•',
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] },
    ],
  },
  sections: [
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: c,
    },
  ],
})

const out = path.resolve(__dirname, '..', 'Kyri-Media-Automation-Proposal-Plain.docx')
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log('WROTE ' + out + ' (' + buf.length + ' bytes)') })
