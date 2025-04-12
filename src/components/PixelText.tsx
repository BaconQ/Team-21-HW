import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONTS } from './theme';

type PixelTextVariant = 'regular' | 'title' | 'body' | 'heading' | 'small';

interface PixelTextProps extends TextProps {
  variant?: PixelTextVariant;
  pixelated?: boolean;
}

/**
 * PixelText - A custom Text component that ensures all text 
 * in the app has a consistent bitmap/pixel font style
 */
export function PixelText({ 
  children, 
  style, 
  variant = 'regular',
  pixelated = true,
  ...props 
}: PixelTextProps) {
  // Map variants to font styles
  const getFontFamily = () => {
    switch (variant) {
      case 'title':
        return FONTS.title; // PressStart2P - bold, chunky pixel font
      case 'heading':
        return FONTS.heading; // PressStart2P
      case 'body':
        return FONTS.regular; // VT323 - more readable for longer text
      case 'small':
        return FONTS.silkscreen; // Silkscreen - good for small text
      default:
        return FONTS.regular; // VT323
    }
  };

  // Get appropriate font size for variant
  const getFontSize = () => {
    switch (variant) {
      case 'title':
        return 24;
      case 'heading':
        return 18;
      case 'body':
        return 16;
      case 'small':
        return 12;
      default:
        return 16;
    }
  };

  // Apply pixel-perfect rendering
  const getPixelPerfect = () => {
    if (!pixelated) return {};
    
    return {
      // These styles ensure crisp pixel rendering
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
      // Disable font scaling
      allowFontScaling: false
    };
  };

  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[
        styles.base,
        {
          fontFamily: getFontFamily(),
          fontSize: getFontSize(),
        },
        getPixelPerfect(),
        style, // Allow custom styles to override defaults
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base styles for all text
    letterSpacing: 1,
    color: '#20252a',
  },
}); 