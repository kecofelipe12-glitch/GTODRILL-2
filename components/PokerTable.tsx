
import React from 'react';
import { Position, Scenario, TrainingConfig } from '../types.ts';
import { getActivePositions } from '../engine/gtoLogic.ts';
import PlayerSeat from './PlayerSeat.tsx';

interface PokerTableProps {
  scenario: Scenario;
  config: TrainingConfig;
  onViewOpponentRange: (pos: Position, action: any) => void;
}

const PokerTable: React.FC<PokerTableProps> = ({ scenario, config, onViewOpponentRange }) => {
  const activePositions = getActivePositions(config.players);
  
  const heroIdxInActive = activePositions.indexOf(scenario.heroPosition);
  const rotatedPositions = activePositions.map((_, i) => {
    return activePositions[(i + heroIdxInActive) % activePositions.length];
  });

  const getCoordinates = (index: number, total: number) => {
    const angle = (Math.PI / 2) + (index * (2 * Math.PI / total));
    const x = 50 + 46 * Math.cos(angle);
    const y = 50 + 43 * Math.sin(angle);
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="relative w-full max-w-5xl aspect-[2/1] mx-auto mt-4 px-8 select-none">
      <div className="absolute inset-8 felt-gradient rounded-[180px] border border-zinc-800/80 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
        <div className="w-[98%] h-[96%] border border-zinc-900/30 rounded-[170px] relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.008]">
             <span className="text-[40px] font-black tracking-[-0.05em] rotate-[-2deg] select-none text-white">GTODRILL</span>
          </div>
        </div>
        
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
           <div className="flex items-center justify-center gap-1.5 mb-2 opacity-60">
             <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{scenario.heroStack}bb</div>
           </div>
           <div className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">
             {scenario.potSize.toFixed(1)} <span className="text-xl text-zinc-500 font-bold ml-0.5 tracking-normal">bb</span>
           </div>
           <div className="text-xs font-black text-zinc-600 mt-2 uppercase tracking-widest">{scenario.drillMode}</div>
        </div>
      </div>

      {rotatedPositions.map((pos, i) => {
        const isHero = pos === scenario.heroPosition;
        const actionsForPos = scenario.previousActions.filter(a => a.position === pos);
        const lastAction = actionsForPos.length > 0 ? actionsForPos[actionsForPos.length - 1] : undefined;
        const displayStack = isHero ? scenario.heroStack : (scenario.villainStacks[pos] || scenario.heroStack);
        
        return (
          <PlayerSeat
            key={pos}
            seatIndex={i}
            totalSeats={rotatedPositions.length}
            position={pos}
            stack={displayStack}
            isHero={isHero}
            isActive={isHero}
            isDealer={pos === 'BTN'}
            lastAction={lastAction}
            style={getCoordinates(i, rotatedPositions.length)}
            heroCards={isHero ? scenario.heroHand : undefined}
            onActionClick={() => lastAction && onViewOpponentRange(pos, lastAction)}
          />
        );
      })}
    </div>
  );
};

export default PokerTable;
