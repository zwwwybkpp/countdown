import { createApp } from 'vue'
import App from './App.vue'
import '@renderer/assets/css/styles.scss'
import 'element-plus/dist/index.css'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
dayjs.extend(isoWeek)
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.mount('#app')
