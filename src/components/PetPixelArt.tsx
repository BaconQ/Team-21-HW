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
    case PetType.FROG:
      // Frog pixels
      renderFrog(pixels, BODY_COLOR, BORDER_COLOR, DETAIL_COLOR, isTalking);
      break;
    case PetType.CACTUS:
      // Cactus pixels
      renderCactus(pixels, BODY_COLOR, BORDER_COLOR, DETAIL_COLOR, isTalking);
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
  // Outline of a more traditional cat shape
  const borderCoordinates = [
    // Ears - more triangular and distinct
    [2, 1], [3, 0], [5, 1], // Left ear
    [7, 1], [9, 0], [10, 1], // Right ear
    
    // Head outline - rounder
    [1, 2], [11, 2], // Top of head
    [0, 3], [12, 3], // Upper sides
    [0, 4], [12, 4], // Mid sides
    [0, 5], [12, 5], // Lower sides
    [1, 6], [11, 6], // Bottom of head
    
    // Neck and body
    [2, 7], [10, 7], // Neck
    [1, 8], [11, 8], // Upper body
    [1, 9], [11, 9], // Mid upper body
    [1, 10], [11, 10], // Mid body
    [1, 11], [11, 11], // Mid lower body
    [2, 12], [10, 12], // Lower body
    
    // Legs/paws
    [2, 13], [4, 13], [8, 13], [10, 13], // Upper paws
    [2, 14], [4, 14], [8, 14], [10, 14], // Mid paws
    [2, 15], [3, 15], [9, 15], [10, 15]  // Lower paws
  ];

  // Eyes - larger with pupils, more expressive
  const eyesCoordinates = [
    [3, 4], [4, 4], // Left eye outline
    [8, 4], [9, 4], // Right eye outline
    [4, 4], [8, 4]  // Eye pupils (will be drawn last to show up)
  ];
  
  // White parts of eyes for highlight
  const eyeWhiteCoordinates = [
    [3, 4], [9, 4]  // Eye whites
  ];

  // Small nose
  const noseCoordinates = [[6, 5]];

  // Mouth that changes based on talking state
  const mouthCoordinates = isTalking 
    ? [
        [5, 6], [6, 6], [7, 6] // Talking mouth - horizontal line
      ]
    : [
        [5, 6], [7, 6] // Resting mouth - two dots for a cute smile
      ];

  // Whiskers!
  const whiskerCoordinates = [
    [0, 6], [1, 5], // Left whiskers
    [11, 5], [12, 6] // Right whiskers
  ];

  // Tail with curve
  const tailCoordinates = [
    [11, 10], [12, 9], [13, 8], [14, 8], [14, 7] // Curved tail
  ];

  // Ear inner details
  const earInnerCoordinates = [
    [3, 1], // Left ear inner
    [9, 1]  // Right ear inner
  ];

  // Fill border pixels first (outline)
  borderCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill white eye parts
  eyeWhiteCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FFFFFF' });
  });

  // Fill eyes after white parts
  eyesCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill whiskers
  whiskerCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill nose
  noseCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FF9999' }); // Pink nose
  });

  // Fill mouth
  mouthCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill ear inner details
  earInnerCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FFCCCC' }); // Light pink ear innards
  });

  // Fill tail
  tailCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });

  // Fill body with color - row by row approach for better control
  // Head fill
  for (let y = 1; y <= 6; y++) {
    let startX = 2;
    let endX = 10;
    
    // Adjust fill range for head shape
    if (y === 1) {
      startX = 3; endX = 9; // Between ears
    } else if (y >= 3 && y <= 5) {
      startX = 1; endX = 11; // Wider middle of head
    }
    
    fillRow(startX, endX, y);
  }
  
  // Body fill
  for (let y = 7; y <= 12; y++) {
    let startX = 2;
    let endX = 10;
    
    // Adjust fill range for body shape
    if (y >= 8 && y <= 11) {
      startX = 2; endX = 10;
    }
    
    fillRow(startX, endX, y);
  }
  
  // Paws fill
  const pawsFillCoordinates = [
    [3, 13], [9, 13], // Upper paws centers
    [3, 14], [9, 14]  // Lower paws centers
  ];
  pawsFillCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: bodyColor });
  });
  
  // Tail fill - inside the curved tail
  const tailFillCoordinates = [
    [12, 8], [13, 7]
  ];
  tailFillCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: bodyColor });
  });

  // Helper function to fill a row while skipping existing pixels
  function fillRow(startX: number, endX: number, y: number) {
    for (let x = startX; x <= endX; x++) {
      // Skip if position already has a pixel
      const hasPixel = 
        borderCoordinates.some(([px, py]) => px === x && py === y) ||
        eyesCoordinates.some(([px, py]) => px === x && py === y) ||
        eyeWhiteCoordinates.some(([px, py]) => px === x && py === y) ||
        noseCoordinates.some(([px, py]) => px === x && py === y) ||
        mouthCoordinates.some(([px, py]) => px === x && py === y) ||
        earInnerCoordinates.some(([px, py]) => px === x && py === y) ||
        whiskerCoordinates.some(([px, py]) => px === x && py === y) ||
        tailCoordinates.some(([px, py]) => px === x && py === y);
      
      if (!hasPixel) {
        pixels.push({ x, y, color: bodyColor });
      }
    }
  }

  // Add details in darker shade for depth
  const detailCoordinates = [
    [5, 8], [7, 8],   // Neck/chest details
    [3, 11], [9, 11], // Lower body shading
    [12, 8]           // Tail detail
  ];
  
  detailCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: detailColor });
  });

  // Blush marks (optional but cute)
  const blushCoordinates = [
    [2, 5], [10, 5] // Cheek blush
  ];
  
  blushCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FFAAAA' });
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

