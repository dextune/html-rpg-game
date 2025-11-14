// ===== 스킬 데이터 =====
const skills = [
  {
    id: "powerStrike",
    icon: "💥",
    cooldown: 3,
    currentCooldown: 0,
    effect: "damage",
    multiplier: 1.5,
    ignoreDef: true
  },
  {
    id: "weaken",
    icon: "🌀",
    cooldown: 4,
    currentCooldown: 0,
    effect: "debuff",
    debuffType: "def",
    debuffValue: -2,
    debuffDuration: 2
  }
];
