import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
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
  
  const getIcon = () => {
    switch (type) {
      case 'FOOD':
        return require('../assets/Food.png');
      case 'WATER':
        return require('../assets/Water.png');
      case 'ACTIVITY':
        return require('../assets/Activity.png');
      case 'MOOD':
        return require('../assets/Mood.png');
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
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="butt"
            transform="rotate(-90, 18, 18)"
          />
          
          {/* Icon Background */}
          <Circle 
            cx="18" 
            cy="18" 
            r="14" 
            fill={COLORS.primary} 
            stroke="#000"
            strokeWidth="1"
          />
        </Svg>
        
        {/* Icon as Image */}
        <Image 
          source={getIcon()} 
          style={styles.iconImage} 
          resizeMode="contain"
        />
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
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  iconImage: {
    width: 24,
    height: 24,
    position: 'absolute',
    tintColor: '#FFFFFF',
  },
}); 