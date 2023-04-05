// - control the main process which runs in a Node.js env
// and is responsible for:
// - controlling your app's lifecycle,
// - displaying native interfaces
// - performing priviledged operations
// - managing renderer processes
// 
// Each instance of the BrowserWindow class creates an application window that loads
// in a separate renderer process. You can interact with this web content from the
// main process using the window's webContents object

// When a BrowserWindow instance is destroyed, its corresponding renderer process gets terminated as well

// app - controls application's event lifecycle.
// BrowserWindow - module which creates and manages application windows.

// console.log(`Hello from Electron`)

const { app, BrowserWindow, dialog, ipcMain, netLog, Notification } = require ('electron')

const path = require('path');
const { setHashCodeServices } = require('../services/Services');

async function handleFileOpen() {
    const {cancelled, filePaths} = await dialog.showOpenDialog()
    if (cancelled) {
        return
    }else{
        return filePaths[0]
    }
}

const isDev = !app.isPackaged;

// console.log(path.join(__dirname, '../node_modules', '.bin', 'electron'))


function handleSetTitle (e,title) {
    const webContents = e.sender //the object that sent the request
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title) //sets new title to the active window
}

// sets and returns index in hashtable

// initializing the array
var hashtable = new Array(300) //300 - avg number of registered voters and votes cast at each polling station

async function handleSetIndex(e, key) {
    // console.log(`event: ${e}`)
    // console.log(hashtable.length)
    return new Promise((resolve, reject) => {
        try {
            const temp = setHashCodeServices(key, hashtable.length)
            resolve(temp)
        } catch (error) {
            reject(error)
        }
    })

}

function handleGetIndex(key){
    return 'handleGetIndex: Successful reply';
}

function setTime(e, time) {

}

app.whenReady().then(async () => {
    const { net } = require('electron')

    const p = await netLog.startLogging(path.join(__dirname, 'netlog.log'))

    const win = new BrowserWindow({
        width: 800,
        height: 1500,
        show: false,
        webPreferences: { //webPreferences used to process preloaded scripts before window is ready
            preload: path.join(__dirname, "../preload.js"),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: true
        }
    })
    win.loadFile(path.join(__dirname, "./index.html")) //after build, the index file will be located here?
    win.webContents.openDevTools()

    
    //splash screen
    const splash = new BrowserWindow({
        width: 500, 
        height: 300, 
        transparent: true, 
        frame: false, 
        alwaysOnTop: true 
    })
    splash.loadFile(path.join(__dirname, './splash.html'));
    splash.center();

    
    function simpleGet() {
        return new Promise((resolve, reject) => {
            const request = net.request({
                method: 'GET',
                protocol: 'http:',
                hostname: '127.0.0.1',
                port: 5037,
                path: '/getStreams',
                redirect: 'follow'
            })
            request.on('response', (response) => {
                console.log(`STATUS CODE: ${response.statusCode}`);
                response.on('data', chunk => {
                    // ans = chunk.toJSON();
                    console.log(`chunked data: ${chunk}`)
                    var res = chunk.toString()
                    console.log(JSON.parse(res))
                    resolve(JSON.parse(res)['raw'])
                })
                response.on('end', () => {
                    console.log('No more data in response');
                })
                response.on('error',(error) => {
                    reject(error)
                })
            })
            request.end()
        })



    }
    if (isDev) {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
        })
    }

    function handleCreateStream(streamName) {
        return new Promise((resolve, reject) => {
            const request = net.request({
                method: 'POST',
                protocol: 'http:',
                hostname: '127.0.0.1',
                port: 5037,
                path: `/createStream?name=${streamName}`,
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            request.on('response', (response) => {
                console.log(response.statusCode)
                response.on('data', (chunked) => {
                    chunked = chunked.toString()
                    console.log(JSON.parse(chunked))
                    resolve(JSON.parse(chunked)['result'])
                })
            })
            request.on('error', (error) => {
                console.log(`ERROR: ${JSON.stringify(error)}`)
                reject(error.message)
            });
            request.write(JSON.stringify({ "name": streamName }), 'utf-8');
            request.end();
        })
    }

    ipcMain.on('set-title',handleSetTitle)
    
    ipcMain.handle('getReq:responseFnc', simpleGet)

    ipcMain.handle('set-index', handleSetIndex)

    ipcMain.handle('get-index',handleGetIndex)

    ipcMain.on('notify', (_, message) => {
        new Notification({title:'Notify', body:message}).show();
    })

    ipcMain.handle('dialog:openFile', async(e,msg) => {
        return await handleFileOpen()
        .then((res) => {
            console.log(res.statusCode)
            return res
        })
        .catch((error) => {
            console.log(`handleFileOpenError: ${error}`)
        })
    })

    ipcMain.handle('set:create-stream', async(e, msg) => {
        return await handleCreateStream(msg)
        .then((data) => {
            console.log(`stream name: ${data}`)
            return data
        })
        .catch((error) => {
            console.log(`handle error: ${error}`)
        })
    })

    setTimeout(function(){
        splash.close()
        win.show()
    }, 5000);

    ipcMain.on('set-time', setTime)

    await netLog.stopLogging()
    console.log(`Net-logs written to ${p}`)
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) win
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') console.log('Closing application...'); app.quit()
})

// Each instance of the BrowserWindow class creates an application window that loadsa web page
// using a separate renderer process. Essentially, window and renderer processes are different.

// You can interact with this web content from the main process using the window's webContents
// object