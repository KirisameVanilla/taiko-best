import { createRouter, createWebHistory } from 'vue-router'
import GuideView from '../components/GuideView.vue'
import ReportView from '../components/ReportView.vue'

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
      component: ReportView,
      props: (route) => ({ scoreInput: route.query.data as string || '' })
    }
  ]
})

export default router
