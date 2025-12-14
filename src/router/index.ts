import GuideView from '@views/GuideView.vue'
import ReportView from '@views/ReportView.vue'
import SongsView from '@views/SongsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GuideView
    },
    {
      path: '/report',
      name: 'report',
      component: ReportView
    },
    {
      path: '/songs',
      name: 'songs',
      component: SongsView
    }
  ]
})

export default router
