<template>
    <i :class="bem.b()">
        <slot></slot>
    </i>
</template>
<script setup lang="ts">
import { createNameSpace } from '@zi-shui/utils/create'
import { iconProps } from './icon'

const bem = createNameSpace('icon')

const props = defineProps(iconProps)

//计算属性 来计算一个样式来处理
</script>