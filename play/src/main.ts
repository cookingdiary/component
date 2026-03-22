import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import Icon from '@zi-shui/components/icon'
import Tree from '@zi-shui/components/tree'
import Checkbox from '@zi-shui/components/checkbox'
import Button from '@zi-shui/components/button'
import Input from '@zi-shui/components/input'
import {FormItem,  Form } from '@zi-shui/components/form'
import Virtual from '@zi-shui/components/virtual-scroll-list'
import '@zi-shui/theme-chalk/src/index.scss'

const plugins = [
    Icon,
    Tree,
    Checkbox,
    Button,
    Input,
    FormItem,
    Form,
    Virtual
]
const app = createApp(App)
plugins.forEach(plugin => app.use(plugin));

// createApp(App).mount( '#ap p') 
app.mount('#app')   