// Frog rendering function
function renderFrog(pixels: PixelData[], bodyColor: string, borderColor: string, detailColor: string, isTalking: boolean) {
  // Recreate the exact pixel art from the image
  
  // Main body shape - square with "ears"
  const borderCoordinates = [
    // Top edge with "ears"
    [2, 0], [3, 0], [9, 0], [10, 0],
    
    // Left side outline
    [1, 1], [0, 2], [0, 3], [0, 4], [0, 5], 
    [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
    [1, 11],
    
    // Right side outline
    [11, 1], [12, 2], [12, 3], [12, 4], [12, 5],
    [12, 6], [12, 7], [12, 8], [12, 9], [12, 10],
    [11, 11],
    
    // Bottom outline
    [2, 12], [3, 12], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12],
    
    // Feet
    [2, 13], [3, 13], [4, 13], [8, 13], [9, 13], [10, 13], // Top of feet
    [2, 14], [4, 14], [8, 14], [10, 14], // Bottom of feet
  ];
  
  // Face features - exactly matching the image
  const facePatternCoordinates = [
    // Left ear/horn interior
    [2, 1], [3, 1], 
    
    // Right ear/horn interior
    [9, 1], [10, 1],
    
    // Left eye pattern
    [2, 3], [3, 3], [4, 3], [2, 4], [3, 4], [4, 4],
    
    // Right eye pattern
    [8, 3], [9, 3], [10, 3], [8, 4], [9, 4], [10, 4],
    
    // Nose/central feature
    [5, 5], [6, 5], [7, 5], [6, 6],
    
    // Mouth/lower face pattern
    [4, 7], [5, 7], [6, 7], [7, 7], [8, 7],
    [4, 8], [8, 8],
    [5, 9], [6, 9], [7, 9]
  ];
  
  // Mouth changes when talking
  const talkingMouthCoordinates = isTalking
    ? [
        [5, 10], [6, 10], [7, 10] // Extra mouth pixels when talking
      ]
    : [];
  
  // Fill body outline
  borderCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });
  
  // Fill face pattern with black pixels
  facePatternCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#000000' });
  });
  
  // Fill talking mouth pattern if talking
  talkingMouthCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#000000' });
  });
  
  // Fill body with main color
  for (let y = 0; y <= 14; y++) {
    let startX = 1;
    let endX = 11;
    
    // Adjust fill ranges for each row
    if (y === 0) {
      // Top row with ears - only fill middle
      startX = 4; endX = 8;
    } else if (y === 1) {
      // Row 1
      startX = 4; endX = 8;
    } else if (y === 11) {
      // Bottom curved row
      startX = 2; endX = 10;
    } else if (y === 12) {
      // Feet row - no fill
      continue;
    } else if (y >= 13) {
      // Feet fill
      continue;
    }
    
    // Fill the row
    for (let x = startX; x <= endX; x++) {
      // Skip if position already has a pixel
      const hasPixel = 
        borderCoordinates.some(([px, py]) => px === x && py === y) ||
        facePatternCoordinates.some(([px, py]) => px === x && py === y) ||
        talkingMouthCoordinates.some(([px, py]) => px === x && py === y);
      
      if (!hasPixel) {
        pixels.push({ x, y, color: bodyColor });
      }
    }
  }
  
  // Fill feet
  const feetFillCoordinates = [
    [3, 13], [9, 13], // Feet tops
    [3, 14], [9, 14]  // Feet bottoms
  ];
  
  feetFillCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: bodyColor });
  });
}

