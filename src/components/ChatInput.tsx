import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS, SIZES, FONTS, SPACING } from './theme';
import { useSpeechToText } from '../services/speechToTextService';
import Constants from 'expo-constants';

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

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  
  // Check if we're in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';
  
  // Only use speech recognition if not in Expo Go
  const { 
    isListening, 
    results, 
    startListening, 
    stopListening 
  } = useSpeechToText();

  // Update input when speech recognition results change
  useEffect(() => {
    if (results.length > 0) {
      setMessage(results[0]);
    }
  }, [results]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const toggleListening = async () => {
    if (isExpoGo) {
      // Show info alert in Expo Go
      Alert.alert(
        "Voice Recognition Unavailable",
        "Speech-to-text requires a development build and cannot be used in Expo Go.",
        [{ text: "OK" }]
      );
      return;
    }
    
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Talk to your DigiPal..."
        placeholderTextColor={COLORS.text + '80'}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      
      {/* Microphone button */}
      <TouchableOpacity 
        style={[
          styles.micButton, 
          isListening && styles.micButtonActive,
          isExpoGo && styles.micButtonDisabled
        ]} 
        onPress={toggleListening}
      >
        {isListening ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Svg height={24} width={24} viewBox="0 0 24 24">
            <Path
              d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"
              fill="#FFFFFF"
            />
          </Svg>
        )}
      </TouchableOpacity>
      
      {/* Send button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Svg height={24} width={24} viewBox="0 0 24 24">
          <Path
            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            fill={COLORS.primary}
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  input: {
    flex: 1,
    height: SIZES.inputHeight,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.md,
    fontFamily: FONTS.silkscreen,
    fontSize: 16,
    letterSpacing: 1,
    color: '#333333',
    borderWidth: 3,
    borderColor: '#CCCCCC',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    width: SIZES.buttonHeight,
    height: SIZES.buttonHeight,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: adjustColorBrightness(COLORS.secondary, -50),
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
  },
  micButton: {
    width: SIZES.buttonHeight,
    height: SIZES.buttonHeight,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    borderWidth: 3,
    borderColor: adjustColorBrightness(COLORS.primary, -50),
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
  },
  micButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: adjustColorBrightness(COLORS.accent, -50),
  },
  micButtonDisabled: {
    backgroundColor: '#888888',
    borderColor: '#666666',
    opacity: 0.7,
  },
}); 