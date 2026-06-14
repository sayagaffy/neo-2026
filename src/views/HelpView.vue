<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ChevronDown } from 'lucide-vue-next'

interface FaqItem {
  id: string
  question: string
  answer: string
}

const FAQ: FaqItem[] = [
  {
    id: 'f1',
    question: 'How do I book a coaching session?',
    answer:
      'Go to the Book A Coach page, select a coach, choose an available time slot, and confirm your booking. Tokens will be deducted from your balance at the time of booking.',
  },
  {
    id: 'f2',
    question: 'How do tokens work?',
    answer:
      'Each coaching session costs a set number of tokens depending on the coach and session type. Your token balance is shown on the Token page. Tokens can be added by your program administrator.',
  },
  {
    id: 'f3',
    question: 'Can I cancel or reschedule a session?',
    answer:
      'You can cancel a session up to 24 hours before the scheduled start time. Cancelled sessions within the allowed window will have tokens refunded. Rescheduling is treated as a cancel-and-rebook.',
  },
  {
    id: 'f4',
    question: 'What is the Precall Test?',
    answer:
      'The Precall Test checks your camera, microphone, speaker, and network connection before a session. We recommend running it at least 15 minutes before your first session to avoid technical issues.',
  },
  {
    id: 'f5',
    question: 'How do I access my session recording?',
    answer:
      'Recordings are available on the My Records page and also in the transaction history on the Token page. Recordings are typically available within a few hours after the session ends.',
  },
  {
    id: 'f6',
    question: 'What is my certification level?',
    answer:
      'Your current level is shown on your Profile page. It reflects your progress through the neo curriculum (A1–C2). Your coach may update your level after assessments.',
  },
  {
    id: 'f7',
    question: 'How do I update my profile information?',
    answer:
      'Go to the Profile page and tap "Update Profile". You can update personal details, your native language, country, and timezone. Email changes may require verification.',
  },
  {
    id: 'f8',
    question: 'What timezone are my sessions shown in?',
    answer:
      'Sessions are always displayed in your local timezone as set in your Profile. The timezone abbreviation is shown next to every session time so you always know exactly when your session is.',
  },
]

const query = ref('')
const openId = ref<string | null>(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return FAQ
  return FAQ.filter(
    (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
  )
})

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="mx-auto w-full max-w-[760px] px-4 py-6 lg:px-6 lg:py-10">
    <!-- Page title -->
    <h1 class="mb-6 text-h1 font-semibold text-text">Help &amp; FAQ</h1>

    <!-- Search -->
    <div class="relative mb-6">
      <Search
        :size="18"
        class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
      />
      <input
        v-model="query"
        type="search"
        placeholder="Search questions…"
        class="h-12 w-full rounded-input border border-border bg-card pl-11 pr-4 text-body text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Search FAQ"
      />
    </div>

    <!-- FAQ list -->
    <div class="divide-y divide-border rounded-card border border-border bg-card">
      <template v-if="filtered.length > 0">
        <div v-for="item in filtered" :key="item.id">
          <button
            :id="`faq-btn-${item.id}`"
            :aria-expanded="openId === item.id"
            :aria-controls="`faq-panel-${item.id}`"
            class="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left"
            @click="toggle(item.id)"
          >
            <span class="text-body font-medium text-text">{{ item.question }}</span>
            <ChevronDown
              :size="18"
              class="shrink-0 text-text-muted transition-transform duration-200"
              :class="openId === item.id ? 'rotate-180' : ''"
            />
          </button>

          <div
            :id="`faq-panel-${item.id}`"
            role="region"
            :aria-labelledby="`faq-btn-${item.id}`"
            class="overflow-hidden transition-all duration-200"
            :class="openId === item.id ? 'max-h-96' : 'max-h-0'"
          >
            <p class="px-5 pb-5 text-small text-text-muted leading-relaxed">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </template>

      <div v-else class="px-5 py-10 text-center text-body text-text-muted">
        No results for "{{ query }}"
      </div>
    </div>

    <!-- Contact footer -->
    <p class="mt-8 text-center text-small text-text-muted">
      Still need help?
      <a href="mailto:support@neo.com" class="font-medium text-primary hover:underline">
        Contact support
      </a>
    </p>
  </div>
</template>
