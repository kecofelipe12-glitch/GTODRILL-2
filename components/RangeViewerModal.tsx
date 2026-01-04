
import React from 'react';

interface RangeViewerModalProps {
  title: string;
  subtitle: string;
  matrix: number[][];
  onClose: () => void;
}

const RANK_LABELS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const RangeViewerModal: React.FC<RangeViewerModalProps> = ({ title, subtitle, matrix, onClose }) => {
  const RangeGrid = ({ matrix }: { matrix: number[][] }) => {
    return (
      <div className="grid grid-cols-13 gap-[1px] bg-zinc-900 border border-zinc-800 p-[1px] rounded shadow-2xl">
        {matrix.flat().map((val, idx) => {
          const row = Math.floor(idx / 13);
          const col = idx % 13;
          const r1 = RANK_LABELS[row];
          const r2 = RANK_LABELS[col];
          
          let label = "";
          if (row === col) label = r1 + r2; 
          else if (row < col) label = r1 + r2 + 's'; 
          else label = r2 + r1 + 'o';

          let cellClass = "bg-[#121214] text-zinc-700 opacity-80";
          if (val === 1) cellClass = "bg-emerald-500 text-white font-black"; 
          if (val === 2) cellClass = "bg-[#e11d48] text-white font-black";

          return (
            <div 
              key={idx}
              className={`aspect-square flex items-center justify-center text-[7px] font-bold leading-none ${cellClass} border-[0.5px] border-black/20 select-none`}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
           <div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase leading-none">{title}</h2>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{subtitle}</span>
           </div>
           <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>
        <div className="p-6">
           <RangeGrid matrix={matrix} />
           <div className="mt-5 flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#e11d48] rounded-sm"></div>
                 <span className="text-[10px] font-black text-zinc-500 uppercase">Raise / All-in</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                 <span className="text-[10px] font-black text-zinc-500 uppercase">Call</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-[#121214] border border-zinc-800 rounded-sm"></div>
                 <span className="text-[10px] font-black text-zinc-500 uppercase">Fold</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RangeViewerModal;
