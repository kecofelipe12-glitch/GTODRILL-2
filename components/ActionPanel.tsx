
import React from 'react';
import { ActionType } from '../types';

interface ActionPanelProps {
  onAction: (action: ActionType) => void;
  disabled?: boolean;
  highlightedAction?: ActionType | null;
}

const ACTION_MAP: Record<ActionType, { label: string, color: string, active: string, key: string }> = {
  FOLD: { label: 'FOLD', color: 'bg-blue-600', active: 'hover:bg-blue-500 active:bg-blue-700', key: '1' },
  CALL: { label: 'CALL', color: 'bg-emerald-600', active: 'hover:bg-emerald-500 active:bg-emerald-700', key: '2' },
  RAISE: { label: 'RAISE', color: 'bg-rose-600', active: 'hover:bg-rose-500 active:bg-rose-700', key: '3' },
  ALLIN: { label: 'ALL-IN', color: 'bg-[#4c0519]', active: 'hover:bg-[#700d2b] active:bg-[#310411]', key: '4' },
};

const ActionPanel: React.FC<ActionPanelProps> = ({ onAction, disabled, highlightedAction }) => {
  const actions: ActionType[] = ['FOLD', 'CALL', 'RAISE', 'ALLIN'];

  return (
    <div className="flex gap-3 justify-center py-6 px-10">
      {actions.map((action) => {
        const isHighlighted = highlightedAction === action;
        const { label, color, active, key } = ACTION_MAP[action];
        
        return (
          <button
            key={action}
            onClick={() => onAction(action)}
            disabled={disabled && !isHighlighted}
            className={`
              relative ${color} ${!disabled ? active : ''}
              min-w-[120px] py-3 px-6 rounded-md font-extrabold text-sm tracking-widest text-white transition-all duration-200
              flex items-center justify-center border border-white/10
              ${disabled && !isHighlighted ? 'opacity-30 grayscale cursor-not-allowed' : 'shadow-lg'}
              ${isHighlighted ? 'ring-4 ring-amber-400 animate-pulse-gold scale-105 z-10 opacity-100 grayscale-0' : ''}
            `}
          >
            <span className="absolute top-1 left-1.5 text-[8px] opacity-40 font-mono">{key}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default ActionPanel;
