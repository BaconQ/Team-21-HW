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
}

export type ThemeColors = {
  primary: string; // #328E6E
  secondary: string; // #E1EEBC
  background: string;
  text: string;
  accent: string;
}; 