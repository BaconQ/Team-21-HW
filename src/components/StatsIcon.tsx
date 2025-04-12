import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { COLORS, SIZES, SPACING } from './theme';

interface StatsIconProps {
  type: 'FOOD' | 'WATER' | 'ACTIVITY' | 'MOOD';
  value: number;
  onPress: () => void;
}

export function StatsIcon({ type, value, onPress }: StatsIconProps) {
  // Calculate progress arc parameters
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (value / 100) * circumference;
  
  const renderIcon = () => {
    switch (type) {
      case 'FOOD':
        return (
          <Path
            d="M18,10 L25,10 L25,18 C25,21.866 21.866,25 18,25 C14.134,25 11,21.866 11,18 L11,10 L18,10 Z"
            fill="#FFFFFF"
          />
        );
      case 'WATER':
        return (
          <Path
            d="M18,8 C20,12 24,16 24,20 C24,24.418 21.314,28 18,28 C14.686,28 12,24.418 12,20 C12,16 16,12 18,8 Z"
            fill="#FFFFFF"
          />
        );
      case 'ACTIVITY':
        return (
          <Path
            d="M16,10 C20.418,10 24,13.582 24,18 L20,18 L25,25 L18,18 L22,18 C22,14.686 19.314,12 16,12 C14.348,12 12.856,12.69 11.799,13.799 L10.201,12.201 C11.648,10.753 13.711,10 16,10 Z"
            fill="#FFFFFF"
          />
        );
      case 'MOOD':
        return (
          <Path
            d="M18,8 C24.627,8 30,13.373 30,20 C30,26.627 24.627,32 18,32 C11.373,32 6,26.627 6,20 C6,13.373 11.373,8 18,8 Z M14,18 C12.895,18 12,18.895 12,20 C12,21.105 12.895,22 14,22 C15.105,22 16,21.105 16,20 C16,18.895 15.105,18 14,18 Z M22,18 C20.895,18 20,18.895 20,20 C20,21.105 20.895,22 22,22 C23.105,22 24,21.105 24,20 C24,18.895 23.105,18 22,18 Z"
            fill="#FFFFFF"
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <View style={styles.container}>
        <Svg height={SIZES.iconSize} width={SIZES.iconSize} viewBox="0 0 36 36">
          {/* Background Circle */}
          <Circle 
            cx="18" 
            cy="18" 
            r={radius} 
            fill="rgba(255, 255, 255, 0.15)" 
          />
          
          {/* Progress Circle */}
          <Circle
            cx="18"
            cy="18"
            r={radius}
            fill="transparent"
            stroke={COLORS.secondary}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform="rotate(-90, 18, 18)"
          />
          
          {/* Icon Background */}
          <Circle 
            cx="18" 
            cy="18" 
            r="14" 
            fill={COLORS.primary} 
          />
          
          {/* Icon */}
          {renderIcon()}
        </Svg>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    margin: SPACING.xs,
  },
  container: {
    width: SIZES.iconSize,
    height: SIZES.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.iconSize / 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
}); 