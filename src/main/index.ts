import { app, shell, BrowserWindow, Tray, Menu, autoUpdater } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 225,
    show: false,
    frame: false,
    resizable: false,
    center: true,
    fullscreenable: false,
    skipTaskbar: true, //不在任务栏显示
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.showInactive()
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
function setTray() {
  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('倒计时')
  tray.setContextMenu(contextMenu)
}
autoUpdater.setFeedURL({
  url: 'https://update.electronjs.org/OWNER/REPO/${process.platform}/${app.getVersion()}'
})
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  setTray()
  autoUpdater.checkForUpdates()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
/**
 * 开机自启
 */
app.setLoginItemSettings({
  openAtLogin: true
})
