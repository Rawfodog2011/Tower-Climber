import React, { useRef } from 'react';
import { Shield, Activity, Flame, Cpu, Settings, Fingerprint, Zap, Trophy, ChevronLeft, ChevronRight, User, Crosshair, ShoppingCart, Briefcase, BookOpen } from 'lucide-react';

interface Props {
  hubTab: string;
  setHubTab: (tab: any) => void;
}

export const HubNavigation: React.FC<Props> = ({ hubTab, setHubTab }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const tabs = [
    { id: 'expedicao', label: 'Expedição', icon: Crosshair, color: 'orange' },
    { id: 'perfil', label: 'Painel do Jogador', icon: User, color: 'emerald' },
    { id: 'geral', label: 'Equipamentos', icon: Shield, color: 'cyan' },
    { id: 'habilidades', label: 'Matriz Neural', icon: Activity, color: 'cyan' },
    { id: 'forja', label: 'Forja Arcana', icon: Flame, color: 'amber' },
    { id: 'soldagem', label: 'Bancada de Soldagem', icon: Cpu, color: 'indigo' },
    { id: 'reliquias', label: 'Sistema de Relíquias', icon: Settings, color: 'rose' },
    { id: 'adaptacoes', label: 'Adaptações Biomec.', icon: Fingerprint, color: 'blue' },
    { id: 'contratos', label: 'Central de Contratos', icon: Briefcase, color: 'indigo' },
    { id: 'mercado', label: 'Rede Clandestina', icon: ShoppingCart, color: 'red' },
    { id: 'auto', label: 'Módulos Auto', icon: Zap, color: 'emerald' },
    { id: 'conquistas', label: 'Parede de Troféus', icon: Trophy, color: 'purple' }
  ];

  const getColorClasses = (id: string, color: string) => {
    if (hubTab === id) {
      return `bg-${color}-900/40 text-${color}-400 border-${color}-500/50 shadow-[0_0_15px_rgba(var(--${color}-500-rgb),0.2)]`;
    }
    return `text-slate-400 hover:bg-slate-800 hover:text-${color}-200 border-transparent`;
  };

  return (
    <div className="relative flex items-center w-full system-panel p-2 mb-2 lg:mb-4 border border-slate-800/50">
      <button 
        onClick={() => scroll('left')}
        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors z-10 mx-1 shrink-0 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto no-scrollbar flex-1 px-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id}
              onClick={() => setHubTab(tab.id)} 
              className={`whitespace-nowrap px-4 py-2.5 rounded border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${getColorClasses(tab.id, tab.color)}`}
            >
              <Icon className="w-4 h-4 inline-block mr-2" /> 
              {tab.label}
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900/80 rounded border border-slate-700 hover:border-cyan-500/50 transition-colors z-10 mx-1 shrink-0 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
