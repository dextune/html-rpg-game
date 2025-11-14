// ===== DOM 요소 =====
const stageText = document.getElementById("stageText");
const heroNameEl = document.getElementById("heroName");
const heroAvatarEl = document.getElementById("heroAvatar");
const heroHpTextEl = document.getElementById("heroHpText");
const heroHpFillEl = document.getElementById("heroHpFill");
const heroAtkTextEl = document.getElementById("heroAtkText");
const heroDefTextEl = document.getElementById("heroDefText");

const enemyNameEl = document.getElementById("enemyName");
const enemyAvatarEl = document.getElementById("enemyAvatar");
const enemyHpTextEl = document.getElementById("enemyHpText");
const enemyHpFillEl = document.getElementById("enemyHpFill");
const enemyAtkTextEl = document.getElementById("enemyAtkText");
const enemyDefTextEl = document.getElementById("enemyDefText");

const attackBtn = document.getElementById("attackBtn");
const healBtn = document.getElementById("healBtn");
const nextBtn = document.getElementById("nextBtn");
const resetBtn = document.getElementById("resetBtn");
const logEl = document.getElementById("log");
const skillControls = document.getElementById("skillControls");
const itemControls = document.getElementById("itemControls");

const levelUpModal = document.getElementById("levelUpModal");
const atkUpBtn = document.getElementById("atkUpBtn");
const defUpBtn = document.getElementById("defUpBtn");
const hpUpBtn = document.getElementById("hpUpBtn");
const remainingPointsEl = document.getElementById("remainingPoints");

const equipModal = document.getElementById("equipModal");
const equipBtn = document.getElementById("equipBtn");
const closeEquipBtn = document.getElementById("closeEquipBtn");
const currentWeaponEl = document.getElementById("currentWeapon");
const currentArmorEl = document.getElementById("currentArmor");
const equipmentList = document.getElementById("equipmentList");

const saveBtn = document.getElementById("saveBtn");

// ===== 유틸 함수 =====
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
  return Math.max(min, Math.min(num, max));
}

function setHpBar(fillEl, current, max, isDamage = false) {
  const ratio = clamp(current / max, 0, 1);
  fillEl.style.transform = `scaleX(${ratio})`;

  if (isDamage) {
    fillEl.classList.add("damage");
    setTimeout(() => {
      fillEl.classList.remove("damage");
    }, 500);
  }
}

function log(message, type = "system", icon = null) {
  const line = document.createElement("div");
  line.className = `log-line ${type}`;
  
  const turnSpan = `<span style="color: #9ca3af; font-size: 11px; margin-right: 8px;">[T${turn}]</span>`;
  const iconSpan = icon ? `<span style="margin-right: 6px;">${icon}</span>` : "";
  
  line.innerHTML = `${turnSpan}${iconSpan}${message}`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

function playAnimation(element, animationClass) {
  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, 500); // 애니메이션 지속 시간
}

// ===== UI 업데이트 함수 =====
function updateUI() {
  // 장비 보너스 계산
  const weaponBonus = hero.equipment.weapon ? equipment.find(e => e.id === hero.equipment.weapon) : null;
  const armorBonus = hero.equipment.armor ? equipment.find(e => e.id === hero.equipment.armor) : null;

  const totalAtk = hero.minAtk + (weaponBonus ? weaponBonus.atkBonus : 0);
  const totalMaxAtk = hero.maxAtk + (weaponBonus ? weaponBonus.atkBonus : 0);
  const totalDef = hero.def + (armorBonus ? armorBonus.defBonus : 0);
  const totalHp = hero.maxHp + (armorBonus ? armorBonus.hpBonus : 0);

  const lang = L[currentLang];

  // Hero
  heroNameEl.textContent = lang.hero_name(hero.name, hero.level);
  heroAvatarEl.textContent = hero.avatar;
  heroHpTextEl.textContent = lang.hero_hp(hero.hp, totalHp, hero.healCount);
  heroAtkTextEl.textContent = lang.hero_atk(totalAtk, totalMaxAtk);
  heroDefTextEl.textContent = lang.hero_def(totalDef);
  setHpBar(heroHpFillEl, hero.hp, totalHp);

  // Enemy
  if (currentEnemy) {
    enemyNameEl.textContent = currentEnemy.name;
    enemyAvatarEl.textContent = currentEnemy.avatar;
    enemyHpTextEl.textContent = lang.enemy_hp(currentEnemy.hp, currentEnemy.maxHp);
    enemyAtkTextEl.textContent = lang.enemy_atk(currentEnemy.minAtk, currentEnemy.maxAtk);
    enemyDefTextEl.textContent = lang.enemy_def(currentEnemy.def);
    setHpBar(enemyHpFillEl, currentEnemy.hp, currentEnemy.maxHp);
  } else {
    enemyNameEl.textContent = "-";
    enemyAvatarEl.textContent = "❔";
    enemyHpTextEl.textContent = lang.enemy_none;
    setHpBar(enemyHpFillEl, 0, 1);
    enemyAtkTextEl.textContent = `${L[currentLang].hero_atk(0, 0).split(':')[0]}: -`;
    enemyDefTextEl.textContent = `${L[currentLang].hero_def(0).split(':')[0]}: -`;
  }

  stageText.textContent = lang.current_stage(currentEnemyIndex + 1);

  // 스킬 버튼 업데이트
  updateSkillButtons();

  // 아이템 버튼 업데이트
  updateItemButtons();

  // 버튼 상태
  attackBtn.disabled = gameOver || !currentEnemy || !isPlayerTurn;
  healBtn.disabled =
    gameOver || !currentEnemy || !isPlayerTurn || hero.healCount <= 0;
  nextBtn.disabled = gameOver || !!currentEnemy; // 적이 없을 때만
}

