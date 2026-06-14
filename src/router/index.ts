import { createRouter, createWebHistory } from 'vue-router'
import AppShell from '@/components/layout/AppShell.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppShell,
      children: [
        { path: '', redirect: '/dashboard' },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'coaches',
          name: 'coaches',
          component: () => import('@/views/CoachesView.vue'),
        },
        {
          path: 'book',
          name: 'book',
          component: () => import('@/views/BookView.vue'),
        },
        {
          path: 'my-records',
          name: 'my-records',
          component: () => import('@/views/MyRecordsView.vue'),
        },
        {
          path: 'precall-test',
          name: 'precall-test',
          component: () => import('@/views/PrecallTestView.vue'),
        },
        {
          path: 'token',
          name: 'token',
          component: () => import('@/views/TokenView.vue'),
        },
        {
          path: 'help',
          name: 'help',
          component: () => import('@/views/HelpView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
