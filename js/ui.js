// ===== DOM 요소 =====
const stageText = document.getElementById("stageText");
const heroNameEl = document.getElementById("heroName");
const heroAvatarEl = document.getElementById("heroAvatar");
const heroHpTextEl = document.getElementById("heroHpText");
const heroHpFillEl = document.getElementById("heroHpFill");
const heroExpFill = document.getElementById("heroExpFill");
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
const resetBtn = document.getElementById("resetBtn");
const logEl = document.getElementById("log");
const skillControls = document.getElementById("skillControls");
const itemControls = document.getElementById("itemControls");

const levelUpModal = document.getElementById("levelUpModal");
const atkUpBtn = document.getElementById("atkUpBtn");
const defUpBtn = document.getElementById("defUpBtn");
const hpUpBtn = document.getElementById("hpUpBtn");
const remainingPointsEl = document.getElementById("remainingPoints");

const statusModal = document.getElementById("statusModal");
const statusBtn = document.getElementById("statusBtn");
const closeStatusBtn = document.getElementById("closeStatusBtn");
const currentWeaponEl = document.getElementById("currentWeapon");
const currentArmorEl = document.getElementById("currentArmor");
const currentGlovesEl = document.getElementById("currentGloves");
const currentBootsEl = document.getElementById("currentBoots");
const equipmentList = document.getElementById("equipmentList");

const statusLevel = document.getElementById("statusLevel");
const statusExp = document.getElementById("statusExp");
const statusHp = document.getElementById("statusHp");
const statusHeal = document.getElementById("statusHeal");
const statusAtk = document.getElementById("statusAtk");
const statusDef = document.getElementById("statusDef");
const activeSkillsList = document.getElementById("activeSkillsList");
const learnedSkillsList = document.getElementById("learnedSkillsList");

const saveBtn = document.getElementById("saveBtn");
const stageSelector = document.getElementById("stageSelector");
const startBattleBtn = document.getElementById("startBattleBtn");

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

function getHeroTotalStats() {
  const weapon = hero.equipment.weapon ? equipment.find(e => e.id === hero.equipment.weapon) : null;
  const armor = hero.equipment.armor ? equipment.find(e => e.id === hero.equipment.armor) : null;
  const gloves = hero.equipment.gloves ? equipment.find(e => e.id === hero.equipment.gloves) : null;
  const boots = hero.equipment.boots ? equipment.find(e => e.id === hero.equipment.boots) : null;

  const totalAtkBonus = (weapon?.atkBonus || 0) + (gloves?.atkBonus || 0) + (boots?.atkBonus || 0);
  const totalDefBonus = (armor?.defBonus || 0) + (gloves?.defBonus || 0) + (boots?.defBonus || 0);
  const totalHpBonus = (armor?.hpBonus || 0) + (gloves?.hpBonus || 0) + (boots?.hpBonus || 0);

  return {
    atk: hero.minAtk + totalAtkBonus,
    maxAtk: hero.maxAtk + totalAtkBonus,
    def: hero.def + totalDefBonus,
    maxHp: hero.maxHp + totalHpBonus,
  };
}

