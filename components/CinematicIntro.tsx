import React, { useEffect, useState } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 0: Initial black
    // 1: Logo Fade In (0.5s)
    // 2: Line expansion (1.5s)
    // 3: Blur Out / Exit (3.5s)
    
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1500);
    const t3 = setTimeout(() => setStage(3), 3500);
    const t4 = setTimeout(() => onComplete(), 4500); // Give time for fade out

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${stage === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`flex flex-col items-center transition-all duration-1000 transform ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Logo Container */}
        <div className={`flex items-center gap-6 mb-8 transition-all duration-1000 ${stage === 3 ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}>
          <div className="w-20 h-20 border-2 border-white flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
             <span className="text-5xl font-bold text-white relative z-10">L</span>
             {/* Scanning Line */}
             <div className="absolute top-0 left-0 w-full h-1 bg-white/50 animate-[scan_2s_ease-in-out_infinite]" />
          </div>
          <h1 className="text-7xl font-thin tracking-[0.4em] text-white uppercase mix-blend-difference">
            Lumina
          </h1>
        </div>

        {/* Cinematic Line */}
        <div className={`h-[1px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-[2000ms] ease-out ${stage >= 2 ? 'w-full opacity-50' : 'w-0 opacity-0'}`} />
        
        <p className={`mt-6 text-xs text-gray-500 tracking-[0.5em] uppercase transition-opacity duration-1000 delay-500 ${stage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          System Initialization
        </p>
      </div>
    </div>
  );
};

export default CinematicIntro;