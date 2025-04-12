import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PetType } from '../types';
import { COLORS } from './theme';

interface PixelProps {
  x: number;
  y: number;
  color: string;
  size?: number;
}

interface PetPixelArtProps {
  type: PetType;
  color?: string;
  pixelSize?: number;
  hatColor?: string;
  isTalking?: boolean;
}

// Define a Pixel type interface
interface PixelData {
  x: number;
  y: number;
  color: string;
}

// A simple pixel component
const Pixel = ({ x, y, color, size = 12 }: PixelProps) => (
  <View
    style={{
      position: 'absolute',
      left: x * size,
      top: y * size,
      width: size,
      height: size,
      backgroundColor: color,
    }}
  />
);

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

export function PetPixelArt({ type, color = '#E1EEBC', pixelSize = 14, hatColor, isTalking = false }: PetPixelArtProps) {
  // Define colors
  const BODY_COLOR = color;
  const BORDER_COLOR = '#20252a'; // Dark border color for outline
  const DETAIL_COLOR = adjustColorBrightness(BODY_COLOR, -30);
  
  // Create pixel array
  const pixels: PixelData[] = [];
  
  // Choose animal pixel map based on type
  switch (type) {
    case PetType.CAT:
      // Cat pixels
      renderCat(pixels, BODY_COLOR, BORDER_COLOR, DETAIL_COLOR, isTalking);
      break;
    case PetType.DOG:
      // Dog pixels
      renderDog(pixels, BODY_COLOR, BORDER_COLOR, DETAIL_COLOR, isTalking);
      break;
    case PetType.BUNNY:
      // Bunny pixels
      renderBunny(pixels, BODY_COLOR, BORDER_COLOR, DETAIL_COLOR, isTalking);
      break;
    default:
      renderCat(pixels, BODY_COLOR, BORDER_COLOR, DETAIL_COLOR, isTalking);
  }

  // Simple hat pixels (if a hat color is provided)
  const hatPixels = hatColor ? [
    { x: 3, y: 0, color: hatColor },
    { x: 4, y: 0, color: hatColor },
    { x: 5, y: 0, color: hatColor },
    { x: 6, y: 0, color: hatColor },
    { x: 7, y: 0, color: hatColor },
    { x: 8, y: 0, color: hatColor },
  ].map((pixel, index) => (
    <Pixel
      key={`hat-pixel-${index}`}
      x={pixel.x}
      y={pixel.y}
      color={pixel.color}
      size={pixelSize}
    />
  )) : [];

  // Render all pixels
  const renderedPixels = pixels.map((pixel, index) => (
    <Pixel
      key={`pixel-${index}`}
      x={pixel.x}
      y={pixel.y}
      color={pixel.color}
      size={pixelSize}
    />
  ));

  return (
    <View style={[styles.container, { width: 16 * pixelSize, height: 16 * pixelSize }]}>
      {renderedPixels}
      {hatPixels}
    </View>
  );
}

