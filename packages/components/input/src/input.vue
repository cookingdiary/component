<template>
  <div :class="[bem.b()]">
    <div :class="bem.e('group')">
      <div v-if="slots.prepend" :class="bem.be('group', 'prepend')">
        <slot name="prepend"></slot>
      </div>
      <div :class="[bem.e('wrapper')]">
        <span v-if="slots.prefixIcon" :class="[bem.e('prefix')]">
          <slot name="prefixIcon"></slot>
        </span>
        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password'):type"
          v-bind="attrs"
          :class="[bem.e('inner')]"
          ref="input"
          @input="handleInput"
          @change="handleChange"
          @focus="handleFocus"
          @blur="handleBlur"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
        />

        <span v-if="slots.sufixIcon" :class="[bem.e('suffix')]">
          <slot name="sufixIcon"></slot>          
        </span>
        <z-icon v-if="showPwdVisible" @click="handlePasswordVisible">e</z-icon>
        <z-icon v-if="clearVisible" @click="clearInput">x</z-icon>
      </div>
      <div v-if="slots.append" :class="bem.be('group', 'append')">
        <slot name="prepend"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { createNameSpace } from '@zi-shui/utils/create'
import { inputProps, inputEmits } from './input'
import { useAttrs, useSlots, watch, ref, onMounted, nextTick,computed, inject } from 'vue'
import { formItemContextKey } from '../../form/src/form-item'

defineOptions({
  name: 'z-input'
})
const bem = createNameSpace('input')
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)
const slots = useSlots()
const attrs = useAttrs()

const formItemContext = inject(formItemContextKey)

const input = ref<HTMLInputElement | null>(null)
const setNativeInputValue = () => {
  const inputEle = input.value
  if (!inputEle) return
  inputEle.value = String(props.modelValue)
}
watch(
  () => props.modelValue,
  () => {
    formItemContext?.validate('change').catch(()=>{})
    setNativeInputValue()
  }
)

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('input', value)
  emit('update:modelValue', value)
}
const handleChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('change', value)
}
const handleFocus = (e: FocusEvent) => {
  emit('focus', e)
}
const handleBlur = (e: FocusEvent) => {  
  formItemContext?.validate('blur').catch(()=>{})
  emit('blur', e)
}
const focus = async()=>{
  await nextTick();
  input.value?.focus()
}
const passwordVisible = ref(false)
const handlePasswordVisible=()=>{
  passwordVisible.value = !passwordVisible.value
  focus()
}
const showPwdVisible = computed(()=>{
  return props.modelValue && props.showPassword && !props.disabled && !props.readonly

})
const clearVisible = computed(()=>{
  return props.modelValue && !props.disabled && !props.readonly

})
const clearInput = ()=>{
  emit('input','')
  emit('update:modelValue','')
  emit('clear')
  focus()

}
onMounted(() => {
  setNativeInputValue()
})
</script>
