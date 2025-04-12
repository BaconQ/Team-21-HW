export interface Pet {
  id: string;
  name: string;
  type: PetType;
  color: string;
  hat?: string;
  stats: PetStats;
  lastInteraction: Date;
}

export enum PetType {
  CAT = 'cat',
  DOG = 'dog',
  BUNNY = 'bunny',
  FROG = 'frog',
  CACTUS = 'cactus',
}

export interface PetStats {
  hunger: number; // 0-100
  hydration: number; // 0-100
  activity: number; // 0-100
  mood: number; // 0-100
  health: number; // 0-100
}

export interface StatsLog {
  timestamp: Date;
  type: 'FOOD' | 'WATER' | 'ACTIVITY' | 'MOOD';
  value: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'USER' | 'PET';
  timestamp: Date;
  audioUrl?: string; // URL to the audio file for this message
  isPlaying?: boolean; // Whether the audio is currently playing
  isLoading?: boolean; // Whether the message is loading (waiting for audio)
  isTyping?: boolean; // Whether the message is currently being typed
}

export interface StatChange {
  attribute: string; // "food", "water", "activity", "happiness", etc.
  value: number; // Positive for increase, negative for decrease
}

export interface LLMResponse {
  messages: string[]; // Array of message texts
  changes: StatChange[]; // Array of stat changes
}

export type ThemeColors = {
  primary: string; // #328E6E
  secondary: string; // #E1EEBC
  background: string;
  text: string;
  accent: string;
}; 