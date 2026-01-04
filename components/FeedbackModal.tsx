
import React from 'react';
import { Scenario, ActionType } from '../types';
import CardUI from './CardUI';

interface FeedbackModalProps {
  scenario: Scenario;
  userAction: ActionType;
  onContinue: () => void;
}

const RANK_LABELS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ scenario, userAction, onContinue }) => {
  const getActionName = (action: ActionType) => {
    switch(action) {
      case 'FOLD': return 'FOLD';
      case 'CALL': return 'CALL';
      case 'RAISE': return 'RAISE';
      case 'ALLIN': return 'ALL-IN';
      default: return action;
    }
  };

  const getActionColor = (action: ActionType) => {
    switch(action) {
      case 'FOLD': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'CALL': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'RAISE': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'ALLIN': return 'text-rose-900 bg-rose-900/10 border-rose-900/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const RangeGrid = ({ matrix }: { matrix: number[][] }) => {
    return (
      <div className="grid grid-cols-13 gap-[1px] bg-zinc-900 border border-zinc-800 p-[1px] rounded shadow-2xl">
        {matrix.flat().map((val, idx) => {
          const row = Math.floor(idx / 13);
          const col = idx % 13;
          const r1 = RANK_LABELS[row];
          const r2 = RANK_LABELS[col];
          
          let label = "";
          if (row === col) {
            label = r1 + r2; 
          } else if (row < col) {
            label = r1 + r2 + 's'; 
          } else {
            label = r2 + r1 + 'o';
          }

          let cellClass = "bg-[#121214] text-zinc-700 opacity-80"; // Fold
          if (val === 1) cellClass = "bg-emerald-500 text-white font-black"; // Call (Green)
          if (val === 2) cellClass = "bg-[#e11d48] text-white font-black"; // Raise/4-bet (Red)

          return (
            <div 
              key={idx}
              className={`
                aspect-square flex items-center justify-center text-[6px] font-bold leading-none
                ${cellClass}
                border-[0.5px] border-black/20 select-none
              `}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#0c0c0e] border border-zinc-800/50 rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="bg-[#e11d48]/10 border-b border-[#e11d48]/20 px-8 py-5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#e11d48] flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                   <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                 </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">Erro de Estratégia</h2>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em]">Game Theory Optimal Analysis</span>
              </div>
           </div>
           <button onClick={onContinue} className="text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>

        <div className="p-8 flex flex-col lg:flex-row gap-10">
           
           <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sua Decisão</span>
                    <div className={`py-3 rounded-xl border-2 text-center font-black text-sm tracking-widest ${getActionColor(userAction)}`}>
                       {getActionName(userAction)}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">GTO Solvido</span>
                    <div className={`py-3 rounded-xl border-2 text-center font-black text-sm tracking-widest ${getActionColor(scenario.correctAction)} ring-2 ring-emerald-500/20`}>
                       {getActionName(scenario.correctAction)}
                    </div>
                 </div>
              </div>

              <div className="bg-zinc-900/40 rounded-xl p-5 border border-zinc-800/50 mb-6 flex-1">
                 <div className="flex gap-5 mb-4 items-center">
                    <div className="flex gap-1.5">
                       <CardUI card={scenario.heroHand[0]} isHero small />
                       <CardUI card={scenario.heroHand[1]} isHero small />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Combo em {scenario.heroPosition}</span>
                      <span className="text-xs font-bold text-zinc-400">Stack: {scenario.heroStack}bb</span>
                    </div>
                 </div>
                 
                 <div className="h-px bg-zinc-800/50 w-full mb-4"></div>
                 
                 <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                   </svg>
                   Análise do Motor de Decisão
                 </h3>
                 <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                    {scenario.explanation}
                 </p>
              </div>

              <button 
                onClick={onContinue}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs py-4 rounded-xl transition-all uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continuar Treino
                <span className="px-1.5 py-0.5 rounded bg-black/20 text-[9px] opacity-60">ENTER</span>
              </button>
           </div>

           <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col">
              <div className="flex justify-between items-end mb-3">
                 <h4 className="text-xs font-black text-white uppercase tracking-tighter">Matriz de Ranges do Solver</h4>
                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                    {scenario.rangeData?.category || 'GTO Strategy'}
                 </span>
              </div>
              
              <div className="relative">
                {scenario.rangeData?.matrix && <RangeGrid matrix={scenario.rangeData.matrix} />}
              </div>
              
              <div className="mt-5 grid grid-cols-3 gap-2">
                 <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-900/50 rounded border border-zinc-800/50">
                    <div className="w-2.5 h-2.5 bg-[#e11d48] rounded-sm"></div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Raise</span>
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-900/50 rounded border border-zinc-800/50">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Call</span>
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-900/50 rounded border border-zinc-800/50">
                    <div className="w-2.5 h-2.5 bg-[#121214] border border-zinc-800 rounded-sm"></div>
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Fold</span>
                 </div>
              </div>
           </div>
           
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
