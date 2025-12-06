import React, { useState } from 'react';
import { Platform } from '../types';
import { Check, ArrowRight, Zap } from 'lucide-react';

interface SetupWizardProps {
  initialSubscriptions: Platform[];
  onComplete: (selected: Platform[]) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ initialSubscriptions, onComplete }) => {
  const [selected, setSelected] = useState<Platform[]>(initialSubscriptions);

  const togglePlatform = (p: Platform) => {
    if (selected.includes(p)) {
      setSelected(selected.filter(i => i !== p));
    } else {
      setSelected([...selected, p]);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black flex items-center justify-center p-6 animate-in fade-in duration-700">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-xs text-gray-400 uppercase tracking-widest mb-6">
            <Zap size={12} className="text-yellow-400" /> Configuration Required
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">Connect Source</h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            Select your active neural feeds to calibrate the recommendation engine.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {Object.values(Platform).map((platform) => {
            const isActive = selected.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`
                  relative aspect-square rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-4 group overflow-hidden
                  ${isActive 
                    ? 'bg-white text-black border-white scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)] z-10' 
                    : 'bg-black text-gray-500 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active Glow */}
                {isActive && <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white opacity-20" />}
                
                <span className={`text-sm font-bold tracking-wider uppercase transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                    {platform}
                </span>
                
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive ? 'bg-black border-black text-white' : 'border-white/20'}`}>
                    {isActive && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
            <button
            onClick={() => onComplete(selected)}
            disabled={selected.length === 0}
            className="group relative flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-bold text-lg tracking-[0.2em] hover:bg-gray-200 hover:scale-105 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
            INITIALIZE HUB
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;