// ===== localStorage 관리 =====
function saveGame() {
  const gameData = {
    hero: {
      name: hero.name,
      avatar: hero.avatar,
      maxHp: hero.maxHp,
      hp: hero.hp,
      minAtk: hero.minAtk,
      maxAtk: hero.maxAtk,
      def: hero.def,
      healAmount: hero.healAmount,
      healCount: hero.healCount,
      level: hero.level,
      exp: hero.exp,
      expToNext: hero.expToNext,
      statPoints: hero.statPoints,
      equipment: hero.equipment,
      inventory: hero.inventory
    },
    skills: skills.map(skill => ({
      id: skill.id,
      currentCooldown: skill.currentCooldown
    })),
    items: items.map(item => ({
      id: item.id,
      count: item.count
    })),
    gameState: {
      currentEnemyIndex: currentEnemyIndex,
      isPlayerTurn: isPlayerTurn,
      gameOver: gameOver,
      currentLang: currentLang
    },
    currentEnemy: currentEnemy ? {
      name: currentEnemy.name,
      avatar: currentEnemy.avatar,
      maxHp: currentEnemy.maxHp,
      hp: currentEnemy.hp,
      minAtk: currentEnemy.minAtk,
      maxAtk: currentEnemy.maxAtk,
      def: currentEnemy.def
    } : null,
    log: Array.from(logEl.children).map(line => ({
      text: line.textContent,
      class: line.className
    }))
  };

  try {
    localStorage.setItem("rpgGameSave", JSON.stringify(gameData));
    log(L[currentLang].log_save_game, "system", "💾");
  } catch (error) {
    log(L[currentLang].log_save_error, "system", "❌");
    console.error("Save error:", error);
  }
}

function loadGame() {
  try {
    const savedData = localStorage.getItem("rpgGameSave");
    if (!savedData) return false;

    const gameData = JSON.parse(savedData);

    // 언어 설정 복원
    if (gameData.gameState.currentLang) {
      setLanguage(gameData.gameState.currentLang);
    }

    // 히어로 데이터 복원
    Object.assign(hero, gameData.hero);

    // 스킬 쿨다운 복원
    gameData.skills.forEach(savedSkill => {
      const skill = skills.find(s => s.id === savedSkill.id);
      if (skill) {
        skill.currentCooldown = savedSkill.currentCooldown;
      }
    });

    // 아이템 개수 복원
    gameData.items.forEach(savedItem => {
      const item = items.find(i => i.id === savedItem.id);
      if (item) {
        item.count = savedItem.count;
      }
    });

    // 게임 상태 복원
    currentEnemyIndex = gameData.gameState.currentEnemyIndex;
    isPlayerTurn = gameData.gameState.isPlayerTurn;
    gameOver = gameData.gameState.gameOver;

    // 현재 적 복원
    if (gameData.currentEnemy) {
      currentEnemy = { ...gameData.currentEnemy };
    } else {
      currentEnemy = null;
    }

    // 로그 복원
    logEl.innerHTML = "";
    gameData.log.forEach(logEntry => {
      const line = document.createElement("div");
      line.className = logEntry.class;
      line.innerHTML = logEntry.text; // innerHTML로 변경하여 아이콘도 복원
      logEl.appendChild(line);
    });
    logEl.scrollTop = logEl.scrollHeight;
    log(L[currentLang].log_load_game, "system", "✅");


    updateUI();
    return true;
  } catch (error) {
    log(L[currentLang].log_load_error, "system", "❌");
    console.error("Load error:", error);
    return false;
  }
}
