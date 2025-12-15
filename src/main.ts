import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import './style.css'
import '@fortawesome/fontawesome-free/css/all.css'
import App from './App.vue'
import router from './router'

inject()
injectSpeedInsights()

const app = createApp(App)
app.use(router)
app.mount('#app')
