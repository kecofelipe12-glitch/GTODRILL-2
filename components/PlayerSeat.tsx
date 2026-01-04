
import React from 'react';
import { Position, ActionType } from '../types.ts';
import CardUI from './CardUI.tsx';

interface PlayerSeatProps {
  position: Position;
  stack: number;
  isHero: boolean;
  isActive: boolean;
  isDealer?: boolean;
  lastAction?: { action: ActionType; amount?: number };
  style?: React.CSSProperties;
  heroCards?: any;
  seatIndex: number; 
  totalSeats: number;
  onActionClick?: () => void;
}

const PlayerSeat: React.FC<PlayerSeatProps> = ({ 
  position, 
  stack, 
  isHero, 
  isActive, 
  isDealer, 
  lastAction,
  style,
  heroCards,
  seatIndex,
  totalSeats,
  onActionClick
}) => {
  const isFolded = lastAction?.action === 'FOLD';
  const relativePos = seatIndex / totalSeats;
  const isRightSideOfTable = relativePos > 0.5;

  const getActionColor = (action: ActionType) => {
    switch(action) {
      case 'FOLD': return 'bg-blue-600/90';
      case 'CALL': return 'bg-emerald-600';
      case 'RAISE': return 'bg-rose-600';
      case 'ALLIN': return 'bg-[#4c0519]';
      default: return 'bg-zinc-700/50';
    }
  };

  const getInwardPositionClasses = (index: number, total: number) => {
    const ratio = index / total;
    if (ratio === 0) return { chips: '-top-14', dealer: '-top-3 -right-1' };
    if (ratio > 0 && ratio < 0.25) return { chips: '-top-6 -right-10', dealer: '-top-0.5 -right-3' };
    if (ratio >= 0.25 && ratio < 0.4) return { chips: '-right-14', dealer: 'top-5 -right-1' };
    if (ratio >= 0.4 && ratio <= 0.6) return { chips: '-bottom-14', dealer: '-bottom-1 -right-1' };
    if (ratio > 0.6 && ratio <= 0.8) return { chips: '-left-14', dealer: 'top-5 -left-1' };
    return { chips: '-top-6 -left-10', dealer: '-top-0.5 -left-3' };
  };

  const layoutPositions = getInwardPositionClasses(seatIndex, totalSeats);
  const displayBetAmount = lastAction?.amount || (position === 'SB' ? 0.5 : position === 'BB' ? 1.0 : 0);
  const isBlindPosting = lastAction && lastAction.action === 'RAISE' && lastAction.amount === 1.0 && position === 'BB';
  const shouldShowActionTag = lastAction && !isBlindPosting && lastAction.action !== 'FOLD';

  return (
    <div 
      className={`absolute flex flex-col items-center transition-all duration-500 ${isFolded ? 'opacity-30 grayscale' : ''}`}
      style={{ ...style, transform: 'translate(-50%, -50%)' }}
    >
      {!isFolded && displayBetAmount > 0 && (
        <div className={`absolute ${layoutPositions.chips} flex flex-col items-center z-30 transition-all duration-300`}>
           {shouldShowActionTag && (
             <button 
               onClick={onActionClick}
               title="Ver Range GTO desta ação"
               className={`px-2 py-0.5 rounded-sm text-[9px] font-black text-white uppercase tracking-tighter shadow-xl border border-white/10 ${getActionColor(lastAction!.action)} mb-1 animate-in fade-in zoom-in-95 hover:scale-110 active:scale-95 transition-transform cursor-pointer group`}
             >
               {lastAction!.action}
               <span className="ml-1 opacity-0 group-hover:opacity-100 text-[8px]">👁</span>
             </button>
           )}
           <div className="flex items-center gap-1.5 bg-zinc-950/70 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5 shadow-xl whitespace-nowrap">
              <div className={`w-2 h-2 rounded-full border border-white/10 ${position === 'SB' || position === 'BB' ? 'bg-blue-500' : 'bg-zinc-400 opacity-80'}`}></div>
              <span className="text-[12px] font-black text-white tracking-tight tabular-nums drop-shadow-sm">
                {displayBetAmount.toFixed(displayBetAmount % 1 === 0 ? 0 : 1)}
              </span>
           </div>
        </div>
      )}

      {isDealer && (
        <div className={`absolute ${layoutPositions.dealer} w-5 h-5 bg-white text-zinc-950 rounded-full flex items-center justify-center text-[9px] font-black shadow-2xl ring-1 ring-zinc-300 z-40`}>
          D
        </div>
      )}

      <div className={`flex items-center gap-2 ${isRightSideOfTable ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`
          relative w-16 h-16 rounded-full flex flex-col items-center justify-center border-[2.5px] transition-all duration-300 z-20
          ${isHero ? 'border-emerald-500 bg-zinc-900 shadow-[0_0_25px_rgba(16,185,129,0.3)]' : 'border-zinc-800 bg-zinc-900/95 shadow-lg'}
          ${isActive ? 'ring-4 ring-emerald-500/20' : ''}
        `}>
          <span className={`text-[11px] font-black uppercase tracking-wider ${isHero ? 'text-emerald-400' : 'text-zinc-500'}`}>{position}</span>
          <span className="text-[13px] font-black text-white leading-none mt-1 tabular-nums">{stack.toFixed(1)}</span>
        </div>

        {!isFolded && (
          <div className="flex gap-1 transition-all duration-300 animate-in fade-in zoom-in-95 z-10">
            {isHero && heroCards ? (
              <>
                <CardUI card={heroCards[0]} isHero={true} />
                <CardUI card={heroCards[1]} isHero={true} />
              </>
            ) : (
              <>
                <CardUI hidden small />
                <CardUI hidden small />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSeat;
