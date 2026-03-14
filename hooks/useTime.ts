import { useState, useEffect } from 'react';
import { TimeState } from '../types';

export const useTime = (): TimeState => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    // Update every 100ms for smoother analog clock movement if needed, 
    // but 1000ms is standard. Let's do 1000ms for efficiency unless requested.
    // For analog clocks, we might want sub-second updates, but let's stick to 1s for now to save battery.
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hoursRaw = time.getHours();
  const ampm = hoursRaw >= 12 ? 'PM' : 'AM';
  
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  return {
    hours: hoursRaw,
    minutes: time.getMinutes(),
    seconds: time.getSeconds(),
    ampm,
    date: time.toLocaleDateString('en-US', dateOptions),
    rawDate: time
  };
};
