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
const { ipcRenderer, dialog } = require('electron')
ipcRenderer.on('update-available', () => {
  // 显示更新提示
  dialog
    .showMessageBox({
      type: 'info',
      title: '发现新版本',
      message: '是否下载并安装？',
      buttons: ['是', '否']
    })
    .then((result) => {
      if (result.response === 0) {
        // 下载并安装更新
        ipcRenderer.send('download-update')
      }
    })
})
ipcRenderer.on('update-downloaded', () => {
  // 显示安装提示
  dialog
    .showMessageBox({
      type: 'info',
      title: '更新已下载',
      message: '是否重启应用？',
      buttons: ['是', '否']
    })
    .then((result) => {
      if (result.response === 0) {
        // 安装并重启应用
        ipcRenderer.send('install-update')
      }
    })
})
