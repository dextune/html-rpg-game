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

function log(message, type = "system") {
  const line = document.createElement("div");
  line.className = `log-line ${type}`;
  line.textContent = message;
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

  // Hero
  heroNameEl.textContent = `${hero.name} (Lv.${hero.level})`;
  heroAvatarEl.textContent = hero.avatar;
  heroHpTextEl.textContent = `HP: ${hero.hp} / ${totalHp} · 회복 가능: ${hero.healCount}회`;
  heroAtkTextEl.textContent = `공격: ${totalAtk} ~ ${totalMaxAtk}`;
  heroDefTextEl.textContent = `방어: ${totalDef}`;
  setHpBar(heroHpFillEl, hero.hp, totalHp);

  // Enemy
  if (currentEnemy) {
    enemyNameEl.textContent = currentEnemy.name;
    enemyAvatarEl.textContent = currentEnemy.avatar;
    enemyHpTextEl.textContent = `HP: ${currentEnemy.hp} / ${currentEnemy.maxHp}`;
    enemyAtkTextEl.textContent = `공격: ${currentEnemy.minAtk} ~ ${currentEnemy.maxAtk}`;
    enemyDefTextEl.textContent = `방어: ${currentEnemy.def}`;
    setHpBar(enemyHpFillEl, currentEnemy.hp, currentEnemy.maxHp);
  } else {
    enemyNameEl.textContent = "-";
    enemyAvatarEl.textContent = "❔";
    enemyHpTextEl.textContent = "적 없음";
    setHpBar(enemyHpFillEl, 0, 1);
    enemyAtkTextEl.textContent = "공격: -";
    enemyDefTextEl.textContent = "방어: -";
  }

  stageText.textContent = `스테이지 ${currentEnemyIndex + 1}`;

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

  skills.forEach(skill => {
    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.style.flex = "1";
    btn.style.minWidth = "80px";
    btn.textContent = `${skill.icon} ${skill.name}`;

    // 쿨다운 표시
    if (skill.currentCooldown > 0) {
      btn.textContent += ` (${skill.currentCooldown})`;
      btn.disabled = true;
    } else {
      btn.disabled = gameOver || !currentEnemy || !isPlayerTurn;
    }

    btn.title = skill.description;
    btn.addEventListener("click", () => useSkill(skill));
    skillControls.appendChild(btn);
  });
}

function updateItemButtons() {
  itemControls.innerHTML = "";

  items.forEach(item => {
    if (item.count <= 0) return; // 아이템이 없으면 표시하지 않음

    const btn = document.createElement("button");
    btn.className = "secondary";
    btn.style.flex = "1";
    btn.style.minWidth = "80px";
    btn.textContent = `${item.icon} ${item.name} (${item.count})`;
    btn.disabled = gameOver || !currentEnemy || !isPlayerTurn;
    btn.title = item.description;
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
  // 현재 장비 표시
  const weapon = hero.equipment.weapon ? equipment.find(e => e.id === hero.equipment.weapon) : null;
  const armor = hero.equipment.armor ? equipment.find(e => e.id === hero.equipment.armor) : null;

  currentWeaponEl.textContent = weapon ? weapon.name : "없음";
  currentArmorEl.textContent = armor ? armor.name : "없음";

  // 장비 리스트 표시
  equipmentList.innerHTML = "";
  equipment.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.style.display = "flex";
    itemDiv.style.justifyContent = "space-between";
    itemDiv.style.alignItems = "center";
    itemDiv.style.padding = "8px";
    itemDiv.style.marginBottom = "5px";
    itemDiv.style.background = "rgba(0,0,0,0.3)";
    itemDiv.style.borderRadius = "6px";

    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `${item.icon} ${item.name}<br><small style="color: #9ca3af;">${item.description}</small>`;

    const equipBtn = document.createElement("button");
    equipBtn.className = "secondary";
    equipBtn.style.padding = "4px 8px";
    equipBtn.style.fontSize = "12px";
    equipBtn.textContent = "착용";

    const isEquipped = (item.type === "weapon" && hero.equipment.weapon === item.id) ||
                      (item.type === "armor" && hero.equipment.armor === item.id);

    if (isEquipped) {
      equipBtn.textContent = "착용중";
      equipBtn.disabled = true;
    } else {
      equipBtn.onclick = () => equipItem(item);
    }

    itemDiv.appendChild(infoDiv);
    itemDiv.appendChild(equipBtn);
    equipmentList.appendChild(itemDiv);
  });

  equipModal.style.display = "flex";
}
