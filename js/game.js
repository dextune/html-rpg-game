// ===== 게임 로직 =====
function spawnEnemy() {
  const enemyData = enemies[currentEnemyIndex];
  currentEnemy = {
    ...enemyData,
    hp: enemyData.maxHp
  };
  isPlayerTurn = true;
  turn = 1; // 새 적이 나타나면 턴 수 초기화
  log(L[currentLang].log_enemy_spawn(currentEnemy.name), "system", "⚔️");
  updateUI();
}

function gameClear() {
  log(L[currentLang].log_game_clear, "system", "🎉");
  gameOver = true;
  updateUI();
}

function gameLose() {
  log(L[currentLang].log_game_over, "system", "💀");
  gameOver = true;
  updateUI();
}

// ===== 전투 로직 =====
function playerAttack() {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;

  playAnimation(heroAvatarEl, "attack-animation");

  const rawDmg = randInt(hero.minAtk, hero.maxAtk);
  const dmg = clamp(rawDmg - currentEnemy.def, 1, 999);
  currentEnemy.hp = clamp(currentEnemy.hp - dmg, 0, currentEnemy.maxHp);
  log(L[currentLang].log_player_attack(currentEnemy.name, dmg), "hero", "⚔️");

  setTimeout(() => {
    playAnimation(enemyAvatarEl, "damage-animation");
    setHpBar(enemyHpFillEl, currentEnemy.hp, currentEnemy.maxHp, true);
    updateUI();
  }, 150);

  if (currentEnemy.hp <= 0) {
    const expGained = currentEnemyIndex + 1 * 10;
    hero.exp += expGained;
    log(L[currentLang].log_enemy_defeated(currentEnemy.name, expGained), "system", "⭐");

    const defeatedEnemyData = enemies[currentEnemyIndex];
    if (defeatedEnemyData.drops && defeatedEnemyData.drops.length > 0) {
      defeatedEnemyData.drops.forEach(drop => {
        if (Math.random() < drop.chance) {
          const isConsumable = items.some(i => i.id === drop.id);
          const droppedItemInfo = isConsumable ? L[currentLang].items[drop.id] : L[currentLang].equipment[drop.id];
          if (!droppedItemInfo) return;

          if (isConsumable) {
            const item = items.find(i => i.id === drop.id);
            item.count++;
            log(L[currentLang].log_item_drop(currentEnemy.name, droppedItemInfo.name), "drop", "✨");
          } else {
            if (!hero.inventory.includes(drop.id)) {
              hero.inventory.push(drop.id);
              log(L[currentLang].log_item_drop(currentEnemy.name, droppedItemInfo.name), "drop", "✨");
            }
          }
        }
      });
    }

    if (hero.exp >= hero.expToNext) {
      levelUp();
      return;
    }

    currentEnemy = null;
    currentEnemyIndex++;

    if (currentEnemyIndex >= enemies.length) {
      gameClear();
    } else {
      log(L[currentLang].log_next_stage, "system", "▶️");
      updateUI();
    }
    return;
  }

  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function playerHeal() {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;
  if (hero.healCount <= 0) {
    log(L[currentLang].log_no_heal, "system", "⚠️");
    return;
  }

  hero.healCount--;
  const healed = clamp(hero.healAmount, 0, hero.maxHp - hero.hp);
  hero.hp = clamp(hero.hp + healed, 0, hero.maxHp);
  log(L[currentLang].log_player_heal(healed, hero.healCount), "hero", "❤️");

  playAnimation(heroAvatarEl, "heal-animation");
  updateUI();

  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function enemyAttack() {
  if (gameOver || !currentEnemy) return;

  const performAttack = (isSecondAttack = false) => {
    playAnimation(enemyAvatarEl, "attack-animation");
    const rawDmg = randInt(currentEnemy.minAtk, currentEnemy.maxAtk);
    const dmg = clamp(rawDmg - hero.def, 1, 999);
    hero.hp = clamp(hero.hp - dmg, 0, hero.maxHp);
    log(L[currentLang].log_enemy_attack(currentEnemy.name, dmg), "enemy", "⚔️");

    setTimeout(() => {
      playAnimation(heroAvatarEl, "damage-animation");
      const armorBonus = hero.equipment.armor ? equipment.find(e => e.id === hero.equipment.armor) : null;
      const totalHp = hero.maxHp + (armorBonus ? armorBonus.hpBonus : 0);
      setHpBar(heroHpFillEl, hero.hp, totalHp, true);
      updateUI();
    }, 150);

    if (hero.hp <= 0) {
      gameLose();
      return { dmg, isGameOver: true };
    }
    return { dmg, isGameOver: false };
  };

  let abilityTriggered = false;
  if (currentEnemy.abilities && currentEnemy.abilities.length > 0) {
    for (const ability of currentEnemy.abilities) {
      if (Math.random() < ability.chance) {
        abilityTriggered = true;
        if (ability.type === 'lifesteal') {
          const { dmg, isGameOver } = performAttack();
          if (!isGameOver) {
            const healed = Math.floor(dmg * ability.multiplier);
            currentEnemy.hp = clamp(currentEnemy.hp + healed, 0, currentEnemy.maxHp);
            log(L[currentLang].log_monster_lifesteal(currentEnemy.name, healed), "enemy", "🩸");
          }
        } else if (ability.type === 'double_attack') {
          log(L[currentLang].log_monster_double_attack(currentEnemy.name), "enemy", "⚡");
          const { isGameOver } = performAttack();
          if (!isGameOver) {
            setTimeout(() => performAttack(true), 400);
          }
        }
        break; 
      }
    }
  }

  if (!abilityTriggered) {
    performAttack();
  }

  setTimeout(() => {
    if (hero.hp > 0) {
      skills.forEach(skill => {
        if (skill.currentCooldown > 0) {
          skill.currentCooldown--;
        }
      });
      isPlayerTurn = true;
      turn++;
      updateUI();
    }
  }, abilityTriggered ? 800 : 400);
}

function useSkill(skill) {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;
  if (skill.currentCooldown > 0) return;

  skill.currentCooldown = skill.cooldown;
  const skillInfo = L[currentLang].skills[skill.id];

  if (skill.effect === "damage") {
    playAnimation(heroAvatarEl, "attack-animation");

    const rawDmg = randInt(hero.minAtk, hero.maxAtk) * skill.multiplier;
    const dmg = skill.ignoreDef ? rawDmg : clamp(rawDmg - currentEnemy.def, 1, 999);
    currentEnemy.hp = clamp(currentEnemy.hp - dmg, 0, currentEnemy.maxHp);
    log(L[currentLang].log_use_skill(skillInfo.name, currentEnemy.name, dmg), "hero", "💥");

    setTimeout(() => {
      playAnimation(enemyAvatarEl, "damage-animation");
      setHpBar(enemyHpFillEl, currentEnemy.hp, currentEnemy.maxHp, true);
    }, 150);
  } else if (skill.effect === "debuff") {
    if (skill.debuffType === "def") {
      currentEnemy.def = clamp(currentEnemy.def + skill.debuffValue, 0, 999);
      log(L[currentLang].log_use_debuff_skill(skillInfo.name, currentEnemy.name, skill.debuffDuration, skill.debuffValue), "hero", "🌀");
      setTimeout(() => {
        currentEnemy.def = clamp(currentEnemy.def - skill.debuffValue, 0, 999);
        log(L[currentLang].log_debuff_expired(currentEnemy.name), "system", "⚙️");
      }, skill.debuffDuration * 1000);
    }
  }

  updateUI();

  if (currentEnemy.hp <= 0) {
    const expGained = currentEnemyIndex + 1 * 10;
    hero.exp += expGained;
    log(L[currentLang].log_enemy_defeated(currentEnemy.name, expGained), "system", "⭐");

    const defeatedEnemyData = enemies[currentEnemyIndex];
    if (defeatedEnemyData.drops && defeatedEnemyData.drops.length > 0) {
      defeatedEnemyData.drops.forEach(drop => {
        if (Math.random() < drop.chance) {
          const isConsumable = items.some(i => i.id === drop.id);
          const droppedItemInfo = isConsumable ? L[currentLang].items[drop.id] : L[currentLang].equipment[drop.id];
          if (!droppedItemInfo) return;

          if (isConsumable) {
            const item = items.find(i => i.id === drop.id);
            item.count++;
            log(L[currentLang].log_item_drop(currentEnemy.name, droppedItemInfo.name), "drop", "✨");
          } else {
            if (!hero.inventory.includes(drop.id)) {
              hero.inventory.push(drop.id);
              log(L[currentLang].log_item_drop(currentEnemy.name, droppedItemInfo.name), "drop", "✨");
            }
          }
        }
      });
    }

    if (hero.exp >= hero.expToNext) {
      levelUp();
      return;
    }

    currentEnemy = null;
    currentEnemyIndex++;

    if (currentEnemyIndex >= enemies.length) {
      gameClear();
    } else {
      log(L[currentLang].log_next_stage, "system", "▶️");
      updateUI();
    }
    return;
  }

  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function useItem(item) {
  if (gameOver || !currentEnemy || !isPlayerTurn) return;
  if (item.count <= 0) return;

  item.count--;
  const lang = L[currentLang];
  const itemInfo = lang.items[item.id];
  const statName = item.buffType === 'atk' ? lang.hero_atk(0,0).split(':')[0] : lang.hero_def(0).split(':')[0];

  if (item.effect === "buff") {
    if (item.buffType === "atk") {
      hero.minAtk += item.buffValue;
      hero.maxAtk += item.buffValue;
    } else if (item.buffType === "def") {
      hero.def += item.buffValue;
    }
    log(lang.log_use_buff_item(itemInfo.name, item.buffDuration, item.buffValue, statName), "hero", "🛡️");
    
    setTimeout(() => {
      if (item.buffType === "atk") {
        hero.minAtk -= item.buffValue;
        hero.maxAtk -= item.buffValue;
      } else if (item.buffType === "def") {
        hero.def -= item.buffValue;
      }
      log(lang.log_buff_expired(statName), "system", "⚙️");
      updateUI();
    }, item.buffDuration * 1000);
  }

  updateUI();

  isPlayerTurn = false;
  updateUI();
  setTimeout(enemyAttack, 400);
}

function levelUp() {
  hero.level++;
  hero.statPoints += 3;
  hero.expToNext = Math.floor(hero.expToNext * 1.5);
  log(L[currentLang].log_levelup(hero.level), "system", "⬆️");
  showLevelUpModal();
}

function allocateStat(type) {
  if (hero.statPoints <= 0) return;

  hero.statPoints--;
  const lang = L[currentLang];
  let statName = '';

  if (type === "atk") {
    hero.minAtk += 2;
    hero.maxAtk += 2;
    statName = lang.hero_atk(0,0).split(':')[0];
    log(lang.log_stat_increase(statName, 2), "system", "⬆️");
  } else if (type === "def") {
    hero.def += 1;
    statName = lang.hero_def(0).split(':')[0];
    log(lang.log_stat_increase(statName, 1), "system", "⬆️");
  } else if (type === "hp") {
    hero.maxHp += 10;
    hero.hp += 10;
    log(lang.log_stat_increase("HP", 10), "system", "⬆️");
  }

  remainingPointsEl.textContent = hero.statPoints;
  updateLevelUpButtons();

  if (hero.statPoints <= 0) {
    setTimeout(() => {
      levelUpModal.style.display = "none";
      updateUI();
      currentEnemy = null;
      currentEnemyIndex++;
      if (currentEnemyIndex >= enemies.length) {
        gameClear();
      } else {
        log(lang.log_next_stage, "system", "▶️");
        updateUI();
      }
    }, 500);
  }
}

function equipItem(item) {
  const itemInfo = L[currentLang].equipment[item.id];
  if (item.type === "weapon") {
    hero.equipment.weapon = item.id;
  } else if (item.type === "armor") {
    hero.equipment.armor = item.id;
  }
  log(L[currentLang].log_equip_item(itemInfo.name), "system", "🎒");
  updateUI();
  showEquipModal();
}
