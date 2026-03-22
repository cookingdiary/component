//整合导出组件
import _Button from './src/button.vue'
import { withInstall } from '@zi-shui/utils/with-install'

const Button = withInstall(_Button)

export default Button
export type { ButtonProps } from './src/button'

declare module 'vue' {
  export interface GlobalComponents {
    //接口可以自动合并
    ZButton: typeof Button
  }
}
