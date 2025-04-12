import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, VT323_400Regular } from '@expo-google-fonts/vt323';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { COLORS } from './src/components/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const ONBOARDING_COMPLETE_KEY = 'digipal_onboarding_complete';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    VT323_400Regular,
    PressStart2P_400Regular,
    Silkscreen_400Regular,
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const fullText = 'Loading DigiPal...';
  const charIndexRef = useRef(0);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // Animate cursor blinking
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Simulate text typing animation
  useEffect(() => {
    if (charIndexRef.current < fullText.length) {
      const typingTimer = setTimeout(() => {
        setLoadingText(fullText.substring(0, charIndexRef.current + 1));
        charIndexRef.current += 1;
      }, 100);
      return () => clearTimeout(typingTimer);
    }
  }, [loadingText]);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if onboarding has been completed
        const onboardingStatus = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        setOnboardingComplete(onboardingStatus === 'true');

        // Pre-load any other resources or data here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleOnboardingComplete = async () => {
    // Mark onboarding as complete
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
      setOnboardingComplete(true);
    } catch (e) {
      console.warn('Error saving onboarding status:', e);
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      // Hide the splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.loadingText}>
            {fontError ? 'Font loading error...' : loadingText}
          </Text>
          <Animated.Text 
            style={[
              styles.cursor, 
              { opacity: blinkAnim }
            ]}
          >
            █
          </Animated.Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        {onboardingComplete ? (
          <HomeScreen />
        ) : (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        )}
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderWidth: 8,
    borderColor: COLORS.secondary,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'PressStart2P_400Regular',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  cursor: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'PressStart2P_400Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  }
});
