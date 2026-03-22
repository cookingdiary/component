<template>
  <div @click="handleClick">
    <input type="text" ref="inputRef" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const inputRef = ref<HTMLInputElement>()

function upload(file:UploadRawFile){
    

}
const handleChange = (e:Event)=>{
    const files = (e.target as HTMLInputElement).files!
    for(let i = 0; i< files.length;i++){
        const rawFile = files[i]
        rawFile.uid = i
        upload(rawFile)


    }

}
const handleClick = () => {
  inputRef.value!.click() //点击上传文件
}

</script>
