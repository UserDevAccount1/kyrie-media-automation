<script setup lang="ts">
import type { Project } from '../data/types'
defineProps<{ project: Project }>()
</script>

<template>
  <div class="grid gap-5 md:grid-cols-2">
    <div class="card p-5">
      <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
        What they do now
      </h3>
      <ul class="space-y-2.5">
        <li
          v-for="(s, i) in project.currentProcess"
          :key="i"
          class="flex gap-2.5 text-sm leading-relaxed text-slate-300"
        >
          <span class="font-mono text-xs text-muted">{{ i + 1 }}.</span>
          <span>{{ s }}</span>
        </li>
      </ul>
    </div>
    <div class="card border-brand/30 bg-brand/5 p-5">
      <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-brand2">
        What we automate
      </h3>
      <p class="text-sm leading-relaxed text-slate-200">{{ project.goal }}</p>
    </div>
  </div>
</template>
