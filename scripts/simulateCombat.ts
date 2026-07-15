import { processTurn, startCombat, CombatState } from '../src/core/engine/combat';
import { generateMonsterForFloor } from '../src/core/entities/monsters';
import { SKILLS_DATABASE } from '../src/core/entities/skills';
import { calculatePlayerStats } from '../src/core/entities/player';
import { getExpectedPlayerStats } from '../src/core/math/worldScaling';
import { Player } from '../src/types';

function createMockPlayer(level: number, floor: number): Player {
  const p: Player = {
    level,
    currentXp: 0,
    currentClassId: 'tecno_aprendiz',
    gold: 0,
    inventory: [],
    equipment: {
       weapon: { id: 'mock_w', name: 'Mock', type: 'weapon', rarity: 'epic', statModifiers: { atk: 100 } },
       armor: { id: 'mock_a', name: 'Mock', type: 'armor', rarity: 'epic', statModifiers: { def: 100, hp: 250 } },
       accessory1: { id: 'mock_ac', name: 'Mock', type: 'accessory', rarity: 'epic', statModifiers: { spd: 50, mp: 50 } }
    },
    highestFloorUnlocked: floor,
    unlockedNodes: ['core_start'],
    learnedSkills: ['mira_laser_calibrada', 'reparo_emergencia'],
    materials: { common: 0, rare: 0, epic: 0 },
    adaptations: {},
    bestiary: {},
    contracts: [],
    runStats: { goldSpent: 0, totalTurns: 0 },
    gameStats: { monstersKilled: 0, puzzlesSolved: 0, bossesDefeated: 0 },
    soulShards: 0,
    matrixPoints: 0,
    achievements: [],
    relics: {},
    autoBattleRules: [],
  } as unknown as Player;

  const basePStats = calculatePlayerStats({ ...p, equipment: {} } as unknown as Player);
  const expected = getExpectedPlayerStats(level);
  (p.equipment.weapon as any).statModifiers = { atk: Math.max(0, expected.atk - basePStats.atk) };
  (p.equipment.armor as any).statModifiers = { hp: Math.max(0, expected.hp - basePStats.hp), def: Math.max(0, expected.def - basePStats.def) };
  (p.equipment.accessory1 as any).statModifiers = { spd: Math.max(0, expected.spd - basePStats.spd), mp: 100 };

  return p;
}

export function simulateCombat(playerLevel: number, floor: number, debug: boolean = false): boolean {
  const player = createMockPlayer(playerLevel, floor);
  const finalPStats = calculatePlayerStats(player);
  const monster = generateMonsterForFloor(floor);

  let combatState: CombatState = startCombat(player, monster, floor);

  if (debug) {
    console.log(`\n=== F${floor} BATTLE START ===`);
    console.log(`PStats: HP ${finalPStats.hp} ATK ${finalPStats.atk} DEF ${finalPStats.def} SPD ${finalPStats.spd}`);
    console.log(`MStats: HP ${monster.stats.hp} ATK ${monster.stats.atk} DEF ${monster.stats.def} SPD ${monster.stats.spd} (BOSS: ${monster.isBoss})`);
  }

  while (combatState.isActive) {
    let action: any = { type: 'attack' };

    if (combatState.playerHp < (finalPStats.hp * 0.3) && !combatState.cooldowns['reparo_emergencia'] && combatState.playerMp >= SKILLS_DATABASE['reparo_emergencia'].mpCost) {
       action = { type: 'skill', skillId: 'reparo_emergencia' };
    } else if (!combatState.cooldowns['mira_laser_calibrada'] && combatState.playerMp >= SKILLS_DATABASE['mira_laser_calibrada'].mpCost) {
       action = { type: 'skill', skillId: 'mira_laser_calibrada' };
    }

    if (debug) {
        console.log(`Round ${combatState.round} - Action: ${action.type === 'skill' ? action.skillId : 'attack'}`);
        console.log(`State Before Turn -> Player: [HP ${combatState.playerHp}, MP ${combatState.playerMp}] | Monster: [HP ${combatState.monsterHp}]`);
    }

    const { nextState, combatResult } = processTurn(player, combatState, action, floor);

    if (debug) {
       for (const l of nextState.logs.slice(combatState.logs.length)) {
           console.log("  LOG:", l);
       }
    }

    if (!nextState.isActive) {
       if (debug) console.log(`Result: ${combatResult?.winner === 'player' ? 'PLAYER WINS' : 'MONSTER WINS'}\n`);
       return combatResult?.winner === 'player';
    }
    combatState = nextState;
    if (combatState.round > 50) return false;
  }
  return false;
}

// Only run when executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const floorsToTest = [25];
  const iters = 5;

  for (const floor of floorsToTest) {
    let wins = 0;
    for (let i = 0; i < iters; i++) {
      if (simulateCombat(20, floor, true)) wins++;
    }
    console.log(`Floor ${floor}: ${((wins/iters)*100).toFixed(1)}% win rate`);
  }
}
