
import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Play, MonitorPlay, Loader2 } from 'lucide-react';
import { Movie } from '../types';
import { fetchMovieDetails } from '../services/tmdbService';

interface PlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const PlayerModal: React.FC<PlayerModalProps> = ({ movie, onClose }) => {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [detailedMovie, setDetailedMovie] = useState<Movie | null>(movie);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (movie) {
        setDetailedMovie(movie); 
        setIsLoadingDetails(true);
        // Correctly pass mediaType and platform
        fetchMovieDetails(movie.id, movie.mediaType, movie.platform).then(details => {
            if (details) {
                setDetailedMovie(prev => prev ? ({ ...prev, ...details }) : null);
            }
            setIsLoadingDetails(false);
        });
    }
  }, [movie]);

  if (!detailedMovie) return null;

  const handleWatchNow = () => {
    if (detailedMovie.streamUrl) {
      // Open in new tab with security best practices
      window.open(detailedMovie.streamUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 duration-300">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl aspect-[16/10] md:aspect-[16/9] bg-[#050505] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col md:flex-row group">
        
        {/* Left: Media Area */}
        <div className="w-full md:w-3/4 relative h-64 md:h-full bg-black">
          {isPlayingTrailer && detailedMovie.trailerUrl ? (
             <iframe
              src={`https://www.youtube.com/embed/${detailedMovie.trailerUrl}?autoplay=1&modestbranding=1&controls=1&rel=0&showinfo=0`}
              title="Trailer"
              className="w-full h-full object-cover"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-105"
                   style={{ backgroundImage: `url(${detailedMovie.backdropUrl || detailedMovie.thumbnailUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
              
              {detailedMovie.trailerUrl ? (
                  <button 
                    onClick={() => setIsPlayingTrailer(true)}
                    className="absolute inset-0 flex items-center justify-center group/play"
                  >
                     <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover/play:scale-110 transition-transform duration-300">
                        <Play size={40} className="ml-2 text-white fill-white" />
                     </div>
                  </button>
              ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/40 text-sm tracking-widest uppercase">
                          {isLoadingDetails ? 'Syncing...' : 'No Trailer Available'}
                      </span>
                  </div>
              )}
            </>
          )}
          
          {/* Mobile Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-white/70 bg-black/50 p-2 rounded-full backdrop-blur-md">
            <X size={20} />
          </button>
        </div>

        {/* Right: Info Area */}
        <div className="w-full md:w-1/4 bg-[#050505] border-l border-white/5 flex flex-col relative z-10">
            {/* Desktop Close */}
            <div className="hidden md:flex justify-end p-4">
                 <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-2">
                    <X size={24} />
                 </button>
            </div>

            <div className="p-6 md:p-8 flex flex-col h-full">
                <div className="mb-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-none tracking-tight">
                        {detailedMovie.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-6 font-medium">
                        <span className="text-green-400 font-bold">{detailedMovie.rating} Score</span>
                        <span>{detailedMovie.year}</span>
                        <span className="text-white/60">{detailedMovie.genre}</span>
                        <span className="text-[10px] uppercase border border-white/10 px-1 rounded">{detailedMovie.mediaType}</span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-6">
                        {detailedMovie.description}
                    </p>

                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="text-gray-600 uppercase text-xs font-bold tracking-wider block mb-1">Director/Creator</span>
                            <span className="text-white">{detailedMovie.director}</span>
                        </div>
                        <div>
                            <span className="text-gray-600 uppercase text-xs font-bold tracking-wider block mb-1">Starring</span>
                            <span className="text-white text-opacity-80 leading-snug">
                                {detailedMovie.cast?.join(', ')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <button 
                        onClick={handleWatchNow}
                        disabled={isLoadingDetails}
                        className="w-full py-5 bg-white text-black font-bold text-base uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] group/btn disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoadingDetails ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <MonitorPlay size={20} className="group-hover/btn:scale-110 transition-transform" />
                        )}
                        Open in {detailedMovie.platform}
                    </button>
                    <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-wider">
                        {isLoadingDetails ? 'Retrieving direct link...' : 'Redirects to external player'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
