import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  TouchableOpacityProps,
  View,
  ViewStyle,
  StyleProp
} from 'react-native';
import { COLORS, SPACING } from './theme';
import { PixelText } from './PixelText';

interface PixelButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: any;
}

/**
 * PixelButton - A button component with bitmap/pixel styling
 */
export function PixelButton({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  textColor,
  style,
  textStyle,
  ...props
}: PixelButtonProps) {
  // Get button sizing based on size prop
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
        };
      case 'large':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
        };
      default: // medium
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
        };
    }
  };

  // Get button styling based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          borderColor: adjustColorBrightness(COLORS.secondary, -50),
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.primary,
        };
      default: // primary
        return {
          backgroundColor: COLORS.primary,
          borderColor: adjustColorBrightness(COLORS.primary, -50),
        };
    }
  };

  // Get text color based on variant
  const getTextColor = () => {
    if (textColor) return textColor;
    
    switch (variant) {
      case 'secondary':
        return COLORS.primary;
      case 'outline':
        return COLORS.primary;
      default: // primary
        return '#FFFFFF';
    }
  };

  // Get text variant based on button size
  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'heading';
      default:
        return 'body';
    }
  };

  // Helper function to adjust color brightness
  function adjustColorBrightness(color: string, amount: number): string {
    // Remove # if present
    color = color.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Adjust brightness
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        getButtonSize(),
        getButtonStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {/* Shadow View for Pixel-Perfect Shadow */}
      <View style={[styles.shadow, { borderColor: getButtonStyle().borderColor }]} />
      
      <PixelText
        variant={getTextVariant()}
        style={[
          styles.text,
          { color: getTextColor() },
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title.toUpperCase()}
      </PixelText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Pixel-perfect border
    borderStyle: 'solid',
  },
  shadow: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: -2,
    bottom: -2,
    borderWidth: 2,
    borderRadius: 4,
    zIndex: -1,
  },
  text: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
}); 