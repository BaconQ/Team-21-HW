import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

// Initialize ElevenLabs with API key
const API_KEY = 'sk_d9ff42b69a9ce1aa5f86fa6e1d888570d3d830a1bddb0165';

// Default voice settings
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Bella

// Cache for audio recordings
const audioCache = new Map<string, Audio.Sound>();
const audioFiles = new Set<string>();
const loadingStates = new Map<string, boolean>();
const isPlayingMap = new Map<string, boolean>();

// Debug flag - set to true to see more logs
const DEBUG = true;

interface TTSOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  messageId?: string; // Added to track loading state
}

/**
 * Check if audio for a specific message is currently loading
 */
export function isAudioLoading(messageId: string): boolean {
  return loadingStates.get(messageId) === true;
}

/**
 * Check if a specific message is currently being played
 */
export function isAudioPlaying(messageId: string): boolean {
  return isPlayingMap.get(messageId) === true;
}

/**
 * Safe play operation - checks if sound is loaded before playing
 */
async function safePlaySound(sound: Audio.Sound, messageId?: string): Promise<void> {
  try {
    // Check if sound is loaded
    const status = await sound.getStatusAsync();
    
    if (!status.isLoaded) {
      console.warn('Attempted to play an unloaded sound');
      return;
    }
    
    // Start from the beginning
    await sound.setPositionAsync(0);
    
    // Set volume to max
    await sound.setVolumeAsync(1.0);
    
    // Play the sound
    if (messageId) isPlayingMap.set(messageId, true);
    await sound.playAsync();
    
    // Add listener for playback status
    sound.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
        if (DEBUG) console.log('Audio finished playing');
        if (messageId) isPlayingMap.set(messageId, false);
      }
    });
  } catch (error) {
    console.error('Error playing sound:', error);
    if (messageId) isPlayingMap.set(messageId, false);
  }
}

/**
 * Safe unload operation - checks if sound is loaded before unloading
 */
async function safeUnloadSound(sound: Audio.Sound): Promise<void> {
  try {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.unloadAsync();
    }
  } catch (error) {
    console.warn('Error unloading sound:', error);
  }
}

/**
 * Safe stop operation - checks if sound is loaded before stopping
 */
async function safeStopSound(sound: Audio.Sound): Promise<void> {
  try {
    // Check if sound is loaded before stopping
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      await sound.stopAsync();
    }
  } catch (error) {
    console.warn('Error stopping sound:', error);
    // Don't rethrow, just log warning
  }
}

/**
 * Get a simple system sound that's guaranteed to work
 */
async function getSystemSound(): Promise<Audio.Sound> {
  const sound = new Audio.Sound();
  
  try {
    // Create an empty audio file in the filesystem
    const emptyAudioPath = FileSystem.cacheDirectory + 'silence.mp3';
    await FileSystem.writeAsStringAsync(emptyAudioPath, '');
    
    // Load as sound
    await sound.loadAsync({ uri: emptyAudioPath });
    return sound;
  } catch (error) {
    console.warn('Error creating system sound, returning unloaded sound');
    return sound;
  }
}

/**
 * Synthesizes text to speech using ElevenLabs API
 */
