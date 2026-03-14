import React from 'react';
import { TimeState, ThemeModeData, ClockSettings } from '../types';

interface ClockFaceProps {
  time: TimeState;
  mode: 'light' | 'dark';
  themeStyles: ThemeModeData;
  settings: ClockSettings;
  overrideScale?: number;
  overrideColor?: string | null;
}

// Helpers
const getDisplayHours = (hours: number, is24Hour: boolean): string => {
  if (is24Hour) return hours.toString().padStart(2, '0');
  const h = hours % 12 || 12;
  return h.toString().padStart(2, '0');
};
const pad = (num: number) => num.toString().padStart(2, '0');

// Hook to resolve color
const useActiveColor = (settings: ClockSettings, overrideColor?: string | null) => {
  const color = overrideColor || settings.customColor;
  return color ? { color } : {};
};

// Wrapper with smoother transition (Scale Up & Fade In)
const AnimatedWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 ease-out fill-mode-forwards">
    {children}
  </div>
);

// --- FACES ---

export const SwissClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const secondDeg = (time.seconds / 60) * 360;
  const minuteDeg = (time.minutes / 60) * 360 + (time.seconds / 60) * 6;
  const hourDeg = ((time.hours % 12) / 12) * 360 + (time.minutes / 60) * 30;
  const activeColorStyle = useActiveColor(settings, overrideColor);
  const activeColorVal = overrideColor || settings.customColor;

  return (
    <AnimatedWrapper>
      <div className={`relative w-[90%] h-[90%] rounded-full ${themeStyles.containerClass}`}>
         <div className="absolute inset-0 rounded-full">
           {[...Array(12)].map((_, i) => (
             <div 
               key={i} 
               className={`absolute w-2 h-6 left-1/2 -ml-1 top-4 origin-center ${mode === 'dark' ? 'bg-gray-300' : 'bg-gray-800'}`}
               style={{ transform: `rotate(${i * 30}deg) translate(0, 10px)`, backgroundColor: activeColorVal || undefined }} 
             />
           ))}
         </div>
         {settings.showDate && (
           <div className={`absolute right-[20%] top-1/2 -translate-y-1/2 border px-2 py-0.5 rounded text-sm font-semibold tracking-wider ${mode === 'dark' ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-300 bg-gray-100 text-gray-800'}`} style={activeColorStyle}>
             {time.rawDate.getDate()}
           </div>
         )}
         <div 
           className={`absolute top-[25%] left-1/2 -ml-[3px] w-[6px] h-[25%] bg-current origin-bottom rounded-full shadow-lg transition-transform duration-500 ease-out ${mode === 'dark' ? 'text-white' : 'text-black'}`}
           style={{ transform: `rotate(${hourDeg}deg)`, ...activeColorStyle }}
         />
         <div 
           className={`absolute top-[10%] left-1/2 -ml-[2px] w-[4px] h-[40%] bg-current origin-bottom rounded-full shadow-lg transition-transform duration-500 ease-out ${mode === 'dark' ? 'text-white' : 'text-black'}`}
           style={{ transform: `rotate(${minuteDeg}deg)`, ...activeColorStyle }}
         />
         {settings.showSeconds && (
           <div 
             className={`absolute top-[10%] left-1/2 -ml-[1px] w-[2px] h-[45%] origin-bottom rounded-full shadow-sm transition-transform duration-100 linear ${themeStyles.accentClass}`}
             style={{ transform: `rotate(${secondDeg}deg)` }}
           ></div>
         )}
         <div className={`absolute top-1/2 left-1/2 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full ring-2 ring-white ${mode === 'dark' ? 'bg-black' : 'bg-black'}`}></div>
      </div>
    </AnimatedWrapper>
  );
};

