<script setup lang="ts">
import { computed, ref } from 'vue'
import { TOOLS, proofAutomations } from '../data/tools'
import type { Pricing, ToolStatus } from '../data/types'

const all = computed(() => Object.values(TOOLS))

const priceFilter = ref<'all' | Pricing>('all')
const statusFilter = ref<'all' | ToolStatus>('all')

const priceTabs: { id: 'all' | Pricing; label: string }[] = [
  { id: 'all', label: 'All pricing' },
  { id: 'free', label: 'Free' },
  { id: 'freemium', label: 'Freemium' },
  { id: 'paid', label: 'Paid' },
]
const statusTabs: { id: 'all' | ToolStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'configured', label: 'Configured' },
  { id: 'recommended', label: 'Recommended' },
]

const filtered = computed(() =>
  all.value.filter(
    (t) =>
      (priceFilter.value === 'all' || t.pricing === priceFilter.value) &&
      (statusFilter.value === 'all' || t.status === statusFilter.value),
  ),
)

const grouped = computed(() => {
  const m = new Map<string, typeof filtered.value>()
  for (const t of filtered.value) {
    if (!m.has(t.category)) m.set(t.category, [])
    m.get(t.category)!.push(t)
  }
  return [...m.entries()]
})

const counts = computed(() => ({
  free: all.value.filter((t) => t.pricing === 'free').length,
  freemium: all.value.filter((t) => t.pricing === 'freemium').length,
  paid: all.value.filter((t) => t.pricing === 'paid').length,
}))

const priceBadge: Record<string, string> = {
  free: 'bg-emerald-500/20 text-emerald-300',
  freemium: 'bg-sky-500/20 text-sky-300',
  paid: 'bg-rose-500/20 text-rose-300',
}
</script>

<template>
  <section class="space-y-5">
    <div class="card p-5">
      <div class="mb-1 flex flex-wrap items-end justify-between gap-2">
        <h3 class="text-lg font-bold text-slate-100">Capability Stack</h3>
        <span class="text-xs text-muted">
          {{ filtered.length }} / {{ all.length }} tools ·
          <span class="text-emerald-300">{{ counts.free }} free</span> ·
          <span class="text-sky-300">{{ counts.freemium }} freemium</span> ·
          <span class="text-rose-300">{{ counts.paid }} paid</span>
        </span>
      </div>
      <p class="mb-4 text-sm text-muted">
        Not limited to the research feed — industry-standard free &amp; paid
        options included. Filter by pricing to plan budget.
      </p>

      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="p in priceTabs"
          :key="p.id"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
          :class="
            priceFilter === p.id
              ? 'border-brand bg-brand/15 text-white'
              : 'border-edge bg-panel2 text-muted hover:text-slate-200'
          "
          @click="priceFilter = p.id"
        >
          {{ p.label }}
        </button>
        <span class="mx-1 self-center text-edge">|</span>
        <button
          v-for="s in statusTabs"
          :key="s.id"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
          :class="
            statusFilter === s.id
              ? 'border-accent bg-accent/15 text-white'
              : 'border-edge bg-panel2 text-muted hover:text-slate-200'
          "
          @click="statusFilter = s.id"
        >
          {{ s.label }}
        </button>
      </div>

      <div v-if="!filtered.length" class="py-8 text-center text-sm text-muted">
        No tools match this filter.
      </div>

      <div v-for="[cat, list] in grouped" :key="cat" class="mb-5 last:mb-0">
        <h4 class="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
          {{ cat }} <span class="text-edge">({{ list.length }})</span>
        </h4>
        <div class="grid gap-2 sm:grid-cols-2">
          <div
            v-for="t in list"
            :key="t.name"
            class="flex items-start justify-between gap-3 rounded-lg border border-edge bg-panel2 px-3 py-2.5"
            :title="t.note"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="truncate text-sm font-semibold text-slate-100">{{ t.name }}</span>
                <span
                  class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase"
                  :class="priceBadge[t.pricing]"
                >{{ t.pricing }}</span>
              </div>
              <p class="mt-0.5 truncate text-xs text-muted">{{ t.cost }}</p>
            </div>
            <span
              class="shrink-0 text-[10px] uppercase tracking-wide"
              :class="t.status === 'configured' ? 'text-emerald-300' : 'text-amber-300'"
            >
              {{ t.status === 'configured' ? '● cfg' : '○ rec' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-accent/30 bg-accent/5 p-5">
      <h3 class="mb-1 text-sm font-bold uppercase tracking-wider text-accent">
        Proof — analogous automations already built
      </h3>
      <p class="mb-3 text-xs text-muted">These ship today and de-risk both projects.</p>
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
