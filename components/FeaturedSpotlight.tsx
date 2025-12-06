
import React from 'react';
import { Movie } from '../types';
import { Play, Info } from 'lucide-react';

interface FeaturedSpotlightProps {
  movie: Movie | null;
  onPlay: (movie: Movie) => void;
}

const FeaturedSpotlight: React.FC<FeaturedSpotlightProps> = ({ movie, onPlay }) => {
  if (!movie) return (
    <div className="w-full h-[500px] bg-white/5 animate-pulse rounded-3xl" />
  );

  return (
    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden group border border-white/10 shadow-2xl">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
            src={movie.backdropUrl || movie.thumbnailUrl} 
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Glass Overlay Tag */}
      <div className="absolute top-6 left-6 flex gap-2">
         <span className="glass-button px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white">
            Featured Premiere
         </span>
         <span className="glass-button px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-red-600/20 border-red-500/50">
            {movie.platform}
         </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-none tracking-tight drop-shadow-lg">
            {movie.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-6 font-medium">
            <span className="text-green-400 font-bold">{movie.rating} Rating</span>
            <span>•</span>
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.genre}</span>
        </div>

        <p className="text-gray-300 line-clamp-2 mb-8 text-lg font-light leading-relaxed">
            {movie.description}
        </p>

        <div className="flex gap-4">
            <button 
                onClick={() => onPlay(movie)}
                className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
                <Play fill="black" size={16} /> Watch Now
            </button>
            <button 
                onClick={() => onPlay(movie)}
                className="glass-button px-6 py-4 rounded-full text-white font-bold text-sm tracking-widest uppercase hover:bg-white/20 transition-all hover:scale-105 active:scale-95 border border-white/20"
            >
                More Info
            </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSpotlight;
