<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { PROJECTS } from './data/projects'
import ProjectOverview from './components/ProjectOverview.vue'
import ArchitectureDiagram from './components/ArchitectureDiagram.vue'
import QuestionCard from './components/QuestionCard.vue'
import StackPanel from './components/StackPanel.vue'

type View = 'p1' | 'p2' | 'stack'
const view = ref<View>('p1')
const openIdx = ref<number>(0)

const project = computed(() => PROJECTS.find((p) => p.id === view.value) ?? null)

function selectView(v: View) {
  view.value = v
  openIdx.value = 0
}

function toggle(i: number) {
  openIdx.value = openIdx.value === i ? -1 : i
}

function onKey(e: KeyboardEvent) {
  if (!project.value) return
  const max = project.value.questions.length - 1
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    openIdx.value = Math.min(max, openIdx.value + 1)
    e.preventDefault()
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    openIdx.value = Math.max(0, openIdx.value - 1)
    e.preventDefault()
  } else if (e.key === '1') selectView('p1')
  else if (e.key === '2') selectView('p2')
  else if (e.key === '3') selectView('stack')
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

const tabs: { id: View; label: string }[] = [
  { id: 'p1', label: 'Project 1 · Video Editing' },
  { id: 'p2', label: 'Project 2 · Video Posting' },
  { id: 'stack', label: 'Stack & Proof' },
]
</script>

<template>
  <div class="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-sm font-black text-white"
            >K</div>
            <h1 class="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              Kyrie Media Automation
            </h1>
          </div>
          <p class="mt-1.5 text-sm text-muted">
            Automation proposal · Project 1 — Automated Video Editing · Project 2 — Automated Video Posting
          </p>
        </div>
        <div class="text-right text-xs text-muted no-print">
          <p>Use <kbd class="rounded border border-edge px-1">1</kbd>
            <kbd class="rounded border border-edge px-1">2</kbd>
            <kbd class="rounded border border-edge px-1">3</kbd> to switch ·
            <kbd class="rounded border border-edge px-1">↑</kbd>
            <kbd class="rounded border border-edge px-1">↓</kbd> to navigate Q&amp;A
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <nav class="mt-6 flex flex-wrap gap-2 no-print">
        <button
          v-for="t in tabs"
          :key="t.id"
          class="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors"
          :class="
            view === t.id
              ? 'border-brand bg-brand/15 text-white'
              : 'border-edge bg-panel/60 text-muted hover:text-slate-200'
          "
          @click="selectView(t.id)"
        >
          {{ t.label }}
        </button>
      </nav>
    </header>

    <!-- Project views -->
    <main class="flex-1 space-y-6">
      <template v-if="project">
        <div>
          <span
            class="text-xs font-bold uppercase tracking-[0.2em] text-brand2"
          >{{ project.tag }}</span>
          <h2 class="mt-1 text-xl font-bold text-white md:text-2xl">
            {{ project.title }}
          </h2>
          <p class="text-sm text-muted">{{ project.subtitle }}</p>
        </div>

        <ProjectOverview :project="project" />
        <ArchitectureDiagram :steps="project.pipeline" />

        <div>
          <h3 class="mb-3 text-sm font-bold uppercase tracking-wider text-muted">
            Questions &amp; our answers
          </h3>
          <div class="space-y-3">
            <QuestionCard
              v-for="(qa, i) in project.questions"
              :key="qa.n"
              :qa="qa"
              :open="openIdx === i"
              @toggle="toggle(i)"
            />
          </div>
        </div>
      </template>

      <StackPanel v-else />
    </main>

    <footer class="mt-10 border-t border-edge pt-5 text-center text-xs text-muted">
      Kyrie Media Automation · prepared for kyrimedia.us · built with Vue 3 + Vite + Tailwind
    </footer>
  </div>
</template>
