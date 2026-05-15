/* Generates Kyri-Media-Automation-Proposal.docx from the proposal content. */
const fs = require('fs')
const path = require('path')
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, LevelFormat,
} = require('docx')

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
const borders = { top: border, bottom: border, left: border, right: border }
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 }

const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] })
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] })
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] })
const P = (t) => new Paragraph({ children: [new TextRun(t)], spacing: { after: 120 } })
const B = (t) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun(t)] })
const KV = (k, v) =>
  new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: k + ': ', bold: true }), new TextRun(v)] })

function tblRow(cells, head = false) {
  const w = Math.floor(9360 / cells.length)
  return new TableRow({
    children: cells.map(
      (c) =>
        new TableCell({
          borders,
          margins: cellMargins,
          width: { size: w, type: WidthType.DXA },
          shading: head ? { fill: 'D5E8F0', type: ShadingType.CLEAR } : undefined,
          children: [new Paragraph({ children: [new TextRun({ text: String(c), bold: head, size: 18 })] })],
        }),
    ),
  })
}
function table(rows) {
  const cols = rows[0].length
  const w = Math.floor(9360 / cols)
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: Array(cols).fill(w),
    rows: rows.map((r, i) => tblRow(r, i === 0)),
  })
}

const QA = (n, q, a) => [
  new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: `Q${n}. ${q}`, bold: true })] }),
  ...a.map((line) => B(line)),
]

const children = []

// Title
children.push(
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Kyrie Media Automation', bold: true, size: 44 })] }),
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: 'Automation Proposal — prepared for Kyri Media (kyrimedia.us)', size: 24, color: '555555' })] }),
)

children.push(H1('Summary'))
children.push(P('Two automation systems are proposed:'))
children.push(B('Automated Video Editing — the social media manager fills the brief (topic, caption, inspiration video); the system sources local B-roll, assembles and edits a finished/near-finished talking-head short with no human editor.'))
children.push(B('Automated Video Posting — when a video is marked ready in Google Sheets, the system posts it as the correct client (US residential IP via MoreLogin), on schedule, confirms in the sheet, and flags failures.'))
children.push(P('Honest principle throughout: AI agents do decisioning, orchestration, scoring and verification; execution (render, post) stays deterministic. That is what makes the automation auditable and the percentages real metrics, not guesses.'))

