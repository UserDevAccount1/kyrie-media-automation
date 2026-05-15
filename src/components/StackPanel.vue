<script setup lang="ts">
import { computed } from 'vue'
import { TOOLS, proofAutomations } from '../data/tools'

const configured = computed(() =>
  Object.values(TOOLS).filter((t) => t.status === 'configured'),
)
const recommended = computed(() =>
  Object.values(TOOLS).filter((t) => t.status === 'recommended'),
)
</script>

<template>
  <section class="space-y-5">
    <div class="card p-5">
      <h3 class="mb-1 text-lg font-bold text-slate-100">Capability Stack</h3>
      <p class="mb-4 text-sm text-muted">
        Verified live against the configured environment catalog — not vapor.
      </p>

      <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
        Already configured ({{ configured.length }})
      </h4>
      <div class="mb-5 flex flex-wrap gap-2">
        <span
          v-for="t in configured"
          :key="t.name"
          class="chip border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
          :title="t.note"
        >
          {{ t.name }}
        </span>
      </div>

      <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">
        Recommended additions ({{ recommended.length }})
      </h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="t in recommended"
          :key="t.name"
          class="chip border-amber-400/40 bg-amber-400/10 text-amber-300"
          :title="t.note"
        >
          {{ t.name }}
        </span>
      </div>
    </div>

    <div class="card border-accent/30 bg-accent/5 p-5">
      <h3 class="mb-1 text-sm font-bold uppercase tracking-wider text-accent">
        Proof — analogous automations already built
      </h3>
      <p class="mb-3 text-xs text-muted">
        These ship today and de-risk both projects.
      </p>
      <ul class="space-y-2">
        <li
          v-for="p in proofAutomations"
          :key="p.name"
          class="flex items-center justify-between rounded-lg border border-edge bg-panel2 px-3.5 py-2.5 text-sm"
        >
          <span class="text-slate-200">{{ p.name }}</span>
          <span class="chip border-accent/40 bg-accent/10 text-accent">→ {{ p.maps }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
