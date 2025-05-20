const VideoPlayer = ({ onBack }) => {
  return (
    <div
      className="fixed inset-0 flex items-start justify-center bg-cover bg-center z-10"
      style={{
        backgroundImage: 'url("/assets/wallpapermovie.jpg")',
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 border border-fashion-white bg-white bg-opacity-70 hover:bg-fashion-white hover:text-fashion-black transition-colors duration-300 rounded-lg shadow z-20"
      >
        Back
      </button>
      <div className="w-full h-full flex items-start justify-center pt-16">
        <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-6 flex flex-col items-center w-[65vw] h-[65vh] overflow-hidden">
          <h1 className="text-2xl mb-4 text-pink-600 font-bold">aaaaaa(mintiri)</h1>
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
            <video
              controls
              className="w-full h-full rounded-lg shadow-lg object-contain"
              poster="/assets/videoposter.jpg"
              style={{ 
                background: "#000",
                maxWidth: "100%",
                maxHeight: "100%"
              }}
            >
              <source src="/assets/film_lma.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="mt-4 text-pink-500">Honorable mention mama ta pt unele poze 💖</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 