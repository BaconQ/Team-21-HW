export enum PetType {
  CAT = 'CAT',
  DOG = 'DOG',
  BUNNY = 'BUNNY'
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