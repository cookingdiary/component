import { ExtractPropTypes, PropType } from "vue"

type Key = string | number
export interface TreeOption{
    label?:Key,
    key?:Key,
    children?: TreeOption[],
    [key:string] : unknown, //任意的接口
    isLeaf:boolean
}
export interface TreeNode extends Required<TreeOption>{
    level:number,
    rawNode:TreeOption,
    children: TreeNode[],
    isLeaf: boolean
}
export const treeProps = {
    data:{
        type:Array as PropType<TreeOption[]>,
        default: ()=>[],
    },
    defaultExpandedKeys:{
        type:Array as PropType<Key []>,
        default:()=>[]
    },
    labelField:{
        type:String,
        default: 'label',
    },
    keyField:{
        type: String,
        default: 'key'
    },
    childrenField:{
        type:String,
        default:'children',
    },

} as const

export type TreeProps = Partial< ExtractPropTypes<typeof treeProps>>