export const GalaxyClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const secondDeg = (time.seconds / 60) * 360;
  const minuteDeg = (time.minutes / 60) * 360 + (time.seconds / 60) * 6;
  const hourDeg = ((time.hours % 12) / 12) * 360 + (time.minutes / 60) * 30;
  const activeColorStyle = useActiveColor(settings, overrideColor);

  return (
    <AnimatedWrapper>
      <div className={`relative w-[90%] h-[90%] rounded-full overflow-hidden ${themeStyles.containerClass}`}>
         {/* Stars background effect */}
         <div className="absolute inset-0 opacity-50">
             {[...Array(20)].map((_, i) => (
                 <div key={i} className="absolute bg-white rounded-full w-0.5 h-0.5 animate-pulse" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDelay: `${Math.random()*2}s` }}></div>
             ))}
         </div>

         {/* Indices */}
         <div className="absolute inset-0 rounded-full">
           {[...Array(12)].map((_, i) => (
             <div 
               key={i} 
               className={`absolute w-1 h-1 rounded-full left-1/2 -ml-0.5 top-6 origin-center ${mode === 'dark' ? 'bg-white shadow-[0_0_5px_white]' : 'bg-blue-900'}`}
               style={{ transform: `rotate(${i * 30}deg) translate(0, 10px)` }} 
             />
           ))}
         </div>

         <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] opacity-60 ${themeStyles.subTextClass}`}>Nebula</div>

         {/* Hands */}
         <div 
           className={`absolute top-[25%] left-1/2 -ml-[1px] w-[2px] h-[25%] bg-current origin-bottom rounded-full transition-transform duration-500 ease-out ${themeStyles.textClass}`}
           style={{ transform: `rotate(${hourDeg}deg)`, ...activeColorStyle }}
         />
         <div 
           className={`absolute top-[15%] left-1/2 -ml-[0.5px] w-[1px] h-[35%] bg-current origin-bottom rounded-full transition-transform duration-500 ease-out ${themeStyles.textClass}`}
           style={{ transform: `rotate(${minuteDeg}deg)`, ...activeColorStyle }}
         />
         {settings.showSeconds && (
           <div 
             className={`absolute top-[15%] left-1/2 -ml-[0.5px] w-[1px] h-[35%] origin-bottom rounded-full ${themeStyles.accentClass}`}
             style={{ transform: `rotate(${secondDeg}deg)` }}
           >
             <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${themeStyles.accentClass}`}></div>
           </div>
         )}
         <div className={`absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-white`}></div>
      </div>
    </AnimatedWrapper>
  );
};

export const NasaClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  return (
    <AnimatedWrapper>
      <div className={`relative w-full h-full flex flex-col items-center justify-center p-4 font-mono ${themeStyles.textClass}`}>
        <div className={`absolute inset-4 border-2 border-dashed opacity-20 rounded-lg ${mode === 'dark' ? 'border-green-500' : 'border-black'}`}></div>
        <div className="absolute top-6 left-6 text-xs flex flex-col gap-1 opacity-70">
           <span>STS-135</span>
           <span>T-MINUS</span>
        </div>
        <div className="absolute top-6 right-6 text-xs flex flex-col items-end gap-1 opacity-70">
           <span>ORBIT: 213</span>
           <span>APOGEE: OK</span>
        </div>
        
        {/* Orbital ring */}
        <div className={`absolute w-64 h-64 rounded-full border border-current opacity-20 animate-spin-slow`}>
           <div className="absolute -top-1 left-1/2 w-2 h-2 bg-current rounded-full"></div>
        </div>

        <div className={`z-10 flex flex-col items-center p-8 rounded-lg ${themeStyles.containerClass}`} style={{ borderColor: overrideColor ? `${overrideColor}40` : undefined }}>
           <div className="text-6xl font-bold tracking-tighter" style={activeColorStyle}>
             {getDisplayHours(time.hours, settings.is24Hour)}{pad(time.minutes)}
           </div>
           {settings.showSeconds && <div className="text-xl mt-2 w-full text-right" style={activeColorStyle}>.{pad(time.seconds)}</div>}
        </div>
        
        {settings.showDate && <div className="absolute bottom-8 font-bold tracking-widest text-xs opacity-60">MISSION TIME: {time.date.toUpperCase()}</div>}
      </div>
    </AnimatedWrapper>
  );
};

