
import { Scenario, Position, Card, ActionType, Rank, Suit, TrainingConfig, PreflopAction } from '../types.ts';
import { RANKS, SUITS, POSITIONS_9MAX } from '../constants.tsx';

const RANK_ORDER: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRankValue = (r: Rank): number => {
  const values: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  return values[r];
};

/**
 * RFI - OPEN RAISE GTO POR STACK
 */
const evaluateRFI = (r1: Rank, r2: Rank, suited: boolean, pos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (stack <= 12) {
    if (pair && high >= 2) return 'ALLIN';
    if (high === 14) return 'ALLIN';
    if (suited && high === 13 && low >= 9) return 'ALLIN';
    if (suited && high === 12 && low >= 10) return 'ALLIN';
    if (['BTN', 'SB', 'CO'].includes(pos)) {
      if (suited && high >= 10) return 'ALLIN';
      if (high >= 12 && low >= 7) return 'ALLIN';
      if (high === 11 && low >= 8) return 'ALLIN';
    }
    if (['UTG', 'UTG1', 'UTG2'].includes(pos)) {
      return (pair && high >= 5) || (high === 14 && low >= 10) || (suited && high === 14) ? 'ALLIN' : 'FOLD';
    }
  }

  if (['UTG', 'UTG1', 'UTG2'].includes(pos)) {
    if (pair) return high >= 7 ? 'RAISE' : 'FOLD';
    if (suited) return (high === 14 && low >= 2) || (high === 13 && low >= 10) || (high === 12 && low >= 11) ? 'RAISE' : 'FOLD';
    return (high === 14 && low >= 12) || (high === 13 && low >= 12) ? 'RAISE' : 'FOLD';
  }

  if (['LJ', 'HJ'].includes(pos)) {
    if (pair) return high >= 5 ? 'RAISE' : 'FOLD';
    if (suited) return (high === 14) || (high === 13 && low >= 8) || (high === 12 && low >= 9) || (high === 11 && low >= 10) ? 'RAISE' : 'FOLD';
    return (high === 14 && low >= 11) || (high === 13 && low >= 11) ? 'RAISE' : 'FOLD';
  }

  if (pos === 'CO') {
    if (pair) return high >= 2 ? 'RAISE' : 'FOLD';
    if (suited) return (high === 14) || (high >= 12 && low >= 5) || (high >= 10 && low >= 7) || (high === 9 && low >= 8) ? 'RAISE' : 'FOLD';
    return (high === 14 && low >= 10) || (high === 13 && low >= 10) || (high === 12 && low >= 10) ? 'RAISE' : 'FOLD';
  }

  if (pos === 'BTN') {
    if (pair) return 'RAISE';
    if (suited) return (high >= 9 || low >= 2 || (high === 8 && low >= 4) || (high === 7 && low >= 5)) ? 'RAISE' : 'FOLD';
    return (high >= 12 || (high === 11 && low >= 7) || (high === 10 && low >= 7) || (high === 9 && low >= 8)) ? 'RAISE' : 'FOLD';
  }

  if (pos === 'SB') return (pair || suited || high >= 11 || (high === 10 && low >= 7) || (high === 9 && low >= 7)) ? 'RAISE' : 'FOLD';
  return 'FOLD';
};

/**
 * DEFESA VS OPEN RAISE
 */
const evaluateVsOpen = (r1: Rank, r2: Rank, suited: boolean, heroPos: Position, raiserPos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (stack <= 18 && heroPos !== 'BB') {
    if (pair && high >= 8) return 'ALLIN';
    if (high === 14 && low >= 12) return 'ALLIN';
    if (suited && high === 14 && low >= 10) return 'ALLIN';
    
    if (['CO', 'BTN', 'SB'].includes(raiserPos)) {
      if (pair && high >= 6) return 'ALLIN';
      if (high === 14 && low >= 9) return 'ALLIN';
      if (suited && (high >= 13 && low >= 10)) return 'ALLIN';
      if (suited && high === 14) return 'ALLIN';
    }
    return 'FOLD';
  }

  if (heroPos === 'BB') {
    if (pair && high >= 11) return 'RAISE';
    if (high === 14 && low >= 13) return 'RAISE';
    const isLateOpen = ['CO', 'BTN', 'SB'].includes(raiserPos);
    if (pair || suited || high >= 10) return 'CALL';
    if (isLateOpen && (high >= 7 || (high === 6 && low >= 4 && suited))) return 'CALL';
    return 'FOLD';
  }

  if (pair && high >= 10) return 'RAISE';
  if (high === 14 && low >= 13) return 'RAISE';
  if (pair && high >= 6) return 'CALL';
  if (suited && high >= 12 && low >= 10) return 'CALL';
  if (suited && high === 14 && low >= 8) return 'CALL';
  if (high === 14 && low >= 11) return 'CALL';

  return 'FOLD';
};

