
import {def, isString} from '@vue/shared'
import { Exception } from 'sass'
import { ExtractPropTypes, PropType } from 'vue'

export const inputProps = {
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: [Number, String] as PropType<string | number>,
    default: ''
  },
  placeholder: {
    type: String
  },
  clearable: {
    type: Boolean
  },
  showPassword: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  label:{
    type:String
  }
} as const 

export const inputEmits = {
  'update:modelValue': (value: string) => isString(value),
  input: (value: string) => isString(value),
  change: (value: string) => isString(value),
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear:()=>true
}
export type InputProps = ExtractPropTypes<typeof inputProps>
export type InputEmits = typeof inputEmits