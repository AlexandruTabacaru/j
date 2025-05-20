import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    invoke: (channel, data) => {
      // List of allowed channels to invoke
      const validChannels = [
        'get-photos',
        'save-photos-metadata',
        'save-photo',
        'delete-photo'
      ]
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data)
      }
      
      throw new Error(`Unauthorized IPC channel: ${channel}`)
    }
  }
) 