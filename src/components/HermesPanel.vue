<script setup lang="ts">
import { ORCHESTRATOR } from '../data/orchestrator'
import ToolChip from './ToolChip.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="card border-accent/30 bg-accent/5 p-5">
      <span class="text-xs font-bold uppercase tracking-[0.2em] text-accent">
        TOP-LEVEL ORCHESTRATOR
      </span>
      <h2 class="mt-1 text-xl font-bold text-white md:text-2xl">
        {{ ORCHESTRATOR.name }} — {{ ORCHESTRATOR.tagline }}
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ ORCHESTRATOR.intro }}</p>
      <p
        class="mt-3 rounded-lg border border-edge bg-panel2 px-3 py-2 font-mono text-[11px] leading-relaxed text-brand2"
      >
        {{ ORCHESTRATOR.flow }}
      </p>
    </div>

    <div>
      <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
        Once the workflow is set, Hermes handles
      </h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div
          v-for="d in ORCHESTRATOR.duties"
          :key="d.title"
          class="card flex flex-col p-5"
        >
          <h4 class="text-sm font-bold text-slate-100">{{ d.title }}</h4>
          <p class="mt-1 flex-1 text-xs leading-relaxed text-slate-300">{{ d.detail }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <ToolChip v-for="k in d.tools" :key="k" :key-name="k" />
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-brand2">
        A day in the life (fully unattended)
      </h3>
      <ol class="space-y-2.5">
        <li
          v-for="(s, i) in ORCHESTRATOR.dayInLife"
          :key="i"
          class="flex gap-3 text-sm leading-relaxed text-slate-300"
        >
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent/20 text-xs font-bold text-accent"
          >{{ i + 1 }}</span>
          <span>{{ s }}</span>
        </li>
      </ol>
    </div>

    <p class="text-center text-xs text-muted">
      Hermes is open-source (MIT), self-hosted, zero telemetry — credentials and
      client data stay on Kyri’s own server.
    </p>
  </section>
</template>
