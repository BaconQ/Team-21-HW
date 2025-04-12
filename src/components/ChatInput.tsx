import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS, SIZES, FONTS, SPACING } from './theme';

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
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: 18,
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
    borderRadius: SIZES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
}); 