// PROJECT 1
children.push(H1('Project 1 — Automated Video Editing'))
children.push(KV('Now', 'Agent records talking head to Drive; SMM writes brief in a Doc; a human editor sources local B-roll and cuts in Premiere/CapCut; reviewed; posted.'))
children.push(H3('Pipeline (agent vs deterministic)'))
children.push(
  table([
    ['#', 'Step', 'What', 'AI agent role'],
    ['1', 'Intake', 'n8n watches the brief Doc + Drive', 'LLM extraction -> schema-validated job'],
    ['2', 'Style profile', 'Skill Seekers + beat/scene; Huashu-Design + Claude Design -> visual spec', 'vision/beat -> structured style+design spec, embedded'],
    ['3', 'B-roll sourcing', 'stock + social/web + AI-gen', 'LLM+RAG rank vs topic/area/style'],
    ['4', 'Transcribe & plan', 'Whisper -> EDL', 'LangGraph planner emits deterministic EDL'],
    ['5', 'Assembly', 'FFmpeg/Shotstack render', 'none — deterministic; agent triggers + verifies'],
    ['6', 'Review', 'draft + score to queue', 'RAG scoring agent -> auto-finalize or human'],
  ]),
)
children.push(new Paragraph({ spacing: { after: 120 }, children: [] }))
children.push(
  ...QA(1, 'How will the system find and source real local B-roll footage? Approach and tools?', [
    'Two-tier. Tier 1 (default, license-safe): Pexels/Pixabay (free) + Storyblocks (paid) geo+topic queries. Tier 2 (opt-in): Playwright/Apify/yt-dlp scrape of public TikTok/IG/YouTube/Google for true-local feel.',
    'LLM+RAG ranks candidates vs the style profile; gaps filled by AI-gen (Kie.ai/Seedance/Higgsfield, or local WanGP at ~$0); results cached in Supabase by region+topic.',
    'Worked example — Florida: area parsed to a geo entity (Florida + city if given) -> expanded to visual queries (Miami skyline aerial, palm-tree street, waterfront home, suburb drone) -> Tier-1 stock + opt-in geotagged social -> a vision check confirms it actually looks like Florida (palms, FL architecture/signage) and drops wrong-location clips -> gaps AI-generated -> cached so the next Florida video is near-instant.',
    'Honest note: scraped social B-roll carries licensing/usage risk — default is stock + AI-gen, scraped clips opt-in per client.',
  ]),
  ...QA(2, 'What tool or API handles the actual video assembly and editing?', [
    'Deterministic, not a black box: FFmpeg driven by a programmatic timeline (Shotstack API or self-hosted Remotion/Creatomate).',
    'Whisper word-level transcript -> LLM Edit Decision List -> beat-snapped cuts -> burned captions in the inspiration style -> encode to 9:16 / 1:1. HeyGen available for avatar intro/outro. n8n conducts; renderer is a stateless worker -> scales to 200+/mo in parallel.',
  ]),
  ...QA(3, 'How closely will the output match the inspiration style? What can/cannot be replicated?', [
    'CAN: cut pace, beat-synced cuts, caption style, aspect, hook structure, B-roll ratio. PARTIAL: exact grade/transition flair (~80% via LUTs + transition library). CANNOT: bespoke motion graphics, frame-perfect comedic timing — flagged for review.',
    'Template-driven guarantee: each client/format = a predefined style template; a custom agent (scaffolded with Claude Code/Codex) generates every edit to that spec. Huashu-Design turns brand intent into a structured design spec; Claude Design generates the visual system (captions, lower-thirds, end-cards).',
    'Honest framing: "same feel and pacing", not pixel-identical.',
  ]),
  ...QA(4, 'What percentage is fully automated vs requiring human review?', [
    'Steady state ~85–90% automated, 10–15% review. Months 1–2 ~60–70% during calibration.',
    'How measured: a RAG scoring agent (Ollama + vector DB: pgvector/Pinecone/Weaviate/Faiss) embeds inspiration + brand rules + template; the rendered draft features are embedded and semantic-searched -> 0–1 conformance score; the template adds hard pass/fail conditions. Auto-finalize when score >= threshold AND conditions pass. The % is an observed per-video metric, not a guess.',
  ]),
  ...QA(5, 'Estimated tooling cost per video?', [
    'Stock+assembly path ~$0.30–$1.20. AI-gen B-roll +$0.50–$3.00 (~$0 on local WanGP).',
    'Blended at 200/mo ~ $1–$4 per video (~$200–$800/mo) in tooling, excluding one-time build. Drops over time via cache + reusable profiles. CodeBurn tracks real per-video AI spend.',
  ]),
  ...QA(6, 'How long per video once live?', [
    '~4–10 min machine time end-to-end; jobs run in parallel so 200/mo is absorbed — effectively ready within minutes of brief submission. AI-gen adds 1–4 min; human approval adds the reviewer’s 1–2 min.',
  ]),
  ...QA(7, 'Realistic prototype timeline?', [
    'Wk1 intake + style profile + sourcing PoC; Wk2–3 assembly + caption/beat-sync + first end-to-end drafts; Wk4 review queue + scoring + calibration on 10–20 real briefs.',
    'Working prototype ~3–4 weeks; production-hardened ~6–8 weeks.',
  ]),
  ...QA(8, 'Risks / limitations (honest)?', [
    'Licensing of scraped social (default stock+AI-gen, scraped opt-in); style fidelity ceiling on motion-graphics-heavy refs; social-site markup volatility; early quality variance during calibration; AI-gen B-roll can look synthetic for real locality (fallback only).',
  ]),
)