// Cat rendering function
function renderCat(pixels: PixelData[], bodyColor: string, borderColor: string, detailColor: string, isTalking: boolean) {
  // Border outline (black pixels)
  const borderCoordinates = [
    // Top row (head top) - rounder edges for cuter look
    [3, 0], [4, 0], [8, 0], [9, 0],
    // Row 1 - smoother curve
    [2, 1], [5, 1], [6, 1], [7, 1], [10, 1],
    // Row 2 edges
    [1, 2], [11, 2],
    // Row 3-7 sides (face sides)
    [0, 3], [12, 3],
    [0, 4], [12, 4],
    [0, 5], [12, 5],
    [0, 6], [12, 6],
    [0, 7], [12, 7],
    // Row 8-9 edges
    [1, 8], [11, 8],
    [1, 9], [2, 9], [10, 9], [11, 9],
    // Row 10 - connection to body
    [2, 10], [10, 10],
    // Body outline
    [1, 11], [11, 11],
    [1, 12], [11, 12],
    [2, 13], [10, 13],
    // Legs
    [3, 14], [5, 14], [7, 14], [9, 14],
    [3, 15], [5, 15], [7, 15], [9, 15],
  ];

  // Bigger, rounder eyes for kawaii look
  const eyesCoordinates = [
    [3, 4], [4, 4], // Left eye upper
    [3, 5], [4, 5], // Left eye lower
    [8, 4], [9, 4], // Right eye upper
    [8, 5], [9, 5], // Right eye lower
  ];

  // Add eye shine for cuteness
  const eyeShineCoordinates = [
    [4, 4], // Left eye shine
    [9, 4], // Right eye shine
  ];

  // Blush marks for extra cuteness
  const blushCoordinates = [
    [2, 6], // Left cheek
    [10, 6], // Right cheek
  ];

  // Facial features - cuter mouth
  const mouthCoordinates = isTalking 
    ? [
        [5, 7], [6, 8], [7, 7] // Open mouth
      ]
    : [
        [6, 7], [5, 8], [6, 8], [7, 8] // Cute w-shaped mouth
      ];
  
  // Cuter nose
  const noseCoordinates = [[6, 6]];

  // Fill all border pixels
  borderCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill all eye pixels with black
  eyesCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Add white eye shine
  eyeShineCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FFFFFF' });
  });

  // Add blush marks with a pink color
  blushCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FFA0A0' });
  });

  // Fill facial feature pixels
  [...noseCoordinates, ...mouthCoordinates].forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill body with color (row by row)
  for (let y = 2; y <= 13; y++) {
    // Determine x range based on row
    let startX = 2;
    let endX = 10; 
    
    if (y >= 3 && y <= 7) {
      startX = 1;
      endX = 11;
    } else if (y >= 11 && y <= 12) {
      startX = 2;
      endX = 10;
    }

    for (let x = startX; x <= endX; x++) {
      // Skip if this position is already filled (eyes, nose, border, blush)
      const isEye = eyesCoordinates.some(([ex, ey]) => ex === x && ey === y);
      const isEyeShine = eyeShineCoordinates.some(([ex, ey]) => ex === x && ey === y);
      const isBlush = blushCoordinates.some(([bx, by]) => bx === x && by === y);
      const isMouth = mouthCoordinates.some(([mx, my]) => mx === x && my === y);
      const isNose = noseCoordinates.some(([nx, ny]) => nx === x && ny === y);
      const isBorder = borderCoordinates.some(([bx, by]) => bx === x && by === y);
      
      if (!isEye && !isEyeShine && !isBlush && !isMouth && !isNose && !isBorder) {
        pixels.push({ x, y, color: bodyColor });
      }
    }
  }

  // Add paws and tail details
  const pawsCoordinates = [
    [3, 14], [5, 14], [7, 14], [9, 14],
    [3, 15], [5, 15], [7, 15], [9, 15],
  ];
  
  // Add small details in darker shade
  const detailCoordinates = [
    [4, 3], [8, 3], // Ear inner
    [4, 13], [8, 13], // Body details
  ];
  
  detailCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: detailColor });
  });
}

// Dog rendering function
function renderDog(pixels: PixelData[], bodyColor: string, borderColor: string, detailColor: string, isTalking: boolean) {
  // Border outline
  const borderCoordinates = [
    // Head top with ears
    [2, 0], [3, 0], [9, 0], [10, 0],
    // Row 1
    [1, 1], [4, 1], [8, 1], [11, 1],
    // Row 2 
    [1, 2], [11, 2],
    // Row 3-7 sides (face)
    [0, 3], [12, 3],
    [0, 4], [12, 4],
    [0, 5], [12, 5],
    [0, 6], [12, 6],
    [0, 7], [12, 7],
    // Row 8-9 
    [1, 8], [11, 8],
    [1, 9], [11, 9],
    // Body outline
    [2, 10], [10, 10],
    [1, 11], [11, 11],
    [1, 12], [11, 12],
    [2, 13], [10, 13],
    // Legs
    [3, 14], [5, 14], [7, 14], [9, 14],
    [3, 15], [5, 15], [7, 15], [9, 15],
  ];

  // Eyes
  const eyesCoordinates = [
    [3, 5], [4, 5], // Left eye
    [8, 5], [9, 5], // Right eye
  ];

  // Snout and mouth - change based on talking
  const snoutCoordinates = [
    [5, 6], [6, 6], [7, 6], // Snout top
    [5, 7], [7, 7], // Snout sides
  ];
  
  const mouthCoordinates = isTalking
    ? [
        [5, 8], [6, 7], [7, 8] // Open mouth
      ]
    : [
        [5, 8], [6, 8], [7, 8] // Closed mouth
      ];

  // Fill border pixels
  borderCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill eyes
  eyesCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill snout and mouth
  [...snoutCoordinates, ...mouthCoordinates].forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill body with color
  for (let y = 1; y <= 15; y++) {
    let startX = 2;
    let endX = 10;
    
    // Adjust range based on row
    if (y >= 3 && y <= 7) {
      startX = 1;
      endX = 11;
    }
    
    for (let x = startX; x <= endX; x++) {
      // Skip if already filled
      const isEye = eyesCoordinates.some(([ex, ey]) => ex === x && ey === y);
      const isSnout = snoutCoordinates.some(([sx, sy]) => sx === x && sy === y);
      const isMouth = mouthCoordinates.some(([mx, my]) => mx === x && my === y);
      const isBorder = borderCoordinates.some(([bx, by]) => bx === x && by === y);
      
      if (!isEye && !isSnout && !isMouth && !isBorder) {
        pixels.push({ x, y, color: bodyColor });
      }
    }
  }

  // Add details in darker shade
  const detailCoordinates = [
    [3, 2], [9, 2], // Ear details
    [6, 9], // Chin
    [4, 13], [8, 13], // Body details
  ];
  
  detailCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: detailColor });
  });
}

