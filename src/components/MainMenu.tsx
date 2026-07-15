import React, { useState } from 'react';
import { Terminal, Play, Settings, FileText, RotateCcw, Power } from 'lucide-react';
import { Player } from '../types';

interface Props {
  hasSaveFile: boolean;
  onContinue: () => void;
  onNewGame: () => void;
}

export const MainMenu: React.FC<Props> = ({ hasSaveFile, onContinue, onNewGame }) => {
  const [showConfirmNew, setShowConfirmNew] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'main' | 'settings' | 'changelog'>('main');

  const handleNewGame = () => {
    if (hasSaveFile) {
      setShowConfirmNew(true);
    } else {
      onNewGame();
    }
  };

  const confirmNewGame = () => {
    setShowConfirmNew(false);
    onNewGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-50 font-mono p-4 flex flex-col relative overflow-hidden flex items-center justify-center">
      {/* Background styling for industrial theme */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)' }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/50 to-slate-950 z-0 pointer-events-none"></div>

      <div className="z-10 w-full max-w-2xl system-panel p-8 relative flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Terminal className="w-12 h-12 text-cyan-400" />
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tighter uppercase" style={{ filter: 'drop-shadow(0 0 10px rgba(34,211,238,0.3))' }}>
              Tower Climber
            </h1>
            <span className="text-cyan-500/60 text-xs tracking-[0.3em] uppercase">Boot Sequence Initialized</span>
          </div>
        </div>

        {activeScreen === 'main' && (
          <div className="w-full max-w-md flex flex-col gap-4">
            {hasSaveFile && (
              <button
                onClick={onContinue}
                className="w-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-100 font-bold py-4 px-6 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-3 group"
              >
                <Play className="w-5 h-5 group-hover:text-cyan-300" /> Continuar Ciclo
              </button>
            )}

            {!showConfirmNew ? (
              <button
                onClick={handleNewGame}
                className={`w-full bg-slate-900/80 hover:bg-slate-800 border ${hasSaveFile ? 'border-slate-700/50 text-slate-300' : 'border-cyan-500/50 text-cyan-100'} font-bold py-4 px-6 rounded uppercase tracking-widest transition-all hover:border-cyan-400 flex items-center justify-center gap-3 group hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]`}
              >
                <Power className={`w-5 h-5 ${hasSaveFile ? 'group-hover:text-cyan-300' : 'text-cyan-400'}`} /> {hasSaveFile ? 'Reiniciar Sistema (Novo Jogo)' : 'Iniciar Sistema'}
              </button>
            ) : (
              <div className="w-full bg-red-950/30 border border-red-900/50 p-4 rounded text-center flex flex-col gap-4">
                <p className="text-red-400 text-sm">AVISO: Isso apagará seu progresso atual irreversivelmente. Tem certeza?</p>
                <div className="flex gap-2">
                  <button onClick={confirmNewGame} className="flex-1 bg-red-900/50 hover:bg-red-800 border border-red-500 text-red-100 py-2 rounded text-xs uppercase tracking-widest transition-colors">Sim, Formatar</button>
                  <button onClick={() => setShowConfirmNew(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 py-2 rounded text-xs uppercase tracking-widest transition-colors">Cancelar</button>
                </div>
              </div>
            )}

            <div className="h-px w-full bg-slate-800/50 my-2"></div>

            <button
              onClick={() => setActiveScreen('settings')}
              className="w-full bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-bold py-3 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            >
              <Settings className="w-4 h-4" /> Configurações
            </button>

            <button
              onClick={() => setActiveScreen('changelog')}
              className="w-full bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200 font-bold py-3 px-6 rounded uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            >
              <FileText className="w-4 h-4" /> Changelog
            </button>
          </div>
        )}

        {activeScreen === 'settings' && (
          <div className="w-full flex flex-col gap-6">
            <h2 className="text-cyan-400 uppercase tracking-widest font-bold border-b border-cyan-900/50 pb-2 flex items-center gap-2">
              <Settings className="w-5 h-5" /> Configurações
            </h2>
            
            <div className="flex flex-col gap-4 text-sm text-slate-300">
               <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex justify-between items-center opacity-50">
                 <span>Efeitos Sonoros (Em Breve)</span>
                 <div className="w-12 h-6 bg-slate-800 rounded-full"></div>
               </div>
               <div className="bg-slate-900/50 p-4 rounded border border-slate-800 flex justify-between items-center opacity-50">
                 <span>Música de Fundo (Em Breve)</span>
                 <div className="w-12 h-6 bg-slate-800 rounded-full"></div>
               </div>
            </div>

            <button
              onClick={() => setActiveScreen('main')}
              className="mt-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold py-2 px-6 rounded uppercase tracking-widest transition-all"
            >
              Voltar
            </button>
          </div>
        )}

        {activeScreen === 'changelog' && (
          <div className="w-full flex flex-col gap-6">
            <h2 className="text-cyan-400 uppercase tracking-widest font-bold border-b border-cyan-900/50 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Patch Notes // Changelog
            </h2>
            
            <div className="flex flex-col gap-4 h-64 overflow-y-auto custom-scrollbar text-sm text-slate-300 pr-2">
               <div className="border-l-2 border-cyan-500 pl-4 pb-4">
                 <h3 className="text-cyan-300 font-bold mb-1">v1.2.0 - Despertar da Máquina</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-400">
                   <li>Adicionado Sistema de Matriz Neural (Árvore de Passivas)</li>
                   <li>Novo Menu Principal</li>
                   <li>Refatoração de Sinergia de Habilidades</li>
                   <li>Adicionado Glossário de Efeitos</li>
                 </ul>
               </div>
               <div className="border-l-2 border-slate-700 pl-4 pb-4 opacity-70">
                 <h3 className="text-slate-300 font-bold mb-1">v1.1.0 - Expansão do Núcleo</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-400">
                   <li>Introduzido Sistema de Sockets em Equipamentos</li>
                   <li>Módulos de Circuitos Adicionados (Chipsets)</li>
                   <li>Auto-Batalha Aprimorada</li>
                 </ul>
               </div>
               <div className="border-l-2 border-slate-700 pl-4 opacity-50">
                 <h3 className="text-slate-300 font-bold mb-1">v1.0.0 - Genesis</h3>
                 <ul className="list-disc list-inside space-y-1 text-slate-400">
                   <li>Lançamento Inicial do Protocolo</li>
                   <li>Batalhas em Turnos Implementadas</li>
                   <li>Classes Iniciais de Combate</li>
                 </ul>
               </div>
            </div>

            <button
              onClick={() => setActiveScreen('main')}
              className="mt-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold py-2 px-6 rounded uppercase tracking-widest transition-all"
            >
              Voltar
            </button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-4 left-0 w-full text-center text-slate-600 text-[10px] font-mono tracking-widest pointer-events-none">
        TOWER CLIMBER OS v1.2.0 // ESTADO: OPERACIONAL
      </div>
    </div>
  );
};
