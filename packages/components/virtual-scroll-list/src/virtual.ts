import { RangeOptions, updateType, VirutalOptions } from './props'

const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC'
}
export function initVirtual(param: VirutalOptions, update: updateType) {
  let offsetValue = 0
  let caclType = CALC_TYPE.INIT
  let fixedSizeVal = 0
  let firstRangeAvg = 0 //动态平均高度
  const sizes = new Map()

  const range: RangeOptions = {
    start: 0,
    end: 0,
    padFront: 0,
    padBehind: 0
  }

  function isFixed() {
    return caclType === CALC_TYPE.FIXED
  }
  function getEstimateSize() {
    return isFixed() ? fixedSizeVal : firstRangeAvg || param.estimateSize
  }

  function getIndexOffset(idx: number) {
    if (!idx) {
      return 0
    }
    let offset = 0
    for (let i = 0; i < idx; i++) {
      let indexSize = sizes.get(param.uniqueIds[i])
      offset += typeof indexSize === 'number' ? indexSize : getEstimateSize()
    }
    return offset
  }
  function getPadFront() {
    if (isFixed()) {
      return getEstimateSize() * range.start
    } else {
      return getIndexOffset(range.start)
    }
  }
  function getPadBehind() {
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * getEstimateSize()
  }
  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({ ...range })
  }
  function checkRange(start: number, end: number) {
    const total = param.uniqueIds.length
    const keeps = param.keeps
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      start = end - keeps - 1
    }
    updateRange(start, end)
  }
  function getScrollOvers() { //获取当前滚动索引，从0开始
    if (isFixed()) {
      return Math.floor(offsetValue / getEstimateSize())
    } else {
      let low = 0
      let high = param.uniqueIds.length
      let middle = 0
      let middleOffset = 0
      while (low <= high) {
        middle = low + Math.floor((high - low) / 2)
        middleOffset = getIndexOffset(middle)
        if (middleOffset == offsetValue) {
          return middle
        } else if (middleOffset < offsetValue) {
          low = middle + 1
        } else if (middle > offsetValue) {
          high = middle - 1
        }
      }
      return low > 0 ? --low : 0
    }
  }
  function getEndByStart(start: number) {
    const computeEnd = start + param.keeps - 1
    const end = Math.min(computeEnd, param.uniqueIds.length - 1)
    return end
  }
  function handleFront() {
    //向上滚动
    const overs = getScrollOvers()
    if (overs > range.start) {
      return
    }
    const start = Math.max(overs - param.buffer, 0)
    checkRange(start, getEndByStart(start))
  }
  function handleBehind() {
    //向后滑动
    const overs = getScrollOvers()
    if (overs < range.start + param.buffer) {
      return
    }
    checkRange(overs, getEndByStart(overs))
  }
  function handleScroll(offset: number) {
    const direction = offset < offsetValue ? 'FRONT' : 'BEHIND'
    offsetValue = offset
    if (direction === 'FRONT') {
      handleFront()
    } else if (direction === 'BEHIND') {
      handleBehind()
    }
  }
  function saveSize(id: string | number, size: number) {
    sizes.set(id, size)
    if (caclType === CALC_TYPE.INIT) {
      fixedSizeVal = size
      caclType = CALC_TYPE.FIXED
    } else if (caclType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      caclType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0
    }

    if (caclType === CALC_TYPE.DYNAMIC) {
      if (sizes.size < Math.min(param.keeps, param.uniqueIds.length)) {
        firstRangeAvg = Math.round(
          [...sizes.values()].reduce((acc, val) => acc + val, 0) / sizes.size
        )
      }
    }
  }

  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize
  }
}

//固定高度的上padding可以用开始范围前面数 * 每项高度
// 下padding 可以用总个数 - 当前显示到的个数 * 每项高度

//动态高度 （默认先计算下滚动条大致高度，根据已经加载数据尽可能预估下一个滚动条
//上padding （默认记录每一项的高度 根据当前start来累计start之前的每一项高度
//下padding 用（总个数 - 当前显示的个数） * 预估高度

//当前开始滚动 固定高度可以采用 偏移量 / 每项的高度来计算展示的开始索引
//动态开始的位置 需要采用二分查找找到已经加载到的哪一项偏移量和当前的最接近，找到后返回的当前的开始
