import {app, BrowserWindow} from 'electron'
import path from 'path'

app.whenReady().then(() => {
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })

  window.loadFile(path.resolve(__dirname, '../client/index.html'))
})