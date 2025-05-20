const MainMenu = ({ onSelect }) => {
  const menuItems = [
    { id: 'pacman', label: 'Matcha' },
    { id: 'photos', label: 'Amintiri' },
    { id: 'video', label: 'Video' },
    { id: 'dungeon', label: 'CorbuEscape' },
  ]

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center main-menu-bg-gif p-8 relative">
      {/* Floating decorations - moved before the menu card */}
      <img src="/assets/heart.png" className="floating-deco heart1" alt="" />
      <img src="/assets/heart.png" className="floating-deco heart2" alt="" />
      <img src="/assets/heart.png" className="floating-deco heart3" alt="" />
      <img src="/assets/heart.png" className="floating-deco heart4" alt="" />
      <img src="/assets/heart.png" className="floating-deco heart5" alt="" />
      <img src="/assets/pikachu.png" className="floating-deco poke1-bigger" alt="" />
      <img src="/assets/shaymin.png" className="floating-deco poke3" alt="" />
      <img src="/assets/shayminsprite.png" className="floating-deco poke4" alt="" />
      <img src="/assets/mewmew.png" className="floating-deco poke5" alt="" />
      <img src="/assets/mew.webp" className="floating-deco poke6" alt="" />
      
      {/* Confetti */}
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className={`confetti-piece confetti${i % 6}`}
          style={{ left: `${Math.random() * 95}%`, top: `${Math.random() * 90}%` }}
        />
      ))}
      
      {/* Menu card with higher z-index */}
      <div className="bg-white bg-opacity-80 rounded-3xl shadow-xl border-2 border-pink-200 px-10 py-12 flex flex-col items-center menu-card-float relative z-10">
        <h1 className="title-fancy text-5xl mb-12 text-center floating-title" style={{ color: '#e75480', textShadow: '0 2px 8px #fff0fa' }}>
          La multi ani Jasmina!
        </h1>
        <div className="space-y-6 w-full">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="w-64 px-6 py-3 text-center bg-pink-50 text-pink-700 border-2 border-pink-200 rounded-full shadow hover:bg-pink-100 hover:text-pink-900 transition-colors duration-200 text-xl font-semibold tracking-wide wiggle-on-hover"
              onClick={() => onSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainMenu 