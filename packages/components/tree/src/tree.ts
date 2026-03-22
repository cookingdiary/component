import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue'

export type Key = string | number
export interface TreeOption {
  label?: Key
  key?: Key
  disabled?: boolean
  children?: TreeOption[]
  [key: string]: unknown //任意的接口
  isLeaf?: boolean
}
export interface TreeNode extends Required<TreeOption> {
  level: number
  rawNode: TreeOption
  children: TreeNode[]
  isLeaf: boolean
  parentKey: Key | undefined
}
export const treeProps = {
  data: {
    type: Array as PropType<TreeOption[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  onLoad: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>,
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: true
  },
  selectable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  defaultCheckedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  }
} as const

export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  },
  expanded: {
    type: Boolean,
    required: true
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>,
    required: true
  },
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  showCheckBox: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  checked: {
    type: Boolean
  }
}

export const treeNodeEmits = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node,
  check:(node:TreeNode,val:boolean) =>typeof val === 'boolean'
}
export const treeEmits = {
  'update:selectedKeys': (keys: Key[]) => keys
}

export type TreeProps = Partial<ExtractPropTypes<typeof treeProps>>
export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>

export interface TreeContext {
  slots: SetupContext['slots']
  // emit:SetupContext['emit']
}
export const treeInjectKey: InjectionKey<TreeContext> = Symbol()
export const treeNodeContextProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  }
}
