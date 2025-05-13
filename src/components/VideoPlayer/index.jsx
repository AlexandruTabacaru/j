const VideoPlayer = ({ onBack }) => {
  return (
    <div className="relative w-full h-screen">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 border border-fashion-white hover:bg-fashion-white hover:text-fashion-black transition-colors duration-300"
      >
        Back
      </button>
      <div className="p-8">
        <h1 className="text-2xl mb-4">Video Player</h1>
      </div>
    </div>
  )
}

export default VideoPlayer 