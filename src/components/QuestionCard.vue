<script setup lang="ts">
import { ref } from 'vue'
import type { QA } from '../data/types'
import ToolChip from './ToolChip.vue'

defineProps<{ qa: QA; open: boolean }>()
const emit = defineEmits<{ (e: 'toggle'): void }>()
const hovered = ref(false)
</script>

<template>
  <div
    class="card overflow-hidden transition-shadow"
    :class="{ 'shadow-glow': open || hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <button
      class="flex w-full items-start gap-4 p-5 text-left"
      :aria-expanded="open"
      @click="emit('toggle')"
    >
      <span
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-base font-bold text-white"
      >
        {{ qa.n }}
      </span>
      <span class="flex-1">
        <span class="block text-[15px] font-semibold leading-snug text-slate-100">
          {{ qa.question }}
        </span>
      </span>
      <span
        class="mt-1 shrink-0 text-muted transition-transform"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      >▾</span>
    </button>

    <div v-show="open" class="border-t border-edge px-5 pb-5 pt-4">
      <ul class="space-y-2.5">
        <li
          v-for="(line, i) in qa.answer"
          :key="i"
          class="flex gap-2.5 text-sm leading-relaxed text-slate-300"
        >
          <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand2"></span>
          <span>{{ line }}</span>
        </li>
      </ul>
      <div v-if="qa.tools.length" class="mt-4 flex flex-wrap gap-2">
        <ToolChip v-for="k in qa.tools" :key="k" :key-name="k" />
      </div>
    </div>
  </div>
</template>