export const WashiClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const secondDeg = (time.seconds / 60) * 360;
  const minuteDeg = (time.minutes / 60) * 360 + (time.seconds / 60) * 6;
  const hourDeg = ((time.hours % 12) / 12) * 360 + (time.minutes / 60) * 30;
  const activeColorStyle = useActiveColor(settings, overrideColor);

  return (
    <AnimatedWrapper>
      <div className={`relative w-[90%] h-[90%] rounded-full ${themeStyles.containerClass}`}>
         {/* Washi Texture Overlay */}
         <div className="absolute inset-0 rounded-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/rice-paper.png')]"></div>
         
         {/* Gold flakes */}
         <div className="absolute inset-0 rounded-full overflow-hidden">
             <div className="absolute top-10 left-20 w-8 h-8 bg-yellow-400 opacity-20 blur-xl rounded-full"></div>
             <div className="absolute bottom-20 right-10 w-12 h-12 bg-yellow-500 opacity-10 blur-xl rounded-full"></div>
         </div>

         {/* Minimal indices */}
         <div className="absolute inset-0 rounded-full">
           {[0, 3, 6, 9].map((i) => (
             <div 
               key={i} 
               className={`absolute w-1 h-3 left-1/2 -ml-0.5 top-2 origin-center ${mode === 'dark' ? 'bg-[#d4af37]' : 'bg-red-800'}`}
               style={{ transform: `rotate(${i * 30 * 3}deg) translate(0, 10px)` }} 
             />
           ))}
         </div>

         {/* Hands */}
         <div 
           className={`absolute top-[25%] left-1/2 -ml-[2px] w-[4px] h-[25%] bg-current origin-bottom rounded-sm shadow-sm transition-transform duration-500 ease-out ${themeStyles.textClass}`}
           style={{ transform: `rotate(${hourDeg}deg)`, ...activeColorStyle }}
         />
         <div 
           className={`absolute top-[10%] left-1/2 -ml-[1px] w-[2px] h-[40%] bg-current origin-bottom rounded-sm shadow-sm transition-transform duration-500 ease-out ${themeStyles.textClass}`}
           style={{ transform: `rotate(${minuteDeg}deg)`, ...activeColorStyle }}
         />
         {settings.showSeconds && (
           <div 
             className={`absolute top-[10%] left-1/2 -ml-[0.5px] w-[1px] h-[45%] origin-bottom rounded-full ${themeStyles.accentClass}`}
             style={{ transform: `rotate(${secondDeg}deg)` }}
           ></div>
         )}
         <div className={`absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full ${mode === 'dark' ? 'bg-[#d4af37]' : 'bg-red-800'}`}></div>
      </div>
    </AnimatedWrapper>
  );
};

export const JaliClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);

  return (
    <AnimatedWrapper>
      <div className={`relative w-[90%] h-[90%] rounded-full ${themeStyles.containerClass} overflow-hidden`}>
         {/* Shadow play from "lattice" */}
         <div className="absolute inset-0 rounded-full opacity-10 bg-[radial-gradient(circle_at_center,_transparent_40%,_black_100%)]"></div>
         
         <div className={`z-10 flex flex-col items-center justify-center font-india ${themeStyles.textClass}`} style={activeColorStyle}>
            <span className="text-xs tracking-widest mb-2 opacity-60">JALI</span>
            <div className="flex items-baseline">
               <span className="text-6xl font-bold drop-shadow-md">{getDisplayHours(time.hours, settings.is24Hour)}</span>
               <span className="text-4xl px-1 opacity-50">:</span>
               <span className="text-6xl font-light drop-shadow-md">{pad(time.minutes)}</span>
            </div>
            {settings.showDate && <div className="mt-4 text-sm border-t border-current pt-1 opacity-80">{time.date}</div>}
         </div>
      </div>
    </AnimatedWrapper>
  );
};

