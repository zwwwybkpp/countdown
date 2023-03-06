<template>
  <div class="panel">
    <Banner :msg="oneText"></Banner>
    <CountDown @show-dialog="showDialog"></CountDown>
    <Setting :visible="visible" @close-dialog="showDialog"></Setting>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { timeOutFunc } from '@renderer/utils/timeOutFunc'
import Banner from './Banner.vue'
import CountDown from './CountDown.vue'
import { TimeOutConfig } from '@renderer/utils/timeOutFunc'
import localCache from '@renderer/utils/localCache'
import Setting from './Setting.vue'
const oneText = ref('')
const visible = ref(false)
async function getOneText(): Promise<void> {
  await fetch('https://v1.hitokoto.cn/')
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      const text = data.hitokoto
      if (text.length < 24) {
        oneText.value = text
        localCache.setCache('text', text)
      } else {
        getOneText()
      }
    })
}
const config: TimeOutConfig = {
  interval: 1,
  runNow: true,
  time: '08:00:00'
}
const showDialog = (v: boolean) => {
  visible.value = v
}
onMounted(() => {
  if (localCache.getCache('text')) {
    oneText.value = localCache.getCache('text')
    config.runNow = false
  } else {
    config.runNow = true
  }
  timeOutFunc(async () => {
    await getOneText()
  }, config)
})
</script>

<style scoped lang="scss">
.panel {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
