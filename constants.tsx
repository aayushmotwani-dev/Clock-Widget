import { Theme } from './types';

export const THEMES: Theme[] = [
  // --- TABLE TOP ---
  {
    id: 'swiss',
    name: 'Swiss Analog',
    category: 'Table Top',
    type: 'table',
    fontFamily: 'font-analog',
    backgroundImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2000&auto=format&fit=crop',
    description: 'Precision engineering inspired by high-end minimalist desk clocks.',
    modes: {
      light: {
        containerClass: 'bg-[#e8e8e8] border border-white/50 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] rounded-full aspect-square max-h-[80vh] flex items-center justify-center',
        textClass: 'text-slate-800',
        subTextClass: 'text-slate-500',
        accentClass: 'bg-red-600',
      },
      dark: {
        containerClass: 'bg-[#1a1b1e] border border-white/5 shadow-[20px_20px_60px_#161719,-20px_-20px_60px_#1e1f23] rounded-full aspect-square max-h-[80vh] flex items-center justify-center',
        textClass: 'text-gray-100',
        subTextClass: 'text-gray-500',
        accentClass: 'bg-red-500',
      }
    }
  },
  {
    id: 'flip',
    name: 'Retro Flip',
    category: 'Table Top',
    type: 'table',
    fontFamily: 'font-flip',
    backgroundImage: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop',
    description: 'Classic mechanical split-flap display from the 70s.',
    modes: {
      light: {
        containerClass: 'bg-zinc-200/50 backdrop-blur-sm border-b-4 border-zinc-300 shadow-xl rounded-lg',
        textClass: 'text-zinc-800',
        subTextClass: 'text-zinc-500',
        accentClass: 'bg-zinc-700',
      },
      dark: {
        containerClass: 'bg-zinc-900/50 backdrop-blur-sm border-b-4 border-black/50 shadow-2xl rounded-lg',
        textClass: 'text-zinc-100',
        subTextClass: 'text-zinc-500',
        accentClass: 'bg-zinc-700',
      }
    }
  },
  {
    id: 'nixie',
    name: 'Nixie Tube',
    category: 'Table Top',
    type: 'table',
    fontFamily: 'font-mono',
    backgroundImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop',
    description: 'Glowing cold cathode neon tubes for a cyberpunk industrial feel.',
    modes: {
      light: {
        containerClass: 'bg-stone-800 border-4 border-stone-600 shadow-2xl rounded-sm',
        textClass: 'text-orange-500',
        subTextClass: 'text-orange-900/50',
        accentClass: 'bg-orange-500',
      },
      dark: {
        containerClass: 'bg-black/90 border-4 border-stone-900 shadow-2xl shadow-orange-900/20 rounded-sm',
        textClass: 'text-orange-500 drop-shadow-[0_0_10px_rgba(255,100,0,0.8)]',
        subTextClass: 'text-orange-900',
        accentClass: 'bg-orange-600',
      }
    }
  },
  {
    id: 'galaxy',
    name: 'Nebula Elite',
    category: 'Table Top',
    type: 'table',
    fontFamily: 'font-serif',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000&auto=format&fit=crop',
    description: 'Haute horlogerie inspired by the cosmos, featuring micro-star indices.',
    modes: {
      light: {
        containerClass: 'bg-white border-4 border-gray-200 shadow-2xl rounded-full aspect-square max-h-[80vh] flex items-center justify-center',
        textClass: 'text-blue-900',
        subTextClass: 'text-blue-400',
        accentClass: 'bg-blue-600',
      },
      dark: {
        containerClass: 'bg-slate-900 border-4 border-slate-700 shadow-2xl rounded-full aspect-square max-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black',
        textClass: 'text-white',
        subTextClass: 'text-blue-300',
        accentClass: 'bg-white',
      }
    }
  },

  // --- MODERN DIGITAL ---
  {
    id: 'apple',
    name: 'Cupertino',
    category: 'Modern Digital',
    type: 'modern',
    fontFamily: 'font-sans',
    backgroundImage: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?q=80&w=2000&auto=format&fit=crop',
    description: 'Clean, glassmorphic design inspired by modern OS aesthetics.',
    modes: {
      light: {
        containerClass: 'bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[3rem]',
        textClass: 'text-slate-800',
        subTextClass: 'text-slate-500',
        accentClass: 'bg-blue-500',
      },
      dark: {
        containerClass: 'bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-[3rem]',
        textClass: 'text-white',
        subTextClass: 'text-slate-400',
        accentClass: 'bg-blue-400',
      }
    }
  },
  {
    id: 'microsoft',
    name: 'Redmond',
    category: 'Modern Digital',
    type: 'modern',
    fontFamily: 'font-sans',
    backgroundImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop',
    description: 'Productivity focused, high contrast, acrylic material.',
    modes: {
      light: {
        containerClass: 'bg-white/85 backdrop-blur-xl border border-black/5 shadow-xl rounded-none ring-1 ring-black/5',
        textClass: 'text-slate-900',
        subTextClass: 'text-slate-600',
        accentClass: 'bg-blue-600',
      },
      dark: {
        containerClass: 'bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-xl rounded-none ring-1 ring-white/5',
        textClass: 'text-white',
        subTextClass: 'text-blue-200',
        accentClass: 'bg-blue-500',
      }
    }
  },
  {
    id: 'nasa',
    name: 'Mission HUD',
    category: 'Modern Digital',
    type: 'modern',
    fontFamily: 'font-mono',
    backgroundImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop',
    description: 'Orbital tracking and high-contrast telemetry data.',
    modes: {
      light: {
        containerClass: 'bg-white/90 border-2 border-black shadow-xl rounded-lg',
        textClass: 'text-black',
        subTextClass: 'text-gray-600',
        accentClass: 'bg-black',
      },
      dark: {
        containerClass: 'bg-black/80 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] rounded-lg',
        textClass: 'text-green-500 font-bold tracking-widest',
        subTextClass: 'text-green-800',
        accentClass: 'bg-green-500',
      }
    }
  },

  // --- CULTURAL ---
  {
    id: 'washi',
    name: 'Washi & Lacquer',
    category: 'Cultural',
    type: 'cultural',
    fontFamily: 'font-japan',
    backgroundImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2000&auto=format&fit=crop',
    description: 'Deep urushi lacquer with gold flakes and textured paper.',
    modes: {
      light: {
        containerClass: 'bg-[#f4f1e8] border border-stone-300 shadow-xl rounded-full aspect-square flex items-center justify-center bg-[url("https://www.transparenttextures.com/patterns/washi.png")]',
        textClass: 'text-stone-800',
        subTextClass: 'text-red-800',
        accentClass: 'bg-red-700',
      },
      dark: {
        containerClass: 'bg-[#2a0a0a] border border-red-900/30 shadow-2xl rounded-full aspect-square flex items-center justify-center',
        textClass: 'text-[#d4af37]',
        subTextClass: 'text-red-900',
        accentClass: 'bg-[#d4af37]',
      }
    }
  },
  {
    id: 'japan',
    name: 'Kyoto',
    category: 'Cultural',
    type: 'cultural',
    fontFamily: 'font-japan',
    backgroundImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop',
    description: 'Minimalist Zen aesthetic with vertical typography elements.',
    modes: {
      light: {
        containerClass: 'bg-stone-100/90 backdrop-blur-md border border-stone-200 shadow-xl rounded-lg bg-[url("https://www.transparenttextures.com/patterns/rice-paper.png")]',
        textClass: 'text-red-900',
        subTextClass: 'text-red-900/60',
        accentClass: 'bg-red-400',
      },
      dark: {
        containerClass: 'bg-stone-900/90 backdrop-blur-md border border-stone-800 shadow-xl rounded-lg',
        textClass: 'text-red-100',
        subTextClass: 'text-red-200/60',
        accentClass: 'bg-red-500',
      }
    }
  },
  {
    id: 'india',
    name: 'Jaipur',
    category: 'Cultural',
    type: 'cultural',
    fontFamily: 'font-india',
    backgroundImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop',
    description: 'Warm colors, ornamental details, and mandala influences.',
    modes: {
      light: {
        containerClass: 'bg-orange-50/95 backdrop-blur-lg border-2 border-orange-200 shadow-2xl rounded-t-full rounded-b-3xl',
        textClass: 'text-orange-900',
        subTextClass: 'text-orange-700',
        accentClass: 'bg-orange-600',
      },
      dark: {
        containerClass: 'bg-orange-950/90 backdrop-blur-lg border-2 border-orange-800 shadow-2xl rounded-t-full rounded-b-3xl',
        textClass: 'text-orange-100',
        subTextClass: 'text-orange-300',
        accentClass: 'bg-orange-500',
      }
    }
  },
  {
    id: 'jali',
    name: 'Royal Jali',
    category: 'Cultural',
    type: 'cultural',
    fontFamily: 'font-india',
    backgroundImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2000&auto=format&fit=crop',
    description: 'Shadow play dial inspired by intricate stone lattice work.',
    modes: {
      light: {
        containerClass: 'bg-[#fdfbf7] border-4 border-[#dcd0b8] shadow-inner rounded-full aspect-square flex items-center justify-center bg-[url("https://www.transparenttextures.com/patterns/hexellence.png")]',
        textClass: 'text-stone-800',
        subTextClass: 'text-stone-500',
        accentClass: 'bg-stone-800',
      },
      dark: {
        containerClass: 'bg-[#1c1917] border-4 border-[#44403c] shadow-inner rounded-full aspect-square flex items-center justify-center bg-[url("https://www.transparenttextures.com/patterns/hexellence.png")]',
        textClass: 'text-[#fbbf24]',
        subTextClass: 'text-stone-600',
        accentClass: 'bg-[#fbbf24]',
      }
    }
  },
  {
    id: 'china',
    name: 'Beijing',
    category: 'Cultural',
    type: 'cultural',
    fontFamily: 'font-china',
    backgroundImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2000&auto=format&fit=crop',
    description: 'Bold red and gold colors symbolizing luck and prosperity.',
    modes: {
      light: {
        containerClass: 'bg-red-50/90 backdrop-blur-xl border-2 border-red-200 shadow-2xl rounded-2xl',
        textClass: 'text-red-900',
        subTextClass: 'text-red-700',
        accentClass: 'bg-red-600',
      },
      dark: {
        containerClass: 'bg-red-950/80 backdrop-blur-xl border-2 border-yellow-600/30 shadow-2xl rounded-2xl',
        textClass: 'text-yellow-400',
        subTextClass: 'text-yellow-500/80',
        accentClass: 'bg-red-800',
      }
    }
  },

  // --- EXPERIMENTAL ---
  {
    id: 'word',
    name: 'Word Clock',
    category: 'Experimental',
    type: 'modern',
    fontFamily: 'font-mono',
    backgroundImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop',
    description: 'Typographic representation of time for the literary mind.',
    modes: {
      light: {
        containerClass: 'bg-stone-100/90 backdrop-blur-xl border border-stone-300 shadow-2xl rounded-xl p-8',
        textClass: 'text-stone-800',
        subTextClass: 'text-stone-400',
        accentClass: 'text-black font-bold',
      },
      dark: {
        containerClass: 'bg-black/80 backdrop-blur-xl border border-stone-800 shadow-2xl rounded-xl p-8',
        textClass: 'text-stone-600',
        subTextClass: 'text-stone-800',
        accentClass: 'text-white font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]',
      }
    }
  },
  {
    id: 'binary',
    name: 'Binary Matrix',
    category: 'Experimental',
    type: 'modern',
    fontFamily: 'font-mono',
    backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop',
    description: 'Read time in the language of computers. BCD format.',
    modes: {
      light: {
        containerClass: 'bg-slate-200/90 backdrop-blur-xl border border-slate-300 shadow-2xl rounded-lg p-8',
        textClass: 'bg-slate-300', 
        subTextClass: 'text-slate-500',
        accentClass: 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]', 
      },
      dark: {
        containerClass: 'bg-slate-900/90 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-lg p-8',
        textClass: 'bg-slate-800', 
        subTextClass: 'text-slate-400',
        accentClass: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]', 
      }
    }
  },
];
