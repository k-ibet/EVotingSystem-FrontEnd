import React from "react";
const Authenticate = require('./components/Authentication').default

const App = () => {
    return (
        <>
            <h1>Hello world! I am using React</h1>
            {/* <h2>This is an added text, it should live reload</h2> */}
            <button
                onClick={_ => electronAPI.notificationApi.sendNotification('Hi there!')}
            >Notify</button>

            <Authenticate />
        </>
    )
}

export default App