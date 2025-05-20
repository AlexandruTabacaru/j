const VideoPlayer = ({ onBack }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center z-10"
      style={{
        backgroundImage: 'url("/assets/wallpapermovie.jpg")',
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 border border-fashion-white bg-white bg-opacity-70 hover:bg-fashion-white hover:text-fashion-black transition-colors duration-300 rounded-lg shadow"
      >
        Back
      </button>
      <div className="w-full h-full flex items-start pt-20 justify-center">
        <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-4 flex flex-col items-center max-w-[55vw] max-h-[60vh] w-full h-full">
          <h1 className="text-2xl mb-4 text-pink-600 font-bold">aaaaaa</h1>
          <video
            controls
            className="w-full h-full max-w-[96vw] max-h-[80vh] rounded-lg shadow-lg object-contain"
            poster="/assets/videoposter.jpg"
            style={{ background: "#eee" }}
          >
            <source src="/assets/memories.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="mt-4 text-pink-500">Honorable mention mama ta pt unele poze 💖</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 