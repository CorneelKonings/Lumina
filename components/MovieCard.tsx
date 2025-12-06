
import React, { useRef, useState, MouseEvent } from 'react';
import { Movie } from '../types';
import { Play, Info } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  variant?: 'poster' | 'landscape' | 'compact';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay, variant = 'poster' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // More subtle rotation for smaller cards
    const intensity = variant === 'compact' ? 4 : 8;
    const rotateY = ((x - centerX) / centerX) * intensity; 
    const rotateX = ((centerY - y) / centerY) * intensity;

    setRotation({ x: rotateX, y: rotateY });
    
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  // Dimension classes based on variant
  const containerClasses = {
    poster: "aspect-[2/3] w-full",
    landscape: "aspect-video w-full",
    compact: "aspect-square w-full"
  };

  return (
    <div 
      className={`relative group perspective-container z-10 hover:z-20 transition-all duration-300 ${containerClasses[variant]}`}
      style={{ perspective: '1000px' }}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onPlay(movie)}
        className="w-full h-full relative preserve-3d transition-transform duration-200 ease-out cursor-pointer rounded-2xl"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
        }}
      >
        {/* Card Main Container */}
        <div className="absolute inset-0 bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl border border-white/5">
          
          {/* Image */}
          <img 
            src={variant === 'landscape' && movie.backdropUrl ? movie.backdropUrl : movie.thumbnailUrl} 
            alt={movie.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Platform Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-5px] group-hover:translate-y-0">
             <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                {movie.platform}
             </span>
          </div>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold leading-tight drop-shadow-md mb-1 truncate">
               {movie.title}
            </h3>
            
            <div className={`flex items-center justify-between text-xs text-gray-300 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
                <span>{movie.year}</span>
                <span className="text-green-400 font-bold">{movie.rating}</span>
            </div>

            {/* Hover Actions */}
            <div className={`mt-3 flex gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 h-8' : 'opacity-0 h-0 overflow-hidden'}`}>
                 <button className="flex-1 bg-white text-black rounded-lg flex items-center justify-center gap-1 font-bold text-xs hover:bg-gray-200">
                    <Play size={12} fill="black" /> Play
                 </button>
                 <button className="w-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white/30">
                    <Info size={14} />
                 </button>
            </div>
          </div>
        </div>

        {/* Liquid Glass Glare */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none z-50 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`,
            opacity: glare.opacity,
          }}
        />
      </div>
    </div>
  );
};

export default MovieCard;
