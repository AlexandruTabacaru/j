import React, { useEffect, useRef, useState } from 'react';

const TILE_SIZE = 32;
const ENTITY_SIZE = 24;
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

const PLAYER_IMG = '/assets/pacman.png';
const ENEMY_IMG = '/assets/ghost.png';
const COLLECTIBLE_IMG = '/assets/dot.png';

const DIRS = [
  { x: 0, y: -1, dir: 'up' },
  { x: 1, y: 0, dir: 'right' },
  { x: 0, y: 1, dir: 'down' },
  { x: -1, y: 0, dir: 'left' },
];

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
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors duration-300 z-10"
      >
        Back
      </button>

      <div style={{ width: level[0].length * TILE_SIZE, height: level.length * TILE_SIZE, position: 'relative', border: '4px solid #222' }}>
        {level.map((row, y) => row.split('').map((cell, x) => cell === '1' && (
          <div key={`${x}-${y}`} style={{ position: 'absolute', left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, background: '#222' }} />
        )))}
        {collectibles.map((c, i) => (
          <img key={i} src={COLLECTIBLE_IMG} alt="dot" style={{ position: 'absolute', left: c.x * TILE_SIZE + TILE_SIZE / 4, top: c.y * TILE_SIZE + TILE_SIZE / 4, width: TILE_SIZE / 2, height: TILE_SIZE / 2, pointerEvents: 'none' }} />
        ))}
        <img 
          src={PLAYER_IMG} 
          alt="player" 
          style={{ 
            position: 'absolute', 
            left: player.x * TILE_SIZE + (TILE_SIZE - ENTITY_SIZE) / 2, 
            top: player.y * TILE_SIZE + (TILE_SIZE - ENTITY_SIZE) / 2, 
            width: ENTITY_SIZE, 
            height: ENTITY_SIZE, 
            zIndex: 2, 
            pointerEvents: 'none',
            transition: 'left 0.12s linear, top 0.12s linear' 
          }} 
        />
        {enemies.map((e, i) => (
          <img 
            key={i} 
            src={ENEMY_IMG} 
            alt="enemy" 
            style={{ 
              position: 'absolute', 
              left: e.x * TILE_SIZE + (TILE_SIZE - ENTITY_SIZE) / 2, 
              top: e.y * TILE_SIZE + (TILE_SIZE - ENTITY_SIZE) / 2, 
              width: ENTITY_SIZE, 
              height: ENTITY_SIZE, 
              zIndex: 2, 
              pointerEvents: 'none',
              transition: 'left 0.3s linear, top 0.3s linear' 
            }} 
          />
        ))}
      </div>

      <div className="flex justify-between w-full max-w-lg mt-4 px-4">
        <div className="text-lg text-white">Lives: {lives}</div>
        <div className="text-lg text-white">Level: {levelIdx + 1}</div>
      </div>

      {gameState === 'finalwin' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="text-4xl text-white text-center p-8 border border-white">
            🎉 You finished all levels!<br/>
            <button 
              className="mt-4 px-6 py-2 text-xl border border-white hover:bg-white hover:text-black"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'lose' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="text-4xl text-white text-center p-8 border border-white">
            Game Over<br/>
            <button 
              className="mt-4 px-6 py-2 text-xl border border-white hover:bg-white hover:text-black"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
