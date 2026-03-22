<template>
  <div
    :class="[
      bem.b(),
      bem.is('success', validateState == 'success'),
      bem.is('error', validateState == 'error')
    ]"
  >
    <label :class="bem.e('label')"
      ><slot name="label">{{ label }}</slot></label
    >
    <div :class="bem.e('content')">
      <slot></slot>
      <div :class="bem.e('error')">
        <slot name="error">{{ validateMessage }}</slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { createNameSpace } from '@zi-shui/utils/create'
import { provide, ref, computed, inject, onMounted } from 'vue'
import {
  Arrayable,
  FormItemContext,
  formItemContextKey,
  formItemProps,
  FormItemRule,
  FormItemValidateState
} from './form-item'
import { FormContextKey } from './form'
import AsyncValdaitor, { Values } from 'async-validator'

const bem = createNameSpace('form-tiem')
const props = defineProps(formItemProps)

defineOptions({
  name: 'z-form-item'
})

const validateState = ref<FormItemValidateState>('')
const validateMessage = ref('')

const formContext = inject(FormContextKey)
console.log('key', formContext)

const converArray = (rules: Arrayable<FormItemRule> | undefined):FormItemRule[] => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

const _rules = computed(() => {
  const myRules: FormItemRule[] = converArray(props.rules)

  const formRules = formContext?.rules
  if(formRules && props.prop){
    const _temp = formRules[props.prop]
    if(_temp){
      myRules.push(...converArray(_temp))
    }
  }
  return myRules
})

const getRuleFiltered = (trigger: string) => {
  const rules = _rules.value
  console.log(_rules.value, trigger)

  return rules.filter(rule => {
    if (!rule.trigger || !trigger) return rule
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger)
    } else {
      return rule.trigger === trigger
    }
  })
}
const onValidationSuccessed = ()=>{
  validateState.value = 'success'
  validateMessage.value = ''

}
const onValidationFailed = (error:Values)=>{
  console.log(error);
  
  validateState.value = 'error'
  const {errors} = error
  validateMessage.value = errors?errors[0].message : ''

}
const validate: FormItemContext['validate'] = async (
  trigger: string,
  callback?
) => {
  const rules = getRuleFiltered(trigger)
  console.log('trigger', trigger, rules)
  const modelName = props.prop!
  const validator = new AsyncValdaitor({
    [modelName] : rules
  })
  const model = formContext?.module!
  return validator
  .validate({
    [modelName]: model[modelName]
  })
  .then(()=>{
    console.log('成功');  
    onValidationSuccessed()  
  })
  .catch((err)=>{
    console.log('失败');
    onValidationFailed(err)
    return Promise.reject(err)
    
  })
}
const context: FormItemContext = {
  ...props,
  validate
}

provide(formItemContextKey, context)
onMounted(()=>{
  formContext?.addField(context) //上下文传递
})
</script>
