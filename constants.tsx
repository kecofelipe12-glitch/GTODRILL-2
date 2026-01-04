
import { Position, Rank, Suit } from './types';

export const POSITIONS_9MAX: Position[] = ['SB', 'BB', 'UTG', 'UTG1', 'UTG2', 'LJ', 'HJ', 'CO', 'BTN'];

export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const SUITS: Suit[] = ['h', 'd', 'c', 's'];

// Adjusted coordinates to move seats closer to the edges
export const POSITION_COORDINATES: Record<number, { top: string; left: string }> = {
  0: { top: '92%', left: '50%' },   // Hero (Bottom Center)
  1: { top: '78%', left: '10%' },   // Bottom Left
  2: { top: '45%', left: '5%' },    // Middle Left
  3: { top: '12%', left: '10%' },   // Top Left
  4: { top: '4%',  left: '50%' },   // Top Center
  5: { top: '12%', left: '90%' },   // Top Right
  6: { top: '45%', left: '95%' },   // Middle Right
  7: { top: '78%', left: '90%' },   // Bottom Right
  8: { top: '92%', left: '75%' },   // Adjusted Bottom Right for 9-max feel
};

export const ACTION_COLORS = {
  FOLD: 'bg-blue-500 hover:bg-blue-600',
  CALL: 'bg-emerald-500 hover:bg-emerald-600',
  RAISE: 'bg-red-500 hover:bg-red-600',
  ALLIN: 'bg-red-900 hover:bg-red-950',
};
