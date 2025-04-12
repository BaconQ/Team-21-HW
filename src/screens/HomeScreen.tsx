import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Keyboard, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager } from 'react-native';
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
import { sendMessageToLLM } from '../services/llmService';

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
    customizePet,
    applyStatChanges
  } = usePet();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTalking, setIsTalking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const MAX_VISIBLE_MESSAGES = 5;

  // Add keyboard state
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animation for loading dots
  const loadingAnim = useRef(new Animated.Value(0.3)).current;
  
  // Set up loading animation
  useEffect(() => {
    // Create a looping animation for loading dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      // Clean up animation
      loadingAnim.stopAnimation();
    };
  }, [loadingAnim]);

  // On mount, set the default pet type and get initial greeting
  useEffect(() => {
    customizePet({ type: PetType.CAT });
    
    // Get initial greeting
    getInitialGreeting();
  }, []);

  // Fetch initial greeting from LLM
  const getInitialGreeting = async () => {
    try {
      setIsLoading(true);
      
      // Add a temporary greeting while loading
      setMessages([{
        id: 'loading',
        text: '',
        sender: 'PET',
        timestamp: new Date(),
        isLoading: true
      }]);
      
      // Call LLM with empty string for initial greeting
      const llmResponse = await sendMessageToLLM('Hello');
      
      // Apply any initial stat changes
      if (llmResponse.changes && llmResponse.changes.length > 0) {
        applyStatChanges(llmResponse.changes);
      }
      
      // Replace loading message with actual messages
      const initialMessages = llmResponse.messages.map((text, index) => ({
        id: `initial-${index}`,
        text,
        sender: 'PET' as const,
        timestamp: new Date(Date.now() + index * 100),
      }));
      
      setMessages(initialMessages);
    } catch (error) {
      console.error("Error getting initial greeting:", error);
      
      // Fallback greeting if API fails
      setMessages([{
        id: 'initial-fallback',
        text: "Hello! I'm DigiPal. How can I help you today?",
        sender: 'PET',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

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
  }, [messages]);

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

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'USER',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Add a temporary thinking message
    const thinkingId = `thinking-${Date.now()}`;
    setMessages((prev) => [
      ...prev, 
      {
        id: thinkingId,
        text: '',
        sender: 'PET',
        timestamp: new Date(),
        isLoading: true
      }
    ]);
    
    try {
      // Show talking animation
      setIsTalking(true);
      
      // Call the LLM API
      const llmResponse = await sendMessageToLLM(text);
      
      // Hide talking animation
      setIsTalking(false);
      
      // Remove the thinking message
      setMessages((prev) => prev.filter(msg => msg.id !== thinkingId));
      
      // Apply any stat changes returned by the API
      if (llmResponse.changes && llmResponse.changes.length > 0) {
        applyStatChanges(llmResponse.changes);
      }
      
      // Add all response messages
      const responseMessages = llmResponse.messages.map((messageText, index) => ({
        id: `${Date.now()}-${index}`,
        text: messageText,
        sender: 'PET' as const,
        timestamp: new Date(Date.now() + index * 100),
      }));
      
      setMessages(prev => [...prev, ...responseMessages]);
      
    } catch (error) {
      console.error("Error processing LLM response:", error);
      
      // Remove thinking bubble
      setMessages((prev) => prev.filter(msg => msg.id !== thinkingId));
      
      // Add a fallback message if something goes wrong
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "I'm having trouble connecting right now. Can you try again?",
        sender: 'PET',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Hide talking animation
      setIsTalking(false);
    }
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
    // Change pet's color
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
                  message.isLoading && styles.loadingMessage,
                ]}
              >
                {message.isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.Text 
                      style={[
                        styles.loadingText,
                        { opacity: loadingAnim }
                      ]}
                    >
                      . . .
                    </Animated.Text>
                  </View>
                ) : (
                  <Text style={[
                    styles.messageText,
                    message.sender === 'USER' ? styles.userMessageText : styles.petMessageText
                  ]}>
                    {message.text}
                  </Text>
                )}
              </Animated.View>
            );
          })}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  loadingText: {
    fontFamily: FONTS.retro,
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  loadingMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
}); 