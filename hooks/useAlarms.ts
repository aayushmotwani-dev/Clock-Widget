import { useState, useEffect, useRef, useCallback } from 'react';
import { Alarm, TimeState, AlarmSoundType } from '../types';

export const useAlarms = (currentTime: TimeState) => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    try {
      const saved = localStorage.getItem('chrono_alarms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('chrono_alarms', JSON.stringify(alarms));
  }, [alarms]);

  const checkAlarmTrigger = useCallback(() => {
    // Only check when seconds are 0 to avoid multiple triggers per minute
    if (currentTime.seconds !== 0) return;

    const currentDay = currentTime.rawDate.getDay(); // 0 = Sunday
    const hours24 = currentTime.hours;
    const current24h = `${hours24.toString().padStart(2, '0')}:${currentTime.minutes.toString().padStart(2, '0')}`;

    const matchingAlarm = alarms.find(a => {
      if (!a.isActive) return false;
      if (a.time !== current24h) return false;
      
      // If repeatDays is empty, it's a one-time alarm (triggers any day it matches)
      // If repeatDays has values, current day must be in it.
      if (a.repeatDays.length > 0 && !a.repeatDays.includes(currentDay)) {
        return false;
      }
      return true;
    });

    if (matchingAlarm) {
      setTriggeredAlarm(matchingAlarm);
      playAlarmSound(matchingAlarm.sound);

      // If it's a one-time alarm, deactivate it after triggering
      if (matchingAlarm.repeatDays.length === 0) {
        toggleAlarm(matchingAlarm.id, false);
      }
    }
  }, [currentTime.hours, currentTime.minutes, currentTime.seconds, currentTime.rawDate, alarms]);

  useEffect(() => {
    checkAlarmTrigger();
  }, [checkAlarmTrigger]);

  const addAlarm = (time: string, label: string, sound: AlarmSoundType, repeatDays: number[] = [], snoozeDuration: number = 5) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time,
      label: label || 'Alarm',
      isActive: true,
      sound,
      repeatDays,
      snoozeDuration
    };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const removeAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const toggleAlarm = (id: string, forceState?: boolean) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: forceState !== undefined ? forceState : !a.isActive } : a));
  };

  const dismissAlarm = () => {
    setTriggeredAlarm(null);
  };

  const snoozeAlarm = () => {
    if (!triggeredAlarm) return;
    
    // Calculate snooze time
    const now = new Date();
    now.setMinutes(now.getMinutes() + triggeredAlarm.snoozeDuration);
    const snoozeHours = now.getHours().toString().padStart(2, '0');
    const snoozeMinutes = now.getMinutes().toString().padStart(2, '0');
    const snoozeTime = `${snoozeHours}:${snoozeMinutes}`;

    // Add a temporary one-off alarm (snooze is always one-time)
    addAlarm(snoozeTime, `Snooze: ${triggeredAlarm.label}`, triggeredAlarm.sound, [], triggeredAlarm.snoozeDuration);
    setTriggeredAlarm(null);
  };

  const playAlarmSound = (type: AlarmSoundType) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;

    if (type === 'digital') {
      // High pitch beeps
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      osc.frequency.setValueAtTime(0, now + 0.11);
      osc.frequency.setValueAtTime(880, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start();
      osc.stop(now + 0.5);

    } else if (type === 'classic') {
      // Ringing bell modulation
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      
      const lfo = ctx.createOscillator();
      lfo.type = 'square';
      lfo.frequency.value = 15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.5;
      lfo.connect(lfoGain.gain);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      osc.start();
      osc.stop(now + 1.5);
      lfo.start();
      lfo.stop(now + 1.5);

    } else { // gentle
      // Soft sine swell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 2);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 1);
      gain.gain.linearRampToValueAtTime(0, now + 2);
      
      osc.start();
      osc.stop(now + 2.1);
    }
  };

  return {
    alarms,
    addAlarm,
    removeAlarm,
    toggleAlarm,
    triggeredAlarm,
    dismissAlarm,
    snoozeAlarm
  };
};