export const FlipClock: React.FC<ClockFaceProps> = ({ time, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  
  const FlipCard = ({ value, label }: { value: string, label: string }) => (
    <div className="flex flex-col items-center">
      <div className={`relative bg-[#222] rounded-lg p-4 sm:p-8 shadow-inner border-b-2 border-black`}>
        <div className="absolute inset-x-0 top-1/2 h-[2px] bg-black/40 z-20"></div>
        <span className="font-flip text-6xl sm:text-9xl text-neutral-100 tracking-wider leading-none relative z-10" style={activeColorStyle}>{value}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-lg"></div>
      </div>
      <span className="text-xs uppercase mt-2 font-bold opacity-40" style={activeColorStyle}>{label}</span>
    </div>
  );

  return (
    <AnimatedWrapper>
      <div className="flex flex-col items-center justify-center gap-8 p-12">
        <div className="flex items-center gap-4 sm:gap-8">
          <FlipCard value={getDisplayHours(time.hours, settings.is24Hour)} label="Hours" />
          <FlipCard value={pad(time.minutes)} label="Minutes" />
          {settings.showSeconds && <FlipCard value={pad(time.seconds)} label="Seconds" />}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export const NixieClock: React.FC<ClockFaceProps> = ({ time, themeStyles, settings, overrideColor }) => {
  const activeColor = overrideColor || settings.customColor;
  const colorStyle = activeColor ? { color: activeColor, textShadow: `0 0 10px ${activeColor}, 0 0 20px ${activeColor}` } : {};

  const NixieDigit = ({ value }: { value: string }) => (
    <div className="relative w-16 h-28 sm:w-24 sm:h-40 bg-black/40 rounded-full border border-white/5 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
      <span className={`font-mono text-6xl sm:text-8xl z-10 ${themeStyles.textClass} animate-flicker`} style={colorStyle}>{value}</span>
    </div>
  );

  return (
    <AnimatedWrapper>
      <div className="flex flex-col items-center justify-center gap-8 p-6 bg-black/80 rounded-xl border-4 border-gray-800 shadow-[0_0_50px_rgba(0,0,0,1)]">
        <div className="flex items-end gap-2 sm:gap-4">
          <div className="flex gap-2">{getDisplayHours(time.hours, settings.is24Hour).split('').map((d, i) => <NixieDigit key={`h-${i}`} value={d} />)}</div>
          <div className="flex flex-col gap-4 mb-8 sm:mb-12 animate-pulse">
             <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_orange]" style={activeColor ? {backgroundColor: activeColor, boxShadow: `0 0 10px ${activeColor}`} : {}}></div>
             <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_orange]" style={activeColor ? {backgroundColor: activeColor, boxShadow: `0 0 10px ${activeColor}`} : {}}></div>
          </div>
          <div className="flex gap-2">{pad(time.minutes).split('').map((d, i) => <NixieDigit key={`m-${i}`} value={d} />)}</div>
          {settings.showSeconds && (
            <div className="flex gap-2 scale-75 origin-bottom ml-2">
               {pad(time.seconds).split('').map((d, i) => <NixieDigit key={`s-${i}`} value={d} />)}
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export const AppleClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  return (
    <AnimatedWrapper>
      <div className={`relative flex flex-col items-center justify-center w-full h-full p-8 ${themeStyles.textClass}`} style={activeColorStyle}>
        <div className={`absolute top-10 left-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow ${mode === 'dark' ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
        <div className={`absolute bottom-10 right-10 w-32 h-32 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow ${mode === 'dark' ? 'bg-purple-600' : 'bg-purple-400'}`}></div>
        <div className="z-10 flex flex-col items-center">
          <div className="text-8xl font-thin tracking-tighter flex items-baseline space-x-2">
            <span className="font-bold">{getDisplayHours(time.hours, settings.is24Hour)}</span>
            <span className="animate-pulse">:</span>
            <span className="font-light">{pad(time.minutes)}</span>
            {settings.showSeconds && <span className="text-4xl font-extralight opacity-60 ml-2">{pad(time.seconds)}</span>}
          </div>
          {settings.showDate && <div className={`text-xl font-medium mt-2 uppercase tracking-widest opacity-80 ${themeStyles.subTextClass}`} style={activeColorStyle}>{time.date}</div>}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export const MicrosoftClock: React.FC<ClockFaceProps> = ({ time, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  return (
    <AnimatedWrapper>
      <div className={`relative w-full h-full flex flex-col p-6 justify-between ${themeStyles.textClass}`} style={activeColorStyle}>
         <div className="z-10 flex flex-col">
            <span className="text-8xl font-light tracking-tight leading-none mb-1">
              {getDisplayHours(time.hours, settings.is24Hour)}<span className="opacity-50">:</span>{pad(time.minutes)}
            </span>
             {settings.showSeconds && <span className="text-4xl font-light opacity-60">{pad(time.seconds)}</span>}
            {settings.showDate && <span className={`text-2xl font-light mt-4 ${themeStyles.subTextClass}`} style={activeColorStyle}>{time.date}</span>}
         </div>
      </div>
    </AnimatedWrapper>
  );
};

export const JapanClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  return (
    <AnimatedWrapper>
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${themeStyles.textClass}`} style={activeColorStyle}>
        <div className="absolute top-0 right-10 text-pink-300 text-4xl opacity-50 animate-bounce delay-75">❀</div>
        <div className={`absolute w-64 h-64 rounded-full opacity-5 blur-2xl ${mode === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}></div>
        <div className={`z-10 flex flex-row-reverse items-start gap-8 border-r-2 pr-8 ${mode === 'dark' ? 'border-red-500/20' : 'border-red-900/20'}`} style={{ borderColor: overrideColor ? `${overrideColor}40` : undefined }}>
          {settings.showDate && <div className={`writing-vertical-rl font-japan tracking-widest text-lg h-40 flex items-center justify-center border-l pl-2 ${themeStyles.subTextClass}`} style={{ ...activeColorStyle, borderColor: overrideColor ? `${overrideColor}40` : undefined }}>{time.date}</div>}
          <div className="flex flex-col items-center font-japan">
            <span className="text-8xl font-black leading-none">{getDisplayHours(time.hours, settings.is24Hour)}</span>
            <span className="text-xl -my-2 opacity-50">time</span>
            <span className="text-8xl font-light leading-none">{pad(time.minutes)}</span>
          </div>
        </div>
        <style>{`.writing-vertical-rl { writing-mode: vertical-rl; text-orientation: upright; }`}</style>
      </div>
    </AnimatedWrapper>
  );
};

export const IndiaClock: React.FC<ClockFaceProps> = ({ time, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  return (
    <AnimatedWrapper>
      <div className={`relative w-full h-full flex flex-col items-center justify-center ${themeStyles.textClass}`} style={activeColorStyle}>
        <div className={`z-10 flex flex-col items-center border-y-2 py-6 px-12 backdrop-blur-sm shadow-xl rounded-full ${themeStyles.textClass.includes('white') ? 'bg-orange-950/50 border-orange-500/30' : 'bg-orange-50/80 border-orange-900/30'}`} style={{ borderColor: overrideColor ? `${overrideColor}40` : undefined }}>
           <span className="font-india text-7xl tracking-wide drop-shadow-sm">
             {getDisplayHours(time.hours, settings.is24Hour)}<span className="text-4xl align-top opacity-60 px-1">:</span>{pad(time.minutes)}
           </span>
           {settings.showDate && <span className="font-india text-lg mt-2 border-t pt-1 w-full text-center opacity-80" style={{ ...activeColorStyle, borderColor: overrideColor ? `${overrideColor}40` : undefined }}>{time.date}</span>}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export const ChinaClock: React.FC<ClockFaceProps> = ({ time, mode, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  return (
    <AnimatedWrapper>
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className={`z-10 flex flex-col items-center p-8 rounded-xl shadow-2xl border ${themeStyles.textClass} ${mode === 'dark' ? 'bg-red-950 border-yellow-600/20' : 'bg-red-50 border-red-200'}`} style={{ borderColor: overrideColor ? `${overrideColor}40` : undefined, ...activeColorStyle }}>
          <div className="flex items-center space-x-4 font-china">
             <div className="flex flex-col items-center">
                <span className="text-7xl font-bold">{getDisplayHours(time.hours, settings.is24Hour)}</span>
             </div>
             <span className="text-4xl animate-pulse text-yellow-600" style={activeColorStyle}>✦</span>
             <div className="flex flex-col items-center">
                <span className="text-7xl font-bold">{pad(time.minutes)}</span>
             </div>
          </div>
          {settings.showDate && <div className={`mt-2 font-china text-lg tracking-wider ${themeStyles.subTextClass}`} style={activeColorStyle}>{time.date}</div>}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export const WordClock: React.FC<ClockFaceProps> = ({ time, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  const activeColor = overrideColor || settings.customColor;
  
  const m = time.minutes;
  const h = time.hours % 12 || 12;
  const nextH = (time.hours + 1) % 12 || 12;
  const isHalf = m >= 30 && m < 35;
  const isTenPast = m >= 10 && m < 15;
  const isTenTo = m >= 50 && m < 55;
  const isQuarterPast = m >= 15 && m < 20;
  const isQuarterTo = m >= 45 && m < 50;
  const isOClock = m < 5;
  const isPast = m >= 5 && m < 35;
  const isTo = m >= 35;
  const activeHour = isTo ? nextH : h;

  const Word = ({ text, active }: { text: string, active: boolean }) => (
    <span 
      className={`transition-all duration-500 ${active ? themeStyles.accentClass : 'opacity-20 blur-[0.5px]'}`}
      style={active ? { ...activeColorStyle, textShadow: activeColor ? `0 0 15px ${activeColor}` : undefined } : undefined}
    >
      {text}
    </span>
  );

  return (
    <AnimatedWrapper>
      <div className={`grid grid-cols-6 gap-x-4 gap-y-2 text-2xl sm:text-4xl font-mono leading-relaxed text-center ${themeStyles.textClass}`}>
         <div className="col-span-6 flex justify-between px-8"><Word text="IT" active={true} /><Word text="IS" active={true} /><Word text="HALF" active={isHalf} /><Word text="TEN" active={isTenPast || isTenTo} /></div>
         <div className="col-span-6 flex justify-between px-4"><Word text="QUARTER" active={isQuarterPast || isQuarterTo} /><Word text="TWENTY" active={(m >= 20 && m < 30) || (m >= 40 && m < 45)} /></div>
         <div className="col-span-6 flex justify-between px-8"><Word text="FIVE" active={(m >= 5 && m < 10) || (m >= 25 && m < 30) || (m >= 35 && m < 40) || (m >= 55)} /><Word text="MINUTES" active={!isOClock && !isHalf && !isQuarterPast && !isQuarterTo} /></div>
         <div className="col-span-6 flex justify-center gap-8"><Word text="PAST" active={isPast && !isOClock} /><Word text="TO" active={isTo && !isOClock} /></div>
         <div className="col-span-6 flex flex-wrap justify-center gap-4 px-4 mt-2 font-bold"><Word text="ONE" active={activeHour === 1} /><Word text="TWO" active={activeHour === 2} /><Word text="THREE" active={activeHour === 3} /><Word text="FOUR" active={activeHour === 4} /><Word text="FIVE" active={activeHour === 5} /><Word text="SIX" active={activeHour === 6} /><Word text="SEVEN" active={activeHour === 7} /><Word text="EIGHT" active={activeHour === 8} /><Word text="NINE" active={activeHour === 9} /><Word text="TEN" active={activeHour === 10} /><Word text="ELEVEN" active={activeHour === 11} /><Word text="TWELVE" active={activeHour === 12} /></div>
         <div className="col-span-6 flex justify-center mt-2"><Word text="O'CLOCK" active={isOClock} /></div>
      </div>
    </AnimatedWrapper>
  );
};

export const BinaryClock: React.FC<ClockFaceProps> = ({ time, themeStyles, settings, overrideColor }) => {
  const activeColorStyle = useActiveColor(settings, overrideColor);
  const activeColor = overrideColor || settings.customColor;
  
  const hStr = getDisplayHours(time.hours, settings.is24Hour);
  const mStr = pad(time.minutes);
  const sStr = pad(time.seconds);
  const digits = [parseInt(hStr[0]), parseInt(hStr[1]), parseInt(mStr[0]), parseInt(mStr[1]), parseInt(sStr[0]), parseInt(sStr[1])];
  const rows = [8, 4, 2, 1];

  return (
    <AnimatedWrapper>
      <div className={`flex gap-4 sm:gap-8 p-8 rounded-xl ${themeStyles.containerClass}`}>
        {digits.map((digit, colIndex) => (
          <div key={colIndex} className={`flex flex-col gap-3 ${colIndex % 2 === 1 && colIndex !== 5 ? 'mr-4 sm:mr-8' : ''}`}>
             {rows.map((val) => {
               const isOn = (digit & val) === val;
               return (
                 <div 
                   key={val} 
                   className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full transition-all duration-300 transform ${isOn ? `scale-110 ${themeStyles.accentClass}` : `scale-90 opacity-20 ${themeStyles.textClass}`}`}
                   style={isOn ? { ...activeColorStyle, backgroundColor: activeColor || undefined, boxShadow: activeColor ? `0 0 10px ${activeColor}` : undefined } : undefined}
                 ></div>
               );
             })}
          </div>
        ))}
      </div>
    </AnimatedWrapper>
  );
};
