export const clearBlur = (e: any) => {
  let target = e.target
  if (target.nodeName == 'SPAN') {
    target = e.target.parentNode
  }
  target.blur()
}
