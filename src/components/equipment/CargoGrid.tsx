import React from 'react';
import { Item } from '../../types';

interface Props {
  inventory: Item[];
  onHover: (item: Item | undefined) => void;
  onClick: (item: Item) => void;
  canEquip: (item: Item) => boolean;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  getRarityStyle: (rarity: string) => string;
  getRarityGradient: (rarity: string) => string;
  inventoryMessage?: { type: 'error'|'success', text: string } | null;
  handleAutoEquip?: () => void;
}

export const CargoGrid: React.FC<Props> = ({
  inventory, onHover, onClick, canEquip,
  getItemIcon, getRarityStyle, getRarityGradient, inventoryMessage, handleAutoEquip
}) => {
  const TOTAL_SLOTS = 72; // 12 columns x 6 rows
  const gridCells = Array.from({ length: TOTAL_SLOTS }, (_, i) => inventory[i] || null);

  return (
    <div className="w-full mt-6 flex flex-col border border-slate-700/50 bg-[#060b13] relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
      {/* Decorative Frame */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-900/50 to-transparent" />

      {/* Header */}
      <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 animate-pulse" />
          <span className="font-mono text-cyan-100 font-bold tracking-[0.2em] text-xs">COMPARTIMENTO DE CARGA</span>
        </div>
        <div className="flex items-center gap-4">
          {inventoryMessage && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${
              inventoryMessage.type === 'error' ? 'text-red-400 border-red-900/50 bg-red-950/30' : 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30'
            }`}>
              {inventoryMessage.text}
            </span>
          )}
          
          {handleAutoEquip && (
            <button 
              onClick={handleAutoEquip}
              className="px-3 py-1 bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-[10px] font-mono tracking-widest uppercase transition-colors"
            >
              Auto-Equipar
            </button>
          )}
          <span className="font-mono text-cyan-600 text-[10px] tracking-widest">

            CAPACIDADE: {inventory.length} / {TOTAL_SLOTS}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 relative">
        {/* Background Grid Lines for empty feeling */}
        <div className="absolute inset-4 grid grid-cols-12 gap-2 pointer-events-none opacity-20">
            {Array.from({length: TOTAL_SLOTS}).map((_,i) => (
                <div key={`bg-${i}`} className="aspect-square border border-slate-800 rounded-sm" />
            ))}
        </div>

        <div className="grid grid-cols-12 gap-2 relative z-10">
          {gridCells.map((item, idx) => {
            if (!item) {
              return (
                <div key={idx} className="aspect-square rounded-sm bg-slate-900/20 border border-slate-800/50 flex items-center justify-center shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                   {/* Empty Slot */}
                   <div className="w-1 h-1 bg-slate-800 rounded-full" />
                </div>
              );
            }

            const isEquipable = canEquip(item);

            return (
              <div 
                key={idx}
                onMouseEnter={() => onHover(item)}
                onMouseLeave={() => onHover(undefined)}
                onClick={() => onClick(item)}
                className={`relative aspect-square rounded-sm border flex items-center justify-center transition-all duration-150 shadow-md ${
                  isEquipable 
                    ? `cursor-pointer hover:scale-105 hover:brightness-125 hover:z-20 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] ${getRarityStyle(item.rarity)}` 
                    : 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div className={`w-full h-full absolute inset-0 opacity-20 pointer-events-none ${getRarityGradient(item.rarity)}`} />
                {getItemIcon(item.type, "w-6 h-6 text-slate-200 drop-shadow-lg relative z-10")}
                
                {item.level && (
                  <span className="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-white z-10">
                    L{item.level}
                  </span>
                )}
                {/* Tech corner accent */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-cyan-500/50 opacity-50 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
