import React, { useState } from 'react';
import { Player } from '../types';
import { BookOpen, Skull, MapPin, Search } from 'lucide-react';

interface Props {
  player: Player;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231f2937' stroke='%23374151' stroke-width='4'/><text x='50' y='55' font-family='monospace' font-size='40' fill='%23ef4444' text-anchor='middle'>X</text></svg>";
};

export const BestiaryPanel: React.FC<Props> = ({ player }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const entries = Object.entries(player.bestiary || {} as Record<string, { name: string, kills: number, firstFloor: number, lastFloor: number }>).map(([id, data]) => ({
    id,
    name: (data as any).name, kills: (data as any).kills, firstFloor: (data as any).firstFloor, lastFloor: (data as any).lastFloor
  })).sort((a, b) => b.kills - a.kills);

  const filteredEntries = entries.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-500" />
            Arquivo de Ameaças
          </h2>
          <p className="text-red-200/60 font-mono text-sm uppercase tracking-wider">Registros Biomecânicos & Anomalias</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar registro..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 transition-colors font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.length === 0 ? (
          <div className="md:col-span-2 system-panel p-12 flex flex-col items-center justify-center text-slate-500 border-dashed">
            <BookOpen className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-mono uppercase tracking-widest text-center">Nenhum registro encontrado.<br/>Explore a torre para catalogar ameaças.</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="system-panel p-4 flex gap-4 hover:border-red-500/50 transition-colors group">
              <div className="w-20 h-20 bg-slate-900 rounded border border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://robohash.org/${entry.name}?set=set2&size=100x100`} onError={handleImageError} 
                  alt={entry.name}
                  className="w-16 h-16 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)] group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-red-100 uppercase tracking-widest text-sm mb-2">{entry.name}</h3>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Skull className="w-3 h-3 text-red-500" />
                    <span>Abates: <span className="text-red-400 font-bold">{entry.kills}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3 h-3 text-cyan-500" />
                    <span>Andares: <span className="text-cyan-400">{entry.firstFloor}{entry.lastFloor > entry.firstFloor ? `-${entry.lastFloor}` : ''}</span></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
