const MainMenu = ({ onSelect }) => {
  const menuItems = [
    { id: 'pacman', label: 'Pacman' },
    { id: 'photos', label: 'Photos' },
    { id: 'video', label: 'Video' },
    { id: 'dungeon', label: 'Dungeon' },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-light mb-16 tracking-wider">AAA</h1>
      <div className="space-y-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="w-64 px-6 py-3 text-center border border-fashion-white hover:bg-fashion-white hover:text-fashion-black transition-colors duration-300"
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MainMenu 