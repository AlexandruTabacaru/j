import { useState } from 'react'
import MainMenu from './components/MainMenu'
import PacmanGame from './components/PacmanGame'
import PhotoGallery from './components/PhotoGallery'
import VideoPlayer from './components/VideoPlayer'
import DungeonGame from './components/DungeonGame'
import StartupAnimation from './components/StartupAnimation'
import MusicPlayer from './components/MusicPlayer'

function App() {
  const [currentSection, setCurrentSection] = useState('startup')
  const [showStartup, setShowStartup] = useState(true)

  const handleStartupComplete = () => {
    setShowStartup(false)
    setCurrentSection('menu')
  }

  const renderSection = () => {
    if (showStartup) {
      return <StartupAnimation onComplete={handleStartupComplete} />
    }

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
      <MusicPlayer isVideoMenu={currentSection === 'video'} />
    </div>
  )
}

export default App 