// Cactus rendering function
function renderCactus(pixels: PixelData[], bodyColor: string, borderColor: string, detailColor: string, isTalking: boolean) {
  // Improved cactus body with better proportions and smoother edges
  const borderCoordinates = [
    // Main stem top - rounder
    [5, 0], [6, 0], [7, 0], [8, 0],
    
    // Main stem outline - slightly wider with smoother edges
    [4, 1], [9, 1],
    [4, 2], [9, 2],
    [4, 3], [9, 3],
    [4, 4], [9, 4],
    [4, 5], [9, 5],
    [4, 6], [9, 6],
    [4, 7], [9, 7],
    [4, 8], [9, 8], 
    [4, 9], [9, 9],
    [4, 10], [9, 10],
    
    // Bottom of stem (connection to pot)
    [5, 11], [6, 11], [7, 11], [8, 11],
    
    // Left arm - shorter, stubbier, and smoother
    [2, 3], [3, 3],
    [1, 4], [1, 5], [1, 6],
    [2, 7], [3, 7],
    
    // Right arm - shorter, stubbier, and smoother
    [10, 5], [11, 5],
    [12, 6], [12, 7], [12, 8],
    [10, 9], [11, 9]
  ];
  
  // Pot with better shape
  const potCoordinates = [
    // Top rim of pot - wider
    [3, 12], [4, 12], [5, 12], [6, 12], [7, 12], [8, 12], [9, 12], [10, 12],
    
    // Pot sides - tapered
    [2, 13], [11, 13],
    [2, 14], [11, 14],
    
    // Bottom of pot
    [3, 15], [4, 15], [5, 15], [6, 15], [7, 15], [8, 15], [9, 15], [10, 15]
  ];
  
  // Cute face with bigger eyes and a more prominent smile
  const faceCoordinates = isTalking
    ? [
        // Eyes - bigger, more centered, with happy expression
        [5, 3], [8, 3],
        
        // Open mouth while talking - clearly open with smile shape
        [5, 5], [7, 5], // Smile corners
        [5, 6], [6, 7], [7, 6] // Deeper open mouth (forms a cavity)
      ]
    : [
        // Eyes - bigger, more centered
        [5, 3], [8, 3],
        
        // Bigger smile - three pixels wide curved smile
        [5, 5], [6, 6], [7, 5]
      ];
  
  // Fewer cactus spikes - reduced number for a less spiky look
  const spikeCoordinates = [
    // Main stem spikes - reduced
    [3, 3], [10, 3],
    [3, 7], [10, 7],
    
    // Just one spike per arm
    [0, 5], // Left arm spike
    [13, 7]  // Right arm spike
  ];
  
  // Markings/stripes on cactus for texture - simplified
  const detailCoordinates = [
    // Vertical stripes on main body - fewer for cleaner look
    [6, 2], [6, 7],
    
    // Arm details - minimal
    [2, 5]
  ];
  
  // Larger blush marks for extra cuteness
  const blushCoordinates = [
    [3, 4], [10, 4]
  ];
  
  // Fill pot with a warmer terracotta color
  const potColor = '#D9937C'; // Warmer terracotta color
  
  // Fill border outline
  borderCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });
  
  // Fill pot outline
  potCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });
  
  // Fill face features
  faceCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#000000' });
  });
  
  // Fill spikes - fewer spikes
  spikeCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: borderColor });
  });
  
  // Fill blush marks - larger
  blushCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FFADB9' }); // Slightly warmer blush color
  });
  
  // Fill main cactus body
  for (let y = 0; y <= 11; y++) {
    // Skip rows that don't need filling
    if (y === 0) {
      // Fill top of the cactus
      for (let x = 5; x <= 8; x++) {
        if (!borderCoordinates.some(([px, py]) => px === x && py === y)) {
          pixels.push({ x, y, color: bodyColor });
        }
      }
      continue;
    }
    
    // Fill main stem
    let startX = 5;
    let endX = 8;
    
    if (y >= 2 && y <= 10) {
      startX = 5;
      endX = 8;
    }
    
    for (let x = startX; x <= endX; x++) {
      if (!borderCoordinates.some(([px, py]) => px === x && py === y) && 
          !faceCoordinates.some(([px, py]) => px === x && py === y) &&
          !detailCoordinates.some(([px, py]) => px === x && py === y)) {
        pixels.push({ x, y, color: bodyColor });
      }
    }
    
    // Fill left arm (when present)
    if (y >= 4 && y <= 6) {
      for (let x = 2; x <= 3; x++) {
        if (!borderCoordinates.some(([px, py]) => px === x && py === y) &&
            !detailCoordinates.some(([px, py]) => px === x && py === y)) {
          pixels.push({ x, y, color: bodyColor });
        }
      }
    }
    
    // Fill right arm (when present)
    if (y >= 6 && y <= 8) {
      for (let x = 10; x <= 11; x++) {
        if (!borderCoordinates.some(([px, py]) => px === x && py === y) &&
            !detailCoordinates.some(([px, py]) => px === x && py === y)) {
          pixels.push({ x, y, color: bodyColor });
        }
      }
    }
  }
  
  // Fill pot area with gradient effect
  for (let y = 13; y <= 14; y++) {
    for (let x = 3; x <= 10; x++) {
      if (!potCoordinates.some(([px, py]) => px === x && py === y)) {
        // Darker at the bottom for a gradient effect
        const potGradientColor = y === 14 ? adjustColorBrightness(potColor, -15) : potColor;
        pixels.push({ x, y, color: potGradientColor });
      }
    }
  }
  
  // Add details/texture lines
  detailCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: detailColor });
  });
  
  // Add highlight on the pot - wider for better visibility
  const potHighlightCoordinates = [
    [3, 13], [4, 13], [5, 13], [6, 13], [7, 13]
  ];
  
  potHighlightCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#F2C1AA' }); // Even lighter highlight for better contrast
  });
  
  // Add larger flower/bloom on top for extra cuteness
  const flowerCoordinates = [
    [5, 0], [6, 0], [7, 0], [8, 0] // Larger flower/bloom covering the top
  ];
  
  flowerCoordinates.forEach(([x, y]) => {
    pixels.push({ x, y, color: '#FF8FB1' }); // Brighter pink flower
  });
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
}); 