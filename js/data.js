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
  }
};

const skills = [
  {
    id: "powerStrike",
    name: "강력한 일격",
    description: "공격력 1.5배, 방어력 무시",
    icon: "💥",
    cooldown: 3,
    currentCooldown: 0,
    effect: "damage",
    multiplier: 1.5,
    ignoreDef: true
  },
  {
    id: "weaken",
    name: "약화",
    description: "적 방어력 2턴 동안 -2",
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
    name: "공격력 포션",
    description: "3턴 동안 공격력 +5",
    icon: "⚔",
    effect: "buff",
    buffType: "atk",
    buffValue: 5,
    buffDuration: 3,
    count: 2
  },
  {
    id: "defPotion",
    name: "방어력 포션",
    description: "3턴 동안 방어력 +3",
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
    name: "나무 검",
    type: "weapon",
    description: "공격력 +3",
    icon: "🗡️",
    atkBonus: 3,
    defBonus: 0,
    hpBonus: 0
  },
  {
    id: "ironSword",
    name: "철 검",
    type: "weapon",
    description: "공격력 +7",
    icon: "⚔️",
    atkBonus: 7,
    defBonus: 0,
    hpBonus: 0
  },
  {
    id: "leatherArmor",
    name: "가죽 갑옷",
    type: "armor",
    description: "방어력 +2",
    icon: "🦺",
    atkBonus: 0,
    defBonus: 2,
    hpBonus: 10
  },
  {
    id: "ironArmor",
    name: "철 갑옷",
    type: "armor",
    description: "방어력 +4, HP +20",
    icon: "🥼",
    atkBonus: 0,
    defBonus: 4,
    hpBonus: 20
  }
];

const enemies = [
  {
    name: "초록 슬라임",
    avatar: "🟢",
    maxHp: 40,
    minAtk: 5,
    maxAtk: 10,
    def: 1
  },
  {
    name: "고블린",
    avatar: "👺",
    maxHp: 65,
    minAtk: 8,
    maxAtk: 14,
    def: 2
  },
  {
    name: "해골 병사",
    avatar: "💀",
    maxHp: 80,
    minAtk: 10,
    maxAtk: 16,
    def: 3
  },
  {
    name: "용의 그림자",
    avatar: "🐉",
    maxHp: 120,
    minAtk: 12,
    maxAtk: 20,
    def: 4
  }
];

// ===== 게임 상태 변수 =====
let currentEnemyIndex = 0;
let currentEnemy = null;
let isPlayerTurn = true;
let gameOver = false;
