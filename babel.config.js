module.exports = function(api) {
  api.cache(true);
  
  // Check if module-resolver plugin is available
  let hasModuleResolver = false;
  try {
    require.resolve('babel-plugin-module-resolver');
    hasModuleResolver = true;
  } catch (error) {
    console.warn('babel-plugin-module-resolver not found, skipping alias configuration');
  }
  
  // Configure plugins based on availability
  const plugins = [];
  
  // Only add module-resolver if available
  if (hasModuleResolver) {
    plugins.push([
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          // This is important for the Buffer polyfill
          'buffer': 'buffer'
        },
      },
    ]);
  }
  
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
}; 