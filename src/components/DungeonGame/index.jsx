import { useState, useRef, useEffect } from 'react';

const LEVELS = [
  {
    images: ['/assets/plajacorbu.jpg'],
    characterImage: '/assets/player.png',
    question: 'Trebuie să scapăm de aici cât mai repede (Evident), dar trebuie sa mergem intr-un loc si mai rau mai intai. Care e cea mai bună locație pt asta?',
    answers: ['Acasă', 'La liceu', 'La job', 'La facultate'],
    correct: 1,
    lore: 'Cum naiba am ajuns aici..........'
  },
  {
    images: ['/assets/cnmbct.jpg'],
    characterImage: '/assets/player.png',
    question: 'Ok, am ajuns, am furat ceva de la Damu, da tot mi-e fomica. Unde mergem și noi repede?',
    answers: ['La Fratelli', 'La b*ta (doamne ferește)', 'Tomis Mall <3', 'Murim de foame'],
    correct: 2,
    lore: 'Oameni cu care am socializat aici : 0'
  },
  {
    images: ['/assets/tomismall.jpg'],
    characterImage: '/assets/player.png',
    question: 'Ah ce frumos e să dai 10 lei pe 2 burgeri și 2 cartofi. Anyway, cred că trebuie să bem ceva să ne facem praf dupa drumu asta lung. Ce luăm ca să ajungem la mine?',
    answers: ['48', '51', '44', '102 (wtf)'],
    correct: 0,
    lore: 'Tomis Mall: Mogosu si McCombo la 5 lei.. ce vremuri'
  },
  {
    images: ['/assets/lift.jpeg', '/assets/casamea.jpeg', '/assets/casamea2.jpeg'],
    characterImage: '/assets/player.png',
    question: 'Bun, acum am făcut multe râsuri dar trebuie să ajungem acasă cum am zis, unde ne despărțeam de regulă și ne luam în brațe?',
    answers: ['Coaie nu făceam asta', 'La Brick', 'La Robert acasă', 'La Skullgames'],
    correct: 1,
    lore: 'Luam liftu scuffed si facem multe rasuri (lol mai incolo)'
  },
  {
    images: ['/assets/brick.jpg'],
    characterImage: '/assets/player.png',
    question: 'Ah ce frumos...Mega Image...sigur nu va dispărea în viitor. Vrem să facem un râs urgent pentru că ne-a luat depresia. Pe unde trecem?',
    answers: ['Casa lu Robert', 'Nu râdem', 'La școală', 'Înapoi la mine'],
    correct: 0,
    lore: 'Brick: mai trb sa descriu locu asta?'
  },
  {
    images: ['/assets/casalupirlea.jpeg'],
    characterImage: '/assets/player.png',
    question: 'Aici chiar nu mai am nimic de zis. Doar pune orice raspuns gng si hai acasă',
    answers: ['a', 'b', 'c', 'd'],
    correct: null,
    lore: 'c̵̭̋a̵͚͋́͝s̷͇̠̉͝a̶̧̰̰̓̈ ̷̢̩͂̈̉g̷̣͙̎̊ͅŗ̸̤͗̊͗ͅȏ̸̼̔́a̴̺̪̬̒̐z̵̝͈͉̓̕͝e̷̤̬͠į̷̦̝̈̍͂'
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
    lore: 'HAI PE LOOOOOOOOOOOOOL'
  }
];

export default function DungeonGame({ onBack }) {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

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
        } else {
          setShowCongrats(true);
        }
      }
    }, 1200);
  }

  function handleRestart() {
    setLevel(0);
    setSelected(null);
    setShowResult(false);
    setShowCongrats(false);
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
            <div className="mt-6 text-2xl font-bold text-center bg-white p-4 rounded-lg shadow-lg text-black">
              {(current.correct === null || current.correct === -1 || selected === current.correct)
                ? 'Bravo broski :D'
                : 'Greșit! Just say you fake gng 🥀'}
            </div>
          )}
          {level === LEVELS.length - 1 && selected === current.correct && !showResult && (
            <div className="mt-8 text-3xl font-bold text-center bg-white p-6 rounded-lg shadow-lg border-4 border-green-500 text-black">
              Ai evadat din Corbu! 🏆
            </div>
          )}
          <button
            onClick={handleRestart}
            className="mt-8 px-8 py-3 border-4 border-black bg-white rounded-lg text-xl font-bold hover:bg-gray-100 transition block mx-auto shadow-lg text-black"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Back button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={onBack}
          className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 text-black font-bold transition-colors duration-300 rounded-lg shadow-lg"
        >
          Back
        </button>
      </div>

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background with rank up animation */}
          <div className="absolute inset-0">
            <img
              src="/assets/league-of-legends-rankup.gif"
              alt="Rank Up Animation"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Modal content */}
          <div className="relative bg-black bg-opacity-80 p-8 rounded-2xl max-w-2xl mx-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">BRAVO!!!!!!! AM SCAPAT</h2>
            <p className="text-xl text-white mb-8">
              Daca nu vorbim rn, poate acum ar fi timpu sa deschizi plicul. (Daca vorbim probabil mentionez eu asta)
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}