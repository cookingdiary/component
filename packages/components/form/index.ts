//整合导出组件
import _FormItem from './src/form-item.vue'
import _Form from './src/form.vue'
import { withInstall } from '@zi-shui/utils/with-install'

const FormItem = withInstall(_FormItem)
const Form = withInstall(_Form)
console.log(FormItem)

export { Form, FormItem }
export default {}
// export * from './src/form-item'
export type { FormItemProps} from './src/form-item'
export type { FormProps } from './src/form'

export type FormInstance = InstanceType<typeof Form>
declare module 'vue' {
  export interface GlobalComponents {
    //接口可以自动合并
    ZFormItem: typeof FormItem,
    ZForm: typeof Form
  }
}
