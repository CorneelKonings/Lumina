
import React, { useState, useEffect, useMemo } from 'react';
import { Platform, Movie } from './types';
import { MOCK_MOVIES, INITIAL_SUBSCRIPTIONS } from './constants';
import { fetchDashboardContent, fetchMovieDetails } from './services/tmdbService';
import PlayerModal from './components/PlayerModal';
import CinematicIntro from './components/CinematicIntro';
import SetupWizard from './components/SetupWizard';
import Sidebar from './components/Sidebar';
import FeaturedSpotlight from './components/FeaturedSpotlight';
import TrendingList from './components/TrendingList';
import MasonryGrid from './components/MasonryGrid';
import SubscriptionToggle from './components/SubscriptionToggle';
import { Search, Bell, Sparkles, KeyRound, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  // Application Flow State
  const [showIntro, setShowIntro] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Data State
  const [subscriptions, setSubscriptions] = useState<Platform[]>(INITIAL_SUBSCRIPTIONS);
  const [movies, setMovies] = useState<Movie[]>(MOCK_MOVIES);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // 1. Handle Intro Completion
  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowSetup(true);
  };

  // 2. Handle Setup Completion
  const handleSetupComplete = (selected: Platform[]) => {
    setSubscriptions(selected);
    setShowSetup(false);
    setSetupComplete(true);
  };

  // 3. Fetch Real Data from TMDB
  useEffect(() => {
    if (setupComplete) {
      const loadContent = async () => {
        setIsGenerating(true);
        setApiError(null);
        try {
          const tmdbMovies = await fetchDashboardContent(subscriptions);
          
          if (tmdbMovies && tmdbMovies.length > 0) {
            setMovies(tmdbMovies);
            
            // Immediately fetch details (trailer) for the Hero movie (index 0)
            const hero = tmdbMovies[0];
            if (hero) {
               // Fix: Pass mediaType explicitly to avoid 404 if hero is a TV show
               const details = await fetchMovieDetails(hero.id, hero.mediaType);
               if (details) {
                  setMovies(prev => {
                     const newMovies = [...prev];
                     newMovies[0] = { ...newMovies[0], ...details };
                     return newMovies;
                  });
               }
            }
          }
        } catch (e: any) {
            console.error("Content Load failed", e);
            if (e.message === 'INVALID_KEY' || e.message === 'MISSING_KEY') {
                setApiError("Authentication Failed: Check constants.ts");
            }
        } finally {
          setIsGenerating(false);
        }
      };
      
      loadContent();
    }
  }, [setupComplete, subscriptions]);

  const handleToggleSubscription = (platform: Platform) => {
    setSubscriptions(prev => {
      const newSubs = prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform];
      return newSubs;
    });
  };

  // Categorize for Dashboard
  const { trending, action, scifi, acclaimed } = useMemo(() => {
    return {
        trending: movies.filter(m => m.category === 'Trending Now'),
        action: movies.filter(m => m.category === 'Action & Thriller'),
        scifi: movies.filter(m => m.category === 'Sci-Fi & Fantasy'),
        acclaimed: movies.filter(m => m.category === 'Critically Acclaimed'),
    };
  }, [movies]);

  const featuredMovie = movies[0] || null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* 1. Cinematic Intro */}
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      {/* 2. Setup Wizard */}
      {showSetup && <SetupWizard initialSubscriptions={[]} onComplete={handleSetupComplete} />}

      {/* 3. Main Dashboard */}
      <div className={`flex min-h-screen transition-all duration-1000 ${setupComplete ? 'opacity-100 blur-0' : 'opacity-0 blur-xl pointer-events-none fixed inset-0'}`}>
        
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10">
            
            {/* Header / Top Bar */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 text-sm mt-1">Discover your next favorite story.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-white transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search titles..." 
                            className="bg-[#111] border border-white/10 rounded-full pl-10 pr-4 py-2.5 w-64 text-sm focus:outline-none focus:border-white/30 focus:bg-[#1a1a1a] transition-all"
                        />
                    </div>
                    <button className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <Bell size={18} />
                    </button>
                </div>
            </header>

            {!apiError ? (
                <div className="space-y-12">
                    
                    {/* Top Grid: Featured + Trending */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Featured (Takes 2 columns on large screens) */}
                        <div className="xl:col-span-2">
                            <FeaturedSpotlight movie={featuredMovie} onPlay={setActiveMovie} />
                        </div>

                        {/* Trending List (Takes 1 column) */}
                        <div className="xl:col-span-1">
                            <TrendingList movies={trending} onPlay={setActiveMovie} />
                        </div>
                    </div>

                    {/* Subscription Filter (Floating Glass) */}
                    <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Sources</span>
                        <div className="flex-1">
                             <SubscriptionToggle selected={subscriptions} onToggle={handleToggleSubscription} />
                        </div>
                        {isGenerating && (
                            <div className="flex items-center gap-2 text-green-400 animate-pulse px-4">
                                <Sparkles size={14} />
                                <span className="text-xs uppercase font-bold">Live Sync</span>
                            </div>
                        )}
                    </div>

                    {/* Discovery Grids (Masonry) */}
                    <div className="space-y-2">
                        <MasonryGrid title="Sci-Fi & Fantasy" movies={scifi} onPlay={setActiveMovie} />
                        <MasonryGrid title="Action & Thriller" movies={action} onPlay={setActiveMovie} />
                        <MasonryGrid title="Critically Acclaimed" movies={acclaimed} onPlay={setActiveMovie} />
                    </div>
                </div>
            ) : (
                /* Error State */
                <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                        <KeyRound size={40} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">System Key Invalid</h2>
                    <p className="text-gray-400 mb-6 max-w-md">{apiError}</p>
                </div>
            )}
             
            {/* Network Error State */}
            {movies.length === 0 && !isGenerating && !apiError && (
                 <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                    <WifiOff size={48} className="text-gray-700 mb-4" />
                    <p className="text-gray-500">No content feed detected.</p>
                </div>
            )}
        </main>

        {/* Detail/Player Modal */}
        {activeMovie && (
          <PlayerModal 
            movie={activeMovie} 
            onClose={() => setActiveMovie(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
