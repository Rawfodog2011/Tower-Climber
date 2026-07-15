import { Player, Item, Rarity } from '../../types';
import { getRandomItemByRarityAndClass } from '../entities/items';

export const CRAFTING_COSTS = {
  common: { materials: 3, gold: 50 },
  rare: { materials: 3, gold: 200 },
  epic: { materials: 3, gold: 1000 },
};

export const MATERIAL_NAMES = {
  common: 'Fragmento Comum',
  rare: 'Essência Rara',
  epic: 'Núcleo Épico'
};

export function dismantleItem(player: Player, inventoryIndex: number): { success: boolean, message: string, updatedPlayer: Player } {
  const item = player.inventory[inventoryIndex];
  if (!item) return { success: false, message: 'Item não encontrado.', updatedPlayer: player };

  const updatedPlayer = { 
    ...player, 
    inventory: [...player.inventory], 
    materials: { ...player.materials } 
  };
  
  updatedPlayer.inventory.splice(inventoryIndex, 1);

  const MAX_FRAGMENTS = 300;
  let message = `Desmanchado! +1 ${MATERIAL_NAMES[item.rarity]}`;
  
  if (updatedPlayer.materials[item.rarity] >= MAX_FRAGMENTS) {
     const goldValues = { common: 5, rare: 20, epic: 100 };
     const goldEarned = goldValues[item.rarity] || 5;
     updatedPlayer.gold += goldEarned;
     message = `Desmanchado! Limite de ${MATERIAL_NAMES[item.rarity]} alcançado (+ ${goldEarned}G compensação)`;
  } else {
     updatedPlayer.materials[item.rarity] += 1;
  }

  return {
    success: true,
    message,
    updatedPlayer
  };
}

export function craftItem(player: Player, rarity: Rarity): { success: boolean, message: string, updatedPlayer: Player } {
  const cost = CRAFTING_COSTS[rarity];
  
  if (player.materials[rarity] < cost.materials) {
    return { success: false, message: `Faltam ${MATERIAL_NAMES[rarity]}s.`, updatedPlayer: player };
  }
  if (player.gold < cost.gold) {
    return { success: false, message: `Ouro insuficiente.`, updatedPlayer: player };
  }

  const newItem = getRandomItemByRarityAndClass(rarity, player.currentClassId);
  if (!newItem) {
    return { success: false, message: `Nenhum item disponível para sua classe nesta raridade.`, updatedPlayer: player };
  }

  const updatedPlayer = { 
    ...player, 
    gold: player.gold - cost.gold,
    materials: { ...player.materials, [rarity]: player.materials[rarity] - cost.materials },
    inventory: [...player.inventory, newItem]
  };

  return {
    success: true,
    message: `Forja concluída: ${newItem.name}!`,
    updatedPlayer
  };
}
