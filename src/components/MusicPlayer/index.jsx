import { useState, useRef, useEffect } from 'react';

const SONGS = [
  {
    name: 'Animal Crossing',
    path: '/assets/animalcrossing.mp3'
  },
  {
    name: 'Aphex Twin',
    path: '/assets/aphex.mp3'
  },
  {
    name: 'Terraria',
    path: '/assets/terraria.mp3'
  },
  {
    name: 'Minecraft',
    path: '/assets/minecraft.mp3'
  }
];

export default function MusicPlayer({ isVideoMenu = false }) {
  const [isPlaying, setIsPlaying] = useState(true); // Start with playing state
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Stop music when entering video section
  useEffect(() => {
    if (isVideoMenu && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVideoMenu]);

  // Create a single audio instance
  useEffect(() => {
    // Create the audio instance only once
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;

      // Set up event listeners
      audioRef.current.addEventListener('play', () => {
        console.log('Audio started playing');
        setIsPlaying(true);
        setIsLoading(false);
      });

      audioRef.current.addEventListener('pause', () => {
        console.log('Audio paused');
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
        setIsLoading(false);
      });

      audioRef.current.addEventListener('loadstart', () => {
        console.log('Audio loading started');
        setIsLoading(true);
      });

      audioRef.current.addEventListener('canplay', () => {
        console.log('Audio can play');
        setIsLoading(false);
        // Always try to play when audio is ready
        audioRef.current.play().catch(error => {
          console.error('Error auto-playing audio:', error);
          setIsPlaying(false);
        });
      });
    }

    // Set initial source and start playing
    audioRef.current.src = SONGS[currentSongIndex].path;
    audioRef.current.play().catch(error => {
      console.error('Error playing initial audio:', error);
      setIsPlaying(false);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('play', () => {});
        audioRef.current.removeEventListener('pause', () => {});
        audioRef.current.removeEventListener('error', () => {});
        audioRef.current.removeEventListener('loadstart', () => {});
        audioRef.current.removeEventListener('canplay', () => {});
      }
    };
  }, []);

  // Handle song change
  const changeSong = (index) => {
    if (audioRef.current) {
      setIsLoading(true);
      const wasPlaying = isPlaying;
      
      // Stop current playback
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Update source and state
      audioRef.current.src = SONGS[index].path;
      setCurrentSongIndex(index);
      
      // Always try to play the new song
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  };

  // Toggle play/pause
  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsLoading(true);
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Don't render anything if we're in the video menu
  if (isVideoMenu) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        {/* Main music control button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? '⌛' : isPlaying ? '🔇' : '🔊'}
        </button>

        {/* Playlist button */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center text-sm shadow-lg hover:bg-gray-100 transition-colors duration-300"
        >
          🎵
        </button>

        {/* Playlist dropdown */}
        {showPlaylist && (
          <div className="absolute bottom-16 right-0 bg-white border-2 border-black rounded-lg shadow-lg p-2 min-w-[150px]">
            {SONGS.map((song, index) => (
              <button
                key={song.path}
                onClick={() => {
                  changeSong(index);
                  setShowPlaylist(false);
                }}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors duration-300 ${
                  currentSongIndex === index ? 'bg-gray-100 font-bold' : ''
                }`}
              >
                {song.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 