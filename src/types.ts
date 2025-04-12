export enum PetType {
  CAT = 'cat',
  DOG = 'dog',
  BUNNY = 'bunny'
}

export interface PetData {
  name: string;
  type: PetType;
  stats: {
    hunger: number;
    hydration: number;
    mood: number;
    activity: number;
  };
  appearance: {
    hatColor?: string;
  };
} 