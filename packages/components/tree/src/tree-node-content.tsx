import { defineComponent,inject,ref, toRef } from "vue";
import { treeInjectKey,treeNodeContextProps} from "./tree";

export default defineComponent({
    name:'ZTreeNodeContent',
    props:treeNodeContextProps,
    setup(props){
        const treeContext = inject(treeInjectKey)
        const node = toRef(props,'node')
        return ()=>{
            return treeContext?.slots.default ? treeContext?.slots.default({node: node.value}) : node.value!.label
        }
    }
})