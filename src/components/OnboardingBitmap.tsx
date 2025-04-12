import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Simple bitmap-style images using pixel blocks
export function OnboardingBitmap({ type }: { type: string }) {
  // Simple 16x16 grid for bitmap images
  
  // Goal reminder bitmap - clipboard with checkmarks
  const goalsBitmap = [
    [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,2,2,2,2,1,0,0,0,0,0,0],
    [0,0,0,0,1,2,2,2,2,1,0,0,0,0,0,0],
    [0,0,1,1,1,2,2,2,2,1,1,1,0,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,1,2,3,2,2,2,3,2,2,1,0,0,0,0],
    [0,0,1,2,2,3,2,3,2,2,2,1,0,0,0,0],
    [0,0,1,2,2,2,3,2,2,2,2,1,0,0,0,0],
    [0,0,1,2,3,2,2,2,3,2,2,1,0,0,0,0],
    [0,0,1,2,2,3,2,3,2,2,2,1,0,0,0,0],
    [0,0,1,2,2,2,3,2,2,2,2,1,0,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  
  // Voice chat bitmap - speech bubble with sound waves
  const voiceBitmap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,2,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,1,2,2,3,2,2,3,2,2,2,1,0,0,0],
    [0,0,1,2,3,3,3,3,3,3,2,2,1,0,0,0],
    [0,0,1,2,2,3,2,2,3,2,2,2,1,0,0,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0],
    [0,0,0,1,2,2,2,2,2,2,2,1,0,0,0,0],
    [0,0,0,0,1,1,1,2,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,1,2,0,0,0,0,0,2,1,0,0,0,0],
    [0,0,0,0,1,2,0,0,0,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,0,2,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  ];
  
  // Listen bitmap - headphones
  const listenBitmap = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,2,2,1,0,0,0,0,0,0,0,1,2,2,2,1],
    [1,2,2,2,1,0,0,0,0,0,1,2,2,2,2,1],
    [1,2,2,2,2,1,0,0,0,1,2,2,2,2,2,1],
    [0,1,2,2,2,2,1,1,1,2,2,2,2,2,1,0],
    [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  
  // Choose which bitmap to render
  let bitmap;
  switch (type) {
    case 'goals': bitmap = goalsBitmap; break;
    case 'voice': bitmap = voiceBitmap; break;
    case 'listen': bitmap = listenBitmap; break;
    default: bitmap = goalsBitmap;
  }
  
  // Calculate pixel size based on screen width
  const pixelSize = Math.floor(width / 32); // 16px image with padding
  
  // Color mapping
  const colors = ['transparent', '#20252a', '#E1EEBC', '#328E6E'];
  
  return (
    <View style={[styles.container, { width: 16 * pixelSize, height: 16 * pixelSize }]}>
      {bitmap.map((row, y) => 
        row.map((pixel, x) => (
          <View
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: x * pixelSize,
              top: y * pixelSize,
              width: pixelSize,
              height: pixelSize,
              backgroundColor: colors[pixel],
            }}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 20,
  }
}); 