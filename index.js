const electron = require('electron')
const { BrowserWindow, ipcMain: ipc } = electron
const { join: pathJoin } = require('path')

const draggableFile = async (file, { title }) => {
  const { bounds } = electron.screen.getPrimaryDisplay()
  const height = 200
  const width = 300
  let win = new BrowserWindow({
    width,
    height,
    x: bounds.width / 2 + bounds.width / 4 - width / 2,
    y: bounds.width.height / 2 - height / 2,
    alwaysOnTop: true,
    acceptFirstMouse: true,
    // frame: false,
    enableLargerThanScreen: true,
    movable: true,
    title,
    resizable: true,
    backgroundColor: 'black',
    show: false,
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  win.loadURL(`file://${__dirname}/index.html#${encodeURIComponent(file)}`)

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    win = null
  })

  ipc.once('size', (event, { width, height }) => {
    const padding = 15
    win.setSize(width, height + padding, true)
  })

  ipc.on('ondragstart', event => {
    win.capturePage(icon => {
      win.close()
      event.sender.startDrag({
        file,
        icon,
      })
    })
  })
}

const action = async context => {
  const file = await context.filePath()
  const title = context.defaultFileName
  draggableFile(file, { title })
}

const draggable = {
  title: 'Drag and Drop',
  formats: ['gif', 'mp4', 'webm', 'apng'],
  action,
}
exports.action = action
exports.shareServices = [draggable]
