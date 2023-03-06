import { defineStore } from 'pinia'
import { ref } from 'vue'
export interface ICounttime {
  name: string
  type: string
  time: string
}
export const useCounttimeStore = defineStore(
  'counttime',
  () => {
    const counttimeList = ref<ICounttime[]>([])
    const count = ref<number>(0)
    function addCounttimeAction(counttime: ICounttime) {
      if (counttimeList.value.length < 3) {
        counttimeList.value?.push(counttime)
        count.value = counttimeList.value.length
        return true
      } else {
        return false
      }
    }
    function deleteCounttimeAction(name: string) {
      const list = counttimeList.value.filter((v) => {
        return v.name != name
      })
      counttimeList.value = list
      count.value = counttimeList.value.length
    }
    return { counttimeList, count, addCounttimeAction, deleteCounttimeAction }
  },
  {
    persist: true
  }
)
