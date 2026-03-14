import React, { useState } from 'react';
import { Alarm, AlarmSoundType } from '../types';

interface AlarmManagerProps {
  alarms: Alarm[];
  onAdd: (time: string, label: string, sound: AlarmSoundType, repeatDays: number[]) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  isDarkMode: boolean;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const AlarmManager: React.FC<AlarmManagerProps> = ({ alarms, onAdd, onRemove, onToggle, isDarkMode }) => {
  const [newTime, setNewTime] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [sound, setSound] = useState<AlarmSoundType>('digital');
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime) {
      onAdd(newTime, newLabel, sound, repeatDays);
      setNewTime('');
      setNewLabel('');
      setRepeatDays([]);
      setIsAdding(false);
    }
  };

  const toggleDay = (dayIndex: number) => {
    setRepeatDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex].sort()
    );
  };

  const inputClass = `w-full bg-transparent border-b ${isDarkMode ? 'border-white/20 text-white placeholder-slate-500' : 'border-slate-300 text-slate-800 placeholder-slate-400'} focus:outline-none focus:border-blue-500 py-2 text-sm transition-colors`;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>My Alarms</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-blue-500 font-bold hover:underline"
        >
          {isAdding ? 'Cancel' : '+ New Alarm'}
        </button>
      </div>
      
      {isAdding && (
        <form onSubmit={handleSubmit} className={`p-4 rounded-xl border animate-in slide-in-from-top-2 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'} space-y-4`}>
          <div className="flex space-x-2">
            <input 
              type="time" 
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              className={`${inputClass} font-mono text-lg`}
            />
            <input 
              type="text" 
              placeholder="Label (optional)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold opacity-50">Repeat</label>
            <div className="flex justify-between gap-1">
              {DAYS.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    repeatDays.includes(i) 
                      ? 'bg-blue-500 text-white shadow-md scale-105' 
                      : 'bg-black/5 hover:bg-black/10 text-slate-500'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] uppercase font-bold opacity-50">Sound</label>
             <div className="flex bg-black/10 rounded-lg p-1">
                {['digital', 'classic', 'gentle'].map((s) => (
                   <button
                     key={s}
                     type="button"
                     onClick={() => setSound(s as AlarmSoundType)}
                     className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${sound === s ? 'bg-white shadow text-black' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     {s}
                   </button>
                ))}
             </div>
          </div>

          <button 
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-blue-500/20"
          >
            Save Alarm
          </button>
        </form>
      )}

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        {alarms.length === 0 && !isAdding && (
          <div className="text-center py-8 opacity-40">
            <p className="text-xs italic">No alarms set.</p>
            <p className="text-[10px] mt-1">Wake up to something new.</p>
          </div>
        )}
        {alarms.map(alarm => (
          <div 
            key={alarm.id} 
            className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/5 border-white/5 hover:bg-white/10' 
                : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <div className="flex flex-col">
              <span className={`text-xl font-mono leading-none ${!alarm.isActive && 'opacity-40'} ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {alarm.time}
              </span>
              <div className="flex items-center gap-2 mt-1">
                 <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{alarm.label || 'Alarm'}</span>
                 <span className="text-[10px] opacity-40">•</span>
                 <span className={`text-[9px] uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {alarm.repeatDays.length === 0 ? 'Once' : (alarm.repeatDays.length === 7 ? 'Every day' : 'Custom')}
                 </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onToggle(alarm.id)}
                className={`w-10 h-6 rounded-full relative transition-colors ${alarm.isActive ? 'bg-green-500' : 'bg-slate-500/30'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${alarm.isActive ? 'left-5' : 'left-1'}`}></div>
              </button>
              <button 
                onClick={() => onRemove(alarm.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all text-slate-500"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
