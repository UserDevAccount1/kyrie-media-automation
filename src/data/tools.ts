import type { ToolRef } from './types'

// Catalog verified live against the NEURALYX environment catalog
// (neuralyx.ai news -> "default-setup", 29 items) + news research.
export const TOOLS: Record<string, ToolRef> = {
  n8n: {
    name: 'n8n MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Workflow orchestration backbone (localhost:5678). Triggers, schedules, branching, retries for both pipelines.',
  },
  n8nWorkflows: {
    name: 'n8n-workflows MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Direct workflow definition + execution over HTTP (localhost:5678/mcp-server/http).',
  },
  heygen: {
    name: 'HeyGen MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'AI avatar / video generation. Useful for intro/outro hooks and fallback talking-head segments.',
  },
  kie: {
    name: 'Kie.ai',
    kind: 'api',
    status: 'recommended',
    note: 'One API hub for video / image / music generation models — single key, single integration.',
  },
  higgsfield: {
    name: 'Higgsfield',
    kind: 'api',
    status: 'recommended',
    note: 'Cinematic AI video with camera control and physics-aware motion for stylized B-roll inserts.',
  },
  wangp: {
    name: 'WanGP / Grafico AI',
    kind: 'repo',
    status: 'recommended',
    note: 'Local GPU video/image generation (6GB+ VRAM) — zero per-clip API cost for generated B-roll.',
  },
  supertonic: {
    name: 'Supertonic TTS',
    kind: 'repo',
    status: 'recommended',
    note: 'High-fidelity open-source TTS for voiceover / beat-aligned narration timing.',
  },
  skillSeekers: {
    name: 'Skill Seekers MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Ingest inspiration videos/refs into a reusable "style profile" skill (pacing, cut rhythm, caption style).',
  },
  playwright: {
    name: 'Playwright MCP (Edge)',
    kind: 'mcp',
    status: 'configured',
    note: 'Automated browser control for logged-in sessions, scraping, and posting flows.',
  },
  browserMcp: {
    name: 'BrowserMCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Drives an existing logged-in browser session — the bridge into MoreLogin anti-detect profiles.',
  },
  browserAgent: {
    name: 'Browser Agent',
    kind: 'agent',
    status: 'configured',
    note: 'Edge browser-automation agent (BrowserMCP + Playwright) — submission flows with screenshot proof.',
  },
  supabase: {
    name: 'Supabase MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Job queue, render status, asset/library store, audit log.',
  },
  sheets: {
    name: 'Google Sheets / Drive (n8n nodes)',
    kind: 'api',
    status: 'configured',
    note: 'Brief intake (Doc), raw footage (Drive), ready-to-post trigger + status write-back (Sheet).',
  },
  ffmpeg: {
    name: 'FFmpeg + Shotstack/Remotion',
    kind: 'api',
    status: 'recommended',
    note: 'Deterministic timeline assembly: cut talking head, overlay B-roll, beat-synced music, burned captions.',
  },
  whisper: {
    name: 'Whisper + scene/beat analysis',
    kind: 'repo',
    status: 'recommended',
    note: 'Transcribe talking head for caption timing; detect music beats + inspiration cut cadence.',
  },
  github: {
    name: 'GitHub MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Version control, CI for the automation + dashboard.',
  },
  vercel: {
    name: 'Vercel MCP',
    kind: 'mcp',
    status: 'configured',
    note: 'Host this dashboard / review UI with preview URLs.',
  },
  ecc: {
    name: 'ECC Universal',
    kind: 'skill',
    status: 'configured',
    note: '182 methodology skills + 48 agents — pipeline design, review, hardening.',
  },
  superpowers: {
    name: 'Superpowers',
    kind: 'skill',
    status: 'configured',
    note: 'Spec-driven dev, TDD, parallel subagents, systematic debugging for delivery.',
  },
  n8nSkills: {
    name: 'n8n-workflow-patterns / n8n-mcp-tools-expert',
    kind: 'skill',
    status: 'configured',
    note: 'Proven n8n architectural patterns + validated node configuration.',
  },
  moreloginApi: {
    name: 'MoreLogin Local API',
    kind: 'api',
    status: 'recommended',
    note: 'Start/stop a client profile programmatically; returns a debug port to attach the automation driver.',
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
      name: key,
      kind: 'repo',
      status: 'recommended',
      note: '',
    }
  )
}
