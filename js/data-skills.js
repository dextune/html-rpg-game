// ===== 스킬 데이터 =====
const skills = [
  {
    id: "powerStrike",
    icon: "💥",
    effect: "damage",
    cooldown: 3,
    currentCooldown: 0,
    multiplier: 1.5,
    ignoreDef: true,
    levelRequired: 1
  },
  {
    id: "weaken",
    icon: "🌀",
    effect: "debuff",
    cooldown: 4,
    currentCooldown: 0,
    debuffType: "def",
    debuffValue: -2,
    debuffDuration: 2,
    levelRequired: 2
  },
  {
    id: "doubleStrike",
    icon: "⚔️⚔️",
    effect: "damage",
    cooldown: 5,
    currentCooldown: 0,
    multiplier: 0.8,
    hits: 2,
    levelRequired: 3
  },
  {
    id: "defensiveStance",
    icon: "🛡️",
    effect: "buff",
    cooldown: 5,
    currentCooldown: 0,
    buffType: "def",
    buffValue: 10,
    buffDuration: 1,
    levelRequired: 5
  },
  {
    id: "holyBlessing",
    icon: "✨",
    effect: "heal",
    cooldown: 6,
    currentCooldown: 0,
    healAmount: 25,
    levelRequired: 7
  }
];