// ===== 스킬/아이템 버튼 관리 =====
function updateSkillButtons() {
  skillControls.innerHTML = "";
  const lang = L[currentLang];

  skills.forEach(skill => {
    const skillInfo = lang.skills[skill.id];
    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.style.flex = "1";
    btn.style.minWidth = "80px";
    btn.textContent = `${skill.icon} ${skillInfo.name}`;

    // 쿨다운 표시
    if (skill.currentCooldown > 0) {
      btn.textContent += ` (${skill.currentCooldown})`;
      btn.disabled = true;
    } else {
      btn.disabled = gameOver || !currentEnemy || !isPlayerTurn;
    }

    btn.title = skillInfo.description;
    btn.addEventListener("click", () => useSkill(skill));
    skillControls.appendChild(btn);
  });
}

function updateItemButtons() {
  itemControls.innerHTML = "";
  const lang = L[currentLang];

  items.forEach(item => {
    if (item.count <= 0) return; // 아이템이 없으면 표시하지 않음
    const itemInfo = lang.items[item.id];

    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.style.flex = "1";
    btn.style.minWidth = "80px";
    btn.textContent = `${item.icon} ${itemInfo.name} (${item.count})`;
    btn.disabled = gameOver || !currentEnemy || !isPlayerTurn;
    btn.title = itemInfo.description;
    btn.addEventListener("click", () => useItem(item));
    itemControls.appendChild(btn);
  });
}

// ===== 모달 관리 =====
function showLevelUpModal() {
  remainingPointsEl.textContent = hero.statPoints;
  levelUpModal.style.display = "flex";

  // 버튼 이벤트 설정
  atkUpBtn.onclick = () => allocateStat("atk");
  defUpBtn.onclick = () => allocateStat("def");
  hpUpBtn.onclick = () => allocateStat("hp");

  updateLevelUpButtons();
}

function updateLevelUpButtons() {
  atkUpBtn.disabled = hero.statPoints <= 0;
  defUpBtn.disabled = hero.statPoints <= 0;
  hpUpBtn.disabled = hero.statPoints <= 0;
}

function showEquipModal() {
  const lang = L[currentLang];
  // 현재 장비 표시
  const weaponId = hero.equipment.weapon;
  const armorId = hero.equipment.armor;
  const weapon = weaponId ? lang.equipment[weaponId] : null;
  const armor = armorId ? lang.equipment[armorId] : null;


  currentWeaponEl.textContent = weapon ? weapon.name : lang.equip_none;
  currentArmorEl.textContent = armor ? armor.name : lang.equip_none;

  // 장비 리스트 표시 (인벤토리에 있는 아이템만)
  equipmentList.innerHTML = "";
  hero.inventory.forEach(itemId => {
    const item = equipment.find(e => e.id === itemId);
    if (!item) return;
    const itemInfo = lang.equipment[item.id];

    const itemDiv = document.createElement("div");
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.padding = "8px";
    itemDiv.style.marginBottom = "5px";
    itemDiv.style.background = "rgba(0,0,0,0.3)";
    itemDiv.style.borderRadius = "6px";

    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `${item.icon} ${itemInfo.name}<br><small style="color: #9ca3af;">${itemInfo.description}</small>`;

    const equipBtn = document.createElement("button");
    equipBtn.className = "secondary";
    equipBtn.style.padding = "4px 8px";
    equipBtn.style.fontSize = "12px";

    const isEquipped = (item.type === "weapon" && hero.equipment.weapon === item.id) ||
                      (item.type === "armor" && hero.equipment.armor === item.id);

    if (isEquipped) {
      equipBtn.textContent = lang.equip_equipped;
      equipBtn.disabled = true;
    } else {
      equipBtn.textContent = lang.equip_equip;
      equipBtn.onclick = () => equipItem(item);
    }

    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(equipBtn);
    equipmentList.appendChild(itemDiv);
  });

  equipModal.style.display = "flex";
}

// ===== 언어 교체 함수 =====
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // data-lang 속성을 가진 모든 요소의 텍스트를 교체
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (L[lang][key]) {
      el.textContent = L[lang][key];
    }
  });

  // data-lang-none 속성 (장비 "없음" 등)
  document.querySelectorAll("[data-lang-none]").forEach(el => {
    const key = el.getAttribute("data-lang-none");
    if (el.textContent === L["ko"][key] || el.textContent === L["en"][key]) {
      el.textContent = L[lang][key];
    }
  });

  // UI 전체 업데이트
  updateUI();
}
