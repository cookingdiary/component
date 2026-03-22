<template>
  <div :class="bem.b()">
    <z-virtual-list :items="flattenTree" :remain="8" :size="35">
      <template #default="{ node }">
        <z-tree-node
          :key="node.key"
          :node="node"
          :expanded="isExpanded(node)"
          :loadingKeys="loadingKeysRef"
          @toggle="toggleExpand"
          :selectedKeys="selectKeysRef"
          @select="handleSelect"
          :show-check-box="showCheckbox"
          :checked="isChecked(node)"
          :disabled="isDisabled(node)"
          :indeterminate="indeterminate(node)"
          @check="toggleCheck"
        ></z-tree-node>
      </template>
    </z-virtual-list>
  </div>
</template>

<script setup lang="ts">
import { createNameSpace } from '@zi-shui/utils/create'
import {
  treeProps,
  TreeNode,
  TreeOption,
  Key,
  treeEmits,
  treeInjectKey
} from './tree'
import { computed, onMounted, provide, ref, useSlots, watch } from 'vue'
import ZTreeNode from './treeNode.vue'
import ZVirtualList from '@zi-shui/components/virtual-list'

defineOptions({
  name: 'z-tree'
})

const bem = createNameSpace('tree')

const props = defineProps(treeProps)

function createOptions(key: string, label: string, children: string) {
  return {
    getKey(node: TreeOption) {
      return node[key] as string
    },
    getLabel(node: TreeOption) {
      return node[label] as string
    },
    getChildren(node: TreeOption) {
      return node[children] as TreeOption[]
    }
  }
}
const TreeOptions = createOptions(
  props.keyField,
  props.labelField,
  props.childrenField
)
function createTree(data: TreeOption[], parent: TreeNode | null = null): any {
  function traversal(data: TreeOption[], parent: TreeNode | null = null) {
    return data.map(node => {
      const children = TreeOptions.getChildren(node) || []
      const treeNode: TreeNode = {
        key: TreeOptions.getKey(node),
        label: TreeOptions.getLabel(node),
        children: [],
        rawNode: node,
        disabled: !!node.disabled,
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? children.length == 0,
        parentKey: parent?.key
      }
      if (children.length > 0) {
        treeNode.children = traversal(children, treeNode)
      }
      return treeNode
    })
  }

  const result: TreeNode[] = traversal(data, parent)
  return result
}
const tree = ref<TreeNode[]>([])

watch(
  () => props.data,
  (data: TreeOption[]) => {
    tree.value = createTree(data)
    console.log(tree.value)
  },
  { immediate: true }
)

const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))
console.log(props.defaultExpandedKeys)

const flattenTree = computed(() => {
  const expandedKeys = expandedKeysSet.value

  const flattenNodes: TreeNode[] = [] //拍平结果

  console.log('tree',tree.value);
  
  const nodes = tree.value || []
  const stack: TreeNode[] = []

  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i])
  }

  while (stack.length) {
    const node = stack.pop()
    if (!node) continue
    flattenNodes.push(node)
    if (expandedKeys.has(node.key)) {
      const children = node.children
      if (children) {
        for (let i = node.children.length - 1; i >= 0; --i) {
          stack.push(node.children[i])
        }
      }
    }
  }
  return flattenNodes
})

function isExpanded(node: TreeNode): boolean {
  return expandedKeysSet.value.has(node.key)
}

function collpase(node: TreeNode) {
  expandedKeysSet.value.delete(node.key)
}

const loadingKeysRef = ref(new Set<Key>())
function triggerLoading(node: TreeNode) {
  if (!node.children.length && !node.isLeaf) {
    const loadingKeys = loadingKeysRef.value
    if (!loadingKeys.has(node.key)) {
      loadingKeys.add(node.key)
      const onLoad = props.onLoad
      if (onLoad) {
        onLoad(node.rawNode).then(children => {
          node.rawNode.children = children
          node.children = createTree(children, node)
          loadingKeys.delete(node.key)
        })
      }
    }
  }
}

function expand(node: TreeNode) {
  expandedKeysSet.value.add(node.key)
  //实现加载逻辑
  triggerLoading(node)
}

function toggleExpand(node: TreeNode) {
  const expandKeys = expandedKeysSet.value
  if (expandKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collpase(node)
  } else {
    expand(node)
  }
}

const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))
function isChecked(node:TreeNode){
  return checkedKeysRefs.value.has(node.key)
}
function isDisabled(node:TreeNode){
  return !!node.disabled
}
const indeterminateRefs = ref<Set<Key>>(new Set())
function indeterminate(node:TreeNode){
  return indeterminateRefs.value.has(node.key)
}
function findNode(key:Key){
  return flattenTree.value.find(node =>node.key === key)
}
function updateCheckedKeys(node:TreeNode){
  console.log(node);
   
  if(node.parentKey){
    const parentNode = findNode(node.parentKey)

    if(parentNode){

      let allChecked  = true 
      let hasChecked = false
      
      const nodes = parentNode.children
      for(const node of nodes){
        if(checkedKeysRefs.value.has(node.key)){
          hasChecked = true
        }else if(indeterminateRefs.value.has(node.key)){
          allChecked = false
          hasChecked = true
        }else{
          allChecked = false
        }
      }
      if(allChecked){ //如果全选中加上
        checkedKeysRefs.value.add(parentNode.key)
        indeterminateRefs.value.delete(parentNode.key)
      }else if(hasChecked){
        checkedKeysRefs.value.delete(parentNode.key)
        indeterminateRefs.value.add(parentNode.key)
      }
      updateCheckedKeys(parentNode)
    }
  }
}
function toggle(node:TreeNode,checked:boolean){
  if(!node)return
  const checkedKeys = checkedKeysRefs.value
  if(checked){
    indeterminateRefs.value.delete(node.key)
  }
  checkedKeys[checked ? 'add' : 'delete'](node.key)
  const children = node.children
  if(children){
    children.forEach(childNode=>{
      if(!childNode.disabled){
        toggle(childNode,checked)
      }
    })
  }
}
//实现选中
function toggleCheck(node:TreeNode,checked:boolean){
  toggle(node,checked) //自上而下

  updateCheckedKeys(node) //自下而上

}
onMounted(()=>{
  checkedKeysRefs.value.forEach((key:Key)=>{
    toggle(findNode(key)!,true)
  })
})

const emit = defineEmits(treeEmits)
const selectKeysRef = ref<Key[]>([])

watch(
  () => props.selectedKeys,
  value => {
    if (value) {
      selectKeysRef.value = value
    }
  },
  { immediate: true }
)

function handleSelect(node: TreeNode) {
  let keys = Array.from(selectKeysRef.value)
  if (!props.selectable) return
  if (props.multiple) {
    const index = keys.findIndex(key => key === node.key)
    if (index > -1) {
      keys.splice(index, 1)
    } else {
      keys.push(node.key)
    }
  } else {
    if (keys.includes(node.key)) {
      keys = []
    } else {
      keys = [node.key]
    }
  }
  emit('update:selectedKeys', keys)
}

provide(treeInjectKey, {
  slots: useSlots()
})
</script>
