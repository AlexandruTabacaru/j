import { useState } from 'react'
import MainMenu from './components/MainMenu'
import PacmanGame from './components/PacmanGame'
import PhotoGallery from './components/PhotoGallery'
import VideoPlayer from './components/VideoPlayer'
import DungeonGame from './components/DungeonGame'

function App() {
  const [currentSection, setCurrentSection] = useState('menu')

  const renderSection = () => {
    switch (currentSection) {
      case 'menu':
        return <MainMenu onSelect={setCurrentSection} />
      case 'pacman':
        return <PacmanGame onBack={() => setCurrentSection('menu')} />
      case 'photos':
        return <PhotoGallery onBack={() => setCurrentSection('menu')} />
      case 'video':
        return <VideoPlayer onBack={() => setCurrentSection('menu')} />
      case 'dungeon':
        return <DungeonGame onBack={() => setCurrentSection('menu')} />
      default:
        return <MainMenu onSelect={setCurrentSection} />
    }
  }

  return (
    <div className="min-h-screen bg-fashion-black text-fashion-white">
      {renderSection()}
    </div>
  )
}

export default App 
