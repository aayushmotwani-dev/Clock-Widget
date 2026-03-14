import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTime } from './hooks/useTime';
import { useAlarms } from './hooks/useAlarms';
import { THEMES } from './constants';
import { QuoteData, ClockSettings, ThemeCategory } from './types';
import { AppleClock, MicrosoftClock, JapanClock, IndiaClock, ChinaClock, FlipClock, NixieClock, SwissClock, WordClock, BinaryClock, WashiClock, JaliClock, GalaxyClock, NasaClock } from './components/ClockThemes';
import { AlarmManager } from './components/AlarmManager';
import { SettingsMenu } from './components/SettingsMenu';
import { getCulturalQuote } from './services/geminiService';

const App: React.FC = () => {
  const time = useTime();
  const [currentThemeId, setCurrentThemeId] = useState<string>('swiss');
  const [isWidgetMode, setIsWidgetMode] = useState<boolean>(false);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'alarms'>('themes');
  const [showWidgetControls, setShowWidgetControls] = useState(false);
  
  // Shuffle State
  const [shuffleIntervalMs, setShuffleIntervalMs] = useState<number | null>(null); // null means OFF
  const [showShuffleMenu, setShowShuffleMenu] = useState(false);
  const [customShuffleSeconds, setCustomShuffleSeconds] = useState<string>('');
  const shuffleMenuRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];
  
  // Background Transition State
  const [activeBg, setActiveBg] = useState(currentTheme.backgroundImage);
  const [nextBg, setNextBg] = useState<string | null>(null);

  const [settings, setSettings] = useState<ClockSettings>({
    is24Hour: false,
    showSeconds: true,
    showDate: true,
    scale: 1,
    customColor: null,
    themeMode: 'dark',
    enableWidgetOverrides: false,
    widgetScale: 1.0,
    widgetColor: null,
    defaultSnoozeMinutes: 5,
  });
  
  const { alarms, addAlarm, removeAlarm, toggleAlarm, triggeredAlarm, dismissAlarm, snoozeAlarm } = useAlarms(time);
  const currentStyles = currentTheme.modes[settings.themeMode];

  // Group themes by category for sidebar
  const themesByCategory = THEMES.reduce((acc, theme) => {
    const cat = theme.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(theme);
    return acc;
  }, {} as Record<ThemeCategory, typeof THEMES>);

  // Handle outside click for shuffle menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shuffleMenuRef.current && !shuffleMenuRef.current.contains(event.target as Node)) {
        setShowShuffleMenu(false);
      }
    };
    if (showShuffleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShuffleMenu]);

  useEffect(() => {
    // Quote fetching
    const fetchQuote = async () => {
      if (currentTheme.type === 'cultural' || currentTheme.id === 'apple' || currentTheme.id === 'microsoft') {
        const data = await getCulturalQuote(currentThemeId);
        setQuote(data);
      } else {
        setQuote({ text: currentTheme.description, author: "ChronoVerse" });
      }
    };
    fetchQuote();
    
    // Handle Background Transition
    if (currentTheme.backgroundImage !== activeBg && currentTheme.backgroundImage !== nextBg) {
       setNextBg(currentTheme.backgroundImage);
       const timer = setTimeout(() => {
         setActiveBg(currentTheme.backgroundImage);
         setNextBg(null);
       }, 800); // Matches CSS duration
       return () => clearTimeout(timer);
    }
  }, [currentThemeId, currentTheme.backgroundImage]); // eslint-disable-line

  // Shuffle Logic
  const navigateTheme = useCallback((direction: 'next' | 'prev') => {
    const currentIndex = THEMES.findIndex(t => t.id === currentThemeId);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= THEMES.length) newIndex = 0;
    if (newIndex < 0) newIndex = THEMES.length - 1;
    setCurrentThemeId(THEMES[newIndex].id);
  }, [currentThemeId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (shuffleIntervalMs && isWidgetMode) {
      interval = setInterval(() => {
        navigateTheme('next');
      }, shuffleIntervalMs);
    }
    return () => clearInterval(interval);
  }, [shuffleIntervalMs, navigateTheme, isWidgetMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        if (isWidgetMode) setIsWidgetMode(false);
        setShowShuffleMenu(false);
      }
      if (!isWidgetMode && !isSettingsOpen) {
        if (e.key === '1') setActiveTab('themes');
        if (e.key === '2') setActiveTab('alarms');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWidgetMode, isSettingsOpen]);

  const toggleWidgetMode = () => setIsWidgetMode(!isWidgetMode);
  const toggleThemeMode = () => setSettings(s => ({...s, themeMode: s.themeMode === 'light' ? 'dark' : 'light'}));

  const setShuffle = (seconds: number | null) => {
    if (seconds === null) {
      setShuffleIntervalMs(null);
    } else {
      setShuffleIntervalMs(seconds * 1000);
    }
    setShowShuffleMenu(false);
  };

  const renderClockFace = () => {
    // Calculate overrides
    const useOverride = isWidgetMode && settings.enableWidgetOverrides;
    const finalScale = useOverride ? settings.widgetScale : settings.scale;
    const finalColor = useOverride ? settings.widgetColor : settings.customColor;

    const props = { 
      time, 
      mode: settings.themeMode, 
      themeStyles: currentStyles, 
      settings,
      overrideScale: finalScale,
      overrideColor: finalColor,
      isWidgetMode // Pass this down to faces if needed
    };

    // Use compound key to force re-animation when theme OR mode changes
    const KeyedComponent = (Component: React.FC<any>) => <Component key={`${currentThemeId}-${settings.themeMode}`} {...props} />;

    switch (currentThemeId) {
      case 'swiss': return KeyedComponent(SwissClock);
      case 'flip': return KeyedComponent(FlipClock);
      case 'nixie': return KeyedComponent(NixieClock);
      case 'galaxy': return KeyedComponent(GalaxyClock);
      case 'word': return KeyedComponent(WordClock);
      case 'binary': return KeyedComponent(BinaryClock);
      case 'apple': return KeyedComponent(AppleClock);
      case 'microsoft': return KeyedComponent(MicrosoftClock);
      case 'nasa': return KeyedComponent(NasaClock);
      case 'japan': return KeyedComponent(JapanClock);
      case 'washi': return KeyedComponent(WashiClock);
      case 'india': return KeyedComponent(IndiaClock);
      case 'jali': return KeyedComponent(JaliClock);
      case 'china': return KeyedComponent(ChinaClock);
      default: return KeyedComponent(AppleClock);
    }
  };

  const isDark = settings.themeMode === 'dark';

  // Advanced Glassmorphism Definitions
  const glassSidebarClass = isDark
    ? 'bg-gradient-to-b from-slate-900/80 to-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
    : 'bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.1)]';

  const glassControlBarClass = isDark
    ? 'bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
    : 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]';
    
  const glassButtonClass = isDark
    ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-white'
    : 'bg-white/40 hover:bg-white/60 border border-white/30 text-slate-800';

  const glassItemClass = isDark
    ? 'hover:bg-white/10 border-transparent hover:border-white/5'
    : 'hover:bg-white/50 border-transparent hover:border-white/30';

  const activeItemClass = 'bg-blue-600/90 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden relative transition-all duration-300 font-sans ${isWidgetMode ? 'p-0' : 'p-6 lg:p-10'}`}
         onMouseEnter={() => isWidgetMode && setShowWidgetControls(true)}
         onMouseLeave={() => isWidgetMode && setShowWidgetControls(false)}
    >
      
      {/* Smooth Background System */}
      <div 
         className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0 scale-105"
         style={{ backgroundImage: `url('${activeBg}')`, opacity: isWidgetMode ? 0 : 1 }}
      />
      {nextBg && (
        <div 
          className="absolute inset-0 bg-cover bg-center animate-in fade-in duration-1000 ease-in-out z-0 scale-105"
          style={{ backgroundImage: `url('${nextBg}')`, opacity: isWidgetMode ? 0 : 1 }}
        />
      )}

      {/* Primary Backdrop Overlay */}
      <div className={`absolute inset-0 transition-all duration-1000 z-0 ${isWidgetMode ? '' : (isDark ? 'bg-black/50 backdrop-blur-[2px]' : 'bg-white/10 backdrop-blur-[2px]')}`}></div>

      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        onUpdate={setSettings}
        isDarkMode={isDark}
      />

      {/* Alarm Notification Overlay */}
      {triggeredAlarm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
           <div className={`p-8 rounded-[2rem] flex flex-col items-center text-center max-w-sm w-full mx-4 border ${glassSidebarClass} ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 animate-pulse border border-red-500/30">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-5xl font-light mb-2">{time.hours}:{String(time.minutes).padStart(2,'0')}</h2>
              <p className="text-xl opacity-70 mb-8 font-medium">{triggeredAlarm.label || "Time is up"}</p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={snoozeAlarm}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 font-bold rounded-2xl transition-all"
                >
                  Snooze
                </button>
                <button 
                  onClick={dismissAlarm}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/40"
                >
                  Dismiss
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Widget Control Bar (Bottom Floating) */}
      {isWidgetMode && (
        <div 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center transition-all duration-500 ease-out
            ${showWidgetControls || showShuffleMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
          `}
        >
          {/* Main Bar */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-full ${glassControlBarClass}`}>
            
            <ControlBtn 
              onClick={() => navigateTheme('prev')} 
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />} 
              label="Prev" 
              isDark={isDark}
            />
            
            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
            
            <div className="relative" ref={shuffleMenuRef}>
              <ControlBtn 
                onClick={() => setShowShuffleMenu(!showShuffleMenu)} 
                icon={shuffleIntervalMs !== null
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" className="animate-spin origin-center" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                }
                label={shuffleIntervalMs ? `${shuffleIntervalMs/1000}s` : "Shuffle"}
                active={shuffleIntervalMs !== null}
                isDark={isDark}
              />
              
              {/* Shuffle Menu - Floating Above */}
              {showShuffleMenu && (
                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 rounded-2xl border p-3 flex flex-col gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-4 zoom-in-95 duration-200
                  ${isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-white/40'} backdrop-blur-xl
                `}>
                  <div className={`text-[10px] uppercase tracking-widest font-bold text-center mb-1 ${isDark ? 'text-white/40' : 'text-black/40'}`}>Shuffle Interval</div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 30, 60].map(sec => (
                      <button 
                        key={sec} 
                        onClick={() => setShuffle(sec)}
                        className={`text-center py-2 rounded-lg text-xs font-bold transition-all border ${shuffleIntervalMs === sec * 1000 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                          : `${isDark ? 'bg-white/5 border-transparent hover:bg-white/10 text-white' : 'bg-black/5 border-transparent hover:bg-black/10 text-slate-800'}`}`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>

                  <div className={`h-px w-full my-1 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}></div>

                  <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        min="1" 
                        max="999"
                        className={`w-full text-xs p-2 rounded-lg border text-center font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors
                          ${isDark ? 'bg-black/20 text-white border-white/10 placeholder-white/20' : 'bg-white text-slate-800 border-black/10 placeholder-black/20'}
                        `}
                        value={customShuffleSeconds}
                        onChange={(e) => setCustomShuffleSeconds(e.target.value)}
                        placeholder="Custom"
                      />
                      <button 
                        onClick={() => setShuffle(parseInt(customShuffleSeconds) || 10)}
                        className={`text-[10px] px-3 py-2 rounded-lg font-bold whitespace-nowrap transition-colors border
                          ${isDark ? 'bg-white/10 border-white/5 hover:bg-white/20 text-white' : 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'}
                        `}
                      >
                        Set
                      </button>
                   </div>
                   
                   {shuffleIntervalMs !== null && (
                     <button 
                      onClick={() => setShuffle(null)} 
                      className="mt-1 w-full text-xs text-red-500 hover:text-white hover:bg-red-500 border border-transparent hover:border-red-600 py-2 rounded-lg font-bold transition-all"
                    >
                       Stop Shuffle
                     </button>
                   )}
                </div>
              )}
            </div>
            
            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>

            <ControlBtn onClick={() => navigateTheme('next')} icon={<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />} label="Next" isDark={isDark} />

            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>

            <ControlBtn 
              onClick={toggleThemeMode} 
              icon={isDark 
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              } 
              label={isDark ? "Light" : "Dark"} 
              isDark={isDark}
            />

            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>

            <ControlBtn 
              onClick={() => setIsSettingsOpen(true)} 
              icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              } 
              icon2={<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />}
              label="Settings" 
              isDark={isDark}
            />

            <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
            
            <button 
              onClick={toggleWidgetMode} 
              className="ml-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase rounded-full transition-all shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              Exit
            </button>
          </div>
        </div>
      )}


      {/* --- MAIN LAYOUT --- */}
      <div className={`relative flex w-full max-w-7xl h-full transition-all duration-500 z-10 ${isWidgetMode ? 'h-screen max-w-none' : 'h-[85vh] lg:h-[90vh]'}`}>
        
        {/* Sidebar Dock - Premium Liquid Glass */}
        {!isWidgetMode && (
          <div className={`
             absolute left-0 top-0 bottom-0 z-20 w-80 rounded-[2rem] flex flex-col overflow-hidden transition-all duration-500
             ${glassSidebarClass} ${isDark ? 'text-white' : 'text-slate-800'}
          `}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
               <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50`}></div>
              <div className="relative z-10">
                <h1 className="text-xl font-bold tracking-tight drop-shadow-sm font-display">ChronoVerse</h1>
                <p className="text-[10px] opacity-60 uppercase tracking-widest font-semibold flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                   Liquid Engine
                </p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2.5 rounded-full transition-all relative z-10 ${glassButtonClass} shadow-lg`}
                title="Settings"
              >
                <svg className="w-5 h-5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Navigation Tabs - Segmented Glass */}
            <div className={`flex p-1.5 mx-6 mt-6 rounded-2xl ${isDark ? 'bg-black/20 border border-white/5' : 'bg-white/20 border border-white/40'}`}>
              <button 
                onClick={() => setActiveTab('themes')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${activeTab === 'themes' ? (isDark ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'bg-white/80 text-slate-800 shadow-lg') : 'opacity-60 hover:opacity-100'}`}
              >
                Faces
              </button>
              <button 
                onClick={() => setActiveTab('alarms')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${activeTab === 'alarms' ? (isDark ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'bg-white/80 text-slate-800 shadow-lg') : 'opacity-60 hover:opacity-100'}`}
              >
                Alarms
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar mask-image-b">
              
              {activeTab === 'themes' && (
                <div className="space-y-6 px-2">
                  {(Object.keys(themesByCategory) as ThemeCategory[]).map(category => (
                    <div key={category}>
                      <h3 className="text-[10px] font-bold opacity-50 uppercase mb-3 ml-1 tracking-widest">{category}</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {themesByCategory[category].map(theme => (
                          <button
                            key={theme.id}
                            onClick={() => setCurrentThemeId(theme.id)}
                            className={`w-full text-left p-3 rounded-2xl transition-all duration-300 flex items-center space-x-3 border group backdrop-blur-md
                              ${currentThemeId === theme.id 
                                ? activeItemClass 
                                : `border-transparent hover:scale-[1.02] hover:shadow-lg ${glassItemClass}`}
                            `}
                          >
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${currentThemeId === theme.id ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'}`}>
                               {theme.name.substring(0,1)}
                             </div>
                             <div>
                               <span className="block font-bold text-sm tracking-tight">{theme.name}</span>
                               <span className="text-[10px] opacity-60 block mt-0.5 font-medium">{theme.type}</span>
                             </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'alarms' && (
                <div className="px-2">
                   <AlarmManager 
                     alarms={alarms} 
                     onAdd={addAlarm} 
                     onRemove={removeAlarm} 
                     onToggle={toggleAlarm}
                     isDarkMode={isDark}
                   />
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="p-5 border-t border-white/5 space-y-3 relative">
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
               {quote && (
                  <div className={`p-4 rounded-2xl text-xs border backdrop-blur-md relative z-10 ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/40 border-white/30'}`}>
                    <p className="italic opacity-80 leading-relaxed font-medium">"{quote.text}"</p>
                    <p className="text-[10px] opacity-50 mt-2 text-right font-bold tracking-wider">— {quote.author}</p>
                  </div>
               )}

               <div className="grid grid-cols-2 gap-3 relative z-10">
                 <button 
                   onClick={toggleThemeMode}
                   className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${glassButtonClass}`}
                 >
                   {isDark ? 'Light' : 'Dark'}
                 </button>
                 <button 
                  onClick={toggleWidgetMode}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${glassButtonClass}`}
                 >
                   Widget Mode
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Main Clock Stage - Free Floating Glass Effect */}
        <div className={`
            flex-1 relative flex items-center justify-center transition-all duration-700 ease-in-out
            ${!isWidgetMode ? 'ml-0 lg:ml-[340px]' : ''}
        `}>
          {/* Main clock scaler and container */}
          <div 
             className={`transition-all duration-500
               ${isWidgetMode ? 'w-full h-full flex items-center justify-center' : (currentTheme.type === 'table' ? 'w-full h-full flex items-center justify-center' : 'w-full max-w-5xl aspect-video rounded-[3rem] overflow-hidden flex items-center justify-center')}
               ${!isWidgetMode && currentTheme.type !== 'table' ? currentStyles.containerClass : ''}
             `}
             style={{ 
               transform: `scale(${isWidgetMode && settings.enableWidgetOverrides ? settings.widgetScale : settings.scale})` 
             }}
           >
             {renderClockFace()}
           </div>
        </div>
      </div>
    </div>
  );
};

const ControlBtn = ({ onClick, icon, icon2, label, active, isDark }: { onClick: () => void, icon: React.ReactNode, icon2?: React.ReactNode, label: string, active?: boolean, isDark?: boolean }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full transition-all group relative hover:scale-110 active:scale-95 flex items-center justify-center
      ${active 
        ? 'bg-blue-600 shadow-lg shadow-blue-600/50 text-white' 
        : `text-opacity-80 hover:text-opacity-100 hover:bg-opacity-10 ${isDark ? 'text-white hover:bg-white' : 'text-slate-800 hover:bg-black'}`
      }
    `}
  >
    <div className="relative w-5 h-5">
      <svg className="w-5 h-5 absolute inset-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {icon}
      </svg>
      {icon2 && (
        <svg className="w-5 h-5 absolute inset-0 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
           {icon2}
        </svg>
      )}
    </div>
    
    <span className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-xl font-bold tracking-wide border
      ${isDark ? 'bg-slate-900/90 text-white border-white/10' : 'bg-white/90 text-slate-900 border-black/10'} backdrop-blur-md translate-y-2 group-hover:translate-y-0
    `}>
      {label}
    </span>
  </button>
)

export default App;
