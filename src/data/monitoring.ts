export interface MonitorGroup {
  title: string
  blurb: string
  metrics: string[]
  tools: string[]
}

export const MONITORING = {
  intro:
    'A dedicated workflow-monitoring dashboard is feasible and recommended. It reads the Supabase job/post tables for operational KPIs, while Uptime Kuma watches every service heartbeat and fires alerts. Every tool below was confirmed in the research feed.',
  pipeline: [
    { label: 'Emit', detail: 'Each n8n step + render/post worker writes status, timing, cost to Supabase; the n8n error-workflow catches any failure.' },
    { label: 'Probe', detail: 'Uptime Kuma pings n8n, MoreLogin API, render workers, Supabase + per-pipeline heartbeat URLs.' },
    { label: 'Observe', detail: 'RuView / Claude HUD trace the editing agent’s tool calls; CodeBurn tallies token cost per video.' },
    { label: 'Visualize', detail: 'This Vue app gains a live ops view (queue, success/fail, latency, cost) from Supabase.' },
    { label: 'Alert', detail: 'Uptime Kuma + n8n error-workflow push Slack/email on failed posts, stalled renders, proxy/profile down.' },
  ],
  groups: <MonitorGroup[]>[
    {
      title: 'Project 1 — Video Editing health',
      blurb: 'Is the editing pipeline producing good videos, fast, at expected cost?',
      metrics: [
        'Briefs received → jobs queued → drafts rendered (funnel)',
        'Render success / failure rate + avg render time',
        'Per-video AI cost + B-roll cache hit rate',
        'Confidence score distribution & auto-finalize vs review ratio',
        'Editing-agent decision traces (why this B-roll / EDL)',
      ],
      tools: ['customMonitor', 'ruview', 'claudeHud', 'codeburn', 'uptimeKuma'],
    },
    {
      title: 'Project 2 — Posting health',
      blurb: 'Did every approved video post, as the right client, on time?',
      metrics: [
        'Scheduled queue + posts succeeded / failed by platform & client',
        'Posting latency vs scheduled time',
        'MoreLogin profile / proxy health (US IP up?)',
        'Retry counts + flagged failures with reason codes',
        'Sheet write-back confirmation lag',
      ],
      tools: ['customMonitor', 'uptimeKuma', 'n8nExec', 'supabase'],
    },
    {
      title: 'Platform & infra',
      blurb: 'Are the moving parts actually up?',
      metrics: [
        'n8n / render workers / MoreLogin API / Supabase uptime',
        'Queue backlog + worker concurrency saturation',
        'Dashboard deploy status (Vercel)',
        'Alert delivery (Slack / email) self-check',
      ],
      tools: ['uptimeKuma', 'n8nExec', 'vercel', 'openGenUI'],
    },
  ],
}
