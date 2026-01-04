
import React, { useState } from 'react';
import { Stats, TrainingConfig, PreflopAction } from '../types';

interface StatsPanelProps {
  stats: Stats;
  config: TrainingConfig;
  setConfig: (config: TrainingConfig) => void;
  onResetStats: () => void;
  onNextHand: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, config, setConfig, onResetStats, onNextHand }) => {
  const [showSettings, setShowSettings] = useState(false);

  const OptionGroup = ({ label, children, icon }: { label: string, children: React.ReactNode, icon?: boolean }) => (
    <div className="mb-5">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-zinc-600 text-[10px]">ⓘ</span>}
      </div>
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );

  const ActionButton = ({ active, label, onClick, locked, fullWidth }: { active?: boolean, label: string | number, onClick?: () => void, locked?: boolean, fullWidth?: boolean }) => (
    <button
      onClick={locked ? undefined : onClick}
      className={`relative px-3 py-1.5 rounded text-[11px] font-bold transition-all border flex items-center justify-center gap-1.5 ${
        fullWidth ? 'flex-grow' : ''
      } ${
        locked 
          ? 'bg-zinc-900/20 border-zinc-800/50 text-zinc-700 cursor-not-allowed'
          : active 
            ? 'bg-zinc-700 border-zinc-600 text-white shadow-sm' 
            : 'bg-zinc-800/40 border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
      }`}
    >
      <span className="truncate">{label}</span>
      {locked && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 opacity-40">
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );

  const StatRow = ({ count, label, color, icon }: { count: number, label: string, color: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 py-1.5">
      <div className="flex items-center justify-center w-5">
        {icon}
      </div>
      <span className="text-sm font-black text-white w-6 tabular-nums">{count}</span>
      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">{label}</span>
    </div>
  );

  const lockedSolutions = ['Cash', 'Spin & Go', 'Hu SnG'];
  const lockedFormats = ['Heads-up', 'Events'];
  const lockedSpots = ['Postflop included'];
  
  const functionalActions: PreflopAction[] = ['Any', 'RFI', 'vs Open', 'vs 3bet', 'vs 4bet', 'vs Limp', 'Blind Defense', 'Push/Fold'];
  
  const allPreflopActions: PreflopAction[] = [
    'Any', 'RFI', 'vs Open', 'vs 3bet', 'vs 4bet', 'vs Limp', 
    'Blind Defense', 'Push/Fold', 'vs Squeeze', 'vs Iso', 'vs Raise-Call'
  ];

  const handleStackChange = (field: 'stackMin' | 'stackMax', val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setConfig({ ...config, [field]: num });
    }
  };

  return (
    <div className="w-[320px] bg-[#0c0c0e] border-r border-zinc-900 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-xl font-black tracking-tighter text-white">
             GTO<span className="text-emerald-500">DRILL</span>
           </h1>
           <div className="flex gap-2">
             <button onClick={onResetStats} className="p-2 rounded-full text-zinc-600 hover:text-rose-400 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                 <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.608a.75.75 0 101.45.451zM19.245 13.941a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h3.183a.75.75 0 100-1.5H3.085a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0014.959-5.252.75.75 0 10-1.45-.451z" clipRule="evenodd" />
               </svg>
             </button>
             <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                 <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.11-.454.03L6.21 5.193c-.773-.514-1.812-.365-2.4.35l-.533.64c-.594.716-.551 1.79.1 2.407l1.102 1.05c.09.085.118.223.057.36a7.501 7.501 0 00-.432 1.07c-.052.176-.197.272-.346.299l-1.516.27c-.912.163-1.56.938-1.56 1.855v.805c0 .917.648 1.692 1.56 1.855l1.516.27c.149.027.294.123.346.299a7.486 7.486 0 00.432 1.07c.061.137.033.275-.057.36l-1.102 1.05c-.65.618-.693 1.69-.1 2.408l.533.64c.588.715 1.627.864 2.4.35l1.103-.736c.12-.08.288-.085.454.03.284.196.613.386.986.57.182.088.277.228.297.348l.178 1.072c.151.904.933 1.567 1.85 1.567h.844c.917 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.115-.26.297-.348.373-.184.702-.374.986-.57.166-.115.334-.11.454-.03l1.103.736c.773.514 1.812.365 2.4-.35l.533-.64c.594-.716.551-1.79-.1-2.407l-1.102-1.05c-.09-.085-.118-.223-.057-.36a7.493 7.493 0 00.432-1.07c.052-.176.197-.272.346-.299l1.516-.27c.912-.163-1.56-.938-1.56-1.855v-.805c0-.917-.648-1.692-1.56-1.855l1.516-.27c.149-.027.294-.123.346-.299a7.501 7.501 0 00-.432-1.07c-.061-.137-.033-.275.057-.36l1.102-1.05c.65-.618.693-1.69.1-2.408l-.533-.64c-.588-.715-1.627-.864-2.4-.35l-1.103.736c-.12.08-.288.085-.454-.03a7.486 7.486 0 00-.986-.57c-.182-.088-.277-.228-.297-.348l-.178-1.072c-.151-.904-.933-1.567-1.85-1.567h-.844zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
               </svg>
             </button>
           </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-0 overflow-y-auto custom-scrollbar">
        {showSettings ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <OptionGroup label="Soluções" icon>
               {['Cash', 'MTT', 'Spin & Go', 'Hu SnG'].map(s => (
                 <ActionButton key={s} label={s} active={config.solution === s} locked={lockedSolutions.includes(s)} onClick={() => setConfig({...config, solution: s as any})} />
               ))}
             </OptionGroup>
             <OptionGroup label="Jogadores" icon>
               {[3, 4, 5, 6, 7, 8, 9].map(p => (
                 <ActionButton key={p} label={p} active={config.players === p} onClick={() => setConfig({...config, players: p})} />
               ))}
             </OptionGroup>
             <OptionGroup label="Ação Pré-flop" icon>
               <div className="grid grid-cols-2 gap-1 w-full">
                 {allPreflopActions.map(a => (
                   <ActionButton key={a} label={a} active={config.preflopAction === a} locked={!functionalActions.includes(a)} onClick={() => setConfig({...config, preflopAction: a})} />
                 ))}
               </div>
             </OptionGroup>
             <OptionGroup label="Stack Efetivo (BB)" icon>
               <div className="flex gap-2 items-center w-full mt-2">
                  <div className="flex-1">
                    <span className="text-[9px] text-zinc-600 block mb-1 uppercase">Min</span>
                    <input type="number" value={config.stackMin} onChange={(e) => handleStackChange('stackMin', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] text-zinc-600 block mb-1 uppercase">Max</span>
                    <input type="number" value={config.stackMax} onChange={(e) => handleStackChange('stackMax', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500" />
                  </div>
               </div>
               <div className="mt-4 flex items-center gap-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50 hover:bg-zinc-900 transition-colors cursor-pointer" onClick={() => setConfig({...config, randomizeVillainStacks: !config.randomizeVillainStacks})}>
                  <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${config.randomizeVillainStacks ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-zinc-950 border-zinc-800'}`}>
                    {config.randomizeVillainStacks && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#0c0c0e]">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">Randomizar stacks dos vilões</span>
               </div>
             </OptionGroup>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
             <div className="flex justify-between items-start mb-8">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-zinc-600 uppercase">Mãos</span>
                 <span className="text-2xl font-black text-white">{stats.hands}</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold text-zinc-600 uppercase">Precisão</span>
                 <span className="text-2xl font-black text-white">{stats.score}%</span>
               </div>
             </div>
             <div className="space-y-1 mt-4">
                <StatRow count={stats.best} label="Excelente" color="text-emerald-400" icon={<div className="w-4 h-4 text-emerald-400">★</div>}/>
                <StatRow count={stats.blunder} label="Erro Grave" color="text-rose-700" icon={<div className="w-4 h-4 text-rose-700">!!</div>}/>
             </div>
          </div>
        )}
      </div>
      <div className="mt-auto p-6 border-t border-zinc-900 bg-black/40">
        <button onClick={showSettings ? () => setShowSettings(false) : onNextHand} className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0c0c0e] font-black text-xs py-3 rounded uppercase tracking-widest shadow-lg active:scale-95">
          {showSettings ? 'Salvar Filtros' : 'Próxima Mão'}
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;