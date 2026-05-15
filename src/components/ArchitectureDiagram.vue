<script setup lang="ts">
import type { PipelineStep } from '../data/types'
defineProps<{ steps: PipelineStep[] }>()
</script>

<template>
  <div class="card p-5">
    <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-muted">
      Pipeline
    </h3>
    <div class="flex flex-col gap-3 lg:flex-row lg:items-stretch">
      <template v-for="(s, i) in steps" :key="i">
        <div
          class="flex-1 rounded-xl border border-edge bg-panel2 p-3.5 transition-colors hover:border-brand/50"
        >
          <div class="mb-1 flex items-center gap-2">
            <span
              class="flex h-6 w-6 items-center justify-center rounded-md bg-brand/20 text-xs font-bold text-brand2"
            >{{ i + 1 }}</span>
            <span class="text-sm font-semibold text-slate-100">{{ s.label }}</span>
          </div>
          <p class="text-xs leading-relaxed text-slate-400">{{ s.detail }}</p>
          <p
            v-if="s.agent"
            class="mt-2 rounded-md border px-2 py-1.5 text-[11px] leading-snug"
            :class="
              s.agent.startsWith('No agent')
                ? 'border-edge bg-panel text-muted'
                : 'border-accent/40 bg-accent/10 text-accent'
            "
          >
            {{ s.agent }}
          </p>
        </div>
        <div
          v-if="i < steps.length - 1"
          class="hidden shrink-0 items-center text-brand2 lg:flex"
          aria-hidden="true"
        >→</div>
      </template>
    </div>
  </div>
</template>
