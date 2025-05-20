import { useState, useEffect } from 'react'

const PhotoGallery = ({ onBack }) => {
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [newPhotoModal, setNewPhotoModal] = useState(false)
  const [newPhoto, setNewPhoto] = useState({
    url: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isElectron, setIsElectron] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState('')

  // Check if we're running in Electron
  useEffect(() => {
    setIsElectron(!!window.electron)
  }, [])

  // Load photos on component mount
  useEffect(() => {
    loadPhotos()
  }, [isElectron])

  // When opening modal, reset editing state
  useEffect(() => {
    if (selectedPhoto) {
      setIsEditingLabel(false)
      setEditedLabel(selectedPhoto.description || '')
    }
  }, [selectedPhoto])

  const loadPhotos = async () => {
    try {
      if (window.electron) {
        // Use Electron's IPC to get photos from the main process
        const savedPhotos = await window.electron.invoke('get-photos')
        if (savedPhotos && Array.isArray(savedPhotos)) {
          console.log('Loaded photos from Electron:', savedPhotos.length)
          setPhotos(savedPhotos)
        }
      } else {
        // Fallback to localStorage in browser environment
        const savedPhotos = localStorage.getItem('amintiriPhotos')
        if (savedPhotos) {
          const parsedPhotos = JSON.parse(savedPhotos)
          console.log('Loaded photos from localStorage:', parsedPhotos.length)
          setPhotos(parsedPhotos)
        }
      }
    } catch (error) {
      console.error('Failed to load photos', error)
    }
  }

  // Save photos whenever they change
  useEffect(() => {
    savePhotos()
  }, [photos, isElectron])

  const savePhotos = async () => {
    if (photos.length === 0) return

    try {
      if (window.electron) {
        // Save to Electron's file system
        await window.electron.invoke('save-photos-metadata', photos)
        console.log('Saved photos to Electron:', photos.length)
      } else {
        // Save to localStorage in browser environment
        localStorage.setItem('amintiriPhotos', JSON.stringify(photos))
        console.log('Saved photos to localStorage:', photos.length)
      }
    } catch (error) {
      console.error('Failed to save photos', error)
    }
  }

  const handleAddPhoto = async () => {
    if (!newPhoto.url) return
    
    setIsLoading(true)
    try {
      // Optimize the image before storing
      const optimizedImage = await optimizeImage(newPhoto.url, 1200)
      
      // Generate a unique ID
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      let finalUrl = optimizedImage
      
      // If running in Electron, save to file system
      if (window.electron) {
        finalUrl = await window.electron.invoke('save-photo', {
          id: photoId,
          dataUrl: optimizedImage
        })
        console.log('Saved photo to file system:', photoId)
      }
      
      // Create new photo object
      const newPhotoObj = { 
        id: photoId,
        url: finalUrl,
        description: newPhoto.description,
        timestamp: Date.now()
      }
      
      // Update state with the new photo
      setPhotos(prevPhotos => [...prevPhotos, newPhotoObj])
      
      // Reset form
      setNewPhoto({ url: '', description: '' })
      setNewPhotoModal(false)
    } catch (error) {
      console.error('Failed to add photo', error)
      alert('Failed to add photo. Please try again with a smaller image.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to optimize images before storing them
  const optimizeImage = (dataUrl, maxWidth) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        // Create canvas and resize image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Get the resized image as data URL with reduced quality
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = reject
      img.src = dataUrl
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 15 * 1024 * 1024) {
        alert('Image is too large. Please select an image under 15MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPhoto({ ...newPhoto, url: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = async (id) => {
    try {
      // If we're in Electron, delete the file from disk
      if (window.electron) {
        await window.electron.invoke('delete-photo', id)
        console.log('Deleted photo from disk:', id)
      }
      
      setPhotos(photos.filter(photo => photo.id !== id))
      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null)
      }
    } catch (error) {
      console.error('Failed to delete photo', error)
    }
  }

  const handleLabelSave = () => {
    if (!selectedPhoto) return
    const updatedPhotos = photos.map(photo =>
      photo.id === selectedPhoto.id ? { ...photo, description: editedLabel } : photo
    )
    setPhotos(updatedPhotos)
    setSelectedPhoto({ ...selectedPhoto, description: editedLabel })
    setIsEditingLabel(false)
  }

  return (
    <div className="relative w-full min-h-screen photo-gallery-bg text-fashion-black">
      <div className="p-8 pt-16 pb-20 h-screen overflow-hidden flex flex-col">
        <div className="flex items-center mb-8 relative min-h-[64px]">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-pink-400 hover:bg-pink-200 hover:text-pink-700 transition-colors duration-300 pink-btn absolute left-0"
            style={{ minWidth: '110px' }}
          >
            acas
          </button>
          <h1 className="title-fancy mx-auto text-center">Amintiri</h1>
          <button
            onClick={() => setNewPhotoModal(true)}
            className="px-4 py-2 pink-btn transition-colors duration-300 rounded-md flex items-center absolute right-0"
            style={{ minWidth: '140px' }}
          >
            <span className="text-xl mr-1">+</span> noua amintire :3
          </button>
        </div>

        {/* Photo Gallery Grid - with scrolling */}
        <div className="flex-1 overflow-y-auto pr-2 pb-4">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="polaroid-css-frame flex flex-col items-center aspect-[4/5] w-full max-w-[320px] cursor-pointer group relative bg-transparent"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative w-full h-full flex flex-col items-center justify-end">
                  <div className="w-full h-[82%] flex items-center justify-center rounded-t-[6px] overflow-hidden relative">
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="object-cover w-[88%] h-[92%] rounded shadow border-4 border-white border-b-[40px] border-solid"
                      style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.10)' }}
                    />
                    {photo.description && (
                      <div className="polaroid-label absolute left-0 w-full text-center text-base font-medium pointer-events-none" style={{ bottom: '18px' }}>
                        {photo.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {photos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-gray-400 mb-4">N-avem amintiri inca ?!</p>
              {!isElectron && (
                <p className="text-sm text-red-400">
                  Da i run din app ca sa se salveze amintirile
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-pink-500 bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-pink-200 text-2xl font-bold shadow z-20"
              title="Inchide"
            >
              ×
            </button>
            <button
              onClick={() => handleRemovePhoto(selectedPhoto.id)}
              className="absolute top-4 left-4 text-white bg-red-500 bg-opacity-70 px-3 py-1 rounded hover:bg-opacity-100 z-20"
            >
              Uita de ea
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.description}
              className="max-h-[80vh] max-w-full mx-auto mt-16"
            />
            <div className="bg-pink-50 bg-opacity-90 p-4 mt-2 flex flex-col items-center rounded-xl border border-pink-200 shadow">
              {isEditingLabel ? (
                <div className="w-full flex flex-col items-center">
                  <textarea
                    value={editedLabel}
                    onChange={e => setEditedLabel(e.target.value)}
                    className="w-full max-w-md p-2 border border-pink-200 bg-pink-50 text-pink-700 rounded resize-none h-16 polaroid-label text-center"
                    style={{ fontSize: '1.3em' }}
                    placeholder="Ii punem titlu?.."
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleLabelSave}
                      className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
                    >
                      Salveaza
                    </button>
                    <button
                      onClick={() => { setIsEditingLabel(false); setEditedLabel(selectedPhoto.description || '') }}
                      className="px-3 py-1 bg-pink-200 text-pink-700 rounded hover:bg-pink-300"
                    >
                      Renunta
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center mt-2 mb-6">
                  <p className="polaroid-label text-white text-center w-full" style={{ fontSize: '2.3em', marginBottom: '-1.5rem' }}>
                    {selectedPhoto.description || <span className="italic text-gray-700">(Ii punem titlu?..)</span>}
                  </p>
                  <button
                    onClick={() => setIsEditingLabel(true)}
                    className="ml-2 text-pink-500 bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center hover:bg-pink-200 text-lg font-bold shadow"
                    title="Editeaza nota"
                  >
                    ✎
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Photo Modal */}
      {newPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-90 border-2 border-pink-300 p-8 rounded-2xl max-w-md w-full shadow-xl flex flex-col items-center relative">
            <button
              onClick={() => setNewPhotoModal(false)}
              className="absolute top-4 right-4 text-pink-500 bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-pink-200 text-2xl font-bold shadow"
              title="Inchide"
            >
              ×
            </button>
            <h2 className="title-fancy mb-4 text-center">Adauga o amintire noua</h2>
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-2 text-pink-700">
                Poza (max 15MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-pink-200 bg-pink-50 rounded"
              />
              {newPhoto.url && (
                <div className="mt-2 h-40 overflow-hidden flex items-center justify-center bg-pink-100 rounded">
                  <img
                    src={newPhoto.url}
                    alt="Preview"
                    className="object-contain h-full mx-auto rounded"
                  />
                </div>
              )}
            </div>
            <div className="mb-6 w-full">
              <label className="block text-sm font-medium mb-2 text-pink-700">
                Titlu (optional)
              </label>
              <textarea
                value={newPhoto.description}
                onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                className="w-full p-2 border border-pink-200 bg-pink-50 rounded resize-none h-20 polaroid-label text-center"
                placeholder="Daca vrei si un titlu..."
              />
            </div>
            <div className="flex justify-end space-x-3 w-full">
              <button
                onClick={() => setNewPhotoModal(false)}
                className="px-4 py-2 border border-pink-300 rounded pink-btn bg-white text-pink-600 hover:bg-pink-100"
                disabled={isLoading}
              >
                Lasa
              </button>
              <button
                onClick={handleAddPhoto}
                disabled={!newPhoto.url || isLoading}
                className={`px-4 py-2 rounded pink-btn ${newPhoto.url && !isLoading ? '' : 'bg-pink-200 text-pink-400 cursor-not-allowed'}`}
              >
                {isLoading ? 'Adding...' : 'Adauga'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoGallery 