export interface OrchDuty {
  title: string
  detail: string
  tools: string[]
}

export const ORCHESTRATOR = {
  name: 'Hermes Agent',
  tagline: 'The single autonomous brain that runs Kyrie Media Automation once it is set up',
  intro:
    'Hermes Agent (Nous Research, open-source MIT, self-hosted) sits ABOVE n8n and the task agents. n8n is the deterministic plumbing; the RAG/LangGraph agents do per-step decisions; Hermes is the always-on owner that schedules, supervises, remembers, recovers, and lets the Philippines team command everything from chat. Configure once — it runs both projects unattended.',
  flow: 'Brief / Sheet → Hermes (schedule + spawn) → per-job sub-agent (edit or post) → deterministic workers (render / MoreLogin) → score + verify → Hermes (finalize, write back, or escalate to the team in chat)',
  duties: <OrchDuty[]>[
    {
      title: 'Scheduling & triggering',
      detail:
        'Cron automations: polls the brief Doc + the ready-to-post Sheet, fires the editing and posting pipelines at the right per-client local time, runs nightly audits, backups and the daily ops report — without anyone pressing start.',
      tools: ['hermes', 'n8n', 'sheets'],
    },
    {
      title: 'Parallel sub-agents (scale)',
      detail:
        'Spawns one isolated sub-agent per video and per post job, so 200+ videos/month and their posts run concurrently with zero context bleed between clients.',
      tools: ['hermes', 'langgraph', 'ragAgent'],
    },
    {
      title: 'Persistent memory',
      detail:
        'Remembers each client’s style profile, brand rules, format template, posting cadence and MoreLogin profile mapping across sessions — nothing is re-explained, and quality compounds over time.',
      tools: ['hermes', 'vectorDb', 'supabase'],
    },
    {
      title: 'Self-improving skills',
      detail:
        'When it solves a new edge (a new platform UI, a new format, a recurring failure), it writes a reusable skill (agentskills.io standard) so the same problem is one-click next time.',
      tools: ['hermes', 'skillSeekers', 'claudeCode'],
    },
    {
      title: 'Command & control from chat',
      detail:
        'The PH team manages everything through Telegram / Slack / WhatsApp: “status of today’s posts”, “approve draft 42”, “retry the failed TikTok for client X”. No dashboard login required to operate.',
      tools: ['hermes', 'customMonitor'],
    },
    {
      title: 'Execution surface',
      detail:
        'Runs render workers (Docker / SSH / cloud), drives the MoreLogin anti-detect browser for posting, does web search + vision for B-roll — all under one agent that already has the credentials and context.',
      tools: ['hermes', 'browserAgent', 'ffmpeg', 'moreloginApi'],
    },
    {
      title: 'Recovery & escalation',
      detail:
        'Watches every job. Auto-retries transient failures, classifies hard failures, and escalates only what truly needs a human — pushed to the team chat with the reason and a screenshot.',
      tools: ['hermes', 'uptimeKuma', 'n8nExec'],
    },
  ],
  dayInLife: [
    '06:00 — Hermes wakes on cron, reads new briefs + the ready-to-post Sheet.',
    'Spawns edit sub-agents for new briefs; each sources B-roll, plans the EDL, renders, self-scores vs the client template.',
    'High-confidence videos auto-finalize; borderline ones are dropped into the team’s Slack with the score and a preview.',
    'At each client’s scheduled local time, Hermes opens the right MoreLogin profile and posts; verifies the live URL; writes SUCCESS back to the Sheet.',
    'A TikTok upload hits a captcha — Hermes retries once, then pings WhatsApp: “client X TikTok needs manual check (CAPTCHA)”.',
    '21:00 — Hermes posts the daily report: videos produced, posts succeeded/failed, cost, what it learned (new skill written).',
  ],
}
