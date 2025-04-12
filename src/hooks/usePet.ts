import { useState, useEffect } from 'react';
import { PetType } from '../types';
import { Pet, PetStats, StatsLog } from '../types/index';

// Initial pet configuration
const DEFAULT_PET: Pet = {
  id: '1',
  name: 'DigiPal',
  type: PetType.CAT,
  color: '#E1EEBC',
  stats: {
    hunger: 70,
    hydration: 80,
    activity: 60,
    mood: 85,
    health: 90,
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

  // Feed the pet (increase hunger stat)
  const feedPet = (amount: number = 15) => {
    updateStat('hunger', amount);
    addLog('FOOD', amount);
  };

  // Give water to pet (increase hydration stat)
  const hydratePet = (amount: number = 20) => {
    updateStat('hydration', amount);
    addLog('WATER', amount);
  };

  // Exercise with pet (increase activity stat)
  const exercisePet = (amount: number = 15) => {
    updateStat('activity', amount);
    addLog('ACTIVITY', amount);
  };

  // Play with pet (increase mood stat)
  const playWithPet = (amount: number = 10) => {
    updateStat('mood', amount);
    addLog('MOOD', amount);
  };
  
  // Update a specific stat
  const updateStat = (stat: keyof PetStats, amount: number) => {
    setPet((currentPet) => {
      const newStats = { ...currentPet.stats };
      newStats[stat] = Math.min(100, currentPet.stats[stat] + amount);
      
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
  };
} 