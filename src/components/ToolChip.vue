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
</script>

<template>
  <span
    class="chip group relative cursor-default"
    :class="kindStyle[t.kind]"
    tabindex="0"
  >
    <span class="font-semibold">{{ t.name }}</span>
    <span
      class="text-[10px] uppercase tracking-wide opacity-70"
      :title="t.status === 'configured' ? 'Already configured in environment' : 'Recommended addition'"
    >
      {{ t.status === 'configured' ? '● configured' : '○ recommended' }}
    </span>
    <span
      v-if="t.note"
      class="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-72 rounded-xl border border-edge bg-panel2 p-3 text-xs leading-relaxed text-slate-300 shadow-glow group-hover:block group-focus:block"
    >
      {{ t.note }}
    </span>
  </span>
</template>
