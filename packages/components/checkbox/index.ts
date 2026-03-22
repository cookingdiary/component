//整合导出组件
import _Checkbox from './src/checkbox.vue'
import { withInstall } from '@zi-shui/utils/with-install'

const Checkbox = withInstall(_Checkbox)

export default Checkbox
export * from './src/checkbox'

declare module 'vue' {
  export interface GlobalComponents {
    //接口可以自动合并
    ZCheckbox: typeof Checkbox
  }
}
