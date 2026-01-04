
export type Suit = 'h' | 'd' | 'c' | 's';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Position = 'SB' | 'BB' | 'UTG' | 'UTG1' | 'UTG2' | 'LJ' | 'HJ' | 'CO' | 'BTN';

export type ActionType = 'FOLD' | 'CALL' | 'RAISE' | 'ALLIN';

export enum DrillMode {
  GENERAL = 'General Training'
}

export type PreflopAction = 
  | 'Any' 
  | 'RFI' 
  | 'vs Open' 
  | 'vs 3bet' 
  | 'vs 4bet' 
  | 'vs Raise-Call' 
  | 'vs Squeeze' 
  | 'vs Limp' 
  | 'vs Iso' 
  | 'From start'
  | 'Push/Fold'
  | 'Blind Defense';

export interface Scenario {
  id: string;
  drillMode: string;
  heroPosition: Position;
  heroHand: [Card, Card];
  heroStack: number; // in BB
  villainStacks: Partial<Record<Position, number>>;
  previousActions: { position: Position; action: ActionType; amount?: number }[];
  correctAction: ActionType;
  potSize: number;
  explanation: string;
  rangeData?: {
    category: string;
    hands: string[]; 
    matrix?: number[][]; // Matriz 13x13 (0 a 1) indicando frequência de cada mão
  };
}

export interface Stats {
  hands: number;
  moves: number;
  score: number;
  best: number;
  correct: number;
  inaccuracy: number;
  wrong: number;
  blunder: number;
  totalEvLoss: number;
}

export interface TrainingConfig {
  solution: 'Cash' | 'MTT' | 'Spin & Go' | 'Hu SnG';
  format: 'Heads-up' | 'ChipEV' | 'ICM' | 'Events';
  players: number;
  spots: 'Postflop included' | 'Preflop only';
  preflopAction: PreflopAction;
  variant: 'Any' | 'With limps' | 'No limps';
  stackMin: number;
  stackMax: number;
  randomizeVillainStacks: boolean;
}