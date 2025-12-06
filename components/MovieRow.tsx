import React, { useRef } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onPlay }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12 relative group/row">
      <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4 px-6 md:px-12 flex items-center gap-2 group-hover/title:text-white transition-colors">
        {title}
        <span className="text-sm font-normal text-blue-400 opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer">Explore All &gt;</span>
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 w-12 bg-black/50 z-30 flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-black/80 transition-all duration-300 backdrop-blur-sm cursor-pointer border-r border-white/10"
        >
            <ChevronLeft className="text-white" size={32} />
        </button>

        {/* Scroll Container */}
        <div 
            ref={rowRef}
            className="flex gap-4 overflow-x-auto px-6 md:px-12 pb-8 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {movies.map((movie) => (
            <MovieCard 
                key={movie.id} 
                movie={movie} 
                onPlay={onPlay} 
            />
            ))}
        </div>

        {/* Right Arrow */}
        <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 w-12 bg-black/50 z-30 flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-black/80 transition-all duration-300 backdrop-blur-sm cursor-pointer border-l border-white/10"
        >
            <ChevronRight className="text-white" size={32} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;