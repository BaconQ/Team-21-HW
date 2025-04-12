import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ChatInput } from '../components/ChatInput';
import { StatsIcon } from '../components/StatsIcon';
import { PixelPet } from '../components/PixelPet';
import { IconButton } from '../components/HeaderIcons';
import { COLORS, FONTS, SPACING, SIZES } from '../components/theme';
import { ChatMessage, PetType } from '../types';
import { usePet } from '../hooks/usePet';

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
      text: 'Hi! I\'m Pixel. How are you today?',
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

  // On mount, assign a random animal type
  useEffect(() => {
    const animalTypes = [PetType.CAT, PetType.DOG, PetType.BUNNY];
    const randomType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
    customizePet({ type: randomType });
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

  // Get more interesting random responses
  const getRandomResponse = (input: string) => {
    const petTypeResponses = {
      [PetType.CAT]: [
        `*purrs* I like talking about ${input}!`,
        `Meow! That's interesting. Tell me more!`,
        `*tilts head* I'm curious about ${input} too!`,
        `*blinks slowly* ${input}? That sounds fun!`,
        `If I could try ${input}, I would pounce on it!`,
      ],
      [PetType.DOG]: [
        `*wags tail* I love talking about ${input}!`,
        `Woof! That's awesome. Tell me more!`,
        `*perks ears up* I'm excited about ${input} too!`,
        `*jumps up* ${input}? That sounds amazing!`,
        `If I could try ${input}, I would bring it right back to you!`,
      ],
      [PetType.BUNNY]: [
        `*twitches nose* I'm interested in ${input}!`,
        `*hops excitedly* That's fascinating. Tell me more!`,
        `*wiggles ears* I want to know more about ${input}!`,
        `*sits up tall* ${input}? That sounds wonderful!`,
        `If I could try ${input}, I would hop all over it!`,
      ],
    };
    
    const responses = petTypeResponses[pet.type] || petTypeResponses[PetType.CAT];
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
    // Change to a random pet type
    const animalTypes = [PetType.CAT, PetType.DOG, PetType.BUNNY];
    const randomType = animalTypes[Math.floor(Math.random() * animalTypes.length)];
    customizePet({ type: randomType });
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
        colors={[COLORS.primary, '#256E54']}
        style={styles.backgroundGradient}
      />
      
      {/* Header with settings */}
      <View style={styles.header}>
        <IconButton 
          type="settings" 
          onPress={handleSettingsPress} 
        />
        
        <IconButton 
          type="stats" 
          onPress={handleStatsPress} 
        />
      </View>
      
      {/* Stats Icons */}
      <View style={styles.statsContainer}>
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
      <View style={styles.petContainer}>
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
              <Text style={styles.cursor}>|</Text>
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: SPACING.lg,
  },
  petContainer: {
    alignItems: 'center',
    marginVertical: SPACING.md,
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
  },
  messageBubble: {
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    maxWidth: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  userMessage: {
    backgroundColor: COLORS.secondary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  petMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 18,
  },
  userMessageText: {
    color: '#333333',
  },
  petMessageText: {
    color: '#333333',
  },
  cursor: {
    opacity: 0.7,
    color: COLORS.primary,
  }
}); 