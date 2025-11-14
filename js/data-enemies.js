// ===== 적 데이터 =====
const enemies = [
  {
    name: "초록 슬라임",
    avatar: "🟢",
    maxHp: 40,
    minAtk: 5,
    maxAtk: 10,
    def: 1,
    drops: [{ id: "atkPotion", chance: 0.3 }, { id: "beginnerBoots", chance: 0.1 }]
  },
  {
    name: "박쥐",
    avatar: "🦇",
    maxHp: 50,
    minAtk: 10,
    maxAtk: 15,
    def: 1,
    drops: [{ id: "beginnerGloves", chance: 0.15 }]
  },
  {
    name: "고블린",
    avatar: "👺",
    maxHp: 65,
    minAtk: 8,
    maxAtk: 14,
    def: 2,
    drops: [{ id: "ironSword", chance: 0.2 }],
    abilities: [
      { type: "double_attack", chance: 0.3 }
    ]
  },
  {
    name: "오크",
    avatar: "👹",
    maxHp: 90,
    minAtk: 12,
    maxAtk: 18,
    def: 4,
    drops: [{ id: "ironArmor", chance: 0.25 }, { id: "ironGauntlets", chance: 0.1 }]
  },
  {
    name: "해골 병사",
    avatar: "💀",
    maxHp: 80,
    minAtk: 10,
    maxAtk: 16,
    def: 3,
    drops: [{ id: "defPotion", chance: 0.3 }, { id: "ironGreaves", chance: 0.1 }]
  },
  {
    name: "골렘",
    avatar: "🗿",
    maxHp: 150,
    minAtk: 8,
    maxAtk: 15,
    def: 8,
    drops: [{ id: "plateArmor", chance: 0.2 }]
  },
  {
    name: "미믹",
    avatar: "🎁",
    maxHp: 70,
    minAtk: 15,
    maxAtk: 22,
    def: 2,
    drops: [{ id: "silverSword", chance: 0.15 }]
  },
  {
    name: "스켈레톤 킹",
    avatar: "👑",
    maxHp: 130,
    minAtk: 15,
    maxAtk: 25,
    def: 5,
    abilities: [
      { type: "lifesteal", chance: 0.2, multiplier: 0.3 }
    ],
    drops: [{ id: "plateArmor", chance: 0.1 }, { id: "silverSword", chance: 0.1 }]
  },
  {
    name: "용의 그림자",
    avatar: "🐉",
    maxHp: 200,
    minAtk: 18,
    maxAtk: 28,
    def: 6,
    abilities: [
      { type: "lifesteal", chance: 0.25, multiplier: 0.5 }
    ]
  }
];
