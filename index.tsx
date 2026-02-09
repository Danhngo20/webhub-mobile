import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Home, 
  Search, 
  Grid, 
  User, 
  Star, 
  Download, 
  Play, 
  ChevronLeft, 
  X, 
  Share2, 
  Trash2,
  MoreVertical,
  Zap,
  Gamepad2,
  Briefcase,
  Music,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Settings,
  Bell,
  Wifi,
  Battery
} from 'lucide-react';

// --- MOCK DATA ---

const CATEGORIES = [
  { id: 'all', name: 'All', icon: <Grid size={15} /> },
  { id: 'games', name: 'Games', icon: <Gamepad2 size={15} /> },
  { id: 'productivity', name: 'Productivity', icon: <Briefcase size={15} /> },
  { id: 'entertainment', name: 'Fun', icon: <Music size={15} /> },
  { id: 'utilities', name: 'Tools', icon: <Zap size={15} /> },
];

const MOCK_APPS = [
  {
    id: '1',
    name: 'Pixel Painter',
    developer: 'Studio Art',
    icon: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=600&fit=crop&q=80',
    category: 'Entertainment',
    rating: 4.8,
    reviews: '1.2K',
    size: '2.4 MB',
    description: 'Create pixel art masterpieces right in your browser. Supports layers, export to PNG, and offline mode.',
    url: 'https://en.wikipedia.org/wiki/Pixel_art'
  },
  {
    id: '2',
    name: 'TaskFlow',
    developer: 'Productive Inc.',
    icon: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&q=80',
    category: 'Productivity',
    rating: 4.5,
    reviews: '890',
    size: '1.1 MB',
    description: 'A simple Kanban board for your daily tasks. Syncs locally and supports drag-and-drop interactions.',
    url: 'https://en.wikipedia.org/wiki/Kanban'
  },
  {
    id: '3',
    name: 'Neon Racer',
    developer: '8-Bit Dreams',
    icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&q=80',
    category: 'Games',
    rating: 4.2,
    reviews: '3.5K',
    size: '5.6 MB',
    description: 'High speed racing game running at 60fps via WebGL. Challenge your friends in time trials.',
    url: 'https://en.wikipedia.org/wiki/Racing_video_game'
  },
  {
    id: '4',
    name: 'NotePad Lite',
    developer: 'SimpleSoft',
    icon: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop&q=80',
    category: 'Utilities',
    rating: 4.9,
    reviews: '520',
    size: '0.5 MB',
    description: 'The lightest note taking app available. Opens instantly, no internet required.',
    url: 'https://en.wikipedia.org/wiki/Microsoft_Notepad'
  },
  {
    id: '5',
    name: 'Zen Garden',
    developer: 'Relax Apps',
    icon: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1584736538356-42721dc2a9d8?w=800&h=600&fit=crop&q=80',
    category: 'Entertainment',
    rating: 4.6,
    reviews: '210',
    size: '3.2 MB',
    description: 'Ambient sounds and visuals to help you focus or sleep.',
    url: 'https://en.wikipedia.org/wiki/Zen_garden'
  },
  {
    id: '6',
    name: 'CryptoWatch',
    developer: 'Finance Hub',
    icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop&q=80',
    category: 'Finance',
    rating: 4.7,
    reviews: '2.1K',
    size: '1.8 MB',
    description: 'Real-time cryptocurrency tracker. View charts, set alerts, and manage your portfolio.',
    url: 'https://en.wikipedia.org/wiki/Cryptocurrency'
  }
];

// --- HELPER COMPONENTS ---

const StatusBar = () => (
  <div className="h-[44px] w-full flex justify-between items-center px-6 absolute top-0 left-0 z-50 pointer-events-none text-black font-medium mix-blend-overlay">
    <span className="text-[15px] font-semibold tracking-wide">9:41</span>
    <div className="flex items-center space-x-1.5">
      <Wifi size={16} strokeWidth={2.5} />
      <Battery size={20} strokeWidth={2.5} className="ml-1" />
    </div>
  </div>
);

