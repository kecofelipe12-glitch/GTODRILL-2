
import { Scenario, Position, Card, ActionType, Rank, Suit, TrainingConfig, PreflopAction } from '../types';
import { RANKS, SUITS, POSITIONS_9MAX } from '../constants';

const RANK_ORDER: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getRankValue = (r: Rank): number => {
  const values: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
  return values[r];
};

/**
 * RFI - OPEN RAISE GTO SENSÍVEL AO STACK
 */
const evaluateRFI = (r1: Rank, r2: Rank, suited: boolean, pos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  // Em stacks curtos (<12bb), RFI muitas vezes é Shove direto em Late Position
  if (stack < 12 && ['BTN', 'SB', 'CO'].includes(pos)) {
    if (pair && high >= 2) return 'ALLIN';
    if (high === 14 || (high === 13 && low >= 8)) return 'ALLIN';
    if (suited && high >= 10 && low >= 6) return 'ALLIN';
  }

  if (['UTG', 'UTG1', 'UTG2'].includes(pos)) {
    if (pair) return high >= 7 ? 'RAISE' : 'FOLD';
    if (suited) return (high === 14 && low >= 2) || (high === 13 && low >= 10) ? 'RAISE' : 'FOLD';
    return (high === 14 && low >= 12) ? 'RAISE' : 'FOLD';
  }

  if (['LJ', 'HJ'].includes(pos)) {
    if (pair) return high >= 5 ? 'RAISE' : 'FOLD';
    if (suited) return (high === 14) || (high === 13 && low >= 8) || (high === 12 && low >= 9) ? 'RAISE' : 'FOLD';
    return (high === 14 && low >= 11) ? 'RAISE' : 'FOLD';
  }

  if (pos === 'CO') {
    if (pair) return 'RAISE';
    if (suited) return (high === 14) || (high >= 12 && low >= 5) || (high === 11 && low >= 7) ? 'RAISE' : 'FOLD';
    return (high === 14 && low >= 10) || (high === 13 && low >= 11) ? 'RAISE' : 'FOLD';
  }

  if (pos === 'BTN') {
    if (pair) return 'RAISE';
    if (suited) return (high >= 10 || low >= 2) ? 'RAISE' : 'FOLD';
    return (high >= 13 || (high === 12 && low >= 7) || (high === 11 && low >= 8)) ? 'RAISE' : 'FOLD';
  }

  if (pos === 'SB') return (pair || suited || high >= 11) ? 'RAISE' : 'FOLD';
  return 'FOLD';
};

/**
 * DEFESA VS OPEN RAISE (O CORAÇÃO DO ERRO ANTERIOR)
 */
const evaluateVsOpen = (r1: Rank, r2: Rank, suited: boolean, heroPos: Position, raiserPos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  // LÓGICA SHORT STACK (< 15bb): Jam ou Fold (Exceção BB)
  if (stack < 15 && heroPos !== 'BB') {
    // No BTN com 11bb, Q6s é FOLD ou ALLIN (Jam apenas se o abridor for muito late)
    if (pair && high >= 7) return 'ALLIN';
    if (high === 14) return 'ALLIN';
    if (high === 13 && low >= 10 && suited) return 'ALLIN';
    if (high === 13 && low >= 12) return 'ALLIN';
    
    // Q6s do BTN vs CO (11bb) é FOLD no GTO Conservador de MTT
    return 'FOLD';
  }

  // LÓGICA DEEP STACK DEFENSE
  if (heroPos === 'BB') {
    if (pair && high >= 11) return 'RAISE';
    if (high === 14 && low >= 12) return 'RAISE';
    // Defesa ampla no BB via Call
    if (pair || suited || high >= 10 || (high === 9 && low >= 7)) return 'CALL';
    return 'FOLD';
  }

  if (pair && high >= 10) return 'RAISE';
  if (high === 14 && low >= 13) return 'RAISE';
  if (pair && high >= 6) return 'CALL';
  if (suited && high === 14 && low >= 10) return 'CALL';
  
  return 'FOLD';
};

