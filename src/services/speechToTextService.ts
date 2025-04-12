import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

// Create mock interface for environments where Voice is not available (Expo Go)
interface VoiceMock {
  onSpeechResults: ((e: any) => void) | null;
  onSpeechPartialResults: ((e: any) => void) | null;
  onSpeechError: ((e: any) => void) | null;
  onSpeechEnd: (() => void) | null;
  start: (locale?: string) => Promise<void>;
  stop: () => Promise<void>;
  destroy: () => Promise<void>;
  removeAllListeners: () => void;
}

// Determine if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Create a mock implementation for Expo Go
const mockVoice: VoiceMock = {
  onSpeechResults: null,
  onSpeechPartialResults: null,
  onSpeechError: null,
  onSpeechEnd: null,
  start: async (locale?: string) => {
    // Show alert explaining voice recognition is not available
    Alert.alert(
      'Voice Recognition Unavailable',
      'Speech recognition requires a development build and cannot be used in Expo Go.',
      [{ text: 'OK' }]
    );
    
    // Simulate error
    if (mockVoice.onSpeechError) {
      mockVoice.onSpeechError({
        error: { message: 'Voice recognition not available in Expo Go' }
      });
    }
    
    throw new Error('Voice recognition not available in Expo Go');
  },
  stop: async () => {
    // No-op for mock
    if (mockVoice.onSpeechEnd) {
      mockVoice.onSpeechEnd();
    }
    return Promise.resolve();
  },
  destroy: async () => Promise.resolve(),
  removeAllListeners: () => {}
};

// Only import the real Voice module if not in Expo Go
let Voice: typeof VoiceMock;
if (isExpoGo) {
  Voice = mockVoice;
} else {
  // Dynamic import to avoid error in Expo Go
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (error) {
    console.warn('Voice module not available, using mock instead');
    Voice = mockVoice;
  }
}

interface SpeechResultsEvent {
  value?: string[];
}

interface SpeechErrorEvent {
  error?: {
    message?: string;
  };
}

interface SpeechToTextState {
  isListening: boolean;
  results: string[];
  error: string | null;
  partialResults: string[];
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
}

/**
 * Hook to manage speech-to-text functionality
 */
export function useSpeechToText(): SpeechToTextState {
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [partialResults, setPartialResults] = useState<string[]>([]);

  useEffect(() => {
    // Initialize Voice
    function onSpeechResults(e: SpeechResultsEvent) {
      if (e.value) {
        setResults(e.value);
      }
    }

    function onSpeechPartialResults(e: SpeechResultsEvent) {
      if (e.value) {
        setPartialResults(e.value);
      }
    }

    function onSpeechError(e: SpeechErrorEvent) {
      console.error('Speech recognition error:', e);
      setError(e.error?.message || 'Unknown error occurred');
      setIsListening(false);
    }

    // Handle end of speech recognition
    function onSpeechEnd() {
      setIsListening(false);
    }

    // Set up Voice listeners
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = onSpeechEnd;

    // Clean up on unmount
    return () => {
      Voice.destroy().then(() => {
        Voice.removeAllListeners();
      });
    };
  }, []);

  const startListening = async () => {
    try {
      // Check if we're in Expo Go and show a message
      if (isExpoGo) {
        setError('Speech recognition is not available in Expo Go. Use a development build to access this feature.');
        return;
      }
      
      setError(null);
      setResults([]);
      setPartialResults([]);
      
      // Start voice recognition
      await Voice.start(Platform.OS === 'ios' ? 'en-US' : undefined);
      setIsListening(true);
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      setError('Failed to start speech recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping speech recognition:', e);
    }
  };

  return {
    isListening,
    results,
    error,
    partialResults,
    startListening,
    stopListening,
  };
} 