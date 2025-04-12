import { useState, useEffect } from 'react';
import { PetType } from '../types';
import { Pet, PetStats, StatsLog } from '../types/index';

// Initial pet configuration
const DEFAULT_PET: Pet = {
  id: '1',
  name: 'DigiPal',
  type: PetType.CACTUS,
  color: '#5DAE60', // Green color for cactus
  stats: {
    hunger: 100,
    hydration: 100,
    activity: 100,
    mood: 100,
    health: 100,
  },
  lastInteraction: new Date(),
};

// Decay rates for each stat (points per hour)
const DECAY_RATES = {
  hunger: 5,
  hydration: 8,
  activity: 3,
  mood: 4,
  health: 1,
};

export function usePet() {
  const [pet, setPet] = useState<Pet>(DEFAULT_PET);
  const [logs, setLogs] = useState<StatsLog[]>([]);

  // Stat decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPet((currentPet) => {
        // Calculate time since last interaction
        const now = new Date();
        const lastInteraction = new Date(currentPet.lastInteraction);
        const hoursPassed = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);
        
        // Only decay if time has passed
        if (hoursPassed < 0.01) return currentPet;
        
        // Calculate new stats with decay
        const newStats = { ...currentPet.stats };
        
        (Object.keys(newStats) as Array<keyof PetStats>).forEach((stat) => {
          const decayAmount = DECAY_RATES[stat] * hoursPassed;
          newStats[stat] = Math.max(0, newStats[stat] - decayAmount);
        });
        
        // Calculate health based on other stats
        const avgStats = (newStats.hunger + newStats.hydration + newStats.activity + newStats.mood) / 4;
        newStats.health = Math.max(0, Math.min(100, avgStats * 0.8 + newStats.health * 0.2));
        
        return {
          ...currentPet,
          stats: newStats,
        };
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Apply stat changes from backend
  const applyStatChanges = (changes: Array<{attribute: string, value: number}>) => {
    if (!changes || changes.length === 0) return;
    
    setPet((currentPet) => {
      const newStats = { ...currentPet.stats };
      
      changes.forEach(change => {
        switch (change.attribute) {
          case 'food':
          case 'hunger':
            newStats.hunger = Math.max(0, Math.min(100, newStats.hunger + change.value));
            addLog('FOOD', change.value);
            break;
          case 'water':
          case 'hydration':
            newStats.hydration = Math.max(0, Math.min(100, newStats.hydration + change.value));
            addLog('WATER', change.value);
            break;
          case 'activity':
          case 'energy':
            newStats.activity = Math.max(0, Math.min(100, newStats.activity + change.value));
            addLog('ACTIVITY', change.value);
            break;
          case 'happiness':
          case 'mood':
            newStats.mood = Math.max(0, Math.min(100, newStats.mood + change.value));
            addLog('MOOD', change.value);
            break;
        }
      });
      
      // Update health based on overall well-being
      const avgStats = (newStats.hunger + newStats.hydration + newStats.activity + newStats.mood) / 4;
      newStats.health = Math.max(0, Math.min(100, avgStats * 0.6 + newStats.health * 0.4));
      
      return {
        ...currentPet,
        stats: newStats,
        lastInteraction: new Date(),
      };
    });
  };

  // These functions are kept for backward compatibility but won't actively change stats
  // The backend will control stat changes
  const feedPet = () => {
    // No-op - stats are controlled by backend now
  };

  const hydratePet = () => {
    // No-op - stats are controlled by backend now
  };

  const exercisePet = () => {
    // No-op - stats are controlled by backend now
  };

  const playWithPet = () => {
    // No-op - stats are controlled by backend now
  };
  
  // Update a specific stat (for internal use)
  const updateStat = (stat: keyof PetStats, amount: number) => {
    setPet((currentPet) => {
      const newStats = { ...currentPet.stats };
      newStats[stat] = Math.max(0, Math.min(100, currentPet.stats[stat] + amount));
      
      // Update health based on overall well-being
      const avgStats = (newStats.hunger + newStats.hydration + newStats.activity + newStats.mood) / 4;
      newStats.health = Math.max(0, Math.min(100, avgStats * 0.6 + newStats.health * 0.4));
      
      return {
        ...currentPet,
        stats: newStats,
        lastInteraction: new Date(),
      };
    });
  };
  
  // Add a log entry
  const addLog = (type: StatsLog['type'], value: number, notes?: string) => {
    const newLog: StatsLog = {
      timestamp: new Date(),
      type,
      value,
      notes,
    };
    
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };
  
  // Customize the pet
  const customizePet = (updates: Partial<Pet>) => {
    setPet((currentPet) => ({
      ...currentPet,
      ...updates,
      lastInteraction: new Date(),
    }));
  };
  
  // Get pet mood based on stats
  const getPetMood = (): 'HAPPY' | 'NEUTRAL' | 'SAD' => {
    const avgStats = (pet.stats.hunger + pet.stats.hydration + pet.stats.mood + pet.stats.activity) / 4;
    
    if (avgStats >= 70) return 'HAPPY';
    if (avgStats >= 40) return 'NEUTRAL';
    return 'SAD';
  };

  return {
    pet,
    logs,
    feedPet,
    hydratePet,
    exercisePet,
    playWithPet,
    updateStat,
    customizePet,
    getPetMood,
    applyStatChanges,
  };
} 