import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SIZES } from './theme';
import { Pet } from '../types';
import { PetPixelArt } from './PetPixelArt';

interface PixelPetProps {
  pet: Pet;
  mood?: 'HAPPY' | 'NEUTRAL' | 'SAD';
  animation?: 'IDLE' | 'EATING' | 'DRINKING' | 'PLAYING';
  isTalking?: boolean;
}

export function PixelPet({ 
  pet, 
  mood = 'NEUTRAL', 
  animation = 'IDLE',
  isTalking = false
}: PixelPetProps) {
  const [frame, setFrame] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  
  // Simple animation system - breathing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % 4);
      // Subtle up and down movement
      setOffsetY(prev => {
        const newOffset = Math.sin(Date.now() * 0.003) * 3;
        return newOffset;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate pixel size based on the container size
  const pixelSize = Math.floor(SIZES.petSize / 16);

  // When talking, add a small bounce effect
  const animationStyle = isTalking 
    ? { 
        transform: [
          { translateY: offsetY }, 
          { scale: 1 + Math.sin(Date.now() * 0.01) * 0.02 }
        ] 
      } 
    : { transform: [{ translateY: offsetY }] };

  return (
    <View style={styles.container}>
      {/* Shadow */}
      <View style={[styles.shadow, { width: 10 * pixelSize, height: 2 * pixelSize }]} />
      
      {/* Pet with animation */}
      <View style={[styles.petContainer, animationStyle]}>
        <PetPixelArt
          type={pet.type}
          color={pet.color}
          pixelSize={pixelSize}
          hatColor={pet.hat}
          isTalking={isTalking}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.petSize,
    height: SIZES.petSize,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  petContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 50,
    zIndex: 1,
  }
}); 