// PROJECT 2
children.push(H1('Project 2 — Automated Video Posting'))
children.push(KV('Now', 'A team member manually logs into each client’s socials and posts; MoreLogin anti-detect browser assigns each client a US IP + residential proxy; done manually for FB/IG/YT/TikTok.'))
children.push(KV('Pipeline', 'Trigger (deterministic) -> Resolve (LLM validate row) -> Schedule (deterministic queue) -> Launch MoreLogin profile (API) -> Post (browser agent) -> Confirm/flag (verify + classify agent).'))
children.push(
  ...QA(1, 'How does it read link/caption/platform/schedule from Google Sheets?', [
    'n8n Sheets node (poll or on-edit webhook) selects rows status = Ready to post -> typed job {client, videoUrl, caption, platform, scheduledTimeLocal}; video pre-fetched; written to a Supabase queue with an idempotency key (row+platform) so it never double-posts.',
  ]),
  ...QA(2, 'How does it integrate with MoreLogin for the correct US IP/proxy?', [
    'MoreLogin Local API starts the client’s profile (proxy + US IP preconfigured) -> returns a CDP port -> Playwright/BrowserMCP attaches -> traffic exits via that client’s US residential proxy + anti-detect fingerprint.',
    'US VPS / VPN — equally valid when set up properly: a US VPS (or per-client US VPN) is a legitimate parallel path, NOT a fallback — one isolated VPS/profile per client + clean/residential US IP bound per client + matched fingerprint. Done that way it stands alongside MoreLogin; only the lazy single-shared-datacenter-IP setup risks linking/bans. A US VPS is recommended regardless to host the runtime.',
  ]),
  ...QA(3, 'How does it actually post — official APIs or browser automation?', [
    'Browser automation inside the MoreLogin profile is primary (preserves per-client residential IP + fingerprint). Per-platform scripted flows (Browser Agent) with explicit DOM assertions. YouTube optionally via official Data API where granted; FB/IG/TikTok stay on automated UI. Human-like pacing + per-account daily caps.',
  ]),
  ...QA(4, 'Scheduling & reliability?', [
    'Scheduled local time held in n8n’s delay queue, released in the client’s timezone; ±1–2 min (profile pre-warm for exact-minute). Native platform schedule used where available. Concurrency limiter staggers same-minute jobs.',
  ]),
  ...QA(5, 'Success confirmation + Sheet write-back?', [
    'Driver captures permalink/video id + screenshot, verifies the post is live, then n8n writes POSTED + URL + timestamp back to the Sheet; screenshot/log to Supabase for audit; idempotency key prevents re-posts.',
  ]),
  ...QA(6, 'Failure detection & flagging?', [
    'Explicit assertions each step -> auto-retry with backoff -> still failing = row FAILED + reason code (PROXY_DOWN, LOGIN_CHALLENGE, UPLOAD_REJECTED, CAPTCHA) + screenshot -> Slack/email alert + dashboard list. Captcha/2FA isolated, never silently retried.',
  ]),
  ...QA(7, 'Realistic prototype timeline?', [
    'Wk1 Sheet trigger + queue + MoreLogin API + one platform/one client; Wk2 remaining platforms + scheduling + write-back; Wk3 failure handling + retries + alerting + multi-client concurrency.',
    'Prototype ~2–3 weeks; hardened ~4–6 weeks.',
  ]),
  ...QA(8, 'Risks / limitations (honest)?', [
    'Automated posting is against FB/IG/TikTok ToS in principle — mitigated (anti-detect + residential IP + pacing + caps) not eliminated; same risk the manual process already accepts, now unattended. UI drift needs monitored/patched selectors. Captcha/2FA need human fallback. Conservative rate limits + warm-up essential. MoreLogin Local API dependency -> health checks + graceful pause.',
  ]),
)

children.push(H1('Orchestrator — Hermes Agent'))
children.push(P('A single orchestrator agent (Hermes, hermes-agent.org) supervises the whole workflow once it is set: dispatches the per-step agents, sequences both projects, handles retries/escalation/recovery, and keeps state across long runs.'))

children.push(H1('Monitoring'))
children.push(P('A dedicated workflow-monitor is feasible and recommended: Uptime Kuma (service/heartbeat + 90+ alerts), the n8n error-workflow, RuView/Claude HUD (agent traces), CodeBurn (per-video cost), and a Supabase-backed KPI view in the companion Vue app. Pattern: Emit -> Probe -> Observe -> Visualize -> Alert.'))

children.push(H1('Capability Stack'))
children.push(P('63 tools across 12 categories, each tagged free / freemium / paid and configured / recommended — filterable in the companion dashboard. Backbone is configured today (n8n, Playwright/BrowserMCP, Supabase, Gemini, Claude Code/Codex, Skill Seekers, GitHub/Vercel). Proof: existing analogous automations already built (AI factory long-form video, Faceless POV AI machine -> P1; AI avatar social Automation -> P2).'))

children.push(H1('Next Steps'))
children.push(B('Confirm scope + priority (P1, P2, or both in parallel).'))
children.push(B('Pick the B-roll posture per client (stock-only vs opt-in social scrape).'))
children.push(B('Stand up the prototype on 1 client / 1 format, calibrate, then scale.'))

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 21 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial', color: '1F3864' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 25, bold: true, font: 'Arial', color: '2E5395' },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 22, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•',
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 460, hanging: 260 } } } }] },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children,
    },
  ],
})

const out = path.resolve(__dirname, '..', 'Kyri-Media-Automation-Proposal.docx')
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf)
  console.log('WROTE ' + out + ' (' + buf.length + ' bytes)')
})
