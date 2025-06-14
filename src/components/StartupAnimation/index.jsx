import { useState, useEffect } from 'react';

const StartupAnimation = ({ onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [loadingText, setLoadingText] = useState('Se incarca lucruri bune...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingText('(nu se incarca nmc de fapt)');
    }, 2000);

    const finalTimer = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  if (!showAnimation) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: 'url("/assets/sylveon.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="text-center bg-white bg-opacity-70 rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-pink-600 animate-pulse mb-4">
          La multi ani!
        </h1>
        <div className="text-2xl text-pink-500 font-medium">
          {loadingText}
        </div>
        <div className="mt-4 text-pink-500">
          <span className="animate-ping">❤️</span>
        </div>
      </div>
    </div>
  );
};

export default StartupAnimation; 