import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create app user data directory if it doesn't exist
const USER_DATA_PATH = path.join(app.getPath('userData'), 'amintiri')
const PHOTOS_PATH = path.join(USER_DATA_PATH, 'photos')
const PHOTOS_METADATA_FILE = path.join(USER_DATA_PATH, 'photos.json')

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

function createWindow() {
  // Ensure our app directories exist
  ensureDirectoryExists(USER_DATA_PATH)
  ensureDirectoryExists(PHOTOS_PATH)

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.resolve(__dirname, '../public/assets/pngwing.com-large.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    // Open DevTools in development
    win.webContents.openDevTools()
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// Setup IPC handlers for photo storage
function setupIpcHandlers() {
  // Get all photos metadata
  ipcMain.handle('get-photos', async () => {
    try {
      if (fs.existsSync(PHOTOS_METADATA_FILE)) {
        const data = fs.readFileSync(PHOTOS_METADATA_FILE, 'utf8')
        return JSON.parse(data)
      }
      return []
    } catch (error) {
      console.error('Error reading photos metadata:', error)
      return []
    }
  })

  // Save photos metadata
  ipcMain.handle('save-photos-metadata', async (_, photosMetadata) => {
    try {
      fs.writeFileSync(PHOTOS_METADATA_FILE, JSON.stringify(photosMetadata, null, 2))
      return true
    } catch (error) {
      console.error('Error saving photos metadata:', error)
      return false
    }
  })

  // Save a photo to disk
  ipcMain.handle('save-photo', async (_, { id, dataUrl }) => {
    try {
      // Extract the base64 data (remove the data:image/xxx;base64, part)
      const base64Data = dataUrl.split(',')[1]
      const photoPath = path.join(PHOTOS_PATH, `${id}.jpg`)
      
      // Write the file
      fs.writeFileSync(photoPath, Buffer.from(base64Data, 'base64'))
      
      // Return the file path that can be used in the renderer
      return `file://${photoPath}`
    } catch (error) {
      console.error('Error saving photo:', error)
      throw error
    }
  })

  // Delete a photo from disk
  ipcMain.handle('delete-photo', async (_, id) => {
    try {
      const photoPath = path.join(PHOTOS_PATH, `${id}.jpg`)
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath)
      }
      return true
    } catch (error) {
      console.error('Error deleting photo:', error)
      throw error
    }
  })
}

app.whenReady().then(() => {
  setupIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 