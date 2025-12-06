import React from 'react';
import { Movie } from '../types';
import { Play, Info } from 'lucide-react';

interface HeroSectionProps {
  movie: Movie | null;
  onPlay: (movie: Movie) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie, onPlay }) => {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
            src={movie.backdropUrl || movie.thumbnailUrl} 
            alt={movie.title}
            className="w-full h-full object-cover object-top"
        />
        {/* Gradient Overlays for integration with black background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-6 md:px-12 pt-20">
        <div className="max-w-2xl animate-in slide-in-from-left duration-1000">
          {/* Logo / Title */}
          <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tight drop-shadow-2xl uppercase italic">
            {movie.title}
          </h1>

          {/* Meta Data */}
          <div className="flex items-center gap-4 mb-6 text-lg font-medium">
             <span className="text-green-500 font-bold">{movie.rating} Match</span>
             <span className="text-gray-300">{movie.year}</span>
             <span className="bg-white/20 text-white px-2 py-0.5 text-xs rounded border border-white/20">
                {movie.platform}
             </span>
             <span className="text-gray-300">{movie.genre}</span>
          </div>

          <p className="text-gray-200 text-lg md:text-xl line-clamp-3 mb-8 drop-shadow-md max-w-xl leading-relaxed">
            {movie.description}
          </p>

          <div className="flex items-center gap-4">
            <button 
                onClick={() => onPlay(movie)}
                className="bg-white text-black px-8 py-3 rounded md:rounded-lg font-bold text-lg flex items-center gap-3 hover:bg-gray-200 transition-colors active:scale-95"
            >
                <Play fill="black" size={24} /> Play
            </button>
            <button 
                onClick={() => onPlay(movie)}
                className="bg-gray-500/30 backdrop-blur-md text-white px-8 py-3 rounded md:rounded-lg font-bold text-lg flex items-center gap-3 hover:bg-gray-500/50 transition-colors border border-white/10 active:scale-95"
            >
                <Info size={24} /> More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;