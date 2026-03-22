import { withInstall } from '@zi-shui/utils/with-install'
import _Tree from './src/tree.vue'

const Tree = withInstall(_Tree)
export default Tree

declare module 'vue'{
    export interface GlobalComponents{
        Ztree: typeof Tree
    }
} //模块增强 解决 Volar 的识别问题，还能让组件的 Props 校验从脚本层延伸到模板层。”
export * from './src/tree'