import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { COLORS, SIZES } from './theme';

interface IconButtonProps {
  onPress: () => void;
  type: 'settings' | 'stats' | 'audio' | 'audio-off';
  isPlaying?: boolean;
}

export function IconButton({ onPress, type, isPlaying = false }: IconButtonProps) {
  // Animation values for the audio icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Set up pulse animation for audio icon when playing
  useEffect(() => {
    if (isPlaying && type === 'audio') {
      // Create a looping pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animation when not playing
      pulseAnim.setValue(1);
    }
    
    return () => {
      // Clean up animation
      pulseAnim.stopAnimation();
    };
  }, [isPlaying, type, pulseAnim]);
  
  const renderIcon = () => {
    switch (type) {
      case 'settings':
        return (
          <Svg height={24} width={24} viewBox="0 0 24 24">
            <Path
              d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
              fill="#FFFFFF"
            />
          </Svg>
        );
      case 'stats':
        return (
          <Svg height={24} width={24} viewBox="0 0 24 24">
            <Path
              d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V20H20V4H4M6,6H10V18H6V6M12,6H16V18H12V6M18,6H22V18H18V6"
              fill="#FFFFFF"
            />
          </Svg>
        );
      case 'audio':
        return (
          <Svg height={24} width={24} viewBox="0 0 24 24">
            <Path
              d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
              fill={isPlaying ? COLORS.accent : "#FFFFFF"}
            />
          </Svg>
        );
      case 'audio-off':
        return (
          <Svg height={24} width={24} viewBox="0 0 24 24">
            <Path
              d="M12,4L9.91,6.09L12,8.18V4M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73L4.27,3M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
              fill="#FFFFFF"
            />
          </Svg>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        type === 'audio' && isPlaying ? { transform: [{ scale: pulseAnim }] } : null
      ]}
    >
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {renderIcon()}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
}); 