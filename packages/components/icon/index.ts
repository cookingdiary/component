//整合导出组件
import _Icon from './src/icon.vue'
import { withInstall } from '@zi-shui/utils/with-install'

const Icon = withInstall(_Icon)
console.log(Icon)

export default Icon
export * from './src/icon'

declare module 'vue' {
  export interface GlobalComponents {
    //接口可以自动合并
    ZIcon: typeof Icon
  }
}