// ===== UI 업데이트 함수 =====
function updateUI() {
  const lang = L[currentLang];
  const totalStats = getHeroTotalStats();

  // Hero
  heroNameEl.textContent = lang.hero_name(hero.name, hero.level);
  heroAvatarEl.textContent = hero.avatar;
  heroHpTextEl.textContent = `${hero.hp} / ${totalStats.maxHp}`;
  heroAtkTextEl.textContent = lang.hero_atk(totalStats.atk, totalStats.maxAtk);
  heroDefTextEl.textContent = lang.hero_def(totalStats.def);
  setHpBar(heroHpFillEl, hero.hp, totalStats.maxHp);
  const expRatio = clamp(hero.exp / hero.expToNext, 0, 1);
  heroExpFill.style.transform = `scaleX(${expRatio})`;

  // Enemy
  if (currentEnemy) {
    enemyNameEl.textContent = currentEnemy.name;
    enemyAvatarEl.textContent = currentEnemy.avatar;
    enemyHpTextEl.textContent = `${currentEnemy.hp} / ${currentEnemy.maxHp}`;
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
  // 스테이지 선택기 업데이트
  updateStageSelector();

  // 버튼 상태
  const isInCombat = currentEnemy && !gameOver;
  attackBtn.disabled = !isInCombat || !isPlayerTurn;
  healBtn.disabled = !isInCombat || !isPlayerTurn || hero.healCount <= 0;
  startBattleBtn.disabled = isInCombat || gameOver;
}

// ===== 스테이지 선택기 업데이트 =====
function updateStageSelector() {
  const lang = L[currentLang];
  const maxStage = Math.min(hero.maxStageCleared + 1, enemies.length - 1);
  stageSelector.innerHTML = "";
  for (let i = 0; i <= maxStage; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = lang.current_stage(i + 1);
    stageSelector.appendChild(option);
  }
  stageSelector.value = currentEnemyIndex;
}

// ===== 스킬/아이템 버튼 관리 =====
function updateSkillButtons() {
  skillControls.innerHTML = "";
  const lang = L[currentLang];
  hero.activeSkills.forEach(skillId => {
    if (!skillId) return;
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    const skillInfo = lang.skills[skill.id];
    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.style.flex = "1";
    btn.style.minWidth = "80px";
    btn.textContent = `${skill.icon} ${skillInfo.name}`;
    
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
    if (item.count <= 0) return;
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

function showStatusModal() {
  const lang = L[currentLang];
  const totalStats = getHeroTotalStats();

  // 능력치 정보 업데이트
  statusLevel.textContent = `${lang.status_level}: ${hero.level}`;
  statusExp.textContent = `${lang.status_exp}: ${hero.exp} / ${hero.expToNext}`;
  statusHp.textContent = `${lang.status_hp}: ${hero.hp} / ${totalStats.maxHp}`;
  statusHeal.textContent = `${lang.status_heal}: ${hero.healCount}회`;
  statusAtk.textContent = `${lang.status_atk}: ${totalStats.atk} ~ ${totalStats.maxAtk}`;
  statusDef.textContent = `${lang.status_def}: ${totalStats.def}`;

  // 현재 장비 표시
  const weapon = hero.equipment.weapon ? lang.equipment[hero.equipment.weapon] : null;
  const armor = hero.equipment.armor ? lang.equipment[hero.equipment.armor] : null;
  const gloves = hero.equipment.gloves ? lang.equipment[hero.equipment.gloves] : null;
  const boots = hero.equipment.boots ? lang.equipment[hero.equipment.boots] : null;

  currentWeaponEl.textContent = weapon ? weapon.name : lang.equip_none;
  currentArmorEl.textContent = armor ? armor.name : lang.equip_none;
  currentGlovesEl.textContent = gloves ? gloves.name : lang.equip_none;
  currentBootsEl.textContent = boots ? boots.name : lang.equip_none;

  // 장비 리스트 표시
  equipmentList.innerHTML = "";
  hero.inventory.forEach(itemId => {
    const item = equipment.find(e => e.id === itemId);
    if (!item) return;
    const itemInfo = lang.equipment[item.id];
    const itemDiv = document.createElement("div");
    itemDiv.className = "modal-list-item";
    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `${item.icon} ${itemInfo.name}<br><small>${itemInfo.description}</small>`;
    const equipBtn = document.createElement("button");
    equipBtn.className = "secondary";
    const isEquipped = Object.values(hero.equipment).includes(item.id);
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

  // 스킬 관리 UI 렌더링
  activeSkillsList.innerHTML = "";
  hero.activeSkills.forEach((skillId, index) => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "modal-list-item";
    const infoDiv = document.createElement("div");
    const unequipBtn = document.createElement("button");
    unequipBtn.className = "secondary";
    
    if (skillId) {
      const skill = skills.find(s => s.id === skillId);
      const skillInfo = lang.skills[skillId];
      infoDiv.innerHTML = `${skill.icon} ${skillInfo.name}<br><small>${skillInfo.description}</small>`;
      unequipBtn.textContent = lang.skill_unequip;
      unequipBtn.onclick = () => unequipSkill(skillId, index);
    } else {
      infoDiv.innerHTML = `<span style="color: #6b7280;">- ${lang.equip_none} -</span>`;
      unequipBtn.textContent = lang.skill_equip;
      unequipBtn.disabled = true;
    }
    skillDiv.appendChild(infoDiv);
    skillDiv.appendChild(unequipBtn);
    activeSkillsList.appendChild(skillDiv);
  });

  learnedSkillsList.innerHTML = "";
  const unequippedSkills = hero.learnedSkills.filter(id => !hero.activeSkills.includes(id));
  unequippedSkills.forEach(skillId => {
    const skill = skills.find(s => s.id === skillId);
    const skillInfo = lang.skills[skillId];
    const skillDiv = document.createElement("div");
    skillDiv.className = "modal-list-item";
    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `${skill.icon} ${skillInfo.name}<br><small>${skillInfo.description}</small>`;
    const equipBtn = document.createElement("button");
    equipBtn.className = "secondary";
    equipBtn.textContent = lang.skill_equip;
    if (hero.activeSkills.includes(null)) {
      equipBtn.onclick = () => equipSkill(skillId);
    } else {
      equipBtn.disabled = true;
    }
    skillDiv.appendChild(infoDiv);
    skillDiv.appendChild(equipBtn);
    learnedSkillsList.appendChild(skillDiv);
  });

  statusModal.style.display = "flex";
}

// ===== 언어 교체 함수 =====
function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    if (L[lang][key]) el.textContent = L[lang][key];
  });

  document.querySelectorAll("[data-lang-none]").forEach(el => {
    const key = el.getAttribute("data-lang-none");
    if (el.textContent === L["ko"][key] || el.textContent === L["en"][key] || el.textContent === "") {
      el.textContent = L[lang][key];
    }
  });

  updateUI();
}
