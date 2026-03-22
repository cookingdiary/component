<template>
  <div
    :class="[
      bem.b(),
      bem.is('selected', isSelected),
      bem.is('disabled', node?.disabled || false)
    ]"
  >
    <div
      :class="[bem.e('content')]"
      :style="{ paddingLeft: `${node!.level * 16}px` }"
    >
      <span
        :class="[bem.e('expand-icon'), { expanded: expanded && !node?.isLeaf }, bem.is('leaf', node!.isLeaf)]"
        @click="handleExpand"
      >
        <z-icon size="20" color="pink">
          <Switcher></Switcher>
        </z-icon>
      </span>
      <z-checkbox
        v-if="showCheckBox"
        :model-value="checked"
        :indeterminate="indeterminate"
        @change="handelChange"
      ></z-checkbox>
      <span @click="handleSelected" :class="bem.e('label')">
        <ZTreeNodeContent :node="node"></ZTreeNodeContent>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Switcher from './icon/Switcher'
import ZIcon from '@zi-shui/components/icon'
import { createNameSpace } from '@zi-shui/utils/create'
import { TreeNode, treeNodeEmits, treeNodeProps } from './tree'
import ZCheckBox from '@zi-shui/components/checkbox'
import { computed } from 'vue'
import ZTreeNodeContent from './tree-node-content'
const bem = createNameSpace('tree-node')
const props = defineProps(treeNodeProps)
const emit = defineEmits(treeNodeEmits)

function handleExpand() {
  console.log('click')

  if (props.node) {
    emit('toggle', props.node)
  }
}

const isLoading = computed(() => {
  //这里是展示loadig图标
  props.loadingKeys!.has(props.node!.key)
})

const isSelected = computed(() => {
  return props.selectedKeys.includes(props.node!.key)
})
function handleSelected() {
  if (props.node?.disabled) {
    return
  }
  if (props.node) {
    emit('select', props.node)
  }
}
function handelChange(val: boolean) {
  emit('check', props.node!, val)
}
</script>
