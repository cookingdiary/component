<template>
    <button :class="[
        bem.b(),
        bem.m(type),
        bem.m(size),
        bem.is('round',round),
        bem.is('loading',loading),
        bem.is('disabled',disabled),                
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="emitClick"
    @mousedown="emitMouseDown"
    >
    <template v-if="iconPlacement==='left'">
        <template v-if="!loading">
            <Component :is="slots.icon"></Component>
        </template>
    </template>
    <slot></slot>
    <template v-if="iconPlacement==='right'"></template>
    </button>
</template>
<script lang="ts" setup>
import { createNameSpace } from '@zi-shui/utils/create';
import { buttonEmits, buttonProps } from './button';
import { useSlots } from 'vue';


const bem = createNameSpace('button')
defineOptions({
    name: 'z-button',
    inheritAttrs:false //绑定属性的继承
})
const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmits)
const slots = useSlots()
const emitClick = (e:MouseEvent)=>{
    emit('click',e)
}
const emitMouseDown = (e:MouseEvent)=>{
    emit('mousedown',e)
}
</script>