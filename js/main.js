// ===== 이벤트 핸들러 설정 =====
function setupEventListeners() {
  attackBtn.addEventListener("click", playerAttack);
  healBtn.addEventListener("click", playerHeal);
  saveBtn.addEventListener("click", saveGame);
  equipBtn.addEventListener("click", showEquipModal);
  closeEquipBtn.addEventListener("click", () => {
    equipModal.style.display = "none";
  });

  nextBtn.addEventListener("click", () => {
    if (gameOver) return;
    if (currentEnemy) return;
    if (currentEnemyIndex >= enemies.length) return;
    spawnEnemy();
  });

  resetBtn.addEventListener("click", () => {
    // 초기화
    hero.hp = hero.maxHp;
    hero.healCount = 3;
    hero.level = 1;
    hero.exp = 0;
    hero.expToNext = 50;
    hero.statPoints = 0;
    hero.minAtk = 10;
    hero.maxAtk = 20;
    hero.def = 2;
    currentEnemyIndex = 0;
    currentEnemy = null;
    gameOver = false;
    isPlayerTurn = true;
    // 스킬 쿨다운 초기화
    skills.forEach(skill => {
      skill.currentCooldown = 0;
    });
    // 아이템 개수 초기화
    items.forEach(item => {
      if (item.id === "atkPotion") item.count = 2;
      if (item.id === "defPotion") item.count = 2;
    });
    // 장비 초기화
    hero.equipment.weapon = null;
    hero.equipment.armor = null;
    logEl.innerHTML = "";
    log("새 모험이 시작된다!", "system");
    spawnEnemy();
  });
}

// ===== 게임 초기화 =====
function init() {
  // 저장된 게임 불러오기 시도
  const loaded = loadGame();
  if (loaded) {
    log("저장된 게임을 불러왔습니다!", "system");
  } else {
    log("HTML 미니 RPG에 오신 걸 환영합니다!", "system");
    log("'공격'과 '회복'으로 적을 모두 물리쳐 보세요.", "system");
    spawnEnemy();
  }

  // 이벤트 리스너 설정
  setupEventListeners();
}

// ===== 페이지 로드 시 실행 =====
document.addEventListener("DOMContentLoaded", init);
