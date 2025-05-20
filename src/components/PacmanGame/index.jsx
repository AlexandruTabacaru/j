import React, { useEffect, useRef, useState } from 'react';

const BASE_TILE_SIZE = 80;
const BASE_ENTITY_SIZE = 90;
const INITIAL_LIVES = 3;

const LEVELS = [
  [
    '111111111111111111111',
    '120202020202020202021',
    '101011111010111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120211111111111112021',
    '101011111111111110101',
    '121211111111111112121',
    '101011111111111110101',
    '120211111111111112021',
    '101011111111111110101',
    '120202020202020202021',
    '101010101010101010101',
    '121212121212121212121',
    '101010101010101010101',
    '120202020202020202021',
    '111111111111111111111',
  ],
  [
    '111111111111111111111',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '101011111111111110101',
    '120202020202020202021',
    '111111111111111111111',
  ],
];

const PLAYER_IMG = '/assets/pacman2.png';
const ENEMY_IMGS = [
  '/assets/enemy1.jpeg',
  '/assets/enemy2.jpeg',
  '/assets/enemy3.jpeg'
];
const COLLECTIBLE_IMG = '/assets/matcha.png';
const GAMEOVER_IMG = '/assets/gameover.jpeg';

const DIRS = [
  { x: 0, y: -1, dir: 'up' },
  { x: 1, y: 0, dir: 'right' },
  { x: 0, y: 1, dir: 'down' },
  { x: -1, y: 0, dir: 'left' },
];

