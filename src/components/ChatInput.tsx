import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS, SIZES, FONTS, SPACING } from './theme';

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

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
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
}); 