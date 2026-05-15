<script setup lang="ts">
import { computed } from 'vue'
import { tool } from '../data/tools'

const props = defineProps<{ keyName: string }>()
const t = computed(() => tool(props.keyName))

const kindStyle: Record<string, string> = {
  mcp: 'border-brand/40 text-brand bg-brand/10',
  skill: 'border-accent/40 text-accent bg-accent/10',
  agent: 'border-brand2/40 text-brand2 bg-brand2/10',
  repo: 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10',
  api: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
}
const priceStyle: Record<string, string> = {
  free: 'bg-emerald-500/20 text-emerald-300',
  freemium: 'bg-sky-500/20 text-sky-300',
  paid: 'bg-rose-500/20 text-rose-300',
}
</script>

<template>
  <span
    class="chip group relative cursor-default"
    :class="kindStyle[t.kind]"
    tabindex="0"
  >
    <span class="font-semibold">{{ t.name }}</span>
    <span
      class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      :class="priceStyle[t.pricing]"
    >{{ t.pricing }}</span>
    <span
      v-if="t.note"
      class="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-72 rounded-xl border border-edge bg-panel2 p-3 text-xs leading-relaxed text-slate-300 shadow-glow group-hover:block group-focus:block"
    >
      <span class="mb-1 block font-semibold text-slate-100">
        {{ t.cost }} ·
        {{ t.status === 'configured' ? '● configured' : '○ recommended' }} ·
        {{ t.source === 'news' ? 'from research' : 'industry standard' }}
      </span>
      {{ t.note }}
    </span>
  </span>
</template>
