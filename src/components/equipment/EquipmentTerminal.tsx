import React, { useState } from 'react';
import { Item, Player, ClassDefinition } from '../../types';
import { ExosuitSilhouette } from './ExosuitSilhouette';
import { EquipmentSlot } from './EquipmentSlot';
import { ItemInspectionPanel } from './ItemInspectionPanel';
import { CargoGrid } from './CargoGrid';
import { StatusPanel } from './StatusPanel';

interface Props {
  player: Player;
  stats: { hp: number, mp: number, atk: number, def: number, spd: number };
  CLASSES: Record<string, ClassDefinition>;
  inventoryMessage: { type: 'error'|'success', text: string } | null;
  handleEquip: (item: Item) => void;
  handleUnequip: (slotId: keyof Player['equipment']) => void;
  handleAutoEquip: () => void;
  canClassEquipItem: (classId: string, item: Item) => boolean;
  getItemIcon: (type: string, className?: string) => React.ReactNode;
  getRarityStyle: (rarity: string) => string;
  getRarityGradient: (rarity: string) => string;
  renderManufacturerBadge: (item: Item) => React.ReactNode;
}

export const EquipmentTerminal: React.FC<Props> = ({
  player, stats, CLASSES, inventoryMessage, handleEquip, handleUnequip, handleAutoEquip,
  canClassEquipItem, getItemIcon, getRarityStyle, getRarityGradient, renderManufacturerBadge
}) => {
  const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

  const onHover = (item?: Item) => {
    setHoveredItem(item || null);
  };

  return (
    <div className="w-full min-h-[800px] bg-[#020617] border border-cyan-900/30 flex flex-col p-4 relative overflow-hidden font-sans shadow-2xl animate-in fade-in duration-500">
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 z-50 mix-blend-overlay" />
      
      {/* Header Telemetry */}
      <div className="w-full flex justify-between items-center pb-2 mb-4 border-b border-cyan-900/40">
        <div className="flex items-center gap-4">
          <div className="text-cyan-500 font-mono text-[10px] tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" /> LINK ESTABELECIDO
          </div>
          <div className="text-cyan-700 font-mono text-[10px] tracking-[0.2em]">CORE ONLINE</div>
        </div>
        
        <h1 className="text-cyan-100 font-bold tracking-[0.3em] uppercase text-sm md:text-base drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          Terminal Tático
        </h1>

        <div className="flex items-center gap-4">
          <div className="text-cyan-700 font-mono text-[10px] tracking-[0.2em]">FW 9.4.2</div>
          <div className="text-cyan-700 font-mono text-[10px] tracking-[0.2em]">UTC {new Date().toISOString().substring(11, 19)}</div>
        </div>
      </div>

      {/* Main Top Area - Silhouette ONLY */}
      <div className="w-full relative flex items-center justify-center min-h-[600px] lg:min-h-[700px] overflow-hidden mb-6 bg-slate-950/20 rounded-xl border border-cyan-900/20">
        
        {/* Constrain Exosuit to exact aspect ratio to align slots perfectly */}
        <div className="relative w-full max-w-[400px] aspect-[1/2] flex items-center justify-center">
          
          {/* Exosuit SVG */}
          <div className="absolute inset-0 z-0">
             <ExosuitSilhouette player={player} />
          </div>

          {/* Equipment Slots overlay */}
          <div className="absolute inset-0 z-10">
             
             {/* Left side: Weapon */}
             <div className="absolute top-[40%] left-[-5%] xl:left-[-15%] origin-left">
               <EquipmentSlot 
                 slotId="weapon" label="Arma" item={player.equipment.weapon} shape="vertical"
                 onHover={onHover} onClick={handleUnequip}
                 getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
               />
             </div>

             {/* Right side: Bracers */}
             <div className="absolute top-[38%] right-[-5%] xl:right-[-15%] origin-right">
               <EquipmentSlot 
                 slotId="bracers" label="Braços" item={player.equipment.bracers} shape="square"
                 onHover={onHover} onClick={handleUnequip}
                 getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
               />
             </div>

             {/* Center slots */}
             <div className="absolute top-[8%] left-1/2 -translate-x-1/2">
               <EquipmentSlot 
                 slotId="helmet" label="Capacete" item={player.equipment.helmet} shape="hexagon"
                 onHover={onHover} onClick={handleUnequip}
                 getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
               />
             </div>
             <div className="absolute top-[28%] left-1/2 -translate-x-1/2">
               <EquipmentSlot 
                 slotId="armor" label="Peitoral" item={player.equipment.armor} shape="square"
                 onHover={onHover} onClick={handleUnequip}
                 getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
               />
             </div>
             <div className="absolute top-[56%] left-1/2 -translate-x-1/2">
               <EquipmentSlot 
                 slotId="pants" label="Pernas" item={player.equipment.pants} shape="vertical"
                 onHover={onHover} onClick={handleUnequip}
                 getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
               />
             </div>
             <div className="absolute top-[78%] left-1/2 -translate-x-1/2">
               <EquipmentSlot 
                 slotId="boots" label="Botas" item={player.equipment.boots} shape="double"
                 onHover={onHover} onClick={handleUnequip}
                 getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
               />
             </div>
          </div>
        </div>

        {/* Accessories Grouped Side-by-Side (Floating Top Right or Bottom Right) */}
        {/* We place them outside the 400x800 aspect ratio so they don't overlap the center suit! */}
        <div className="absolute top-4 right-4 flex gap-4 bg-slate-900/60 p-3 rounded-xl border border-cyan-900/30 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.1)] z-20">
            <EquipmentSlot 
                slotId="accessory1" label="Secundária" item={player.equipment.accessory1} shape="square"
                onHover={onHover} onClick={handleUnequip}
                getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
            />
            <EquipmentSlot 
                slotId="accessory2" label="Módulo" item={player.equipment.accessory2} shape="square"
                onHover={onHover} onClick={handleUnequip}
                getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
            />
            <EquipmentSlot 
                slotId="accessory3" label="Anel" item={player.equipment.accessory3} shape="square"
                onHover={onHover} onClick={handleUnequip}
                getItemIcon={getItemIcon} getRarityStyle={getRarityStyle} getRarityGradient={getRarityGradient}
            />
        </div>
      </div>

      {/* Bottom Area: Status, Cargo, Inspection */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
         
         {/* Status */}
         <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0">
            <StatusPanel player={player} stats={stats} />
         </div>

         {/* Cargo Grid */}
         <div className="w-full flex-1">
            <CargoGrid 
                inventory={player.inventory}
                onHover={onHover}
                onClick={handleEquip}
                canEquip={(item) => canClassEquipItem(player.currentClassId, item)}
                getItemIcon={getItemIcon}
                getRarityStyle={getRarityStyle}
                getRarityGradient={getRarityGradient}
                inventoryMessage={inventoryMessage}
                handleAutoEquip={handleAutoEquip}
            />
         </div>

         {/* Inspection Panel */}
         <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0">
            <ItemInspectionPanel 
                item={hoveredItem} 
                player={player} 
                CLASSES={CLASSES} 
                canClassEquipItem={canClassEquipItem} 
                getItemIcon={getItemIcon}
                renderManufacturerBadge={renderManufacturerBadge}
            />
         </div>
      </div>
    </div>
  );
};
