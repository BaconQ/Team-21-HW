import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../components/theme';
import { PixelPet } from '../components/PixelPet';
import { PetType } from '../types';
import { OnboardingBitmap } from '../components/OnboardingBitmap';

// Onboarding steps
const ONBOARDING_STEPS = [
  {
    title: 'Meet Your DigiPal',
    description: 'Your DigiPal takes care of you and reminds you to keep up with your goals.',
    image: 'goals',
  },
  {
    title: 'Voice Chat',
    description: 'Talk to your DigiPal using speech-to-text and get helpful responses.',
    image: 'voice',
  },
  {
    title: 'Listen',
    description: 'Hear your DigiPal speak to you with a friendly voice.',
    image: 'listen',
  },
];

// Pagination dots
const Dots = ({ active, count }: { active: number; count: number }) => (
  <View style={styles.dotsContainer}>
    {Array.from({ length: count }).map((_, index) => (
      <View 
        key={index} 
        style={[
          styles.dot, 
          index === active && styles.activeDot
        ]} 
      />
    ))}
  </View>
);

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  
  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.petContainer}>
        <PixelPet 
          pet={{
            id: '1',
            name: 'DigiPal',
            type: PetType.CACTUS,
            color: '#5DAE60',
            stats: {
              hunger: 100,
              hydration: 100,
              activity: 100,
              mood: 100,
              health: 100,
            },
            lastInteraction: new Date()
          }}
          isTalking={currentStep === 1}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <OnboardingBitmap type={step.image} />
        
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>
      
      <View style={styles.bottomContainer}>
        <Dots active={currentStep} count={ONBOARDING_STEPS.length} />
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  skipContainer: {
    alignSelf: 'flex-end',
  },
  skipText: {
    color: COLORS.secondary,
    fontFamily: FONTS.retro,
    fontSize: 16,
    padding: SPACING.sm,
  },
  petContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: 24,
    color: COLORS.secondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  description: {
    fontFamily: FONTS.retro,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    lineHeight: 24,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.secondary,
    width: 12,
    height: 12,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: adjustColorBrightness(COLORS.secondary, -50),
  },
  nextButtonText: {
    fontFamily: FONTS.title,
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
}); 