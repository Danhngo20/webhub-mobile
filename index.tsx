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
  ArrowRight
} from 'lucide-react';

// --- MOCK DATA ---

const CATEGORIES = [
  { id: 'all', name: 'All', icon: <Grid size={15} /> },
  { id: 'games', name: 'Games', icon: <Gamepad2 size={15} /> },
  { id: 'productivity', name: 'Productivity', icon: <Briefcase size={15} /> },
  { id: 'entertainment', name: 'Entertainment', icon: <Music size={15} /> },
  { id: 'utilities', name: 'Utilities', icon: <Zap size={15} /> },
];

const MOCK_APPS = [
  {
    id: '1',
    name: 'Pixel Painter',
    developer: 'Studio Art',
    icon: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=600&fit=crop&q=80',
    category: 'entertainment',
    rating: 4.8,
    reviews: '1.2K',
    size: '2.4 MB',
    description: 'Create pixel art masterpieces right in your browser. Supports layers, export to PNG, and offline mode. Perfect for retro game enthusiasts and digital artists alike.',
    url: 'https://en.wikipedia.org/wiki/Pixel_art'
  },
  {
    id: '2',
    name: 'TaskFlow',
    developer: 'Productive Inc.',
    icon: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&q=80',
    category: 'productivity',
    rating: 4.5,
    reviews: '890',
    size: '1.1 MB',
    description: 'A simple Kanban board for your daily tasks. Syncs locally and supports drag-and-drop interactions. Never miss a deadline again with smart reminders.',
    url: 'https://en.wikipedia.org/wiki/Kanban'
  },
  {
    id: '3',
    name: 'Neon Racer',
    developer: '8-Bit Dreams',
    icon: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop&q=80',
    category: 'games',
    rating: 4.2,
    reviews: '3.5K',
    size: '5.6 MB',
    description: 'High speed racing game running at 60fps via WebGL. Challenge your friends in time trials and unlock new vehicles as you progress through the neon city.',
    url: 'https://en.wikipedia.org/wiki/Racing_video_game'
  },
  {
    id: '4',
    name: 'NotePad Lite',
    developer: 'SimpleSoft',
    icon: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&h=600&fit=crop&q=80',
    category: 'utilities',
    rating: 4.9,
    reviews: '520',
    size: '0.5 MB',
    description: 'The lightest note taking app available. Opens instantly, no internet required. Auto-saves every keystroke so you never lose an idea.',
    url: 'https://en.wikipedia.org/wiki/Microsoft_Notepad'
  },
  {
    id: '5',
    name: 'Zen Garden',
    developer: 'Relax Apps',
    icon: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1584736538356-42721dc2a9d8?w=800&h=600&fit=crop&q=80',
    category: 'entertainment',
    rating: 4.6,
    reviews: '210',
    size: '3.2 MB',
    description: 'Ambient sounds and visuals to help you focus or sleep. Mix and match rain, wind, and forest sounds to create your perfect environment.',
    url: 'https://en.wikipedia.org/wiki/Zen_garden'
  },
  {
    id: '6',
    name: 'CryptoWatch',
    developer: 'Finance Hub',
    icon: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=150&h=150&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop&q=80',
    category: 'productivity',
    rating: 4.7,
    reviews: '2.1K',
    size: '1.8 MB',
    description: 'Real-time cryptocurrency tracker. View charts, set alerts, and manage your portfolio without leaving your browser.',
    url: 'https://en.wikipedia.org/wiki/Cryptocurrency'
  }
];

// --- HELPER COMPONENTS ---

const Rating = ({ score }: { score: number }) => (
  <div className="flex items-center space-x-1 bg-gray-100/80 px-2 py-1 rounded-lg">
    <span className="text-xs font-bold text-gray-800">{score}</span>
    <Star size={10} className="text-orange-400 fill-orange-400" />
  </div>
);

const AppIcon = ({ src, size = 'md', className = '' }: { src: string, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-20 h-20 rounded-[1.2rem]',
    xl: 'w-28 h-28 rounded-[1.5rem]'
  };
  return (
    <div className={`${sizeClasses[size]} relative overflow-hidden shadow-sm border border-black/5 flex-shrink-0 ${className}`}>
      <img 
        src={src} 
        alt="App Icon" 
        className="w-full h-full object-cover" 
      />
    </div>
  );
};

