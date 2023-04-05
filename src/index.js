import React from 'react';
import { render } from 'react-dom';
import App from './App';


render(<App />, document.getElementById('root'));

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')

const btn1 = document.getElementById('btn1')
const filePathElement = document.getElementById('filePath')

const getBtn = document.getElementById('get')
const res = document.getElementById('response')

const streamNameInput = document.getElementById('stream-name')
const submitName = document.getElementById('create-stream-btn')

submitName.addEventListener('click', async () => {
    const name = streamNameInput.value;
    const reply = await window.electronAPI.setStreamName(name)
    if (reply == undefined) console.log(`the variable ${reply} is undefined or null`)
    console.log(reply);
    document.getElementById('txid').innerText = reply.toString()
})

getBtn.addEventListener('click', async ()=> {
    const ans = await window.electronAPI.getSample()
    res.innerText = ans
})

btn1.addEventListener('click', async () => {
    const filePath = await window.electronAPI.openFile()
    filePathElement.innerText = filePath
})

setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
})