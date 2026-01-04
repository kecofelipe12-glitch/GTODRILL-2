
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Scenario, Stats, ActionType, TrainingConfig, Position, PreflopAction } from './types';
import { generateScenario, getOpponentActionMatrix } from './engine/gtoLogic';
import StatsPanel from './components/StatsPanel';
import PokerTable from './components/PokerTable';
import ActionPanel from './components/ActionPanel';
import FeedbackModal from './components/FeedbackModal';
import RangeViewerModal from './components/RangeViewerModal';
import { soundEngine } from './utils/soundEngine';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [stats, setStats] = useState<Stats>({ 
    hands: 0, 
    moves: 0, 
    score: 0,
    best: 0,
    correct: 0,
    inaccuracy: 0,
    wrong: 0,
    blunder: 0,
    totalEvLoss: 0
  });
  const [feedback, setFeedback] = useState<{ type: 'CORRECT' | 'WRONG'; action: ActionType } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastUserAction, setLastUserAction] = useState<ActionType | null>(null);
  
  const [viewingOpponent, setViewingOpponent] = useState<{
    pos: Position;
    action: ActionType;
    matrix: number[][];
    mode: string;
  } | null>(null);
  
  const timerRef = useRef<any>(null);
  
  const [config, setConfig] = useState<TrainingConfig>({
    solution: 'MTT',
    format: 'ChipEV',
    players: 9,
    spots: 'Preflop only',
    preflopAction: 'Any',
    variant: 'Any',
    stackMin: 10,
    stackMax: 100,
    randomizeVillainStacks: false
  });

  const loadNewHand = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsProcessing(false);
    setFeedback(null);
    setShowErrorModal(false);
    setScenario(generateScenario(config));
    soundEngine.playCardFlick();
  }, [config]);

  useEffect(() => {
    loadNewHand();
  }, [config.preflopAction, config.stackMin, config.stackMax, config.players, config.randomizeVillainStacks]);

  const handleAction = useCallback((action: ActionType) => {
    if (!scenario || isProcessing) return;
    
    setIsProcessing(true);
    setLastUserAction(action);
    const isCorrect = action === scenario.correctAction;
    
    soundEngine.playActionClick();

    if (isCorrect) {
      soundEngine.playCorrect();
      setFeedback({
        type: 'CORRECT',
        action: scenario.correctAction
      });
      
      timerRef.current = setTimeout(() => {
        loadNewHand();
      }, 1200);
    } else {
      soundEngine.playWrong();
      setShowErrorModal(true);
    }

    setStats(prev => {
      const moves = prev.moves + 1;
      const hands = isCorrect ? prev.hands + 1 : prev.hands;
      const newBest = isCorrect ? prev.best + 1 : prev.best;
      const newBlunder = !isCorrect ? prev.blunder + 1 : prev.blunder;
      const correctTotal = newBest + prev.correct;
      const score = moves > 0 ? Math.round((correctTotal / moves) * 100) : 0;

      return { 
        ...prev,
        hands: isCorrect ? hands : prev.hands,
        moves, 
        score,
        best: newBest,
        blunder: newBlunder
      };
    });
  }, [scenario, isProcessing, loadNewHand]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showErrorModal || viewingOpponent) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          if (showErrorModal) handleCloseErrorModal();
          if (viewingOpponent) setViewingOpponent(null);
        }
        return;
      }

      if (isProcessing) return;

      switch(e.key) {
        case '1': handleAction('FOLD'); break;
        case '2': handleAction('CALL'); break;
        case '3': handleAction('RAISE'); break;
        case '4': handleAction('ALLIN'); break;
        case 'Enter': 
        case ' ':
          if (feedback) loadNewHand();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, showErrorModal, viewingOpponent, isProcessing, feedback, loadNewHand]);

  const handleOpenOpponentRange = (pos: Position, actionData: { action: ActionType }) => {
    if (!scenario) return;
    const matrix = getOpponentActionMatrix(pos, actionData.action, scenario.drillMode as PreflopAction, scenario.heroPosition);
    setViewingOpponent({
      pos,
      action: actionData.action,
      matrix,
      mode: scenario.drillMode
    });
  };

  const handleCloseErrorModal = () => {
    setStats(prev => ({ ...prev, hands: prev.hands + 1 }));
    loadNewHand();
  };

  const handleResetStats = () => {
    setStats({ 
      hands: 0, 
      moves: 0, 
      score: 0,
      best: 0,
      correct: 0,
      inaccuracy: 0,
      wrong: 0,
      blunder: 0,
      totalEvLoss: 0
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden font-inter select-none">
      <StatsPanel 
        stats={stats} 
        config={config} 
        setConfig={setConfig} 
        onResetStats={handleResetStats}
        onNextHand={loadNewHand}
      />

      <main className="flex-1 flex flex-col relative bg-[#09090b]">
        <header className="py-4 px-10 flex justify-between items-center border-b border-zinc-900 bg-[#0c0c0e] z-20">
           <div className="flex items-center gap-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1.5">Ação</span>
                 <span className="text-sm font-black text-zinc-100 uppercase tracking-tight">{scenario?.drillMode || config.preflopAction}</span>
              </div>
              <div className="w-px h-8 bg-zinc-800/50"></div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1.5">Posição Hero</span>
                 <span className="text-sm font-black text-zinc-100 uppercase tracking-tight">{scenario?.heroPosition}</span>
              </div>
              <div className="w-px h-8 bg-zinc-800/50"></div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] leading-none mb-1.5">Stack</span>
                 <span className="text-sm font-black text-zinc-100 tracking-tight tabular-nums">
                   {scenario?.heroStack.toFixed(1)} <span className="text-[10px] text-zinc-500">BB</span>
                 </span>
              </div>
           </div>
           
           <div className="px-5 py-2.5 rounded-md bg-[#16161a] border border-zinc-800 flex items-center gap-3 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse"></span>
              <span className="text-[11px] font-black text-zinc-400 tracking-[0.1em] uppercase">Engine Ativa</span>
           </div>
        </header>

        <div className="flex-1 flex flex-col justify-center items-center px-12 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
          
          {scenario && (
            <PokerTable 
              scenario={scenario} 
              config={config} 
              onViewOpponentRange={handleOpenOpponentRange}
            />
          )}
          
          {feedback && feedback.type === 'CORRECT' && (
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
              <div className="px-12 py-6 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl border-t-2 transition-all flex flex-col items-center bg-emerald-600/10 border-emerald-500 text-emerald-400">
                <span className="text-6xl font-black uppercase tracking-tighter leading-none mb-2">CORRETO</span>
                <span className="text-xs font-black tracking-[0.2em] uppercase opacity-60">Jogada ideal: {feedback.action}</span>
              </div>
            </div>
          )}

          {showErrorModal && scenario && lastUserAction && (
            <FeedbackModal 
              scenario={scenario} 
              userAction={lastUserAction} 
              onContinue={handleCloseErrorModal} 
            />
          )}

          {viewingOpponent && (
             <RangeViewerModal 
               title={`Range GTO: ${viewingOpponent.pos} (${viewingOpponent.action})`}
               subtitle={`Spot vs Hero em ${scenario?.heroPosition}`}
               matrix={viewingOpponent.matrix}
               onClose={() => setViewingOpponent(null)}
             />
          )}
        </div>

        <footer className="bg-[#0c0c0e] border-t border-zinc-900 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
           <ActionPanel 
             onAction={handleAction} 
             disabled={isProcessing} 
             highlightedAction={feedback?.action}
           />
        </footer>
      </main>
    </div>
  );
};

export default App;
