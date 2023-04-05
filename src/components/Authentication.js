// This component autheticates the users
// The user inputs their ID no. 
// const useState = require('react')
import {useState} from 'react'
import React from 'react'
import "./styling/Authenticate.css"
import "./styling/global.css"
import { setHashCodeServices } from '../../services/Services'

const Authenticate = () => {
const [id, setId] = useState('');
const [ret, setRet] = useState('')


async function handleVerify(e) {
    e.preventDefault()
    try {
        const temp = await electronAPI.HashIndex.setHashIndex(id)
        setRet(temp)
        console.log(`index from main: ${temp}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}

return(
    <div id='auth-div-id'>
        <input id="idnum-input" name='IDNumber' value={id} onChange={e => setId(e.target.value)} type='text' placeholder='ID Number'/>

        <button id="verifyid-button" onClick={handleVerify}>Verify</button>
        <br></br>

        <p value={ret}>{ret}</p>
    </div>
)
}

export default Authenticate