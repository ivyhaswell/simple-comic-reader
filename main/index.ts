import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import path from 'path'

app.whenReady().then(() => {
    listen_ipc()
    create_window()
})

function listen_ipc(){
  ipcMain.handle('open-folder', async e => {
    const res = await dialog.showOpenDialog(BrowserWindow.fromWebContents(e.sender) as BrowserWindow, {
      title:'选择文件夹',
      properties: ['openDirectory']
    })
    return res
  })
}

function create_window(){
  const window = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  window.loadFile(path.resolve(__dirname, '../client/index.html'))
}