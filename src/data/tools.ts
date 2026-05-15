import type { ToolRef } from './types'

// Catalog is NOT limited to the neuralyx news feed. It mixes:
//  - source: 'news'      -> surfaced from the neuralyx news research
//  - source: 'industry'  -> standard battle-tested options added independently
// Each entry is tagged free / freemium / paid so options can be filtered.
export const TOOLS: Record<string, ToolRef> = {
  // ---- Orchestration ------------------------------------------------------
  n8n: {
    name: 'n8n MCP', kind: 'mcp', category: 'Orchestration',
    pricing: 'freemium', cost: 'Free self-host · Cloud from $20/mo',
    status: 'configured', source: 'news',
    note: 'Workflow orchestration backbone (localhost:5678). Triggers, schedules, branching, retries for both pipelines.',
  },
  n8nWorkflows: {
    name: 'n8n-workflows MCP', kind: 'mcp', category: 'Orchestration',
    pricing: 'free', cost: 'Free (self-host)',
    status: 'configured', source: 'news',
    note: 'Direct workflow definition + execution over HTTP (localhost:5678/mcp-server/http).',
  },
  temporal: {
    name: 'Temporal', kind: 'repo', category: 'Orchestration',
    pricing: 'freemium', cost: 'Free OSS · Cloud usage-based',
    status: 'recommended', source: 'industry',
    note: 'Durable execution engine if pipelines need bullet-proof retries/state at high scale (alternative to n8n core).',
  },
  hermes: {
    name: 'Hermes Agent (Nous Research)', kind: 'agent', category: 'Orchestration',
    pricing: 'free', cost: 'Free OSS (MIT, self-host, zero telemetry)',
    status: 'configured', source: 'industry',
    note: 'Top-level autonomous orchestrator that OWNS both pipelines once configured. Persistent memory of each client (style, brand rules, MoreLogin mapping), cron scheduling, parallel sub-agents per video/post, multi-platform command gateway (Telegram/Slack/WhatsApp/CLI) for the PH team, code+browser execution, self-writes reusable skills. Already on the automation board ("hermes workflow").',
  },
  langgraph: {
    name: 'LangGraph', kind: 'repo', category: 'Orchestration',
    pricing: 'free', cost: 'Free OSS (MIT) · optional paid Platform',
    status: 'configured', source: 'industry',
    note: 'Graph-based stateful agent orchestration — branching, loops, retries, human-in-the-loop checkpoints. Ideal for the editing decision flow (EDL → render → review) where logic is more complex than linear n8n nodes. In the stack (Agent Systems: LangChain).',
  },
  langchain: {
    name: 'LangChain', kind: 'repo', category: 'Orchestration',
    pricing: 'free', cost: 'Free OSS (MIT)',
    status: 'configured', source: 'industry',
    note: 'LLM tool/agent framework — chains prompts, tools, retrieval, structured output. Backs the brief-parse, B-roll-rank and caption steps; pairs with LangGraph for control flow.',
  },
  crewai: {
    name: 'CrewAI', kind: 'repo', category: 'Orchestration',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'industry',
    note: 'Role-based multi-agent framework (also in the stack) — alternative when several specialist agents (sourcing, editing, QA) collaborate on one video.',
  },
  zapierMake: {
    name: 'Zapier / Make', kind: 'api', category: 'Orchestration',
    pricing: 'paid', cost: 'From ~$20–30/mo',
    status: 'recommended', source: 'industry',
    note: 'Hosted no-code alternative if a fully managed (no self-host) orchestration is preferred.',
  },

  // ---- B-roll sourcing ----------------------------------------------------
  pexels: {
    name: 'Pexels / Pixabay API', kind: 'api', category: 'B-roll sourcing',
    pricing: 'free', cost: 'Free (attribution-free license)',
    status: 'recommended', source: 'industry',
    note: 'License-safe stock video/photo by geo + topic query. Default Tier-1 B-roll source.',
  },
  storyblocks: {
    name: 'Storyblocks / Artgrid', kind: 'api', category: 'B-roll sourcing',
    pricing: 'paid', cost: 'From ~$30/mo (unlimited)',
    status: 'recommended', source: 'industry',
    note: 'Higher-quality licensed stock for premium local B-roll where free libraries are thin.',
  },
  apify: {
    name: 'Apify', kind: 'api', category: 'B-roll sourcing',
    pricing: 'freemium', cost: 'Free $5 credit/mo · usage-based',
    status: 'recommended', source: 'industry',
    note: 'Managed TikTok/IG/YouTube scrapers for authentic local clips (use opt-in per client; licensing risk).',
  },
  ytdlp: {
    name: 'yt-dlp', kind: 'repo', category: 'B-roll sourcing',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'industry',
    note: 'Self-hosted public-video fetch for social B-roll. Zero cost; legal/usage caveats apply.',
  },

  // ---- Assembly / Render --------------------------------------------------
  ffmpeg: {
    name: 'FFmpeg', kind: 'repo', category: 'Assembly / Render',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'industry',
    note: 'Core deterministic encoder: cut, overlay, beat-sync, burned captions. Zero cost, full control.',
  },
  remotion: {
    name: 'Remotion', kind: 'repo', category: 'Assembly / Render',
    pricing: 'freemium', cost: 'Free for small teams · company license paid',
    status: 'recommended', source: 'industry',
    note: 'Programmatic React-driven video composition — reusable templated styles per client.',
  },
  shotstack: {
    name: 'Shotstack', kind: 'api', category: 'Assembly / Render',
    pricing: 'paid', cost: '~$0.20–0.50 / render min',
    status: 'recommended', source: 'industry',
    note: 'Hosted render API (no GPU infra to run). Fast path to scale assembly to 200+/mo.',
  },
  creatomate: {
    name: 'Creatomate / json2video', kind: 'api', category: 'Assembly / Render',
    pricing: 'paid', cost: 'From ~$41/mo',
    status: 'recommended', source: 'industry',
    note: 'Template-based video API alternative to Shotstack; strong for caption/overlay automation.',
  },

  // ---- LLM / Reasoning ----------------------------------------------------
  gemini: {
    name: 'Google Gemini 2.5 (+ Veo)', kind: 'api', category: 'LLM / Reasoning',
    pricing: 'freemium', cost: 'Free tier · API usage-based',
    status: 'configured', source: 'industry',
    note: 'Reasoning core for both pipelines: parse brief, build the Edit Decision List, rank B-roll, write captions, reason over the inspiration style. Already in the stack (Gemini 2.5 / RAG). Veo 3 = Google’s AI video gen for generated B-roll.',
  },
  claudeLlm: {
    name: 'Claude (Anthropic)', kind: 'api', category: 'LLM / Reasoning',
    pricing: 'freemium', cost: 'API usage-based',
    status: 'configured', source: 'industry',
    note: 'Alternative reasoning model for EDL/planning where stronger instruction-following or long-context is needed; the agents already run on Claude.',
  },
  localLlm: {
    name: 'Ollama / Qwen (local)', kind: 'repo', category: 'LLM / Reasoning',
    pricing: 'free', cost: 'Free OSS (self-host)',
    status: 'recommended', source: 'news',
    note: 'Local LLM fallback for bulk, cost-free planning/caption tasks at 200+/mo scale (no per-token API spend).',
  },
  ragAgent: {
    name: 'RAG Scoring Agent', kind: 'agent', category: 'LLM / Reasoning',
    pricing: 'free', cost: 'Free (custom, built on local LLM + vector DB)',
    status: 'configured', source: 'industry',
    note: 'Custom agent that measures style conformance: chunk + embed the inspiration video, brand rules and format template; semantic-search the rendered draft against them to emit a 0–1 score that drives auto-finalize vs human review. This is what makes the automation % an observed metric, not a guess. (RAG/embeddings already in the stack.)',
  },
  vectorDb: {
    name: 'Vector DB (pgvector / Pinecone / Weaviate / Faiss)', kind: 'repo', category: 'LLM / Reasoning',
    pricing: 'freemium', cost: 'pgvector/Faiss free · Pinecone/Weaviate free tier + paid',
    status: 'configured', source: 'industry',
    note: 'Stores style + brand embeddings for the scoring agent. pgvector rides on the existing Supabase Postgres (zero extra infra); Pinecone/Weaviate/Faiss are alternatives, all in the stack.',
  },
  seedance: {
    name: 'Seedance 1.0 (ByteDance)', kind: 'api', category: 'AI video gen',
    pricing: 'paid', cost: 'Usage-based (via Kie.ai / fal / Replicate)',
    status: 'recommended', source: 'industry',
    note: 'ByteDance text/image-to-video model — strong short-form motion + cinematic camera, well-suited to real-estate B-roll. Reachable through the Kie.ai hub already listed (no separate integration).',
  },

  // ---- Transcription ------------------------------------------------------
  whisper: {
    name: 'Whisper / faster-whisper', kind: 'repo', category: 'Transcription',
    pricing: 'free', cost: 'Free OSS (self-host GPU)',
    status: 'recommended', source: 'industry',
    note: 'Word-level transcription for caption timing + scene/beat analysis. No per-minute cost.',
  },
  deepgram: {
    name: 'Deepgram / AssemblyAI', kind: 'api', category: 'Transcription',
    pricing: 'freemium', cost: 'Free credits · ~$0.0043/min',
    status: 'recommended', source: 'industry',
    note: 'Hosted ASR if avoiding self-managed GPU; fast, accurate, diarization built-in.',
  },

  // ---- TTS / Voice --------------------------------------------------------
  supertonic: {
    name: 'Supertonic TTS', kind: 'repo', category: 'TTS / Voice',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'news',
    note: 'High-fidelity open-source TTS for voiceover / beat-aligned narration. Zero cost.',
  },
  piper: {
    name: 'Piper / Coqui TTS', kind: 'repo', category: 'TTS / Voice',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'industry',
    note: 'Lightweight local TTS fallback — runs on CPU, good for bulk narration.',
  },
  elevenlabs: {
    name: 'ElevenLabs', kind: 'api', category: 'TTS / Voice',
    pricing: 'freemium', cost: 'Free 10k chars/mo · from $5/mo',
    status: 'recommended', source: 'industry',
    note: 'Best-in-class natural TTS / voice cloning when premium voiceover quality is required.',
  },

  // ---- AI video gen -------------------------------------------------------
  heygen: {
    name: 'HeyGen MCP', kind: 'mcp', category: 'AI video gen',
    pricing: 'freemium', cost: 'Free trial · from ~$29/mo',
    status: 'configured', source: 'news',
    note: 'AI avatar / video generation for intro-outro hooks and talking-head fallback.',
  },
  kie: {
    name: 'Kie.ai', kind: 'api', category: 'AI video gen',
    pricing: 'paid', cost: 'Usage-based per generation',
    status: 'recommended', source: 'news',
    note: 'One API hub for video / image / music gen models — single key, single integration.',
  },
  higgsfield: {
    name: 'Higgsfield', kind: 'api', category: 'AI video gen',
    pricing: 'paid', cost: 'Subscription / credits',
    status: 'recommended', source: 'news',
    note: 'Cinematic AI video with camera control + physics-aware motion for stylized B-roll inserts.',
  },
  wangp: {
    name: 'WanGP / Grafico AI', kind: 'repo', category: 'AI video gen',
    pricing: 'free', cost: 'Free OSS (local GPU 6GB+)',
    status: 'recommended', source: 'news',
    note: 'Local GPU video/image generation — zero per-clip API cost for generated B-roll.',
  },
  runwayPika: {
    name: 'Runway / Pika', kind: 'api', category: 'AI video gen',
    pricing: 'freemium', cost: 'Free credits · from ~$12–15/mo',
    status: 'recommended', source: 'industry',
    note: 'Premium hosted gen-video alternatives when local quality is insufficient.',
  },

  // ---- Music --------------------------------------------------------------
  uppbeat: {
    name: 'Uppbeat / FMA', kind: 'api', category: 'Music',
    pricing: 'free', cost: 'Free (credit/CC license)',
    status: 'recommended', source: 'industry',
    note: 'Free, clearable background music for the beat-synced track.',
  },
  spotx: {
    name: 'SpotX', kind: 'repo', category: 'Music',
    pricing: 'free', cost: 'Free OSS (github.com/SpotX-Official/SpotX)',
    status: 'recommended', source: 'industry',
    note: 'Open-source patcher for the Spotify Windows desktop client (block ads, unlock client features). Useful as a free reference/scratch listening source to pick a track vibe — NOT a commercial license: do not embed Spotify audio in client videos (use Uppbeat/Epidemic for cleared music).',
  },
  epidemic: {
    name: 'Epidemic Sound / Artlist', kind: 'api', category: 'Music',
    pricing: 'paid', cost: 'From ~$10–15/mo',
    status: 'recommended', source: 'industry',
    note: 'Licensed music with commercial + social clearance for client posting at scale.',
  },

  // ---- Posting / Anti-detect ---------------------------------------------
  playwright: {
    name: 'Playwright MCP (Edge)', kind: 'mcp', category: 'Posting / Anti-detect',
    pricing: 'free', cost: 'Free OSS',
    status: 'configured', source: 'news',
    note: 'Automated browser control for logged-in sessions, scraping, posting flows.',
  },
  browserMcp: {
    name: 'BrowserMCP', kind: 'mcp', category: 'Posting / Anti-detect',
    pricing: 'free', cost: 'Free OSS',
    status: 'configured', source: 'news',
    note: 'Drives an existing logged-in browser session — the bridge into MoreLogin profiles.',
  },
  browserAgent: {
    name: 'Browser Agent', kind: 'agent', category: 'Posting / Anti-detect',
    pricing: 'free', cost: 'Free (configured)',
    status: 'configured', source: 'news',
    note: 'Edge browser-automation agent (BrowserMCP + Playwright) — submission with screenshot proof.',
  },
  moreloginApi: {
    name: 'MoreLogin Local API', kind: 'api', category: 'Posting / Anti-detect',
    pricing: 'freemium', cost: 'Free tier (limited profiles) · paid plans',
    status: 'recommended', source: 'industry',
    note: 'Programmatically start a client profile (US IP + residential proxy); returns CDP port to attach the driver. Already in their stack.',
  },
  antidetectAlt: {
    name: 'GoLogin / AdsPower / Multilogin', kind: 'api', category: 'Posting / Anti-detect',
    pricing: 'freemium', cost: 'Free tier · from ~$24–49/mo',
    status: 'recommended', source: 'industry',
    note: 'Anti-detect browser alternatives to MoreLogin, all expose a local automation API — vendor risk hedge.',
  },
  officialApis: {
    name: 'Official platform APIs', kind: 'api', category: 'Posting / Anti-detect',
    pricing: 'free', cost: 'Free (quota-limited)',
    status: 'recommended', source: 'industry',
    note: 'YouTube Data API / Meta Graph / TikTok Content Posting API — robust where a client grants access; bypasses fragile UI for those.',
  },
  ayrshare: {
    name: 'Ayrshare / Postiz', kind: 'api', category: 'Posting / Anti-detect',
    pricing: 'freemium', cost: 'Postiz free OSS · Ayrshare from ~$29/mo',
    status: 'recommended', source: 'industry',
    note: 'Multi-platform social posting layer (Postiz is free self-host) — but does NOT preserve per-client US residential IP, so secondary to the MoreLogin path.',
  },

  // ---- Infra / Deploy -----------------------------------------------------
  supabase: {
    name: 'Supabase MCP', kind: 'mcp', category: 'Infra / Deploy',
    pricing: 'freemium', cost: 'Free tier · Pro $25/mo',
    status: 'configured', source: 'news',
    note: 'Job queue, render status, asset/library store, audit log.',
  },
  sheets: {
    name: 'Google Sheets / Drive (n8n nodes)', kind: 'api', category: 'Infra / Deploy',
    pricing: 'free', cost: 'Free (Workspace)',
    status: 'configured', source: 'news',
    note: 'Brief intake (Doc), raw footage (Drive), ready-to-post trigger + status write-back (Sheet).',
  },
  skillSeekers: {
    name: 'Skill Seekers MCP', kind: 'mcp', category: 'Methodology',
    pricing: 'free', cost: 'Free OSS',
    status: 'configured', source: 'news',
    note: 'Ingest inspiration videos/refs into a reusable "style profile" skill (pacing, cut rhythm, caption style).',
  },
  github: {
    name: 'GitHub MCP', kind: 'mcp', category: 'Infra / Deploy',
    pricing: 'freemium', cost: 'Free · Team from $4/user',
    status: 'configured', source: 'news',
    note: 'Version control + CI for automation + dashboard.',
  },
  vercel: {
    name: 'Vercel MCP', kind: 'mcp', category: 'Infra / Deploy',
    pricing: 'freemium', cost: 'Free Hobby · Pro $20/mo',
    status: 'configured', source: 'news',
    note: 'Host this dashboard / review UI with preview URLs + GitHub auto-deploy.',
  },

  // ---- Monitoring ---------------------------------------------------------
  uptimeKuma: {
    name: 'Uptime Kuma', kind: 'repo', category: 'Monitoring',
    pricing: 'free', cost: 'Free OSS (one-line Docker)',
    status: 'recommended', source: 'news',
    note: 'Self-hosted uptime dashboard (86k★ MIT). HTTP/TCP/ping/DNS + Docker-container checks, 90+ alert integrations (Slack/email/Telegram). Core of the workflow monitor — watches n8n, MoreLogin API, render workers, Supabase + heartbeats.',
  },
  ruview: {
    name: 'RuView', kind: 'repo', category: 'Monitoring',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'news',
    note: 'Observability layer for Claude-style agents — exposes live tool calls, planning steps, intermediate outputs. Audit/debug WHY the editing agent picked a B-roll clip or EDL decision.',
  },
  codeburn: {
    name: 'CodeBurn', kind: 'repo', category: 'Monitoring',
    pricing: 'free', cost: 'Free OSS (local, no API keys)',
    status: 'recommended', source: 'news',
    note: 'Cost observatory — token/cost/perf by task, tool, model, MCP + one-shot success rate. Tracks real per-video AI spend (feeds Project 1 cost answer).',
  },
  claudeHud: {
    name: 'Claude HUD', kind: 'repo', category: 'Monitoring',
    pricing: 'free', cost: 'Free OSS',
    status: 'recommended', source: 'news',
    note: 'Real-time heads-up display for agent sessions — token usage, tool calls, context window, conversation flow at a glance during editing runs.',
  },
  openGenUI: {
    name: 'OpenGenerativeUI (CopilotKit)', kind: 'repo', category: 'Monitoring',
    pricing: 'free', cost: 'Free OSS (MIT, TypeScript)',
    status: 'recommended', source: 'news',
    note: 'Framework for agentic UIs that stream live dashboards/charts back from any agent runtime — optional tech to make the monitor render live agent-driven panels.',
  },
  n8nExec: {
    name: 'n8n Executions + Error Workflow', kind: 'mcp', category: 'Monitoring',
    pricing: 'free', cost: 'Free (built-in)',
    status: 'configured', source: 'industry',
    note: 'Native per-execution logs, retries and a global error-workflow that pushes any failed step to the monitor + alerts.',
  },
  customMonitor: {
    name: 'Custom Vue monitor (this app + Supabase)', kind: 'repo', category: 'Monitoring',
    pricing: 'free', cost: 'Free (extends this dashboard)',
    status: 'configured', source: 'industry',
    note: 'Operational KPI dashboard reading the Supabase job/post tables — queue depth, success/fail by client+platform, render time, per-video cost, flagged failures.',
  },

  // ---- Methodology --------------------------------------------------------
  claudeCode: {
    name: 'Claude Code', kind: 'agent', category: 'Methodology',
    pricing: 'freemium', cost: 'Subscription / API usage',
    status: 'configured', source: 'industry',
    note: 'AI coding agent used to scaffold, build and iterate the custom editing/posting agents and the per-format style templates. In the stack (AI Coding Tools). This is how the spec-driven agents get built fast.',
  },
  codex: {
    name: 'Codex (GPT)', kind: 'agent', category: 'Methodology',
    pricing: 'freemium', cost: 'Subscription / API usage',
    status: 'configured', source: 'industry',
    note: 'Secondary AI coding agent (cross-check / parallel implementation) for the template + orchestration code. In the stack alongside Claude Code.',
  },
  claudeDesign: {
    name: 'Claude Design', kind: 'agent', category: 'Methodology',
    pricing: 'freemium', cost: 'Subscription / API usage',
    status: 'configured', source: 'industry',
    note: 'AI design tool used for the PRESENTATION layer — this proposal dashboard, pitch visuals and the demo/walkthrough video for the interview. Not part of the production automation pipelines; it is how the proposal itself is presented. In the stack alongside Claude Code / Codex.',
  },
  ecc: {
    name: 'ECC Universal', kind: 'skill', category: 'Methodology',
    pricing: 'free', cost: 'Free (configured)',
    status: 'configured', source: 'news',
    note: '182 methodology skills + 48 agents — pipeline design, review, hardening.',
  },
  superpowers: {
    name: 'Superpowers', kind: 'skill', category: 'Methodology',
    pricing: 'free', cost: 'Free OSS (configured)',
    status: 'configured', source: 'news',
    note: 'Spec-driven dev, TDD, parallel subagents, systematic debugging for delivery.',
  },
  n8nSkills: {
    name: 'n8n-workflow-patterns / mcp-tools-expert', kind: 'skill', category: 'Methodology',
    pricing: 'free', cost: 'Free (configured)',
    status: 'configured', source: 'news',
    note: 'Proven n8n architectural patterns + validated node configuration.',
  },
}

export const proofAutomations = [
  { name: 'AI factory — long-form video generation', maps: 'Project 1' },
  { name: 'Faceless POV AI machine', maps: 'Project 1' },
  { name: 'AI avatar social Automation', maps: 'Project 2' },
]

export function tool(key: string): ToolRef {
  return (
    TOOLS[key] ?? {
      name: key, kind: 'repo', category: 'Methodology',
      pricing: 'free', cost: '', status: 'recommended', source: 'industry', note: '',
    }
  )
}
