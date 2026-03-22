<script lang="ts" setup>
import { AddCircle } from '@vicons/ionicons5'
import type { TreeOption } from '@zi-shui/components/tree'
import { reactive, ref, type DefineComponent } from 'vue'
import type { Key } from '@zi-shui/components/tree'
import type { FormInstance } from '@zi-shui/components/form'

const formRef = ref<FormInstance>()

//可以绑定点击事件触发
const validateForm = () => {
  const form = formRef.value
  form?.validate((valid, errors) => {
    console.log(valid, errors)
  })
}

function createData(level = 4, parentKey = ''): any {
  if (!level) return []
  const arr = new Array(20 - level).fill(0)
  return arr.map((_, idx: number) => {
    const key = parentKey + level + idx
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    }
  })
}

function createLabel(levle: number): string {
  if (levle == 4) return '道生1'
  if (levle == 3) return '1-2'
  if (levle == 2) return '2-3'
  if (levle == 1) return '3-4'
  return ''
}
// function createData() {
//   return [
//     {
//       label: nextLabel(),
//       key: 1,
//       isLeaf: false
//     },
//     {
//       label: nextLabel(),
//       key: 2,
//       isLeaf: false
//     }
//   ]
// }
function nextLabel(currentLabel?: string | number): string {
  if (!currentLabel) return 'out of Tao,one is born'
  if (currentLabel === 'out of Tao,one is born') return 'out of one,two'
  if (currentLabel === 'out of one,two') return 'out of two,three'
  if (currentLabel === 'out of two,three')
    return 'out of three,the created universe'
  if (currentLabel === 'out of three,the created universe')
    return 'out of tao,one is born'
  return ''
}
const data = ref(createData())
// const data = ref<TreeOption[]>([
//   {
//     key:0,
//     label:0,
//     children:[
//       {
//         key:'0-0',
//         label:'0-0'
//       },
//       {
//         disabled:true,
//         key: '0-1',
//         label: '0-1',
//         children:[
//           {
//             key: '0-1-0',
//             label: '0-1-0'
//           },
//           {
//             key: '0-1-1',
//             label: '0-1-1'
//           }
//         ]
//       }
//     ]
//   }
// ])
console.log('data', data.value)

const handleLoad = (node: TreeOption) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 1000)
  })
}

const value = ref<Key[]>(['40', '41'])

const check = ref(true)
const handleChange = (val: boolean) => {}
const handleFocus = (e: FocusEvent) => {
  console.log(e)
}
const handleBlur = (e: FocusEvent) => {
  console.log(e)
}
const userName = ref()

const state = reactive({ username: '', password: '' })

let itemData = [{ id: 1, name: 'js', desc: 'toto', index: 1 }]

interface DataType {
  id: number
  name: string
  desc: string
  index: number
}
const itemsData: Array<DataType> = []
let index = 0
const totalCount = 20
while (index++ !== totalCount) {
  itemsData.push({
    id: index,
    name: `name-${index}`,
    desc: `desc-${index}-${index}`,
    index
  })
}
// const items = ref(itemData)
</script>

<template>
  <!-- <Icon :color="" :size=""/> -->
  <!-- <z-icon :color="'red'" :size="40">
    <AddCircle />
  </z-icon>
  <z-icon :color="'yellow'" :size="40">
    <AddCircle />
  </z-icon> -->

  <z-tree :data="data" :on-load="handleLoad" v-model:selected-keys="value" selectable :show-checkbox="true" :default-checked-keys="['40','41']">
    <template #default="{node}"> 
      {{ node.key }} - {{ node.label }}
    </template>
  </z-tree>

  <!-- {{ check }}
  <z-checkbox v-model="check" :disabled="true" :indeterminate="true" label="节点" @change="handleChange"/> -->

  <!-- <z-button size="medium" type="danger" :round="true">按钮</z-button> -->

  <!-- <z-input
    v-model="userName"
    @focus="handleFocus"
    @blur="handleBlur"
    placeholder="请输入密码"
    :show-password="true"
  >
    <template #prepend>珠峰</template>
    <template #prefixIcon></template>
    <template #sufixIcon></template>
    <template #append>珠峰</template>
  </z-input> -->

  <!-- <z-form
    :module="state"
    :rules="{
      username: {
        min: 6,
        max: 10,
        message: '用户名6-10位',
        trigger: ['change', 'blur']
      }
    }"
  >
    <z-form-item
      prop="username"
      :rules="[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
          min: 6,
          max: 10,
          message: '用户名至少6-10位',
          trigger: ['change', 'blur']
        }
      ]"
    >
      <z-input placeholder="请输入用户名" v-model="state.username"></z-input>
      <template #label>用户名</template>
    </z-form-item>
  </z-form>
  <z-virtua-scroll-list
    class="virtual-list"
    :data-source="items"
    data-key="id"
    :keeps="30"
    :estimate-size="80"
    :dataComponent="(Item as DefineComponent<{},{},any>)"
  ></z-virtua-scroll-list> -->
</template>
