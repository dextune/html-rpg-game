// ===== 이벤트 핸들러 설정 =====
function setupEventListeners() {
  attackBtn.addEventListener("click", playerAttack);
  healBtn.addEventListener("click", playerHeal);
  saveBtn.addEventListener("click", saveGame);
  statusBtn.addEventListener("click", showStatusModal);
  closeStatusBtn.addEventListener("click", () => {
    statusModal.style.display = "none";
  });

  // 언어 변경 버튼
  document.getElementById("lang-ko").addEventListener("click", () => setLanguage("ko"));
  document.getElementById("lang-en").addEventListener("click", () => setLanguage("en"));

  startBattleBtn.addEventListener("click", () => {
    if (gameOver || currentEnemy) return;
    currentEnemyIndex = parseInt(stageSelector.value);
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
    hero.maxStageCleared = 0;
    hero.minAtk = 10;
    hero.maxAtk = 20;
    hero.def = 2;
    currentEnemyIndex = 0;
    currentEnemy = null;
    gameOver = false;
    isPlayerTurn = true;
    turn = 1;
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
    hero.equipment.gloves = null;
    hero.equipment.boots = null;
    hero.inventory = ["woodenSword", "leatherArmor", "beginnerGloves", "beginnerBoots"];
    // 스킬 초기화
    hero.learnedSkills = ["powerStrike"];
    hero.activeSkills = ["powerStrike", null];
    logEl.innerHTML = "";
    log(L[currentLang].log_new_adventure, "system", "🔄");
    spawnEnemy();
  });
}

// ===== 게임 초기화 =====
function init() {
  // 언어 설정
  setLanguage("ko");

  // 저장된 게임 불러오기 시도
  const loaded = loadGame();
  if (loaded) {
    // log(L[currentLang].log_load_game, "system"); // loadGame()에서 이미 로그를 출력함
  } else {
    log(L[currentLang].log_welcome, "system", "👋");
    log(L[currentLang].log_guide, "system", "👉");
    spawnEnemy();
  }

  // 이벤트 리스너 설정
  setupEventListeners();
}

// ===== 페이지 로드 시 실행 =====
document.addEventListener("DOMContentLoaded", init);
