const electron = require('electron')
const { BrowserWindow, ipcMain: ipc } = electron
const { join: pathJoin } = require('path')

const draggableFile = async (gifPath) => {
  const { bounds } = electron.screen.getPrimaryDisplay()
  const height = 200
  const width = 300
  let win = new BrowserWindow({
    width,
    height,
    x: ((bounds.width / 2) + (bounds.width / 4)) - (width / 2),
    y: (bounds.width.height / 2) - (height / 2),
    alwaysOnTop: true,
    acceptFirstMouse: true,
    frame: false,
    enableLargerThanScreen: true,
    movable: true,
    resizable: false
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => {
    win = null
  })

  ipc.once('ondragstart', (event) => {
    event.sender.startDrag({
      file: gifPath,
      icon: pathJoin(__dirname, 'gif.png')
    })
    win.close()
  })
}

const action = async context => {
  if (context.format !== 'gif') throw new Error('Only supports gif')
  const file = await context.filePath()
  draggableFile(file)
}

const draggable = {
  title: 'Drag and Drop',
  formats: ['gif'],
  action
}

exports.shareServices = [draggable]
