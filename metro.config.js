const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Helper to check if a module exists
function moduleExists(moduleName) {
  try {
    return require.resolve(moduleName);
  } catch (error) {
    return false;
  }
}

// Add resolver for node modules used by elevenlabs
config.resolver.extraNodeModules = {
  stream: moduleExists('stream-browserify') || path.join(__dirname, 'node_modules/stream-browserify'),
  buffer: moduleExists('buffer') || path.join(__dirname, 'node_modules/buffer'),
};

module.exports = config; 