// ===== 게임 로직 =====
function spawnEnemy() {
  const enemyData = enemies[currentEnemyIndex];
  currentEnemy = {
    ...enemyData,
    hp: enemyData.maxHp
  };
  isPlayerTurn = true;
  log(`⚔ ${currentEnemy.name} 이(가) 나타났다!`, "system");
  updateUI();
}

function gameClear() {
  log("🎉 모든 적을 물리쳤습니다! 게임 클리어!", "system");
  gameOver = true;
  updateUI();
}

function gameLose() {
  log("💀 용사가 쓰러졌습니다... 게임 오버", "system");
  gameOver = true;
  updateUI();
}

// ===== 전투 로직 =====
function playerAttack() {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;

  // 공격 애니메이션
  playAnimation(heroAvatarEl, "attack-animation");

  const rawDmg = randInt(hero.minAtk, hero.maxAtk);
  const dmg = clamp(rawDmg - currentEnemy.def, 1, 999);
  currentEnemy.hp = clamp(currentEnemy.hp - dmg, 0, currentEnemy.maxHp);
  log(`용사의 공격! ${currentEnemy.name}에게 ${dmg}의 피해!`, "hero");

  // 데미지 애니메이션
  setTimeout(() => {
    playAnimation(enemyAvatarEl, "damage-animation");
    setHpBar(enemyHpFillEl, currentEnemy.hp, currentEnemy.maxHp, true);
    updateUI();
  }, 150);

  if (currentEnemy.hp <= 0) {
    const expGained = currentEnemyIndex + 1 * 10; // 스테이지에 따라 경험치 증가
    hero.exp += expGained;
    log(`${currentEnemy.name} 을(를) 물리쳤다! 경험치 +${expGained}`, "system");

    // 레벨업 체크
    if (hero.exp >= hero.expToNext) {
      levelUp();
      return; // 레벨업 모달이 표시되므로 여기서 중단
    }

    currentEnemy = null;
    currentEnemyIndex++;

    if (currentEnemyIndex >= enemies.length) {
      gameClear();
    } else {
      log("▶ '다음 적' 버튼으로 다음 스테이지로!", "system");
      updateUI();
    }
    return;
  }

  // 적 턴
  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function playerHeal() {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;
  if (hero.healCount <= 0) {
    log("더 이상 회복할 수 없습니다!", "system");
    return;
  }

  hero.healCount--;
  const healed = clamp(hero.healAmount, 0, hero.maxHp - hero.hp);
  hero.hp = clamp(hero.hp + healed, 0, hero.maxHp);
  log(`용사가 회복했다! HP를 ${healed} 회복. (남은 회복: ${hero.healCount}회)`, "hero");

  // 회복 애니메이션
  playAnimation(heroAvatarEl, "heal-animation");
  updateUI();

  // 적 턴
  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function enemyAttack() {
  if (gameOver || !currentEnemy) return;

  // 적 공격 애니메이션
  playAnimation(enemyAvatarEl, "attack-animation");

  const rawDmg = randInt(currentEnemy.minAtk, currentEnemy.maxAtk);
  const dmg = clamp(rawDmg - hero.def, 1, 999);
  hero.hp = clamp(hero.hp - dmg, 0, hero.maxHp);
  log(`${currentEnemy.name} 의 공격! 용사에게 ${dmg}의 피해!`, "enemy");

  // 용사 데미지 애니메이션
  setTimeout(() => {
    playAnimation(heroAvatarEl, "damage-animation");
    const weaponBonus = hero.equipment.weapon ? equipment.find(e => e.id === hero.equipment.weapon) : null;
    const armorBonus = hero.equipment.armor ? equipment.find(e => e.id === hero.equipment.armor) : null;
    const totalHp = hero.maxHp + (armorBonus ? armorBonus.hpBonus : 0);
    setHpBar(heroHpFillEl, hero.hp, totalHp, true);
    updateUI();
  }, 150);

  if (hero.hp <= 0) {
    gameLose();
    return;
  }

  // 스킬 쿨다운 감소
  skills.forEach(skill => {
    if (skill.currentCooldown > 0) {
      skill.currentCooldown--;
    }
  });

  isPlayerTurn = true;
  updateUI();
}

function useSkill(skill) {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;
  if (skill.currentCooldown > 0) return;

  skill.currentCooldown = skill.cooldown;

  if (skill.effect === "damage") {
    // 스킬 공격 애니메이션
    playAnimation(heroAvatarEl, "attack-animation");

    const rawDmg = randInt(hero.minAtk, hero.maxAtk) * skill.multiplier;
    const dmg = skill.ignoreDef ? rawDmg : clamp(rawDmg - currentEnemy.def, 1, 999);
    currentEnemy.hp = clamp(currentEnemy.hp - dmg, 0, currentEnemy.maxHp);
    log(`${skill.name}! ${currentEnemy.name}에게 ${dmg}의 피해!`, "hero");

    // 데미지 애니메이션
    setTimeout(() => {
      playAnimation(enemyAvatarEl, "damage-animation");
      setHpBar(enemyHpFillEl, currentEnemy.hp, currentEnemy.maxHp, true);
    }, 150);
  } else if (skill.effect === "debuff") {
    if (skill.debuffType === "def") {
      currentEnemy.def = clamp(currentEnemy.def + skill.debuffValue, 0, 999);
      log(`${skill.name}! ${currentEnemy.name}의 방어력이 ${skill.debuffDuration}턴 동안 ${Math.abs(skill.debuffValue)} 감소!`, "hero");
      // 디버프 지속 시간 관리
      setTimeout(() => {
        currentEnemy.def = clamp(currentEnemy.def - skill.debuffValue, 0, 999);
        log(`${currentEnemy.name}의 방어력 디버프가 해제되었습니다.`, "system");
      }, skill.debuffDuration * 1000); // 간단하게 턴당 1초로 가정
    }
  }

  updateUI();

  if (currentEnemy.hp <= 0) {
    const expGained = currentEnemyIndex + 1 * 10; // 스테이지에 따라 경험치 증가
    hero.exp += expGained;
    log(`${currentEnemy.name} 을(를) 물리쳤다! 경험치 +${expGained}`, "system");

    // 레벨업 체크
    if (hero.exp >= hero.expToNext) {
      levelUp();
      return; // 레벨업 모달이 표시되므로 여기서 중단
    }

    currentEnemy = null;
    currentEnemyIndex++;

    if (currentEnemyIndex >= enemies.length) {
      gameClear();
    } else {
      log("▶ '다음 적' 버튼으로 다음 스테이지로!", "system");
      updateUI();
    }
    return;
  }

  // 적 턴
  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function useItem(item) {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;
  if (item.count <= 0) return;

  item.count--;

  if (item.effect === "buff") {
    if (item.buffType === "atk") {
      hero.minAtk += item.buffValue;
      hero.maxAtk += item.buffValue;
      log(`${item.name} 사용! 공격력이 ${item.buffDuration}턴 동안 +${item.buffValue} 증가!`, "hero");
      // 버프 지속 시간 관리
      setTimeout(() => {
        hero.minAtk -= item.buffValue;
        hero.maxAtk -= item.buffValue;
        log(`공격력 버프가 해제되었습니다.`, "system");
        updateUI();
      }, item.buffDuration * 1000);
    } else if (item.buffType === "def") {
      hero.def += item.buffValue;
      log(`${item.name} 사용! 방어력이 ${item.buffDuration}턴 동안 +${item.buffValue} 증가!`, "hero");
      // 버프 지속 시간 관리
      setTimeout(() => {
        hero.def -= item.buffValue;
        log(`방어력 버프가 해제되었습니다.`, "system");
        updateUI();
      }, item.buffDuration * 1000);
    }
  }

  updateUI();

  // 적 턴
  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

// ===== 레벨업 및 장비 시스템 =====
function levelUp() {
  hero.level++;
  hero.statPoints += 3; // 레벨업 시 3개의 스탯 포인트 획득
  hero.expToNext = Math.floor(hero.expToNext * 1.5); // 다음 레벨 요구 경험치 증가
  log(`레벨 ${hero.level}로 상승했습니다!`, "system");

  // 레벨업 모달 표시
  showLevelUpModal();
}

function allocateStat(type) {
  if (hero.statPoints <= 0) return;

  hero.statPoints--;

  if (type === "atk") {
    hero.minAtk += 2;
    hero.maxAtk += 2;
    log("공격력이 2 증가했습니다!", "system");
  } else if (type === "def") {
    hero.def += 1;
    log("방어력이 1 증가했습니다!", "system");
  } else if (type === "hp") {
    hero.maxHp += 10;
    hero.hp += 10; // 현재 HP도 증가
    log("최대 HP가 10 증가했습니다!", "system");
  }

  remainingPointsEl.textContent = hero.statPoints;
  updateLevelUpButtons();

  if (hero.statPoints <= 0) {
    // 모든 포인트를 사용했으면 모달 닫기
    setTimeout(() => {
      levelUpModal.style.display = "none";
      updateUI();
      // 게임 재개
      currentEnemy = null;
      currentEnemyIndex++;
      if (currentEnemyIndex >= enemies.length) {
        gameClear();
      } else {
        log("▶ '다음 적' 버튼으로 다음 스테이지로!", "system");
        updateUI();
      }
    }, 500);
  }
}

function equipItem(item) {
  if (item.type === "weapon") {
    hero.equipment.weapon = item.id;
    log(`${item.name}을(를) 착용했습니다!`, "system");
  } else if (item.type === "armor") {
    hero.equipment.armor = item.id;
    log(`${item.name}을(를) 착용했습니다!`, "system");
  }

  updateUI();
  showEquipModal(); // 모달 새로고침
}