// Bunny rendering function
function renderBunny(pixels: PixelData[], bodyColor: string, borderColor: string, detailColor: string, isTalking: boolean) {
  // Border outline
  const borderCoordinates = [
    // Long ears
    [3, 0], [9, 0], // Ear tops
    [2, 1], [4, 1], [8, 1], [10, 1], // Ear sides
    [2, 2], [4, 2], [8, 2], [10, 2],
    // Head
    [1, 3], [5, 3], [7, 3], [11, 3],
    [0, 4], [6, 4], [12, 4],
    [0, 5], [12, 5],
    [0, 6], [12, 6],
    [1, 7], [11, 7],
    // Body
    [2, 8], [10, 8],
    [1, 9], [11, 9],
    [1, 10], [11, 10],
    [1, 11], [11, 11],
    [2, 12], [10, 12],
    // Feet
    [3, 13], [9, 13],
    [2, 14], [4, 14], [8, 14], [10, 14],
    [2, 15], [4, 15], [8, 15], [10, 15],
  ];

  // Eyes
  const eyesCoordinates = [
    [3, 5], [4, 5], // Left eye
    [8, 5], [9, 5], // Right eye
  ];

  // Nose and mouth
  const noseCoordinates = [[6, 6]];
  const mouthCoordinates = isTalking
    ? [
        [5, 7], [6, 8], [7, 7] // Open mouth
      ]
    : [
        [5, 7], [6, 7], [7, 7] // Closed mouth
      ];

  // Fill border pixels
  borderCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill eyes
  eyesCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill nose and mouth
  [...noseCoordinates, ...mouthCoordinates].forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill body with color
  for (let y = 1; y <= 15; y++) {
    let startX = 3;
    let endX = 9;
    
    // Adjust range based on row
    if (y >= 4 && y <= 6) {
      startX = 1;
      endX = 11;
    } else if (y >= 9 && y <= 11) {
      startX = 2;
      endX = 10;
    }
    
    for (let x = startX; x <= endX; x++) {
      // Skip if already filled
      const isEye = eyesCoordinates.some(([ex, ey]) => ex === x && ey === y);
      const isNose = noseCoordinates.some(([nx, ny]) => nx === x && ny === y);
      const isMouth = mouthCoordinates.some(([mx, my]) => mx === x && my === y);
      const isBorder = borderCoordinates.some(([bx, by]) => bx === x && by === y);
      
      if (!isEye && !isNose && !isMouth && !isBorder) {
        pixels.push({ x, y, color: bodyColor });
      }
    }
  }

  // Add bunny details in darker shade
  const detailCoordinates = [
    [3, 1], [9, 1], // Inner ear detail
    [5, 10], [7, 10], // Body details
    [3, 14], [9, 14], // Foot detail
  ];
  
  detailCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: detailColor });
  });
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
}); 