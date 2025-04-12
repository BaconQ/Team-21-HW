import { ThemeColors } from '../types/index';

export const COLORS: ThemeColors = {
  primary: '#328E6E',
  secondary: '#E1EEBC',
  background: '#FFFFFF',
  text: '#333333',
  accent: '#E1EEBC',
};

export const FONTS = {
  regular: 'VT323_400Regular',    // Monospace terminal-like pixel font
  title: 'PressStart2P_400Regular', // NES-style pixel font
  primary: 'VT323_400Regular',    // Default text - easy to read pixelated font
  heading: 'PressStart2P_400Regular', // For headings and important UI text
  pixelated: 'VT323_400Regular',  // For body text with pixel style
  retro: 'PressStart2P_400Regular',  // For retro gaming style text
  silkscreen: 'Silkscreen_400Regular' // Clean, minimal pixel font
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const SIZES = {
  petSize: 200,
  iconSize: 50,
  buttonHeight: 50,
  inputHeight: 50,
  borderRadius: 12,
}; 