export async function synthesizeSpeech(
  text: string, 
  options: TTSOptions = {}
): Promise<Audio.Sound> {
  const messageId = options.messageId || 'default';
  
  try {
    // Set loading state for this message
    loadingStates.set(messageId, true);
    
    if (DEBUG) console.log(`Synthesizing speech for message "${messageId}": "${text.substring(0, 30)}..."`);
    
    // Create cache key
    const voiceId = options.voiceId || DEFAULT_VOICE_ID;
    const stability = options.stability || 0.5;
    const similarityBoost = options.similarityBoost || 0.75;
    const cacheKey = `${text.substring(0, 50)}`; // Shorter cache key for better performance
    
    // Check cache
    if (audioCache.has(cacheKey)) {
      const sound = audioCache.get(cacheKey);
      if (sound) {
        try {
          // Verify sound is loaded
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            if (DEBUG) console.log('Using cached audio');
            loadingStates.set(messageId, false);
            return sound;
          } else {
            // If not loaded, remove from cache and continue
            audioCache.delete(cacheKey);
          }
        } catch (error) {
          console.warn('Error checking cached sound:', error);
          audioCache.delete(cacheKey);
        }
      }
    }
    
    try {
      if (DEBUG) console.log('Making ElevenLabs API request with POST');
      
      // Use the standard API endpoint with POST
      const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      
      // Make API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
          },
        }),
      });
      
      if (!response.ok) {
        console.error(`ElevenLabs API error: ${response.status}`);
        throw new Error(`Failed to get audio: ${response.status}`);
      }
      
      // Download the audio file
      const tempFile = `${FileSystem.cacheDirectory}speech-${Date.now()}.mp3`;
      
      // Get the blob directly from the response
      const audioBlob = await response.blob();
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const dataUrl = reader.result as string;
          // Remove the data URL prefix
          const base64 = dataUrl.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      
      // Write the base64 data to a file
      await FileSystem.writeAsStringAsync(tempFile, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      if (DEBUG) console.log('Audio file saved, loading sound');
      
      // Load the sound
      const sound = new Audio.Sound();
      await sound.loadAsync({ uri: tempFile });
      
      if (DEBUG) console.log('Sound loaded successfully');
      
      // Keep track of the file to clean up later
      audioFiles.add(tempFile);
      
      // Cache the sound
      audioCache.set(cacheKey, sound);
      
      // Clear loading state
      loadingStates.set(messageId, false);
      
      return sound;
    } catch (loadError) {
      console.error('Error with ElevenLabs API:', loadError);
      
      if (DEBUG) console.log('Creating fallback sound');
      
      // Create a proper fallback sound instead of using getSystemSound
      const sound = new Audio.Sound();
      
      try {
        // Create a very short MP3 file from raw data (1 second of silence)
        const silenceFile = `${FileSystem.cacheDirectory}silence-${Date.now()}.mp3`;
        
        // This is a minimal valid MP3 file (essentially silence)
        const silenceMP3Base64 = 'SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD4+Pj4+PkxMTExMTFpaWlpaWmhoaGhoaHd3d3d3d4aGhoaGhpSUlJSUlKCgoKCgoK+vr6+vr76+vr6+vsbGxsbGxtTU1NTU1OPj4+Pj4/Hz8/Pz8//////////////////////////////////////////////////////////////////8AAAA';
        
        // Write the base64 silence MP3 to a file
        await FileSystem.writeAsStringAsync(silenceFile, silenceMP3Base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Load the silence MP3
        await sound.loadAsync({ uri: silenceFile });
        
        // Add to cache and tracking
        audioFiles.add(silenceFile);
        
        if (DEBUG) console.log('Fallback sound created successfully');
        
        // Clear loading state
        loadingStates.set(messageId, false);
        
        return sound;
      } catch (fallbackError) {
        console.error('Error creating fallback sound:', fallbackError);
        
        // Last resort - return unloaded sound but don't throw
        loadingStates.set(messageId, false);
        return sound;
      }
    }
  } catch (error) {
    console.error('Error in synthesizeSpeech:', error);
    loadingStates.set(messageId, false);
    
    // Create an unloaded sound as a last resort
    return new Audio.Sound();
  }
}

/**
 * Plays the synthesized speech for the given text
 */
export async function speakText(
  text: string, 
  options: TTSOptions = {}
): Promise<void> {
  const messageId = options.messageId || 'default';
  
  try {
    if (DEBUG) console.log(`Speaking text: "${text.substring(0, 30)}..." (messageId: ${messageId})`);
    
    // Initialize audio mode settings first
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        allowsRecordingIOS: false,
      });
      if (DEBUG) console.log('Audio mode set successfully');
    } catch (audioModeError) {
      console.warn('Error setting audio mode:', audioModeError);
    }
    
    // Get sound object
    const sound = await synthesizeSpeech(text, options);
    
    if (DEBUG) console.log('Sound synthesized, playing now');
    
    try {
      // First verify the sound is loaded
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) {
        if (DEBUG) console.log('Sound not loaded, cannot play');
        return;
      }
      
      // Play the sound with explicit settings
      await sound.setVolumeAsync(1.0);
      await sound.setPositionAsync(0);
      await sound.setRateAsync(1.0, false);
      await sound.setIsMutedAsync(false);
      
      // Mark as playing
      isPlayingMap.set(messageId, true);
      
      // Play the sound
      await sound.playAsync();
      
      // Set up completion listener
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          if (DEBUG) console.log(`Sound finished playing for message ${messageId}`);
          isPlayingMap.set(messageId, false);
        }
      });
    } catch (playError) {
      console.error('Error playing sound:', playError);
      isPlayingMap.set(messageId, false);
    }
  } catch (error) {
    console.error('Error in speakText:', error);
    // Clear playing state in case of error
    isPlayingMap.set(messageId, false);
  }
}

/**
 * Stops any currently playing speech
 */
export async function stopSpeech(): Promise<void> {
  try {
    if (DEBUG) console.log('Stopping all speech');
    
    // Stop and unload all sounds
    for (const sound of audioCache.values()) {
      try {
        await safeStopSound(sound);
        await safeUnloadSound(sound);
      } catch (e) {
        // Ignore errors - already handled in safe methods
      }
    }
    
    // Clear the cache
    audioCache.clear();
    
    // Clear all loading states
    loadingStates.clear();
    
    // Clear all playing states
    isPlayingMap.clear();
    
    // Delete temporary files
    for (const file of audioFiles) {
      try {
        await FileSystem.deleteAsync(file);
      } catch (e) {
        console.warn('Error cleaning up audio file:', e);
      }
    }
    
    // Clear the file set
    audioFiles.clear();
  } catch (error) {
    console.error('Error in stopSpeech:', error);
    // Don't throw to prevent app crashes
  }
} 