const Toast = ({ message, type = 'success' }: { message: string, type?: 'success' | 'error' }) => (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[60] animate-fade-in w-full max-w-xs px-4">
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 text-gray-800 px-4 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
         {type === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
      </div>
      <span className="text-sm font-semibold">{message}</span>
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[#F2F2F7]/80 backdrop-blur-xl p-5 pt-14 pb-2 border-b border-gray-200/50 transition-all">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{date}</p>
            <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">Today</h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 p-[2px] shadow-lg mb-2">
             <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="w-full h-full rounded-full border-2 border-white object-cover" />
          </div>
        </div>
      </div>

      {/* Hero Featured Card */}
      <div className="px-5 mt-4 mb-8">
        <div 
          onClick={() => onAppClick(featuredApp)}
          className="relative h-[28rem] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/20 active:scale-[0.98] transition-all duration-300 cursor-pointer group bg-white"
        >
          <img src={featuredApp.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-2 bg-black/30 backdrop-blur-md w-fit px-2 py-1 rounded-md border border-white/10">Game of the Day</span>
            <h3 className="text-white text-4xl font-extrabold mb-2 leading-[0.95] drop-shadow-sm">{featuredApp.name}</h3>
            <p className="text-gray-200 text-sm font-medium line-clamp-2 leading-relaxed opacity-90 mb-4">{featuredApp.description}</p>
            
            {/* Inline App Store-like Button */}
            <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-2 pr-4 border border-white/10 mt-2">
                 <AppIcon src={featuredApp.icon} size="sm" className="border-0 mr-3" />
                 <div className="flex-1">
                     <div className="text-white text-xs font-bold">{featuredApp.name}</div>
                     <div className="text-white/60 text-[10px]">{featuredApp.category}</div>
                 </div>
                 <div className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full">
                    GET
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-5 mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-xl font-bold text-black">Trending Now</h2>
          <button className="text-blue-500 text-sm font-medium hover:opacity-70 transition-opacity">See All</button>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-0 divide-y divide-gray-100">
          {MOCK_APPS.filter(a => a.id !== featuredApp.id).slice(0, 3).map((app, i) => (
            <div 
              key={app.id} 
              onClick={() => onAppClick(app)}
              className="flex items-center space-x-4 py-3 first:pt-0 last:pb-0 active:opacity-60 transition-opacity cursor-pointer"
            >
              <AppIcon src={app.icon} size="md" />
              <div className="flex-1 min-w-0 py-1">
                <h4 className="font-semibold text-gray-900 text-[15px] truncate">{app.name}</h4>
                <p className="text-gray-500 text-xs truncate mt-0.5">{app.developer}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                 <button className="bg-gray-100 text-blue-600 px-5 py-1.5 rounded-full text-xs font-bold uppercase hover:bg-blue-50 transition-colors">
                    Get
                 </button>
                 <span className="text-[9px] text-gray-400">In-App Purchases</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals Horizontal Scroll */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-6">
          <h2 className="text-xl font-bold text-black">New Arrivals</h2>
          <ArrowRight size={18} className="text-gray-400" />
        </div>
        <div className="flex space-x-4 overflow-x-auto px-6 pb-6 no-scrollbar snap-x">
          {MOCK_APPS.map(app => (
            <div 
              key={`new-${app.id}`} 
              onClick={() => onAppClick(app)}
              className="flex-shrink-0 w-36 snap-start cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="relative mb-3">
                  <AppIcon src={app.icon} size="xl" className="w-36 h-36 rounded-[22px] shadow-lg group-hover:shadow-xl transition-shadow" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm truncate leading-tight">{app.name}</h4>
                <p className="text-gray-500 text-xs truncate mt-0.5">{app.category}</p>
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
    const matchesCat = activeCat === 'all' || app.category === activeCat;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-24 no-scrollbar">
      <div className="px-5 pt-14 pb-2 sticky top-0 bg-white/90 backdrop-blur-xl z-20 border-b border-gray-100">
        <h1 className="text-[34px] font-bold text-black mb-4 tracking-tight">Search</h1>
        <div className="relative group">
          <Search className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Games, Apps, Stories and More..."
            className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 outline-none focus:ring-0 focus:bg-gray-100/50 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.3)] transition-all text-[15px] font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full p-0.5">
               <X size={14} />
            </button>
          )}
        </div>
        
        {/* Categories Scroller */}
        <div className="flex space-x-2 overflow-x-auto mt-4 pb-2 no-scrollbar mask-gradient-right">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all active:scale-95 ${
                activeCat === cat.id 
                ? 'bg-black text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
          filteredApps.map((app, index) => (
            <div key={app.id} onClick={() => onAppClick(app)} className="cursor-pointer group active:scale-[0.99] transition-transform duration-200">
              <div className="flex items-center space-x-4 mb-3">
                <AppIcon src={app.icon} size="md" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-base">{app.name}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{app.category}</p>
                </div>
                <div className="bg-gray-100 text-blue-600 px-5 py-1.5 rounded-full text-xs font-bold uppercase">
                    Get
                </div>
              </div>
              {/* Screenshots with gradient overlay */}
              <div className="flex space-x-3 overflow-hidden rounded-[1.5rem] h-48 relative">
                  <div className="w-[60%] h-full rounded-2xl overflow-hidden shadow-sm">
                      <img src={app.cover} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-[40%] h-full flex flex-col space-y-3">
                      <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50 relative">
                          <img src={app.icon} className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-150" />
                          <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-400">Preview 1</span>
                          </div>
                      </div>
                      <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50 relative">
                          <img src={app.cover} className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-150" />
                          <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-400">Preview 2</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          ))
        ) : (
            <div className="text-center py-20 flex flex-col items-center">
                <Search className="text-gray-200 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-900">No results found</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-[200px]">We couldn't find any apps matching your search.</p>
            </div>
        )}
      </div>
    </div>
  );
};

// 3. Library (My Apps)
const LibraryScreen = ({ installedApps, onOpenApp, onAppClick }: { installedApps: string[], onOpenApp: (app: any) => void, onAppClick: (app: any) => void }) => {
  const myApps = MOCK_APPS.filter(app => installedApps.includes(app.id));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F2F2F7] pb-24 no-scrollbar">
      <div className="bg-[#F2F2F7]/90 backdrop-blur-xl p-5 pt-14 pb-4 sticky top-0 z-10 border-b border-gray-200/50">
        <h1 className="text-[34px] font-bold text-black tracking-tight">App Library</h1>
        <div className="relative mt-2">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
             <input type="text" placeholder="Search Library" className="w-full bg-gray-200/50 rounded-xl py-2 pl-9 pr-4 text-sm font-medium outline-none" />
        </div>
      </div>

      <div className="px-5 py-6">
        {myApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400 shadow-inner">
              <Grid size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Library is Empty</h3>
            <p className="text-gray-500 text-sm max-w-[220px] mt-2 leading-relaxed">Installed apps will appear here. Explore the marketplace to add some.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
             <h2 className="text-lg font-bold text-gray-900 mb-0">Recently Added</h2>
            {myApps.map(app => (
              <div key={app.id} className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-all">
                <div className="flex items-center space-x-4 cursor-pointer flex-1" onClick={() => onAppClick(app)}>
                  <AppIcon src={app.icon} size="md" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-[15px]">{app.name}</h4>
                    <p className="text-gray-500 text-xs mt-0.5">{app.developer}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onOpenApp(app)}
                  className="bg-black/5 text-blue-600 font-bold px-5 py-2 rounded-full text-xs uppercase hover:bg-blue-50 transition-colors"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- OVERLAYS ---

// 4. App Details Modal (iOS Style Sheet)
const AppDetailModal = ({ app, onClose, isInstalled, onInstall, onUninstall, onOpen, isInstalling }: any) => {
  const [scrollPos, setScrollPos] = useState(0);
  
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-slide-up">
      {/* Dynamic Header */}
      <div className={`fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-4 pt-12 pb-3 transition-all duration-300 ${scrollPos > 150 ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
         <button onClick={onClose} className={`flex items-center font-semibold text-[17px] active:opacity-50 transition-colors ${scrollPos > 150 ? 'text-blue-600' : 'text-white drop-shadow-md'}`}>
            <ChevronLeft size={26} className="mr-1" />
            {scrollPos > 150 ? 'Back' : ''}
         </button>
         
         {/* Title fades in on scroll */}
         <div className={`transition-opacity duration-300 transform ${scrollPos > 150 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <AppIcon src={app.icon} size="sm" />
         </div>

         <button className={`p-2 rounded-full active:bg-white/20 transition-colors ${scrollPos > 150 ? 'text-blue-600' : 'text-white drop-shadow-md'}`}>
            <MoreVertical size={24} />
         </button>
      </div>

      <div 
        className="flex-1 overflow-y-auto no-scrollbar bg-white"
        onScroll={(e) => setScrollPos(e.currentTarget.scrollTop)}
      >
        {/* Hero Banner */}
        <div className="relative h-[22rem] w-full">
            <img src={app.cover} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>
            
            {/* App Header Content Overlapping Banner */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
                <div className="flex items-end space-x-5">
                    <AppIcon src={app.icon} size="xl" className="shadow-2xl border-2 border-white rounded-[1.8rem]" />
                    <div className="flex-1 pb-1">
                        <h1 className="text-[26px] font-bold text-gray-900 leading-tight mb-1">{app.name}</h1>
                        <p className="text-gray-500 text-sm font-medium">{app.developer}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Body */}
        <div className="px-5 pt-2 pb-24">
            {/* Action Row */}
            <div className="flex items-center justify-between mb-8 mt-4">
               <div className="flex-1 mr-4">
                  {isInstalled ? (
                    <button 
                        onClick={() => onOpen(app)}
                        className="w-full bg-blue-600 text-white py-3.5 rounded-full font-bold text-[15px] shadow-lg shadow-blue-200 active:scale-95 transition-transform"
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
                            : 'bg-blue-600 text-white shadow-blue-200'
                        }`}
                    >
                        {isInstalling ? <Loader2 size={18} className="animate-spin" /> : 'GET'}
                    </button>
                  )}
               </div>
               <button className="bg-gray-100 p-3.5 rounded-full text-blue-600">
                  <Share2 size={20} />
               </button>
               {isInstalled && (
                   <button onClick={() => onUninstall(app.id)} className="bg-gray-100 p-3.5 rounded-full text-red-500 ml-3">
                      <Trash2 size={20} />
                   </button>
               )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 w-full mb-6"></div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 mb-8">
                <div className="flex flex-col items-center px-2">
                    <div className="flex items-center space-x-1 text-gray-400 text-[11px] font-semibold uppercase tracking-wide mb-1">
                        <span>Ratings</span>
                    </div>
                    <div className="font-bold text-2xl text-gray-800">{app.rating}</div>
                    <div className="flex mt-1">
                         {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= Math.round(app.rating) ? "text-orange-400 fill-orange-400" : "text-gray-300"} />)}
                    </div>
                </div>
                 <div className="flex flex-col items-center px-2">
                    <div className="flex items-center space-x-1 text-gray-400 text-[11px] font-semibold uppercase tracking-wide mb-1">
                        <span>Age</span>
                    </div>
                    <div className="font-bold text-2xl text-gray-800">4+</div>
                    <div className="text-gray-400 text-[10px] mt-1">Years Old</div>
                </div>
                 <div className="flex flex-col items-center px-2">
                    <div className="flex items-center space-x-1 text-gray-400 text-[11px] font-semibold uppercase tracking-wide mb-1">
                        <span>Size</span>
                    </div>
                    <div className="font-bold text-2xl text-gray-800">{app.size}</div>
                    <div className="text-gray-400 text-[10px] mt-1">Compact</div>
                </div>
            </div>

             {/* Description */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-7 text-[15px] font-normal">
                    {app.description}
                    <br /><br />
                    This web application is optimized for mobile performance. It runs in a secure sandbox environment and requires minimal storage space on your device.
                </p>
            </div>

             {/* Preview Images (Horizontal Scroll) */}
             <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                    <img src={app.cover} className="h-64 w-auto rounded-[1.5rem] shadow-md border border-gray-100 object-cover" />
                    <img src={app.icon} className="h-64 w-64 rounded-[1.5rem] shadow-md border border-gray-100 object-cover blur-sm" />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

// 5. Simulated Runtime (Browser Shell)
const WebAppRuntime = ({ app, onClose }: { app: any, onClose: () => void }) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-slide-up">
            {/* iOS-style Top Bar */}
            <div className="bg-gray-100/90 backdrop-blur-md pt-12 pb-2 px-4 border-b border-gray-300 flex justify-between items-center relative z-10">
                 <button onClick={onClose} className="text-blue-600 font-semibold text-[17px] active:opacity-50">
                    Done
                 </button>
                 
                 <div className="flex flex-col items-center">
                    <span className="font-semibold text-black text-sm">{app.name}</span>
                    <div className="flex items-center space-x-1 text-[10px] text-gray-500">
                        <Lock size={8} />
                        <span>{new URL(app.url).hostname}</span>
                    </div>
                 </div>

                 <button className="text-blue-600 active:opacity-50">
                    <Share2 size={20} />
                 </button>
            </div>

            {/* WebView Container */}
            <div className="flex-1 bg-white relative">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                        <div className="relative">
                           <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center mb-6">
                              <img src={app.icon} className="w-16 h-16 rounded-2xl object-cover" />
                           </div>
                           <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                              <Loader2 size={12} className="text-white animate-spin" />
                           </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Launching...</h3>
                    </div>
                )}
                <iframe 
                    src={app.url} 
                    className="w-full h-full border-none"
                    onLoad={() => setLoading(false)}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                />
            </div>
            
             {/* Simple Bottom Bar */}
             <div className="bg-gray-100/90 backdrop-blur-md h-12 flex items-center justify-center border-t border-gray-300 safe-area-pb">
                 <div className="flex space-x-8 text-gray-400">
                     <ChevronLeft size={24} />
                     <span className="opacity-30"><ChevronLeft size={24} className="rotate-180" /></span>
                 </div>
             </div>
        </div>
    );
};

// --- MAIN APP LAYOUT ---

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [viewingApp, setViewingApp] = useState<any>(null);
  const [runningApp, setRunningApp] = useState<any>(null);
  const [installedApps, setInstalledApps] = useState<string[]>(['1']); // Pre-install one app
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
    // Simulate network delay for installation
    setTimeout(() => {
        setInstalledApps(prev => [...prev, id]);
        setInstallingId(null);
        setToast({ msg: 'App installed successfully', type: 'success' });
    }, 2000);
  };

  const handleUninstall = (id: string) => {
      if (confirm('Delete this app from your library?')) {
          setInstalledApps(prev => prev.filter(appId => appId !== id));
          setToast({ msg: 'App removed', type: 'success' });
          if (viewingApp && viewingApp.id === id) {
              // Stay on modal but update UI state
          }
      }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onAppClick={setViewingApp} />;
      case 'search': return <SearchScreen onAppClick={setViewingApp} />;
      case 'library': return <LibraryScreen installedApps={installedApps} onOpenApp={setRunningApp} onAppClick={setViewingApp} />;
      case 'profile': return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F2F2F7] animate-fade-in">
            <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-sm">
                <div className="relative mx-auto w-fit mb-6">
                    <div className="w-28 h-28 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full p-1 shadow-lg">
                        <img src="https://i.pravatar.cc/150?img=68" className="w-full h-full rounded-full border-4 border-white object-cover" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-green-500 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white">
                        <Zap size={10} className="text-white" fill="white" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
                <p className="text-gray-400 mb-8 font-medium text-sm">john.doe@example.com</p>
                
                <div className="space-y-3">
                    <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between group active:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                             <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Briefcase size={18} /></div>
                             <span className="text-gray-700 font-semibold text-sm">Purchased</span>
                        </div>
                        <ChevronLeft size={18} className="text-gray-300 rotate-180" />
                    </button>
                    <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between group active:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                             <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Star size={18} /></div>
                             <span className="text-gray-700 font-semibold text-sm">Subscriptions</span>
                        </div>
                        <ChevronLeft size={18} className="text-gray-300 rotate-180" />
                    </button>
                     <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center justify-between group active:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                             <div className="bg-purple-100 p-2 rounded-xl text-purple-600"><Lock size={18} /></div>
                             <span className="text-gray-700 font-semibold text-sm">Privacy</span>
                        </div>
                        <ChevronLeft size={18} className="text-gray-300 rotate-180" />
                    </button>
                </div>

                <button className="w-full py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-colors mt-6">
                    Sign Out
                </button>
            </div>
            <p className="mt-8 text-[11px] font-bold text-gray-300 uppercase tracking-widest">WebHub OS v2.0</p>
        </div>
      );
      default: return <HomeScreen onAppClick={setViewingApp} />;
    }
  };

  return (
    <div className="w-full h-full max-w-md mx-auto bg-white flex flex-col shadow-2xl overflow-hidden relative border-x border-gray-200">
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* Dynamic Content */}
      {renderContent()}

      {/* Bottom Navigation (Glassmorphism) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 pb-6 pt-3 px-6 flex justify-between items-center z-30">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
        >
          <Home size={26} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Today</span>
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === 'search' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
        >
          <Search size={26} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Search</span>
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === 'library' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
        >
          <Grid size={26} strokeWidth={activeTab === 'library' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Apps</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 transition-all active:scale-90 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
        >
          <User size={26} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Account</span>
        </button>
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
