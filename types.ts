export interface ThemeModeData {
  containerClass: string;
  textClass: string;
  subTextClass: string;
  accentClass: string;
}

export type ThemeCategory = 'Table Top' | 'Modern Digital' | 'Cultural' | 'Experimental';

export interface Theme {
  id: string;
  name: string;
  category: ThemeCategory;
  type: 'modern' | 'cultural' | 'table';
  fontFamily: string;
  backgroundImage: string; 
  description: string;
  modes: {
    light: ThemeModeData;
    dark: ThemeModeData;
  };
}

export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
  ampm: string;
  date: string;
  rawDate: Date;
}

export interface QuoteData {
  text: string;
  author: string;
}

export type AlarmSoundType = 'digital' | 'classic' | 'gentle';

export interface Alarm {
  id: string;
  time: string; // Format "HH:MM"
  label: string;
  isActive: boolean;
  sound: AlarmSoundType;
  repeatDays: number[]; // 0 = Sunday, 1 = Monday, etc. Empty = One-time.
  snoozeDuration: number; // in minutes
}

export interface ClockSettings {
  // General
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  
  // Global Appearance
  scale: number;
  customColor: string | null;
  themeMode: 'light' | 'dark';

  // Widget Overrides
  enableWidgetOverrides: boolean;
  widgetScale: number;
  widgetColor: string | null;

  // Alarm Defaults
  defaultSnoozeMinutes: number;
}
