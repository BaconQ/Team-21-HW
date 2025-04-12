import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Keyboard, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ChatInput } from '../components/ChatInput';
import { StatsIcon } from '../components/StatsIcon';
import { PixelPet } from '../components/PixelPet';
import { IconButton } from '../components/HeaderIcons';
import { COLORS, FONTS, SPACING, SIZES } from '../components/theme';
import { PetType } from '../types';
import { ChatMessage } from '../types/index';
import { usePet } from '../hooks/usePet';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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

export function HomeScreen() {
  const { 
    pet, 
    feedPet, 
    hydratePet, 
    exercisePet, 
    playWithPet,
    getPetMood,
    customizePet
  } = usePet();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m DigiPal. How are you today?',
      sender: 'PET',
      timestamp: new Date(),
    },
  ]);

  // State for text streaming
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const fullMessageRef = useRef('');
  const charIndexRef = useRef(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const MAX_VISIBLE_MESSAGES = 2;

  // Add keyboard state
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // On mount, set the default pet type (cat)
  useEffect(() => {
    customizePet({ type: PetType.CAT });
  }, []);

  // Trim old messages and keep only the most recent ones
  useEffect(() => {
    if (messages.length > MAX_VISIBLE_MESSAGES) {
      // Fade out animation before removing - longer duration for slower fade
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500, // 1.5 seconds
        useNativeDriver: true,
      }).start(() => {
        // After fade out, trim the messages array
        setMessages(prevMessages => prevMessages.slice(-MAX_VISIBLE_MESSAGES));
        // Reset the fade animation for future use
        fadeAnim.setValue(1);
      });
    }
  }, [messages, fadeAnim]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, streamingText]);

  // Streaming text effect
  useEffect(() => {
    if (isStreaming && charIndexRef.current < fullMessageRef.current.length) {
      // Show pet talking animation during streaming
      setIsTalking(true);
      
      const timeoutId = setTimeout(() => {
        setStreamingText(fullMessageRef.current.substring(0, charIndexRef.current + 1));
        charIndexRef.current += 1;
      }, 50); // Control the speed of the typing

      return () => clearTimeout(timeoutId);
    } else if (isStreaming && charIndexRef.current >= fullMessageRef.current.length) {
      // Streaming finished
      setIsStreaming(false);
      setIsTalking(false);
      
      // Add the full message to the messages state
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: fullMessageRef.current,
        sender: 'PET',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setStreamingText('');
    }
  }, [isStreaming, streamingText]);

  // Add keyboard listeners with layout animation
  useEffect(() => {
    // Create a smoother animation config
    const smoothAnimConfig = {
      duration: 300,
      create: { 
        type: LayoutAnimation.Types.easeInEaseOut, 
        property: LayoutAnimation.Properties.opacity,
      },
      update: { 
        type: LayoutAnimation.Types.easeInEaseOut,
        springDamping: 0.7,
      },
    };

    const keyboardWillShowListener = Platform.OS === 'ios' 
      ? Keyboard.addListener('keyboardWillShow', () => {
          LayoutAnimation.configureNext(smoothAnimConfig);
          setKeyboardVisible(true);
          // Scroll to the end to ensure latest messages are visible when keyboard opens
          scrollViewRef.current?.scrollToEnd({ animated: true });
        })
      : Keyboard.addListener('keyboardDidShow', () => {
          LayoutAnimation.configureNext(smoothAnimConfig);
          setKeyboardVisible(true);
          // Scroll to the end to ensure latest messages are visible when keyboard opens
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
    
    const keyboardWillHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => {
          LayoutAnimation.configureNext(smoothAnimConfig);
          setKeyboardVisible(false);
        })
      : Keyboard.addListener('keyboardDidHide', () => {
          LayoutAnimation.configureNext(smoothAnimConfig);
          setKeyboardVisible(false);
        });

    // Clean up listeners
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'USER',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Prepare to stream AI response
    setTimeout(() => {
      const response = getRandomResponse(text);
      fullMessageRef.current = response;
      charIndexRef.current = 0;
      setIsStreaming(true);
    }, 500);
  };

  // Get pet responses (now just a single set for the cat pet)
  const getRandomResponse = (input: string) => {
    const responses = [
      `*purrs* I like talking about ${input}!`,
      `Meow! That's interesting. Tell me more!`,
      `*tilts head* I'm curious about ${input} too!`,
      `*blinks slowly* ${input}? That sounds fun!`,
      `If I could try ${input}, I would pounce on it!`,
      `That's fascinating! Tell me more about ${input}.`,
      `I've been thinking about ${input} too!`,
      `${input} sounds like something I'd enjoy.`,
      `*perks up* Ooh, ${input}? I like that!`,
      `You always have the most interesting things to say about ${input}!`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleStatIconPress = (type: 'FOOD' | 'WATER' | 'ACTIVITY' | 'MOOD') => {
    switch (type) {
      case 'FOOD':
        feedPet();
        break;
      case 'WATER':
        hydratePet();
        break;
      case 'ACTIVITY':
        exercisePet();
        break;
      case 'MOOD':
        playWithPet();
        break;
    }
  };

  const handleSettingsPress = () => {
    // Change pet's color instead of type
    const colors = ['#E1EEBC', '#FFC0CB', '#ADD8E6', '#FFD700', '#98FB98']; 
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    customizePet({ color: randomColor });
  };

  const handleStatsPress = () => {
    // TODO: Open stats screen
    console.log('Stats pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background gradient */}
      <LinearGradient
        colors={['rgba(50, 142, 110, 1)', 'rgba(30, 100, 80, 1)']} 
        style={styles.backgroundGradient}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
        contentContainerStyle={{ flex: 1 }}
      >
        {/* Header & Title */}
        <View style={styles.header}>
          <Text style={[
            styles.title,
            keyboardVisible && styles.compactTitle
          ]}>DigiPal</Text>
          <View style={{flexDirection: 'row'}}>
            <IconButton type="stats" onPress={handleStatsPress} />
            <IconButton type="settings" onPress={handleSettingsPress} />
          </View>
        </View>
        
        {/* Stats Icons */}
        <View style={[
          styles.statsContainer,
          keyboardVisible && styles.compactStatsContainer
        ]}>
          <StatsIcon 
            type="FOOD" 
            value={pet.stats.hunger} 
            onPress={() => handleStatIconPress('FOOD')}
          />
          <StatsIcon 
            type="WATER" 
            value={pet.stats.hydration} 
            onPress={() => handleStatIconPress('WATER')}
          />
          <StatsIcon 
            type="ACTIVITY" 
            value={pet.stats.activity} 
            onPress={() => handleStatIconPress('ACTIVITY')}
          />
          <StatsIcon 
            type="MOOD" 
            value={pet.stats.mood} 
            onPress={() => handleStatIconPress('MOOD')}
          />
        </View>
        
        {/* Pet View */}
        <View style={[
          styles.petContainer,
          keyboardVisible && styles.compactPetContainer
        ]}>
          <PixelPet 
            pet={pet} 
            mood={getPetMood()}
            isTalking={isTalking}
          />
        </View>
        
        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map((message, index) => {
            // When we're about to remove messages, apply fade animation to older messages
            const isOldMessage = messages.length > MAX_VISIBLE_MESSAGES && index === 0;
            
            return (
              <Animated.View 
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === 'USER' ? styles.userMessage : styles.petMessage,
                  isOldMessage && { opacity: fadeAnim },
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.sender === 'USER' ? styles.userMessageText : styles.petMessageText
                ]}>
                  {message.text}
                </Text>
              </Animated.View>
            );
          })}
          
          {/* Streaming message */}
          {isStreaming && (
            <View style={[styles.messageBubble, styles.petMessage]}>
              <Text style={[styles.messageText, styles.petMessageText]}>
                {streamingText}
                <Animated.Text 
                  style={[
                    styles.cursor, 
                    { opacity: fadeAnim }
                  ]}
                >
                  █
                </Animated.Text>
              </Text>
            </View>
          )}
        </ScrollView>
        
        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  compactHeader: {
    paddingTop: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: 28,
    color: COLORS.secondary,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textTransform: 'uppercase',
    marginVertical: SPACING.sm,
    // Add a border as an outline - typical of retro games
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  compactTitle: {
    fontSize: 20,
    marginVertical: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    width: '100%',
  },
  compactStatsContainer: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  petContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md + 80,
    height: SIZES.petSize,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  compactPetContainer: {
    marginVertical: SPACING.sm,
    transform: [{ scale: 0.8 }],
    height: SIZES.petSize * 0.8,
  },
  chatContainer: {
    flex: 1,
    marginTop: SPACING.md,
    marginBottom: 0,
  },
  chatContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xs,
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  messageBubble: {
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
    maxWidth: '85%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    // Pixelated border style
    borderWidth: 3,
    borderStyle: 'solid',
  },
  userMessage: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
    borderColor: adjustColorBrightness(COLORS.secondary, -50),
  },
  petMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
    borderColor: '#CCCCCC',
  },
  messageText: {
    fontFamily: FONTS.retro,
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 2,
    marginBottom: 4,
    color: '#333333',
  },
  userMessageText: {
    textShadowColor: 'rgba(50, 142, 110, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  petMessageText: {
    textShadowColor: 'rgba(225, 238, 188, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  cursor: {
    opacity: 1,
    fontFamily: FONTS.retro,
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.primary,
    textShadowColor: 'rgba(50, 142, 110, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
}); 