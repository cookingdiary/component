<script lang="ts" setup>
import { AddCircle } from '@vicons/ionicons5'
import {ref} from 'vue'

function createData(level= 4,parentKey = ''):any{
  if(!level)return []
  const arr = new Array(6-level).fill(0)
  return arr.map((_,idx:number)=>{
    const key = parentKey + level + idx;
    return {
      label:createLabel(level),
      key,
      children:createData(level-1,key)
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
const data = ref(createData())
</script>

<template>
  <!-- <Icon :color="" :size=""/> -->
  <z-icon :color="'red'" :size="40">
    <AddCircle />
  </z-icon>
  <z-icon :color="'yellow'" :size="40">
    <AddCircle />
  </z-icon>

  <z-tree :data="data" label-field="label" key-field="key" children-field="children" :default-expanded-keys="['40','41']"></z-tree>
</template>

<style scoped></style>
