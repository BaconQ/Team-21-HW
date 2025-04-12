// Buffer polyfill for React Native
try {
  // Only add the Buffer polyfill if it doesn't exist yet
  if (typeof global.Buffer === 'undefined') {
    global.Buffer = require('buffer').Buffer;
  }
} catch (error) {
  // Ignore errors in Expo Go
  console.warn('Failed to polyfill Buffer. This is expected in Expo Go.');
} 