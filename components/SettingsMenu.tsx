import React, { useState } from 'react';
import { ClockSettings } from '../types';

interface SettingsMenuProps {
  settings: ClockSettings;
  onUpdate: (newSettings: ClockSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const COLORS = [
  { label: 'Default', value: null },
  { label: 'White', value: '#ffffff' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink', value: '#ec4899' },
];

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ settings, onUpdate, isOpen, onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'alarms'>('general');

  if (!isOpen) return null;

  const updateSetting = <K extends keyof ClockSettings>(key: K, value: ClockSettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  // Liquid Glass Classes
  const glassPanelClass = isDarkMode
    ? 'bg-slate-900/60 backdrop-blur-2xl border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
    : 'bg-white/60 backdrop-blur-2xl border-white/40 text-slate-800 shadow-[0_20px_50px_rgba(31,38,135,0.15)]';

  const tabClass = (tab: string) => `pb-2 px-1 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className={`w-full max-w-sm rounded-3xl border ${glassPanelClass} transform transition-all scale-100 max-h-[90vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0 flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight drop-shadow-sm">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <svg className="w-5 h-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 px-6 mt-4 border-b border-white/10">
          <button onClick={() => setActiveTab('general')} className={tabClass('general')}>General</button>
          <button onClick={() => setActiveTab('appearance')} className={tabClass('appearance')}>Appearance</button>
          <button onClick={() => setActiveTab('alarms')} className={tabClass('alarms')}>Defaults</button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <ToggleRow label="24-Hour Clock" checked={settings.is24Hour} onChange={(v) => updateSetting('is24Hour', v)} />
              <ToggleRow label="Show Seconds" checked={settings.showSeconds} onChange={(v) => updateSetting('showSeconds', v)} />
              <ToggleRow label="Show Date" checked={settings.showDate} onChange={(v) => updateSetting('showDate', v)} />
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="font-medium text-sm">Base Scale</span>
                   <span className="text-xs opacity-60">{Math.round(settings.scale * 100)}%</span>
                 </div>
                 <input 
                   type="range" min="0.5" max="1.5" step="0.05"
                   value={settings.scale}
                   onChange={(e) => updateSetting('scale', parseFloat(e.target.value))}
                   className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
               </div>

               <div className="space-y-3">
                 <span className="font-medium text-sm">Accent Color</span>
                 <ColorPicker selected={settings.customColor} onSelect={(c) => updateSetting('customColor', c)} />
               </div>

               <div className="border-t border-white/10 pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                       <span className="font-medium text-sm">Widget Mode</span>
                       <span className="text-[10px] opacity-60 max-w-[200px] leading-tight mt-1">
                         Automatically switch to these settings when entering frameless Widget Mode.
                       </span>
                     </div>
                     <Toggle checked={settings.enableWidgetOverrides} onChange={(v) => updateSetting('enableWidgetOverrides', v)} />
                  </div>
                  
                  {settings.enableWidgetOverrides && (
                    <div className="pl-4 border-l-2 border-blue-500/30 space-y-4 animate-in slide-in-from-left-2 duration-200 bg-blue-500/10 p-3 rounded-r-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium opacity-80">Widget Scale</span>
                          <span className="text-xs opacity-60">{Math.round(settings.widgetScale * 100)}%</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="2.0" step="0.05"
                          value={settings.widgetScale}
                          onChange={(e) => updateSetting('widgetScale', parseFloat(e.target.value))}
                          className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs font-medium opacity-80">Widget Color</span>
                        <ColorPicker selected={settings.widgetColor} onSelect={(c) => updateSetting('widgetColor', c)} small />
                      </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* ALARMS TAB */}
          {activeTab === 'alarms' && (
            <div className="space-y-4">
               <div className="space-y-2">
                 <span className="font-medium text-sm">Default Snooze (Minutes)</span>
                 <div className="flex gap-2">
                   {[5, 10, 15].map(min => (
                     <button
                       key={min}
                       onClick={() => updateSetting('defaultSnoozeMinutes', min)}
                       className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                         settings.defaultSnoozeMinutes === min 
                           ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                           : 'border-white/10 hover:bg-white/10 opacity-70'
                       }`}
                     >
                       {min}m
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          )}

        </div>
        <div className="p-4 border-t border-white/10 text-center bg-black/5">
            <p className="text-[10px] opacity-40 font-mono">ChronoVerse Build 2.0</p>
        </div>
      </div>
    </div>
  );
};

// UI Helpers
const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-1">
    <span className="font-medium text-sm">{label}</span>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-blue-600' : 'bg-slate-500/30'}`}
  >
    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${checked ? 'left-6' : 'left-1'}`}></div>
  </button>
);

const ColorPicker = ({ selected, onSelect, small }: { selected: string | null, onSelect: (c: string | null) => void, small?: boolean }) => (
  <div className={`grid grid-cols-5 gap-2`}>
    {COLORS.map((color) => (
      <button
        key={color.label}
        onClick={() => onSelect(color.value)}
        className={`w-full aspect-square rounded-full border-2 flex items-center justify-center transition-all hover:scale-110
          ${selected === color.value ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent'}
          ${small ? 'h-6 w-6' : ''}
        `}
        title={color.label}
        style={{ backgroundColor: color.value || 'transparent' }}
      >
          {!color.value && (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center">
              <span className="text-[6px] text-white font-bold">AUTO</span>
            </div>
          )}
      </button>
    ))}
  </div>
);
