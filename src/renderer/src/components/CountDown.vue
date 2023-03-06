<template>
  <div class="countdown">
    <ul>
      <template v-for="(item, index) of list" :key="index">
        <li class="countdown-item">
          <span>
            距离{{ item.name }}还有 <b class="time-text">{{ countTimes[index].day + ' ' }}</b
            >天 <b class="time-text">{{ countTimes[index].hour + ' ' }}</b
            >小时 <b class="time-text">{{ countTimes[index].minute + ' ' }}</b
            >分 <b class="time-text">{{ countTimes[index].second + ' ' }}</b
            >秒
          </span>
          <el-button
            v-show="editVisible"
            class="del"
            type="danger"
            size="small"
            link
            @click="deleteCounttime(item.name)"
            >删除</el-button
          >
        </li>
      </template>
      <li class="countdown-item">
        <div class="nowtime">
          <i class="time">现在时间: {{ nowTime }}</i> <i class="week">{{ day }}</i>
        </div>
        <div class="btns">
          <el-button type="primary" size="small" @click="showEdit($event)">{{
            editVisible ? '取消' : '编辑'
          }}</el-button>
          <el-button type="primary" size="small" @click="handleShowDialog">添加</el-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useCounttimeStore } from '@renderer/stores/useCountimeStore'
import dayjs from 'dayjs'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { clearBlur } from '@renderer/utils/clearBlur'
const emits = defineEmits(['showDialog'])
const nowTime = ref('')
const day = ref('')
const countTimes = ref<any[]>([
  { day: 0, hour: 0, minute: 0, second: 0 },
  { day: 0, hour: 0, minute: 0, second: 0 },
  { day: 0, hour: 0, minute: 0, second: 0 }
])
const list = computed(() => useCounttimeStore().counttimeList)
console.log(list.value)
let t1: any = null
let t2: any = null
const getNowTime = () => {
  nowTime.value = dayjs().format('YYYY-MM-DD hh:mm:ss')
  day.value = weekDay[dayjs().isoWeekday()]
  t1 = setTimeout(getNowTime, 1000)
}
const weekDay = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
}
const isNull = ref(false)
const countTime = () => {
  const now = dayjs()
  if (list.value.length === 0) {
    isNull.value = true
  }
  for (const i in list.value) {
    isNull.value = false
    let diff = 0
    if (list.value[i].type == 'once' || list.value[i].type == undefined) {
      diff = -now.diff(dayjs(list.value[i].time), 's')
      if (diff == 0) {
        useCounttimeStore().deleteCounttimeAction(list.value[i].name)
      }
    } else if (list.value[i].type == 'always') {
      const t = dayjs().format('YYYY-MM-DD') + list.value[i].time
      if (now.isBefore(dayjs(t))) {
        diff = -now.diff(dayjs(t), 's')
      } else {
        diff = -now.diff(dayjs(t).add(1, 'day'), 's')
      }
    }
    countTimes.value[i].day = Math.floor(diff / (24 * 3600))
    countTimes.value[i].hour = Math.floor((diff % (24 * 3600)) / 3600)
    countTimes.value[i].minute = Math.floor(((diff % (24 * 3600)) % 3600) / 60)
    countTimes.value[i].second = Math.floor(((diff % (24 * 3600)) % 3600) % 60)
  }
  t2 = setTimeout(countTime, 1000)
}
const handleShowDialog = (e: any) => {
  emits('showDialog', true)
  clearBlur(e)
}
const editVisible = ref(false)
const showEdit = (e: any) => {
  editVisible.value = !editVisible.value
  clearBlur(e)
}
const deleteCounttime = (name: string) => {
  const countStore = useCounttimeStore()
  countStore.deleteCounttimeAction(name)
  console.log(countStore.count)

  countStore.count == 0 && (editVisible.value = false)
}
onMounted(() => {
  getNowTime()
  countTime()
})
onUnmounted(() => {
  clearTimeout(t1)
  clearTimeout(t2)
})
</script>

<style scoped lang="scss">
.del {
  position: fixed;
  right: 30px;
}
.countdown {
  margin: 0 auto;
  width: 90%;
  .countdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  li {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    color: #4d4b4b;
    font-weight: 600;
    font-size: 14px;
    border-left: 1px solid var(--list-border);
    border-right: 1px solid var(--list-border);
    border-bottom: 1px solid var(--list-border);
    width: 100%;
    .time-text {
      color: red;
      font-size: 15px;
    }
    &:last-child {
      padding: 0 0 0 10px;
      border-radius: 0 0 5px 5px;
      .nowtime {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #414141;
        font-weight: 600;
        width: 210px;
      }
      .btns {
        width: 32%;
      }
    }
    &:first-child {
      border-top: 1px solid var(--list-border);
      border-radius: 5px 5px 0 0;
    }
  }
}
</style>
