<script setup lang="ts">
import { MONITORING } from '../data/monitoring'
import ArchitectureDiagram from './ArchitectureDiagram.vue'
import ToolChip from './ToolChip.vue'
</script>

<template>
  <section class="space-y-6">
    <div class="card border-brand2/30 bg-brand2/5 p-5">
      <span class="text-xs font-bold uppercase tracking-[0.2em] text-brand2">
        DEDICATED MONITORING DASHBOARD
      </span>
      <h2 class="mt-1 text-xl font-bold text-white md:text-2xl">
        Yes — feasible, and the tools are confirmed
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ MONITORING.intro }}</p>
    </div>

    <ArchitectureDiagram :steps="MONITORING.pipeline" />

    <div class="grid gap-5 lg:grid-cols-3">
      <div
        v-for="g in MONITORING.groups"
        :key="g.title"
        class="card flex flex-col p-5"
      >
        <h3 class="text-sm font-bold text-slate-100">{{ g.title }}</h3>
        <p class="mb-3 mt-0.5 text-xs text-muted">{{ g.blurb }}</p>
        <ul class="flex-1 space-y-2">
          <li
            v-for="(m, i) in g.metrics"
            :key="i"
            class="flex gap-2 text-xs leading-relaxed text-slate-300"
          >
            <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand2"></span>
            <span>{{ m }}</span>
          </li>
        </ul>
        <div class="mt-4 flex flex-wrap gap-2">
          <ToolChip v-for="k in g.tools" :key="k" :key-name="k" />
        </div>
      </div>
    </div>

    <p class="text-center text-xs text-muted">
      Build path: extend this Vue app with a live ops view + deploy Uptime Kuma
      (one-line Docker) alongside the automation. ~1 week on top of either project.
    </p>
  </section>
</template>
