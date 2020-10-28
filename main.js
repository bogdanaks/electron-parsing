const { app, BrowserWindow, ipcMain } = require('electron')
const { foo } = require('./parser.js')
const fetch = require('node-fetch')
const fs = require('fs')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('asynchronous-message', async (event, arg) => {
    let res = await foo(arg.tag, arg.page1, arg.page2)
    console.log(res.length)
    res.forEach((imgUrl, index) => {
        download(imgUrl, imgUrl.split('/')[imgUrl.split('/').length - 2])
        event.sender.send('asynchronous-reply', index + 1)
    })
})

async function download(url, name) {
    const response = await fetch(url)
    const buffer = await response.buffer()
    fs.writeFile(`./images/${name}.png`, buffer, () => console.log('finished downloading!'))
}
