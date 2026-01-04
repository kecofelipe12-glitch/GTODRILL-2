
import React from 'react';
import { Card, Suit } from '../types';

interface CardUIProps {
  card?: Card;
  hidden?: boolean;
  isHero?: boolean;
  small?: boolean;
}

const getSuitStyle = (suit: Suit) => {
  switch (suit) {
    case 's': // Spades - Grey
      return { bg: 'bg-[#52525b]', icon: '♠' };
    case 'h': // Hearts - Red
      return { bg: 'bg-[#dc2626]', icon: '♥' };
    case 'd': // Diamonds - Blue
      return { bg: 'bg-[#2563eb]', icon: '♦' };
    case 'c': // Clubs - Grey
      return { bg: 'bg-[#71717a]', icon: '♣' };
    default:
      return { bg: 'bg-zinc-700', icon: '?' };
  }
};

const CardUI: React.FC<CardUIProps> = ({ card, hidden, isHero, small }) => {
  const width = small ? 'w-6' : 'w-10';
  const height = small ? 'h-8' : 'h-14';

  if (hidden || !card) {
    return (
      <div className={`${width} ${height} bg-[#1a1a1e] rounded-sm border border-zinc-800 flex items-center justify-center shadow-md relative overflow-hidden group`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #3f3f46 25%, transparent 25%, transparent 50%, #3f3f46 50%, #3f3f46 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }}></div>
        <div className="text-[9px] font-black text-zinc-600 tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">GD</div>
      </div>
    );
  }

  const { bg, icon } = getSuitStyle(card.suit);
  
  return (
    <div className={`
      ${width} ${height} ${bg} rounded-sm flex flex-col items-center justify-center shadow-lg border border-white/20 select-none relative overflow-hidden
      ${isHero ? 'ring-1 ring-white/40 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}
    `}>
      <div className="flex flex-col items-center justify-center z-10">
        <span className={`
          ${small ? 'text-sm' : 'text-2xl'} 
          font-[900] text-white leading-none tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]
        `}>
          {card.rank}
        </span>
        <span className={`
          ${small ? 'text-[10px]' : 'text-sm'} 
          text-white font-serif leading-none -mt-0.5 drop-shadow-sm brightness-150
        `}>
          {icon}
        </span>
      </div>
      {!small && (
        <div className="absolute bottom-0 right-0.5 text-white/20 text-[10px] pointer-events-none font-serif">
          {icon}
        </div>
      )}
      {isHero && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none"></div>
      )}
    </div>
  );
};

export default CardUI;
