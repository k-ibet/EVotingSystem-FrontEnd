// This module talks with the renderer process; exposes functions from
// the main module process using namespaces e.g. dialog:openFile, setTitle etc
// to the renderer.js file

//renderer process
const { contextBridge, ipcRenderer } = require('electron')

// contextBridge: exposes functions from main.js
contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getSample: () => ipcRenderer.invoke('getReq:responseFnc'),
    setStreamName: (stream_name) => ipcRenderer.invoke('set:create-stream', stream_name),
    notificationApi:{sendNotification(message){ipcRenderer.send('notify', message)}},
    HashIndex: {setHashIndex(key){return ipcRenderer.invoke('set-index',key)}, getHashIndexBy(key){return ipcRenderer.invoke('get-index',key)}}
})

//loads content in this script before
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if(element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']){
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})