const evaluateVs3Bet = (r1: Rank, r2: Rank, suited: boolean, heroPos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (stack <= 22) {
    if (pair && high >= 9) return 'ALLIN';
    if (high === 14 && low >= 13) return 'ALLIN';
    if (suited && high === 14 && low >= 11) return 'ALLIN';
    
    if (['CO', 'BTN'].includes(heroPos)) {
      if (pair && high >= 7) return 'ALLIN';
      if (high === 14 && low >= 12) return 'ALLIN';
      if (suited && high === 14 && low >= 9) return 'ALLIN';
    }
    
    return 'FOLD';
  }

  if (pair && high >= 11) return 'RAISE'; 
  if (high === 14 && low === 14) return 'RAISE'; 
  if (pair && high >= 7) return 'CALL';
  if (high === 14 && low >= 13) return 'CALL';
  if (suited && high === 14 && low >= 10) return 'CALL';
  if (suited && high === 13 && low >= 12) return 'CALL';

  return 'FOLD';
};

const evaluateVs4Bet = (r1: Rank, r2: Rank, suited: boolean, heroPos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (stack <= 30) {
    return (pair && high >= 11) || (high === 14 && getRankValue(r1) + getRankValue(r2) >= 27) ? 'ALLIN' : 'FOLD';
  }

  if (pair && high >= 13) return 'ALLIN';
  if (high === 14 && low === 13) return 'ALLIN'; 
  if (pair && high === 12) return 'CALL'; 
  return 'FOLD';
};

const evaluatePushFold = (r1: Rank, r2: Rank, suited: boolean, pos: Position): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = r1 === r2;

  if (pair) return 'ALLIN';
  if (high === 14) return 'ALLIN';
  if (high === 13 && (suited || low >= 7)) return 'ALLIN';
  if (high === 12 && (suited && low >= 5 || low >= 9)) return 'ALLIN';
  if (suited && high >= 10 && low >= 6) return 'ALLIN';
  
  return 'FOLD';
};

const findHandForAction = (evaluator: Function, pos: Position, targetAction: ActionType, stack: number, extraParam?: any): [Card, Card] => {
  let attempts = 0;
  const isVsOpen = evaluator.name === 'evaluateVsOpen';
  const isVs3Bet = evaluator.name === 'evaluateVs3Bet';
  
  while (attempts < 8000) {
    const r1 = getRandomItem(RANKS);
    const s1 = getRandomItem(SUITS);
    const r2 = getRandomItem(RANKS);
    const s2 = getRandomItem(SUITS);
    if (r1 === r2 && s1 === s2) continue;
    
    const h: [Card, Card] = [{rank: r1, suit: s1}, {rank: r2, suit: s2}];
    const suited = s1 === s2;
    
    let result: ActionType;
    if (isVsOpen) {
      result = evaluator(r1, r2, suited, pos, extraParam, stack);
    } else if (isVs3Bet) {
      result = evaluator(r1, r2, suited, pos, stack);
    } else {
      result = evaluator(r1, r2, suited, pos, stack);
    }

    if (result === targetAction) return h;
    attempts++;
  }
  if (targetAction === 'RAISE' || targetAction === 'ALLIN') return [{rank: 'A', suit: 's'}, {rank: 'A', suit: 'd'}];
  return [{rank: '7', suit: 's'}, {rank: '2', suit: 'h'}];
};

