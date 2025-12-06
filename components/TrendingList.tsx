
import React from 'react';
import { Movie } from '../types';
import { Play } from 'lucide-react';

interface TrendingListProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
}

const TrendingList: React.FC<TrendingListProps> = ({ movies, onPlay }) => {
  return (
    <div className="bg-[#111] border border-white/5 rounded-3xl p-6 h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Trending Now</h3>
        <span className="text-xs text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">View All</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {movies.slice(0, 5).map((movie, index) => (
            <div 
                key={movie.id}
                onClick={() => onPlay(movie)}
                className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
            >
                <div className="relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img src={movie.thumbnailUrl} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={16} className="text-white fill-white" />
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate group-hover:text-blue-400 transition-colors">{movie.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{movie.platform}</span>
                        <span className="text-xs text-green-500 font-medium">{movie.rating}</span>
                    </div>
                </div>

                <div className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                    {index + 1}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingList;
