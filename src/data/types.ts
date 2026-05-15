export type ToolKind = 'mcp' | 'skill' | 'agent' | 'repo' | 'api'
export type ToolStatus = 'configured' | 'recommended'

export interface ToolRef {
  name: string
  kind: ToolKind
  note: string
  status: ToolStatus
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
