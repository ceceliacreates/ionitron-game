import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home/play'
  },
  {
    path: '/home/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/home/play'
      },
      {
        path: 'play',
        component: () => import('@/views/PlayPage.vue')
      },
      {
        path: 'about',
        component: () => import('@/views/AboutPage.vue')
      },
      {
        path: 'scores',
        component: () => import('@/views/ScoresPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
