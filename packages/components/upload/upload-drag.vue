<template>
    <div @dragover.prevent="onDragover" @dragleav.prevent="$event=>isOver = false" @drop.prevent="onDrop"></div>
    <slot></slot>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
const isOver = ref(false)

const onDrop = (e:DragEvent)=>{
    e.stopPropagation();
    console.log(e.dataTransfer!.files);
    
}
const onDragover = ()=>{
    isOver.value = true
}
</script>