export const generateScenario = (config: TrainingConfig): Scenario => {
  const activePositions = getActivePositions(config.players);
  let mode = config.preflopAction;
  
  if (mode === 'Any') {
    mode = getRandomItem(['RFI', 'vs Open', 'vs 3bet', 'vs 4bet', 'Blind Defense', 'Push/Fold'] as PreflopAction[]);
  }

  let heroPos: Position = 'BTN';
  let hand: [Card, Card] = [{rank: '2', suit: 's'}, {rank: '7', suit: 'h'}];
  let correctAction: ActionType = 'FOLD';
  let heroStack = Math.floor(Math.random() * (config.stackMax - config.stackMin)) + config.stackMin;
  const previousActions: any[] = [];
  let potSize = 1.5;

  if (mode === 'vs 3bet') {
    heroPos = getRandomItem(activePositions.filter(p => !['SB', 'BB'].includes(p)));
    hand = findHandForAction(evaluateRFI, heroPos, 'RAISE', heroStack);
    previousActions.push({ position: heroPos, action: 'RAISE', amount: 2.2 });
    
    const heroIdx = activePositions.indexOf(heroPos);
    const threeBettor = getRandomItem(activePositions.slice(heroIdx + 1).length > 0 ? activePositions.slice(heroIdx + 1) : ['BB']);
    previousActions.push({ position: threeBettor, action: 'RAISE', amount: 7.5 });
    
    correctAction = evaluateVs3Bet(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, heroStack);
    potSize = 11.2;
  }
  else if (mode === 'vs 4bet') {
    const opener = getRandomItem(activePositions.slice(0, -2));
    heroPos = getRandomItem(activePositions.slice(activePositions.indexOf(opener) + 1));
    hand = findHandForAction(evaluateVsOpen, heroPos, 'RAISE', heroStack, opener);
    previousActions.push({ position: opener, action: 'RAISE', amount: 2.2 });
    previousActions.push({ position: heroPos, action: 'RAISE', amount: 7.0 });
    previousActions.push({ position: opener, action: 'RAISE', amount: 22.0 });
    correctAction = evaluateVs4Bet(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, heroStack);
    potSize = 31.2;
  }
  else if (mode === 'Push/Fold') {
    heroPos = getRandomItem(activePositions.filter(p => p !== 'BB'));
    heroStack = Math.floor(Math.random() * 6) + 7;
    hand = generateRandomHand();
    correctAction = evaluatePushFold(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos);
    potSize = 1.5;
  }
  else if (mode === 'vs Open') {
    const raiserPos = getRandomItem(activePositions.filter(p => !['SB', 'BB'].includes(p)));
    const heroIdx = activePositions.indexOf(raiserPos);
    heroPos = getRandomItem(activePositions.slice(heroIdx + 1).length > 0 ? activePositions.slice(heroIdx + 1) : ['BB']);
    
    if (Math.random() > 0.5) {
        const target = getRandomItem(['CALL', 'RAISE', 'ALLIN', 'FOLD'] as ActionType[]);
        hand = findHandForAction(evaluateVsOpen, heroPos, target, heroStack, raiserPos);
        correctAction = target;
    } else {
        hand = generateRandomHand();
        correctAction = evaluateVsOpen(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, raiserPos, heroStack);
    }
    
    previousActions.push({ position: raiserPos, action: 'RAISE', amount: 2.2 });
    potSize = 3.7;
  }
  else if (mode === 'Blind Defense') {
    heroPos = getRandomItem(['SB', 'BB'] as Position[]);
    const stealer = getRandomItem(['CO', 'BTN'] as Position[]);
    previousActions.push({ position: stealer, action: 'RAISE', amount: 2.5 });
    hand = generateRandomHand();
    correctAction = evaluateVsOpen(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, stealer, heroStack);
    potSize = 4.0;
  }
  else { 
    heroPos = getRandomItem(activePositions.filter(p => !['SB', 'BB'].includes(p)));
    if (Math.random() > 0.4) {
        hand = findHandForAction(evaluateRFI, heroPos, 'RAISE', heroStack);
        correctAction = 'RAISE';
    } else {
        hand = generateRandomHand();
        correctAction = evaluateRFI(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, heroStack);
    }
    potSize = 1.5;
  }

  const villainStacks: Partial<Record<Position, number>> = {};
  activePositions.forEach(pos => {
    if (pos === heroPos) villainStacks[pos] = heroStack;
    else if (config.randomizeVillainStacks) villainStacks[pos] = Math.floor(Math.random() * (config.stackMax - config.stackMin + 1)) + config.stackMin;
    else villainStacks[pos] = heroStack;
  });

  return {
    id: Math.random().toString(36).substr(2, 9),
    drillMode: mode,
    heroPosition: heroPos,
    heroHand: hand,
    heroStack,
    villainStacks,
    previousActions,
    correctAction,
    potSize,
    explanation: generateTechnicalExplanation(hand, heroPos, mode, correctAction, heroStack),
    rangeData: {
      category: `${heroPos} - ${mode} (${heroStack}bb)`,
      hands: [],
      matrix: generateMatrix(mode, heroPos, heroStack)
    }
  };
};

