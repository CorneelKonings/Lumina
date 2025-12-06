
import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MasonryGridProps {
  title: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ title, movies, onPlay }) => {
  if (movies.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <div className="h-[1px] flex-1 bg-white/10 mx-6" />
        <button className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-medium">See All</button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onPlay={onPlay} 
            variant="poster" 
          />
        ))}
      </div>
    </div>
  );
};

export default MasonryGrid;