/**
 * DEFESA DE BLIND VS STEAL
 */
const evaluateBlindDefense = (r1: Rank, r2: Rank, suited: boolean, pos: Position, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (stack < 15) {
    if (pair && high >= 5) return 'ALLIN';
    if (high === 14 || (high === 13 && low >= 9)) return 'ALLIN';
    if (suited && (high >= 12 || (high === 11 && low >= 7))) return 'ALLIN';
    if (pos === 'BB') return 'CALL'; // BB defende quase tudo curto via call por preço
    return 'FOLD';
  }

  if (pos === 'BB') return (high >= 11 || pair || suited) ? 'CALL' : 'FOLD';
  return (high >= 13 || (high === 12 && suited)) ? 'RAISE' : 'FOLD';
};

const evaluateVs3Bet = (r1: Rank, r2: Rank, suited: boolean, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (stack < 25) {
    if (pair && high >= 9) return 'ALLIN';
    if (high === 14 && low >= 12) return 'ALLIN';
    if (suited && high === 14 && low >= 10) return 'ALLIN';
    return 'FOLD';
  }

  if (pair && high >= 12) return 'RAISE';
  if (pair && high >= 7) return 'CALL';
  if (high === 14 && low >= 13) return 'CALL';
  if (suited && high === 14 && low >= 11) return 'CALL';
  return 'FOLD';
};

const evaluateVs4Bet = (r1: Rank, r2: Rank, suited: boolean, stack: number): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (pair && high >= 13) return 'ALLIN';
  if (high === 14 && low === 13) return 'ALLIN';
  if (stack > 50 && pair && high === 12) return 'CALL';
  return 'FOLD';
};

const evaluatePushFold = (r1: Rank, r2: Rank, suited: boolean, pos: Position): ActionType => {
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const high = Math.max(v1, v2);
  const low = Math.min(v1, v2);
  const pair = v1 === v2;

  if (pair) return 'ALLIN';
  if (high === 14) return 'ALLIN';
  if (high === 13 && (low >= 5 || suited)) return 'ALLIN';
  if (suited && high >= 10) return 'ALLIN';
  if (high === 12 && low >= 9) return 'ALLIN';
  return 'FOLD';
};

// HELPER: Garante que o Hero tenha uma mão válida para o spot considerando stack
const findHandForAction = (evaluator: Function, pos: Position, targetAction: ActionType, stack: number, extraParam?: any): [Card, Card] => {
  let attempts = 0;
  while (attempts < 3000) {
    const r1 = getRandomItem(RANKS);
    const s1 = getRandomItem(SUITS);
    const r2 = getRandomItem(RANKS);
    const s2 = getRandomItem(SUITS);
    if (r1 === r2 && s1 === s2) continue;
    
    const h: [Card, Card] = [{rank: r1, suit: s1}, {rank: r2, suit: s2}];
    const suited = s1 === s2;
    
    if (evaluator(r1, r2, suited, pos, extraParam || stack, extraParam ? stack : undefined) === targetAction) return h;
    attempts++;
  }
  return [{rank: 'A', suit: 's'}, {rank: 'K', suit: 'd'}];
};