const DOLLAR_BILLS = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 2}s`,
  duration: `${2 + Math.random() * 2}s`
}));

function getOppositeDir(dir) {
  switch (dir) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
    default: return null;
  }
}

function getInitialPositions(level) {
  // Guard against undefined level
  if (!level) return { player: { x: 1, y: 1 }, enemies: [], collectibles: [] };
  
  let player = { x: 1, y: 1 };
  let enemies = [];
  let collectibles = [];
  
  // Calculate all valid positions
  let validPositions = [];
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level[y].length; x++) {
      const cell = level[y][x];
      if (cell === '2') collectibles.push({ x, y });
      if (cell !== '1') {
        validPositions.push({ x, y });
      }
    }
  }
  
  // Filter positions that are far enough from player
  const MIN_DISTANCE = 6; // Minimum Manhattan distance from player
  const farPositions = validPositions.filter(pos => {
    const distance = Math.abs(pos.x - player.x) + Math.abs(pos.y - player.y);
    return distance >= MIN_DISTANCE;
  });
  
  // Select up to 3 random far positions for enemies
  const shuffled = [...farPositions].sort(() => 0.5 - Math.random());
  const enemyPositions = shuffled.slice(0, 3);
  
  enemies = enemyPositions.map(pos => ({
    x: pos.x,
    y: pos.y,
    dir: DIRS[Math.floor(Math.random() * 4)].dir
  }));
  
  return { player, enemies, collectibles };
}

export default function PacmanGame({ onBack }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [player, setPlayer] = useState({ x: 1, y: 1 });
  const [enemies, setEnemies] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameState, setGameState] = useState('loading');
  const moveCooldown = useRef(false);
  const [tileSize, setTileSize] = useState(BASE_TILE_SIZE);
  const [entitySize, setEntitySize] = useState(BASE_ENTITY_SIZE);
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef(null);

  // Get the level safely
  const level = LEVELS[levelIdx];

  // Reset level state
  function resetLevel(idx, preserveLives = false) {
    // Guard against invalid index
    if (idx < 0 || idx >= LEVELS.length) {
      console.error(`Invalid level index: ${idx}`);
      return;
    }
    
    const levelData = LEVELS[idx];
    if (!levelData) {
      console.error(`Level data not found for index: ${idx}`);
      return;
    }
    
    const { player, enemies, collectibles } = getInitialPositions(levelData);
    setPlayer(player);
    setEnemies(enemies);
    setCollectibles(collectibles);
    if (!preserveLives) {
      setLives(INITIAL_LIVES);
    }
    setGameState('playing');
  }

  // Initialize the game when component mounts
  useEffect(() => {
    // Initial setup
    if (levelIdx >= 0 && levelIdx < LEVELS.length) {
      // When progressing to next level, preserve lives
      resetLevel(levelIdx, levelIdx > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIdx]); // Only depend on levelIdx

  // Player movement
  useEffect(() => {
    function handleKey(e) {
      if (gameState !== 'playing' || moveCooldown.current || !level) return;
      let dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -1;
      if (e.key === 'ArrowRight') dx = 1;
      if (e.key === 'ArrowUp') dy = -1;
      if (e.key === 'ArrowDown') dy = 1;
      if (dx || dy) {
        const nx = player.x + dx;
        const ny = player.y + dy;
        if (level[ny] && level[ny][nx] !== '1') {
          setPlayer({ x: nx, y: ny });
          setCollectibles(prev => prev.filter(c => c.x !== nx || c.y !== ny));
        }
        moveCooldown.current = true;
        setTimeout(() => (moveCooldown.current = false), 120);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, level, gameState]);

  // Enemy movement
  useEffect(() => {
    if (gameState !== 'playing' || !level) return;
    const interval = setInterval(() => {
      setEnemies(prev =>
        prev.map(enemy => {
          const possible = DIRS.filter(d => {
            const tx = enemy.x + d.x;
            const ty = enemy.y + d.y;
            return level[ty] && level[ty][tx] !== '1';
          });
          if (!possible.length) return enemy;
          let newDir = enemy.dir;
          if (possible.length >= 3) {
            const opts = possible.filter(d => d.dir !== getOppositeDir(enemy.dir));
            newDir = (opts[Math.floor(Math.random() * opts.length)] || possible[0]).dir;
          } else {
            const fwd = DIRS.find(d => d.dir === enemy.dir);
            if (!level[enemy.y + fwd.y] || level[enemy.y + fwd.y][enemy.x + fwd.x] === '1') {
              const opts = possible.filter(d => d.dir !== getOppositeDir(enemy.dir));
              newDir = (opts[Math.floor(Math.random() * opts.length)] || possible[0]).dir;
            }
          }
          const dirObj = DIRS.find(d => d.dir === newDir);
          return { ...enemy, dir: newDir, x: enemy.x + dirObj.x, y: enemy.y + dirObj.y };
        })
      );
    }, 300);
    return () => clearInterval(interval);
  }, [level, gameState]);

  // Game logic
  useEffect(() => {
    if (gameState !== 'playing' || !level) return;
    
    // Check for win
    if (!collectibles.length) {
      if (levelIdx < LEVELS.length - 1) {
        // Set a flag to prevent multiple state updates
        setGameState('transitioning');
        
        setTimeout(() => {
          setLevelIdx(prevIdx => prevIdx + 1);
          // Reset will happen in the levelIdx effect, with preserved lives
        }, 800);
      } else {
        setGameState('finalwin');
      }
      return; // Exit early to prevent checking collisions during transition
    }
    
    // Check for collisions with enemies
    if (enemies.some(e => e.x === player.x && e.y === player.y)) {
      if (lives > 1) {
        setLives(l => l - 1);
        // Just reset player and enemies positions, keep collectibles
        const { player: newPlayer, enemies: newEnemies } = getInitialPositions(level);
        setPlayer(newPlayer);
        setEnemies(newEnemies);
      } else {
        setGameState('lose');
      }
    }
  }, [collectibles, enemies, player, gameState, level, levelIdx, lives]);

  // Responsive scaling and tile size
  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const wrapper = wrapperRef.current;
      const availableWidth = wrapper.clientWidth;
      const availableHeight = wrapper.clientHeight;

      // Try with base size
      let tile = BASE_TILE_SIZE;
      let entity = BASE_ENTITY_SIZE;
      let gameWidth = level[0].length * tile;
      let gameHeight = level.length * tile;
      let scaleX = availableWidth / gameWidth;
      let scaleY = availableHeight / gameHeight;
      let scale = Math.min(scaleX, scaleY, 1);

      // If scale is < 1, try to shrink tile size instead
      if (scale < 1) {
        tile = Math.floor(Math.min(
          availableWidth / level[0].length,
          availableHeight / level.length
        ));
        tile = Math.max(tile, 24);
        entity = Math.floor(tile * (BASE_ENTITY_SIZE / BASE_TILE_SIZE));
        scale = 1;
      }

      setTileSize(tile);
      setEntitySize(entity);
      setScale(scale);
    };

    updateScale();

    // Force a recalculation after a short delay (for initial mount/layout)
    const timeout = setTimeout(updateScale, 50);

    const resizeObserver = new ResizeObserver(updateScale);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    window.addEventListener('resize', updateScale);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [level]);

  function handleRestart() {
    // Direct reset without relying on the useEffect
    setLevelIdx(0);
    setLives(INITIAL_LIVES);
    resetLevel(0, false); // Explicitly call resetLevel with level 0 and reset lives
  }

  // Show loading state if needed
  if (gameState === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-2xl">
        Loading...
      </div>
    );
  }

  // Guard against missing level data
  if (!level) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-2xl">
        Error: Level data not found. <button onClick={handleRestart} className="ml-4 px-4 py-2 border">Restart</button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/pokemonwallpaper.jpg")'
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 text-pink-500 bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-pink-200 text-2xl font-bold shadow z-30"
        title="Inchide"
      >
        ×
      </button>

      <div
        ref={wrapperRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        <div 
          style={{
            width: level[0].length * tileSize,
            height: level.length * tileSize,
            position: 'relative',
            border: '8px solid #FFB6C1',
            borderRadius: '20px',
            boxShadow: '0 0 40px rgba(255,182,193,0.5)',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitTransform: `scale(${scale})`,
          }}
          className="game-container"
        >
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%',
            }}
          >
            {level.map((row, y) => row.split('').map((cell, x) => cell === '1' && (
              <div 
                key={`${x}-${y}`} 
                style={{ 
                  position: 'absolute', 
                  left: x * tileSize, 
                  top: y * tileSize, 
                  width: tileSize, 
                  height: tileSize, 
                  background: 'rgba(120, 180, 255, 0.85)',
                  borderRadius: '6px',
                  opacity: 0.9,
                  boxSizing: 'border-box',
                }} 
              />
            )))}
            {collectibles.map((c, i) => (
              <img 
                key={i} 
                src={COLLECTIBLE_IMG} 
                alt="matcha" 
                style={{ 
                  position: 'absolute', 
                  left: c.x * tileSize + tileSize / 6,
                  top: c.y * tileSize + tileSize / 6,
                  width: tileSize * 0.7,
                  height: tileSize * 0.7,
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 0 2px rgba(255, 182, 193, 0.5))'
                }} 
              />
            ))}
            <img 
              src={PLAYER_IMG} 
              alt="player" 
              style={{ 
                position: 'absolute', 
                left: player.x * tileSize + (tileSize - entitySize) / 2, 
                top: player.y * tileSize + (tileSize - entitySize) / 2, 
                width: entitySize, 
                height: entitySize, 
                zIndex: 2, 
                pointerEvents: 'none',
                transition: 'left 0.12s linear, top 0.12s linear' 
              }} 
            />
            {enemies.map((e, i) => (
              <img 
                key={i} 
                src={ENEMY_IMGS[i % ENEMY_IMGS.length]} 
                alt="enemy" 
                style={{ 
                  position: 'absolute', 
                  left: e.x * tileSize + (tileSize - entitySize) / 2, 
                  top: e.y * tileSize + (tileSize - entitySize) / 2, 
                  width: entitySize, 
                  height: entitySize, 
                  zIndex: 2, 
                  pointerEvents: 'none',
                  transition: 'left 0.3s linear, top 0.3s linear' 
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full max-w-3xl px-4 absolute bottom-4">
        <div className="text-3xl text-pink-600 font-medium bg-pink-100 bg-opacity-80 px-4 py-2 rounded-lg shadow-lg">Lives: {lives}</div>
        <div className="text-3xl text-pink-600 font-medium bg-pink-100 bg-opacity-80 px-4 py-2 rounded-lg shadow-lg">Level: {levelIdx + 1}</div>
      </div>

      {gameState === 'finalwin' && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-100 bg-opacity-90 z-20">
          <div className="text-center p-12 border-4 border-pink-300 rounded-2xl bg-white bg-opacity-90 max-w-2xl w-full mx-4 relative overflow-hidden">
            {/* Dollar bills animation */}
            {DOLLAR_BILLS.map(bill => (
              <div
                key={bill.id}
                className="absolute text-4xl animate-fall"
                style={{
                  left: bill.left,
                  top: '-10%',
                  animationDelay: bill.delay,
                  animationDuration: bill.duration
                }}
              >
                💵
              </div>
            ))}
            
            <img 
              src="/assets/matcha.png" 
              alt="Victory" 
              className="w-64 h-64 mx-auto mb-6 animate-bounce"
            />
            <h2 className="text-5xl text-pink-600 mb-6">AI CÂȘTIGAT GNG!!! ❤️❤️‍🩹❤️‍🩹</h2>
            <p className="text-3xl text-pink-500 mb-8">Ai strâns toate matcha-urile!</p>
            <button 
              className="px-8 py-4 text-2xl border-4 border-pink-300 hover:bg-pink-300 hover:text-white rounded-xl transition-colors duration-300"
              onClick={handleRestart}
            >
              Joacă din nou
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'lose' && (
        <div className="absolute inset-0 flex items-center justify-center bg-pink-100 bg-opacity-90 z-20">
          <div className="text-center p-8">
            <img 
              src={GAMEOVER_IMG} 
              alt="Game Over" 
              className="w-96 h-96 mb-4 rounded-xl"
            />
            <button 
              className="px-6 py-2 text-xl border-2 border-pink-300 hover:bg-pink-300 hover:text-white rounded-lg transition-colors duration-300"
              onClick={handleRestart}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
