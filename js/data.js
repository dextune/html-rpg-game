// ===== 게임 데이터 =====
const hero = {
  name: "용사",
  avatar: "🧙‍♂️",
  maxHp: 100,
  hp: 100,
  minAtk: 10,
  maxAtk: 20,
  def: 2,
  healAmount: 18,
  healCount: 3,
  level: 1,
  exp: 0,
  expToNext: 50,
  statPoints: 0,
  equipment: {
    weapon: null,
    armor: null
  },
  inventory: ["woodenSword", "leatherArmor"] // 획득한 아이템 목록
};

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

const items = [
  {
    id: "atkPotion",
    icon: "⚔",
    effect: "buff",
    buffType: "atk",
    buffValue: 5,
    buffDuration: 3,
    count: 2
  },
  {
    id: "defPotion",
    icon: "🛡",
    effect: "buff",
    buffType: "def",
    buffValue: 3,
    buffDuration: 3,
    count: 2
  }
];

const equipment = [
  {
    id: "woodenSword",
    type: "weapon",
    icon: "🗡️",
    atkBonus: 3,
    defBonus: 0,
    hpBonus: 0
  },
  {
    id: "ironSword",
    type: "weapon",
    icon: "⚔️",
    atkBonus: 7,
    defBonus: 0,
    hpBonus: 0
  },
  {
    id: "leatherArmor",
    type: "armor",
    icon: "🦺",
    atkBonus: 0,
    defBonus: 2,
    hpBonus: 10
  },
  {
    id: "ironArmor",
    type: "armor",
    icon: "🥼",
    atkBonus: 0,
    defBonus: 4,
    hpBonus: 20
  },
  {
    id: "steelShield",
    type: "armor",
    icon: "🛡️",
    atkBonus: 0,
    defBonus: 6,
    hpBonus: 30
  },
  {
    id: "wizardRobe",
    type: "armor",
    icon: "🥋",
    atkBonus: 0,
    defBonus: 1,
    hpBonus: 50
  }
];

const enemies = [
  {
    name: "초록 슬라임",
    avatar: "🟢",
    maxHp: 40,
    minAtk: 5,
    maxAtk: 10,
    def: 1,
    drops: [{ id: "atkPotion", chance: 0.3 }]
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
    avatar: "덩치",
    maxHp: 90,
    minAtk: 12,
    maxAtk: 18,
    def: 4,
    drops: [{ id: "ironArmor", chance: 0.25 }]
  },
  {
    name: "해골 병사",
    avatar: "💀",
    maxHp: 80,
    minAtk: 10,
    maxAtk: 16,
    def: 3,
    drops: [{ id: "defPotion", chance: 0.3 }]
  },
  {
    name: "미믹",
    avatar: "🎁",
    maxHp: 70,
    minAtk: 15,
    maxAtk: 22,
    def: 2,
    drops: [{ id: "steelShield", chance: 0.3 }, { id: "wizardRobe", chance: 0.15 }]
  },
  {
    name: "용의 그림자",
    avatar: "🐉",
    maxHp: 120,
    minAtk: 12,
    maxAtk: 20,
    def: 4,
    drops: [],
    abilities: [
      { type: "lifesteal", chance: 0.25, multiplier: 0.5 }
    ]
  }
];

// ===== 게임 상태 변수 =====
let currentEnemyIndex = 0;
let currentEnemy = null;
let isPlayerTurn = true;
let gameOver = false;
let turn = 1;
