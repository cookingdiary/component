<template>
    <form :class="bem.b()">
        <slot></slot>
    </form>
</template> 
<script lang="ts" setup>
import { createNameSpace } from '@zi-shui/utils/create';
import { FormContextKey, formProps } from './form';
import { provide } from 'vue';
import { FormItemContext } from './form-item';
import { FormContext } from './form';
import { Values } from 'async-validator';

const bem = createNameSpace('form')
defineOptions({
    name:'z-form'
})
const props = defineProps(formProps)

const validate = async (callback?:(valid:boolean,fields?:Values)=>void)=>{
    let errors:Values = {}
    for(const field of fields){
        try {
            await field.validate('')
        } catch (error) {
            errors = {
                ...errors,
                ...(error as Values).fields
            }            
        }
    }
    if(Object.keys(errors).length === 0){
        return callback?.(true);
    }else{
        if(callback){
            callback?.(false,errors)
        }else{
            return Promise.reject(errors)
        }                
    }
    
}
const fields : FormItemContext[] = []
const addField: FormContext['addField'] = context =>{
    fields.push(context)
}
const context = {
    ...props,
    addField
}
console.log('context',context);

provide(FormContextKey,context)
defineExpose({
    validate
})
</script>