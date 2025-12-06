import React from 'react';
import { Platform } from '../types';
import { Check } from 'lucide-react';

interface SubscriptionToggleProps {
  selected: Platform[];
  onToggle: (platform: Platform) => void;
}

const SubscriptionToggle: React.FC<SubscriptionToggleProps> = ({ selected, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-3 my-6">
      {Object.values(Platform).map((platform) => {
        const isActive = selected.includes(platform);
        return (
          <button
            key={platform}
            onClick={() => onToggle(platform)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300
              border flex items-center gap-2
              ${isActive 
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                : 'bg-black/40 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }
            `}
          >
            {isActive && <Check size={14} strokeWidth={3} />}
            {platform}
          </button>
        );
      })}
    </div>
  );
};

export default SubscriptionToggle;