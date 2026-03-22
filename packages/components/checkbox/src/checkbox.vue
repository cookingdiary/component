<template>
    <label :class="bem.b()">
        <span :class="bem.e('input')">
            <input type="checkbox" v-model="model" ref="inputRef" :disabled="disabled" :value="label" @change="handleChange"/>
        </span>

        <span v-if="$slots.default || label" :class="bem.b('label')">
            <slot></slot>
            <template v-if="!$slots.default">{{ label }}</template>
        </span>

    </label>
</template>
<script lang="ts" setup>
import { computed, watch,ref, onMounted } from 'vue'
import { createNameSpace } from '@zi-shui/utils/create';
import { checkboxEmits, checkboxProps } from './checkbox';


const bem = createNameSpace('checkbox')
const props = defineProps(checkboxProps)
const emit = defineEmits(checkboxEmits)
const inputRef = ref<HTMLInputElement>()

defineOptions({
    name: 'z-checkbox'
})
function interminate(val:boolean){
    inputRef.value!.indeterminate = val
}
function handleChange(e:Event){
    const target = e.target as HTMLInputElement
    const value = target.checked ? true : false
    emit('change',value)
}
watch(()=>props.indeterminate,interminate)
const model = computed({
    get(){
        return props.modelValue
    },
    set(val:string| number| boolean){
        emit('update:modelValue',val)        
    }
})
onMounted(()=>{
    interminate(props.indeterminate)
})
</script>