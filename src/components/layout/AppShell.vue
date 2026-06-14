<script setup lang="ts">
import { ref } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import TopBar from '@/components/layout/TopBar.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import SidebarNav from '@/components/layout/SidebarNav.vue'
import MoreSheet from '@/components/layout/MoreSheet.vue'
import NotificationsPanel from '@/components/layout/NotificationsPanel.vue'
import AccountMenu from '@/components/layout/AccountMenu.vue'

const { isDesktop } = useBreakpoint()

const moreOpen = ref(false)
const notifOpen = ref(false)
const accountOpen = ref(false)
</script>

<template>
  <div class="flex h-dvh w-full overflow-hidden bg-surface">
    <!-- Desktop sidebar -->
    <aside v-if="isDesktop" class="flex h-full shrink-0">
      <SidebarNav />
    </aside>

    <!-- Main column -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top bar -->
      <TopBar
        @open-notif="notifOpen = true"
        @open-account="accountOpen = true"
      />

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>

      <!-- Mobile bottom nav -->
      <nav v-if="!isDesktop" class="shrink-0">
        <BottomNav @open-more="moreOpen = true" />
      </nav>
    </div>

    <!-- Overlays (Teleport to body inside each) -->
    <MoreSheet :open="moreOpen" @close="moreOpen = false" />
    <NotificationsPanel :open="notifOpen" @close="notifOpen = false" />
    <AccountMenu :open="accountOpen" @close="accountOpen = false" />
  </div>
</template>