const generateMatrix = (mode: string, pos: Position, stack: number): number[][] => {
  return RANK_ORDER.map(r1 => RANK_ORDER.map(r2 => {
    const isSuited = RANK_ORDER.indexOf(r1) < RANK_ORDER.indexOf(r2);
    const suit = isSuited;
    const realR1 = isSuited ? r1 : r2;
    const realR2 = isSuited ? r2 : r1;
    let act: ActionType = 'FOLD';
    if (mode === 'Push/Fold') act = evaluatePushFold(realR1, realR2, suit, pos);
    else if (mode === 'vs 4bet') act = evaluateVs4Bet(realR1, realR2, suit, pos, stack);
    else if (mode === 'vs 3bet') act = evaluateVs3Bet(realR1, realR2, suit, pos, stack);
    else if (mode === 'Blind Defense' || mode === 'vs Open') act = evaluateVsOpen(realR1, realR2, suit, pos, 'CO', stack);
    else act = evaluateRFI(realR1, realR2, suit, pos, stack);
    return (act === 'RAISE' || act === 'ALLIN') ? 2 : (act === 'CALL' ? 1 : 0);
  }));
};

const generateRandomHand = (): [Card, Card] => {
  const r1 = getRandomItem(RANKS);
  const s1 = getRandomItem(SUITS);
  let r2 = getRandomItem(RANKS);
  let s2 = getRandomItem(SUITS);
  while (r1 === r2 && s1 === s2) { r2 = getRandomItem(RANKS); s2 = getRandomItem(SUITS); }
  return [{ rank: r1, suit: s1 }, { rank: r2, suit: s2 }];
};

export const getOpponentActionMatrix = (pos: Position, action: ActionType, scenarioMode: string, heroPos: Position): number[][] => {
  return RANK_ORDER.map(r1 => RANK_ORDER.map(r2 => {
    const isSuited = RANK_ORDER.indexOf(r1) < RANK_ORDER.indexOf(r2);
    const suit = isSuited;
    const realR1 = isSuited ? r1 : r2;
    const realR2 = isSuited ? r2 : r1;
    let act: ActionType = 'FOLD';
    if (action === 'RAISE') act = evaluateRFI(realR1, realR2, suit, pos, 100);
    return (act === 'RAISE' || act === 'ALLIN') ? 2 : (act === 'CALL' ? 1 : 0);
  }));
};

const generateTechnicalExplanation = (hand: [Card, Card], pos: Position, mode: string, action: ActionType, stack: number): string => {
  const suited = hand[0].suit === hand[1].suit;
  const handStr = `${hand[0].rank}${hand[1].rank}${suited ? 's' : (hand[0].rank === hand[1].rank ? '' : 'o')}`;
  
  const explanations: Record<string, string> = {
    'RFI': `RFI: Em ${pos} com ${stack}bb, abrir com ${handStr} via ${action} é o padrão GTO.`,
    'vs Open': `Vs Open: Com apenas ${stack}bb em ${pos}, sua estratégia é binária (Shove ou Fold). ${handStr} joga como ${action}.`,
    'vs 3bet': `Vs 3-Bet: Enfrentando re-raise em ${pos} com ${stack}bb. Mãos fracas como T4 são folds triviais; mãos fortes são 4-bet jams. ${handStr} é ${action}.`,
    'vs 4bet': `Vs 4-Bet: Com stack de ${stack}bb, o range de call/shove é extremamente tight. ${handStr} joga como ${action}.`,
    'Blind Defense': `Blind Defense: Defendendo o blind com ${handStr} (${stack}bb).`,
    'Push/Fold': `Push/Fold: Posição ${pos}, stack de ${stack}bb. ${handStr} é ${action} matemático.`,
  };
  return explanations[mode] || `Estratégia GTO para ${handStr} em ${pos} (${stack}bb).`;
};

export const getActivePositions = (numPlayers: number): Position[] => {
  const others: Position[] = ['UTG', 'UTG1', 'UTG2', 'LJ', 'HJ', 'CO', 'BTN'];
  const blinds: Position[] = ['SB', 'BB'];
  if (numPlayers <= 2) return blinds.slice(0, numPlayers);
  const activeOthers = others.slice(-(numPlayers - 2));
  return [...blinds, ...activeOthers];
};
