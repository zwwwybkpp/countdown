import localCache from './localCache'

const H = 3600000
export function timeOutFunc(func: Func, cfg: TimeOutConfig): void {
  cfg.runNow && func()
  // const nowTime = new Date().getTime()
  // const timePoints = cfg.time.split(':').map((v) => +v)
  // let recent = new Date().setHours(...timePoints)
  // recent >= nowTime || (recent = nowTime)
  setTimeout(() => {
    func()
    if (localCache.getCache('id')) {
      clearInterval(localCache.getCache('id'))
      localCache.deleteCache('id')
    }
    const id = setInterval(() => {
      func()
    }, H)
    localCache.setCache('id', id)
  }, H)
}

export interface TimeOutConfig {
  interval: number
  runNow: boolean
  time: string
}
type Func = InstanceType<typeof Function>