export const generateScenario = (config: TrainingConfig): Scenario => {
  const activePositions = getActivePositions(config.players);
  let mode = config.preflopAction;
  
  if (mode === 'Any') {
    mode = getRandomItem(['RFI', 'vs Open', 'vs 3bet', 'vs 4bet', 'vs Limp', 'Blind Defense', 'Push/Fold'] as PreflopAction[]);
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
    previousActions.push({ position: heroPos, action: 'RAISE', amount: 2.5 });
    const heroIdx = activePositions.indexOf(heroPos);
    const threeBettor = getRandomItem(activePositions.slice(heroIdx + 1).length > 0 ? activePositions.slice(heroIdx + 1) : ['BB']);
    previousActions.push({ position: threeBettor, action: 'RAISE', amount: 9.0 });
    correctAction = evaluateVs3Bet(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroStack);
    potSize = 13.0;
  }
  else if (mode === 'vs 4bet') {
    const opener = getRandomItem(activePositions.slice(0, -2));
    heroPos = getRandomItem(activePositions.slice(activePositions.indexOf(opener) + 1));
    // Hero deu 3-bet (Raise)
    hand = findHandForAction(evaluateVsOpen, heroPos, 'RAISE', heroStack, opener);
    previousActions.push({ position: opener, action: 'RAISE', amount: 2.2 });
    previousActions.push({ position: heroPos, action: 'RAISE', amount: 7.0 });
    previousActions.push({ position: opener, action: 'RAISE', amount: 22.0 });
    correctAction = evaluateVs4Bet(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroStack);
    potSize = 30.5;
  }
  else if (mode === 'Push/Fold') {
    heroPos = getRandomItem(activePositions.filter(p => p !== 'BB'));
    heroStack = Math.floor(Math.random() * 7) + 8;
    hand = generateRandomHand();
    correctAction = evaluatePushFold(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos);
    potSize = 1.5;
  }
  else if (mode === 'vs Open') {
    const raiserPos = getRandomItem(activePositions.filter(p => !['SB', 'BB'].includes(p)));
    const heroIdx = activePositions.indexOf(raiserPos);
    heroPos = getRandomItem(activePositions.slice(heroIdx + 1).length > 0 ? activePositions.slice(heroIdx + 1) : ['BB']);
    
    // Filtro crítico: Só sorteia mãos que o Hero jogaria vs Open naquele stack
    if (Math.random() > 0.4) {
        correctAction = getRandomItem(['CALL', 'RAISE', 'ALLIN'] as ActionType[]);
        hand = findHandForAction(evaluateVsOpen, heroPos, correctAction, heroStack, raiserPos);
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
    correctAction = evaluateBlindDefense(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, heroStack);
    potSize = 4.0;
  }
  else { // RFI
    heroPos = getRandomItem(activePositions.filter(p => !['SB', 'BB'].includes(p)));
    if (Math.random() > 0.3) {
        hand = findHandForAction(evaluateRFI, heroPos, 'RAISE', heroStack);
    } else {
        hand = generateRandomHand();
    }
    correctAction = evaluateRFI(hand[0].rank, hand[1].rank, hand[0].suit === hand[1].suit, heroPos, heroStack);
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
    else if (mode === 'vs 4bet') act = evaluateVs4Bet(realR1, realR2, suit, stack);
    else if (mode === 'vs 3bet') act = evaluateVs3Bet(realR1, realR2, suit, stack);
    else if (mode === 'Blind Defense') act = evaluateBlindDefense(realR1, realR2, suit, pos, stack);
    else if (mode === 'vs Open') act = evaluateVsOpen(realR1, realR2, suit, pos, 'UTG', stack);
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
  const isShort = stack < 15;
  
  const explanations: Record<string, string> = {
    'RFI': `RFI: Em ${pos} com ${stack}bb, ${handStr} é abertura padrão.`,
    'vs Open': `Vs Open: Com ${stack}bb, a estratégia de call é ${isShort ? 'inexistente' : 'restrita'}. ${handStr} joga como ${action}.`,
    'vs 3bet': `Vs 3-Bet: Defesa com ${stack}bb exige cautela. ${handStr} é ${action}.`,
    'vs 4bet': `Vs 4-Bet: Stack de ${stack}bb. ${handStr} é ${action} por valor/proteção.`,
    'vs Limp': `Vs Limp: Isolando com ${handStr} via ${action}.`,
    'Blind Defense': `Blind Defense: Defendendo o blind com ${handStr} em ${stack}bb.`,
    'Push/Fold': `Push/Fold: Com stack curto (${stack}bb), ${handStr} é um ${action} matemático.`,
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
