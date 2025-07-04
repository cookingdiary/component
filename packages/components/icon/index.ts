//整合导出组件
import { Plugin } from 'vue'
import _Icon from './src/icon.vue'

export type SFCWithInstall<T> = T & Plugin
export function withInstall<T>(comp:T){
    (comp as SFCWithInstall<T>).install = function(app){
        const { name } = comp as unknown as {name:string}
        app.component(name,comp)
    }
    return comp as SFCWithInstall<T>
}
const Icon = withInstall(_Icon)

export default Icon


export * from './src/icon'
