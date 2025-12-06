
import React from 'react';
import { Home, Compass, Film, Tv, Heart, Settings, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Dashboard' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'movies', icon: Film, label: 'Movies' },
    { id: 'series', icon: Tv, label: 'Series' },
    { id: 'favorites', icon: Heart, label: 'Library' },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50 transition-all duration-300">
      {/* Logo Area */}
      <div className="h-24 flex items-center justify-center md:justify-start md:px-8 border-b border-white/5">
        <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-xl rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            L
        </div>
        <span className="hidden md:block ml-4 text-2xl font-bold tracking-tight text-white">Lumina</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-2 md:px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-full flex items-center justify-center md:justify-start gap-4 p-3 md:px-4 rounded-xl transition-all duration-300 group relative
                ${isActive 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`hidden md:block font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black md:bg-black hidden md:block" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center justify-center md:justify-start gap-4 p-3 text-gray-500 hover:text-white transition-colors">
            <Settings size={20} />
            <span className="hidden md:block font-medium">Settings</span>
        </button>
        <div className="mt-4 hidden md:flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap size={14} className="text-white fill-white" />
            </div>
            <div className="text-xs">
                <p className="text-white font-bold">Pro Plan</p>
                <p className="text-gray-500">Active</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
