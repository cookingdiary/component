//整合导出组件
import _Input from './src/input.vue'
import { withInstall } from '@zi-shui/utils/with-install'

const Input = withInstall(_Input)

export default Input
export type { InputProps } from './src/input'

declare module 'vue' {
  export interface GlobalComponents {
    //接口可以自动合并
    ZInput: typeof Input
  }
}
