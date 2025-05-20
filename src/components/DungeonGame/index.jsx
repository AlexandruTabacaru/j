import { useState } from 'react';

const LEVELS = [
  {
    images: ['/assets/plajacorbu.jpg'],
    characterImage: '/assets/player.png',
    question: 'Trebuie să scapăm de aici cât mai repede, trb să merg să îmi iau bully totuși mai întâi. Care e cea mai bună locație pt asta?',
    answers: ['Acasă', 'La liceu', 'La job', 'La facultate'],
    correct: 1,
    lore: 'Plaja Corbu: începutul aventurii. Unde găsim cel mai bun bully?'
  },
  {
    images: ['/assets/cnmbct.jpg'],
    characterImage: '/assets/player.png',
    question: 'Ok, am ajuns, am luat și rucsacu, da mi-e fomica. Unde mergem și noi repede?',
    answers: ['La Fratelli', 'La b*ta (doamne ferește)', 'Tomis Mall <3', 'Murim de foame'],
    correct: 2,
    lore: 'CNMBCT: Rucsacul e luat, dar stomacul cere sacrificii...'
  },
  {
    images: ['/assets/tomismall.jpg'],
    characterImage: '/assets/player.png',
    question: 'Ah ce frumos e să dai 10 lei pe 2 burgeri și 2 cartofi. Anyway, cred că trebuie să bem ceva să ne facem praf. Ce luăm ca să ajungem la mine?',
    answers: ['48', '51', '44', '102 (wtf)'],
    correct: 0,
    lore: 'Tomis Mall: Fast food și planuri de băut. Care e autobuzul magic?'
  },
  {
    images: ['/assets/lift.jpeg', '/assets/casamea.jpeg', '/assets/casamea2.jpeg'],
    characterImage: '/assets/player.png',
    question: 'Bun, acum am făcut multe râsuri dar trebuie să ajungem acasă cum am zis, unde ne despărțeam de regulă și ne luam în brațe?',
    answers: ['Coaie nu făceam asta', 'La Brick', 'La Robert acasă', 'La Skullgames'],
    correct: 1,
    lore: 'Liftul, apoi acasă, dar unde era momentul de despărțire?'
  },
  {
    images: ['/assets/brick.jpg'],
    characterImage: '/assets/player.png',
    question: 'Ah ce frumos...Mega Image...sigur nu va dispărea în viitor. Vrem să facem un râs urgent pentru că ne-a luat depresia. Pe unde trecem?',
    answers: ['Casa lu Robert', 'Nu râdem', 'La școală', 'Înapoi la mine'],
    correct: 0,
    lore: 'Brick: locul râsului și al depresiei. Care e traseul corect?'
  },
  {
    images: ['/assets/casalupirlea.jpeg'],
    characterImage: '/assets/player.png',
    question: 'Atât, orice răspuns e corect, hai acasă',
    answers: ['a', 'b', 'c', 'd'],
    correct: null,
    lore: 'Casa lu Pirlea: final de drum, orice alegere e bună.'
  },
  {
    images: ['/assets/acasa.jpeg',
    '/assets/acasa2.jpeg',
    '/assets/smili.jpeg',
    '/assets/slimey.jpeg'],
    characterImage: '/assets/player.png',
    question: 'Am ajuns :D ce facem acum?',
    answers: ['Teme', 'Ne pregatim de examen </3', 'Intram pe lol curand', 'Vb/Scroll', 'Dam startu la vara p*rno', 'Toate'],
    correct: 5,
    lore: 'Acasă: ai evadat din Corbu! Felicitări!'
  }
];