const AppIcon = ({ src, size = 'md', className = '' }: { src: string, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-[10px]',
    md: 'w-[60px] h-[60px] rounded-[14px]',
    lg: 'w-20 h-20 rounded-[18px]',
    xl: 'w-28 h-28 rounded-[24px]'
  };
  return (
    <div className={`${sizeClasses[size]} relative overflow-hidden shadow-sm border border-black/5 bg-gray-100 flex-shrink-0 ${className}`}>
      <img 
        src={src} 
        alt="App Icon" 
        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110" 
      />
    </div>
  );
};

const Toast = ({ message, type = 'success' }: { message: string, type?: 'success' | 'error' }) => (
  <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-[60] animate-scale-in w-full max-w-[90%] px-2">
    <div className="bg-white/90 backdrop-blur-2xl border border-white/20 text-gray-900 px-4 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center space-x-3 justify-center">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
         {type === 'success' ? <CheckCircle2 size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
      </div>
      <span className="text-[13px] font-semibold tracking-wide">{message}</span>
    </div>
  </div>
);

// --- SCREENS ---

// 1. Home Screen
const HomeScreen = ({ onAppClick }: { onAppClick: (app: any) => void }) => {
  const featuredApp = MOCK_APPS[2];
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F2F7] pb-24 no-scrollbar">
      {/* Header */}
      <div className="pt-16 pb-2 px-5 flex justify-between items-end sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-sm z-20">
        <div>
          <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">{date}</p>
          <h1 className="text-4xl font-bold text-black tracking-tight">Today</h1>
        </div>
        <button className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shadow-sm active:scale-90 transition-transform">
           <img src="https://i.pravatar.cc/150?img=68" className="w-full h-full object-cover" />
        </button>
      </div>

      {/* Hero Featured Card */}
      <div className="px-5 mt-4 mb-8">
        <div 
          onClick={() => onAppClick(featuredApp)}
          className="relative h-[420px] rounded-[32px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all duration-300 cursor-pointer group bg-white"
        >
          <img src={featuredApp.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
            <span className="text-blue-300 font-bold text-[10px] uppercase tracking-widest mb-1 shadow-black drop-shadow-md">Must Play</span>
            <h3 className="text-white text-[32px] font-bold leading-none mb-2 drop-shadow-md">{featuredApp.name}</h3>
            <p className="text-gray-200 text-sm font-medium line-clamp-2 leading-tight opacity-90 mb-4 drop-shadow-sm">{featuredApp.description}</p>
            
            {/* Inline App Button */}
            <div className="flex items-center bg-white/20 backdrop-blur-xl rounded-[20px] p-2 pr-4 border border-white/10 mt-2 hover:bg-white/30 transition-colors">
                 <AppIcon src={featuredApp.icon} size="sm" className="border-0 mr-3 shadow-none" />
                 <div className="flex-1">
                     <div className="text-white text-[13px] font-bold">{featuredApp.name}</div>
                     <div className="text-white/80 text-[11px]">{featuredApp.category}</div>
                 </div>
                 <div className="bg-white text-black text-[11px] font-bold px-5 py-2 rounded-full shadow-lg">
                    GET
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending List */}
      <div className="px-5 mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[22px] font-bold text-black tracking-tight">Trending Now</h2>
          <button className="text-blue-500 text-[15px] font-medium active:opacity-50 transition-opacity">See All</button>
        </div>
        <div className="bg-white rounded-[24px] p-1 shadow-sm border border-gray-100/50">
          {MOCK_APPS.filter(a => a.id !== featuredApp.id).slice(0, 3).map((app, i) => (
            <div 
              key={app.id} 
              onClick={() => onAppClick(app)}
              className="flex items-center space-x-4 p-3 active:bg-gray-50 rounded-[20px] transition-colors cursor-pointer group"
            >
              <AppIcon src={app.icon} size="md" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-[17px] truncate leading-tight">{app.name}</h4>
                <p className="text-gray-500 text-[13px] truncate mt-0.5">{app.category}</p>
              </div>
              <button className="bg-gray-100 text-blue-600 px-5 py-1.5 rounded-full text-[12px] font-bold hover:bg-blue-50 transition-colors active:scale-95">
                GET
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals Scroll */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3 px-5">
          <h2 className="text-[22px] font-bold text-black tracking-tight">New Arrivals</h2>
          <ArrowRight size={20} className="text-gray-400" />
        </div>
        <div className="flex space-x-4 overflow-x-auto px-5 pb-8 no-scrollbar snap-x snap-mandatory">
          {MOCK_APPS.map(app => (
            <div 
              key={`new-${app.id}`} 
              onClick={() => onAppClick(app)}
              className="flex-shrink-0 w-36 snap-start cursor-pointer active:scale-95 transition-transform"
            >
              <AppIcon src={app.icon} size="xl" className="w-36 h-36 rounded-[28px] shadow-lg mb-3" />
              <div>
                <h4 className="font-semibold text-gray-900 text-[15px] truncate">{app.name}</h4>
                <p className="text-gray-500 text-[13px] truncate">{app.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Search Screen
const SearchScreen = ({ onAppClick }: { onAppClick: (app: any) => void }) => {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  const filteredApps = MOCK_APPS.filter(app => {
    const matchesQuery = app.name.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCat === 'all' || app.category.toLowerCase() === activeCat.toLowerCase();
    return matchesQuery && (activeCat === 'all' || matchesCat);
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-24 no-scrollbar">
      <div className="pt-16 px-5 pb-4 sticky top-0 bg-white/90 backdrop-blur-xl z-20 border-b border-gray-100/50">
        <h1 className="text-[34px] font-bold text-black mb-4 tracking-tight">Search</h1>
        <div className="relative group">
          <Search className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
          <input
            type="text"
            placeholder="Games, Apps, Stories..."
            className="w-full bg-gray-100 rounded-[14px] py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 outline-none focus:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 transition-all text-[17px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-3.5 bg-gray-300 rounded-full p-0.5 text-white active:scale-90 transition-transform">
               <X size={14} />
            </button>
          )}
        </div>
        
        <div className="flex space-x-2 overflow-x-auto mt-4 pb-1 no-scrollbar mask-gradient-right">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all active:scale-95 ${
                activeCat === cat.id 
                ? 'bg-black text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id} onClick={() => onAppClick(app)} className="cursor-pointer group active:scale-[0.98] transition-transform duration-200">
              <div className="flex items-center space-x-4 mb-3">
                <AppIcon src={app.icon} size="md" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-[17px]">{app.name}</h4>
                  <p className="text-gray-500 text-[13px]">{app.category}</p>
                </div>
                <div className="bg-gray-100 text-blue-600 px-5 py-1.5 rounded-full text-[12px] font-bold">
                    GET
                </div>
              </div>
              <div className="flex space-x-3 overflow-hidden rounded-[24px] h-52 relative">
                  <div className="w-[60%] h-full rounded-[20px] overflow-hidden shadow-sm">
                      <img src={app.cover} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-[40%] h-full flex flex-col space-y-3">
                      <div className="flex-1 rounded-[20px] overflow-hidden bg-gray-50 relative">
                          <img src={app.icon} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 scale-150" />
                          <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[11px] font-bold text-gray-500/80 uppercase">Preview</span>
                          </div>
                      </div>
                      <div className="flex-1 rounded-[20px] overflow-hidden bg-gray-50 relative">
                          <img src={app.cover} className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-60 scale-150" />
                      </div>
                  </div>
              </div>
            </div>
          ))
        ) : (
            <div className="text-center py-20 opacity-50">
                <Search className="mx-auto mb-4" size={48} />
                <p>No results found</p>
            </div>
        )}
      </div>
    </div>
  );
};

// 3. Library (My Apps - Grid View)
const LibraryScreen = ({ installedApps, onOpenApp, onAppClick }: { installedApps: string[], onOpenApp: (app: any) => void, onAppClick: (app: any) => void }) => {
  const myApps = MOCK_APPS.filter(app => installedApps.includes(app.id));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F2F7] pb-24 no-scrollbar">
      <div className="pt-16 px-5 pb-2 sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-xl z-20">
        <h1 className="text-[34px] font-bold text-black tracking-tight">App Library</h1>
        <div className="relative mt-2">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
             <input type="text" placeholder="Search Library" className="w-full bg-[#E5E5EA] rounded-[10px] py-2 pl-9 pr-4 text-[15px] outline-none placeholder-gray-500" />
        </div>
      </div>

      <div className="px-5 py-6">
        {myApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <Grid size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Library Empty</h3>
            <p className="text-gray-500 text-sm mt-2">Downloaded apps appear here.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Recently Added</h2>
            <div className="grid grid-cols-4 gap-x-4 gap-y-8 animate-fade-in">
                {myApps.map(app => (
                    <div key={app.id} className="flex flex-col items-center space-y-2 group cursor-pointer active:scale-95 transition-transform" onClick={() => onOpenApp(app)}>
                        <AppIcon src={app.icon} size="md" className="shadow-sm" />
                        <span className="text-[11px] font-medium text-gray-700 text-center leading-tight line-clamp-2 w-full">{app.name}</span>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- OVERLAYS ---

// 4. App Details Modal
const AppDetailModal = ({ app, onClose, isInstalled, onInstall, onUninstall, onOpen, isInstalling }: any) => {
  const [scrollPos, setScrollPos] = useState(0);
  
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-slide-up">
      <StatusBar />
      
      {/* Header Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 pt-12 pb-3 transition-all duration-300 ${scrollPos > 250 ? 'bg-white/80 backdrop-blur-xl shadow-sm' : ''}`}>
         <button onClick={onClose} className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${scrollPos > 250 ? 'bg-gray-100 text-black' : 'bg-black/20 text-white'}`}>
            <ChevronLeft size={20} strokeWidth={3} />
         </button>
         
         <div className={`flex items-center space-x-2 transition-opacity duration-300 ${scrollPos > 250 ? 'opacity-100' : 'opacity-0'}`}>
            <img src={app.icon} className="w-6 h-6 rounded-md border border-black/5" />
            <button 
                onClick={isInstalled ? () => onOpen(app) : () => onInstall(app.id)}
                className="bg-blue-600 text-white text-[11px] font-bold px-4 py-1 rounded-full"
            >
                {isInstalled ? 'OPEN' : 'GET'}
            </button>
         </div>

         <button className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${scrollPos > 250 ? 'bg-gray-100 text-black' : 'bg-black/20 text-white'}`}>
            <MoreVertical size={18} strokeWidth={2.5} />
         </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto no-scrollbar bg-white"
        onScroll={(e) => setScrollPos(e.currentTarget.scrollTop)}
      >
        {/* Parallax Cover */}
        <div className="relative h-[400px] w-full -mt-20">
            <img src={app.cover} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white"></div>
            
            {/* Header Content */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
                <div className="flex items-start space-x-5">
                    <AppIcon src={app.icon} size="xl" className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border-2 border-white rounded-[26px]" />
                    <div className="flex-1 pt-2">
                        <h1 className="text-[26px] font-bold text-gray-900 leading-tight mb-1">{app.name}</h1>
                        <p className="text-gray-500 text-[15px]">{app.developer}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 rounded-[4px]">AD</span>
                            <span className="text-[10px] text-gray-400">In-App Purchases</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-0 pb-24">
            {/* Action Row */}
            <div className="flex items-center justify-between mb-8 mt-2">
               <div className="flex-1 mr-4">
                  {isInstalled ? (
                    <button 
                        onClick={() => onOpen(app)}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-full font-bold text-[15px] shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"
                    >
                        OPEN
                    </button>
                  ) : (
                    <button 
                        onClick={() => onInstall(app.id)}
                        disabled={isInstalling}
                        className={`w-full py-3.5 rounded-full font-bold text-[15px] shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 ${
                            isInstalling 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-blue-600 text-white shadow-blue-500/30'
                        }`}
                    >
                        {isInstalling ? <Loader2 size={18} className="animate-spin" /> : 'GET'}
                    </button>
                  )}
               </div>
               <button className="bg-blue-50 p-3.5 rounded-full text-blue-600 active:scale-90 transition-transform">
                  <Share2 size={20} strokeWidth={2.5} />
               </button>
               {isInstalled && (
                   <button onClick={() => onUninstall(app.id)} className="bg-red-50 p-3.5 rounded-full text-red-500 ml-3 active:scale-90 transition-transform">
                      <Trash2 size={20} strokeWidth={2.5} />
                   </button>
               )}
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-8 overflow-x-auto no-scrollbar">
                <div className="flex flex-col items-center min-w-[80px] border-r border-gray-100 last:border-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Ratings</span>
                    <div className="font-bold text-[22px] text-gray-800 leading-none">{app.rating}</div>
                    <div className="flex mt-1 text-orange-400"><Star size={10} fill="currentColor" /></div>
                </div>
                <div className="flex flex-col items-center min-w-[80px] border-r border-gray-100 last:border-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Age</span>
                    <div className="font-bold text-[22px] text-gray-800 leading-none">4+</div>
                    <span className="text-[11px] text-gray-400 mt-1">Years</span>
                </div>
                <div className="flex flex-col items-center min-w-[80px] border-r border-gray-100 last:border-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Size</span>
                    <div className="font-bold text-[22px] text-gray-800 leading-none">{app.size}</div>
                    <span className="text-[11px] text-gray-400 mt-1">MB</span>
                </div>
                 <div className="flex flex-col items-center min-w-[80px] last:border-0">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">Chart</span>
                    <div className="font-bold text-[22px] text-gray-800 leading-none">#1</div>
                    <span className="text-[11px] text-gray-400 mt-1">{app.category}</span>
                </div>
            </div>

            {/* Description */}
            <div className="mb-8">
                <p className="text-gray-800 text-[15px] leading-relaxed">
                    {app.description}
                </p>
                <button className="text-blue-600 text-[15px] mt-1 font-medium">more</button>
            </div>

             {/* Preview */}
             <div>
                <h2 className="text-[19px] font-bold text-black mb-4 tracking-tight">Preview</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 snap-x">
                    <img src={app.cover} className="h-[300px] w-auto rounded-[24px] shadow-sm border border-black/5 object-cover snap-center" />
                    <img src={app.icon} className="h-[300px] w-[300px] rounded-[24px] shadow-sm border border-black/5 object-cover blur-md snap-center" />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

// 5. Simulated Runtime
const WebAppRuntime = ({ app, onClose }: { app: any, onClose: () => void }) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-slide-up">
            <StatusBar />
            
            {/* Top Bar */}
            <div className="pt-12 pb-3 px-4 flex justify-between items-center bg-gray-50/80 backdrop-blur-md border-b border-gray-200">
                 <button onClick={onClose} className="text-blue-600 font-bold text-[17px] active:opacity-50">
                    Done
                 </button>
                 
                 <div className="flex flex-col items-center">
                    <div className="flex items-center space-x-1">
                        <Lock size={10} className="text-gray-900" strokeWidth={3} />
                        <span className="font-bold text-black text-[15px]">{new URL(app.url).hostname}</span>
                    </div>
                 </div>

                 <button className="text-black active:opacity-50">
                    <MoreVertical size={22} />
                 </button>
            </div>

            {/* WebView */}
            <div className="flex-1 bg-white relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                         <div className="w-16 h-16 bg-gray-100 rounded-[16px] mb-4 animate-pulse"></div>
                        <h3 className="font-semibold text-gray-400 text-sm">Loading...</h3>
                    </div>
                )}
                <iframe 
                    src={app.url} 
                    className="w-full h-full border-none"
                    onLoad={() => setLoading(false)}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
            
             {/* Bottom Home Indicator Area */}
             <div className="bg-white h-[34px] w-full flex justify-center pt-2 safe-pb">
                 <div className="w-[120px] h-[5px] bg-black rounded-full"></div>
             </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [viewingApp, setViewingApp] = useState<any>(null);
  const [runningApp, setRunningApp] = useState<any>(null);
  const [installedApps, setInstalledApps] = useState<string[]>(['1']);
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleInstall = (id: string) => {
    setInstallingId(id);
    setTimeout(() => {
        setInstalledApps(prev => [...prev, id]);
        setInstallingId(null);
        setToast({ msg: 'App installed', type: 'success' });
    }, 1500);
  };

  const handleUninstall = (id: string) => {
      setInstalledApps(prev => prev.filter(appId => appId !== id));
      setToast({ msg: 'App deleted', type: 'success' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onAppClick={setViewingApp} />;
      case 'search': return <SearchScreen onAppClick={setViewingApp} />;
      case 'library': return <LibraryScreen installedApps={installedApps} onOpenApp={setRunningApp} onAppClick={setViewingApp} />;
      case 'profile': return (
        <div className="flex-1 bg-[#F2F2F7] p-5 pt-16 animate-fade-in">
           <h1 className="text-[34px] font-bold text-black mb-6 tracking-tight">Account</h1>
           
           <div className="bg-white rounded-[14px] p-4 flex items-center space-x-4 mb-6 shadow-sm border border-gray-200/50">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                   <img src="https://i.pravatar.cc/150?img=68" className="w-full h-full object-cover" />
              </div>
              <div>
                  <h2 className="text-[19px] font-semibold text-black">John Doe</h2>
                  <p className="text-gray-400 text-[15px]">john.doe@icloud.com</p>
              </div>
           </div>

           <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-200/50 space-y-px">
               {['Purchased', 'Subscriptions', 'Notifications'].map((item) => (
                   <div key={item} className="p-4 flex justify-between items-center bg-white active:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0">
                       <span className="text-[17px] text-black font-medium">{item}</span>
                       <ChevronLeft size={18} className="text-gray-300 rotate-180" strokeWidth={2.5} />
                   </div>
               ))}
           </div>
           
           <button className="mt-8 w-full py-3.5 text-blue-600 font-semibold text-[17px] bg-white rounded-[14px] shadow-sm border border-gray-200/50">
               Sign Out
           </button>
        </div>
      );
      default: return <HomeScreen onAppClick={setViewingApp} />;
    }
  };

  return (
    <div className="w-full h-full max-w-[420px] mx-auto bg-white flex flex-col shadow-2xl overflow-hidden relative border-x border-gray-900 rounded-[40px] my-4 md:h-[90vh]">
      <StatusBar />
      
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {renderContent()}

      {/* Floating Dock Navigation */}
      <div className="absolute bottom-6 left-6 right-6 h-[72px] bg-white/80 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-white/20 flex justify-between items-center px-6 z-30">
        {[
          { id: 'home', icon: Home, label: 'Today' },
          { id: 'search', icon: Search, label: 'Search' },
          { id: 'library', icon: Grid, label: 'Apps' },
          { id: 'profile', icon: User, label: 'Account' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-all duration-300 active:scale-75 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <tab.icon size={26} strokeWidth={activeTab === tab.id ? 2.5 : 2} fill={activeTab === tab.id && tab.id !== 'search' && tab.id !== 'profile' ? "currentColor" : "none"} />
          </button>
        ))}
      </div>

      {/* Overlays */}
      {viewingApp && (
        <AppDetailModal 
            app={viewingApp} 
            onClose={() => setViewingApp(null)}
            isInstalled={installedApps.includes(viewingApp.id)}
            isInstalling={installingId === viewingApp.id}
            onInstall={handleInstall}
            onUninstall={handleUninstall}
            onOpen={(app: any) => {
                setViewingApp(null);
                setRunningApp(app);
            }}
        />
      )}

      {runningApp && (
          <WebAppRuntime 
            app={runningApp} 
            onClose={() => setRunningApp(null)} 
          />
      )}

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
