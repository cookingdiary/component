
export function httpRequest(options:RequestOptions){
    const xhr = new XMLHttpRequest()
    const action = options.action

    xhr.open(options.method,action,true)
    xhr.upload.addEventListener('progress',e=>{
        const processEvents = e as UploadProgressEvent
        processEvents.pecentange = e.total > 0 ? (e.loaded/e.total) * 100 : 0
        options.onProgress(processEvents)
    })

    const headers = options.headers
    if(headers){
        for(const [key,value] of Object.entries(options.data)){
            xhr.setRequestHeader(key,value)

        }
    }

    const formData = new FormData()
    if(options.data){
        for(const [key,value] of Object.entries(options.data)){
            formData.append(key,value)
        }
    }
    formData.append(options.name,options.file)
}