export default function DungeonGame({ onBack }) {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const current = LEVELS[level];

  function handleAnswer(idx) {
    setSelected(idx);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
      setSelected(null);
      if (current.correct === null || current.correct === -1 || idx === current.correct) {
        if (level < LEVELS.length - 1) {
          setLevel(level + 1);
        }
      }
    }, 1200);
  }

  function handleRestart() {
    setLevel(0);
    setSelected(null);
    setShowResult(false);
  }

  // Special layout for the lift/casamea/casamea2 level
  const isLiftLevel =
    current.images.length === 3 &&
    current.images[0].includes('lift') &&
    current.images[1].includes('casamea') &&
    current.images[2].includes('casamea2');

  const isAcasaLevel =
    current.images.length === 4 &&
    current.images[0].includes('acasa') &&
    current.images[1].includes('acasa2') &&
    current.images[2].includes('smily') &&
    current.images[3].includes('slimey');

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Background images */}
      {isLiftLevel ? (
        <div className="absolute inset-0 w-full h-full flex">
          {/* Left: lift */}
          <div className="h-full w-1/2 relative">
            <img
              src={current.images[0]}
              alt=""
              className="object-cover w-full h-full"
              style={{ zIndex: 0, position: 'absolute', left: 0, top: 0 }}
            />
          </div>
          {/* Right: casamea and casamea2 stacked, always fully visible */}
          <div className="h-full w-1/2 flex flex-col bg-black">
            <div className="h-1/2 w-full flex items-center justify-center bg-black">
              <img
                src={current.images[1]}
                alt=""
                className="object-contain max-h-full max-w-full w-auto h-auto"
                style={{ background: '#000', width: '100%', height: '100%' }}
              />
            </div>
            <div className="h-1/2 w-full flex items-center justify-center bg-black">
              <img
                src={current.images[2]}
                alt=""
                className="object-contain max-h-full max-w-full w-auto h-auto"
                style={{ background: '#000', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      ) : isAcasaLevel ? (
        <div className="absolute inset-0 w-full h-full flex">
          {/* Left: acasa.jpg */}
          <div className="h-full w-1/2 relative">
            <img
              src={current.images[0]}
              alt=""
              className="object-contain w-full h-full bg-black"
              style={{ zIndex: 0, position: 'absolute', left: 0, top: 0 }}
            />
          </div>
          {/* Right: top acasa2, bottom split smily/slimey */}
          <div className="h-full w-1/2 flex flex-col">
            {/* Top right: acasa2 */}
            <div className="h-1/2 w-full flex items-center justify-center bg-black">
              <img
                src={current.images[1]}
                alt=""
                className="object-contain max-h-full max-w-full w-auto h-auto"
                style={{ background: '#000', width: '100%', height: '100%' }}
              />
            </div>
            {/* Bottom right: smily and slimey side by side */}
            <div className="h-1/2 w-full flex">
              <div className="w-1/2 h-full flex items-center justify-center bg-black">
                <img
                  src={current.images[2]}
                  alt=""
                  className="object-contain max-h-full max-w-full w-auto h-auto"
                  style={{ background: '#000', width: '100%', height: '100%' }}
                />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center bg-black">
                <img
                  src={current.images[3]}
                  alt=""
                  className="object-contain max-h-full max-w-full w-auto h-auto"
                  style={{ background: '#000', width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full flex">
          {current.images.map((img, i) => (
            <img
              key={img}
              src={img}
              alt=""
              className="object-cover h-full"
              style={{
                zIndex: 0,
                opacity: current.images.length > 1 ? 0.7 : 1,
                position: current.images.length > 1 ? 'relative' : 'absolute',
                left: 0,
                top: 0,
                width: current.images.length > 1 ? `${100 / current.images.length}%` : '100%',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>
      )}

      {/* Character in the corner, bigger and under the back button */}
      <div className="absolute top-24 left-6 z-20">
        <img
          src={current.characterImage}
          alt="Character"
          className="w-40 h-40 rounded-full border-4 border-pink-200 shadow-lg bg-white bg-opacity-80"
        />
      </div>

      {/* Lore textbox (top center) */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white bg-opacity-80 rounded-xl px-6 py-3 text-lg text-pink-700 font-semibold shadow-lg max-w-2xl">
          {current.lore}
        </div>
      </div>

      {/* Question and answers at the bottom */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-20 pb-8">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-6 max-w-2xl w-full mx-4">
          <div className="text-2xl font-bold text-pink-600 mb-4 text-center">{current.question}</div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {current.answers.map((ans, idx) => (
              <button
                key={ans}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`px-4 py-3 rounded-lg text-lg font-semibold border-2 transition-all duration-200
                  ${selected === idx
                    ? (idx === current.correct
                        ? 'bg-green-500 border-green-700 text-white'
                        : 'bg-red-500 border-red-700 text-white')
                    : 'bg-pink-400 border-pink-700 text-white hover:bg-pink-500 hover:border-pink-800'}
                `}
              >
                {ans}
              </button>
            ))}
          </div>
          {showResult && (
            <div className="mt-6 text-xl font-bold text-center">
              {(current.correct === null || current.correct === -1 || selected === current.correct)
                ? 'Corect! 🎉'
                : 'Greșit! 😢'}
            </div>
          )}
          {level === LEVELS.length - 1 && selected === current.correct && !showResult && (
            <div className="mt-8 text-2xl font-bold text-green-700 text-center">Ai evadat din Corbu! 🏆</div>
          )}
          <button
            onClick={handleRestart}
            className="mt-8 px-6 py-2 border-2 border-pink-300 bg-pink-100 rounded-lg text-lg font-semibold hover:bg-pink-200 transition block mx-auto"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 border border-fashion-white bg-white bg-opacity-70 hover:bg-fashion-white hover:text-fashion-black transition-colors duration-300 rounded-lg shadow z-30"
      >
        Back
      </button>
    </div>
  );
}