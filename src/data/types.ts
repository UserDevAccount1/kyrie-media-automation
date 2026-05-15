export type ToolKind = 'mcp' | 'skill' | 'agent' | 'repo' | 'api'
export type ToolStatus = 'configured' | 'recommended'
export type Pricing = 'free' | 'freemium' | 'paid'

export type ToolCategory =
  | 'Orchestration'
  | 'B-roll sourcing'
  | 'Assembly / Render'
  | 'LLM / Reasoning'
  | 'Transcription'
  | 'TTS / Voice'
  | 'AI video gen'
  | 'Music'
  | 'Posting / Anti-detect'
  | 'Infra / Deploy'
  | 'Monitoring'
  | 'Methodology'

export interface ToolRef {
  name: string
  kind: ToolKind
  category: ToolCategory
  pricing: Pricing
  cost: string
  note: string
  status: ToolStatus
  source: 'news' | 'industry'
}

export interface QA {
  n: number
  question: string
  answer: string[]
  tools: string[]
}

export interface PipelineStep {
  label: string
  detail: string
  agent: string
}

export interface Project {
  id: 'p1' | 'p2'
  tag: string
  title: string
  subtitle: string
  currentProcess: string[]
  goal: string
  pipeline: PipelineStep[]
  questions: QA[]
}
