// ============================================================================
// FEATURES ADD-ON: MAIN MENU, LINE SNAP, BOSS DAMAGE TICKS, FASTER BAR,
// ROD REWARDS ONLY WHEN TALKING TO YORI ON THE ISLAND
// Loads AFTER main.js. Redefines updateFischMiniGame and startBoatVoyage.
// ============================================================================

const BOSS_HOLD_TIME = 1.5;        // seconds the line must stay in the bar per strike
const BOSS_TICK_DAMAGE = 150;      // damage per strike
const BOSS_HEAL_PER_SEC = 0.005;   // 0.5% of max HP per second while the line is off the boss

let arrivalPrepared = false;

// Snapshot of the original Yori dialogues so restarts can restore them
const ORIGINAL_YORI = JSON.parse(JSON.stringify(YORI_DIALOGUES));

// Dialogue used when Yori meets you on each new island (gives the rod)
const ARRIVAL_DIALOGUES = {
  2: {
    subtitle: "Arrived at Coconut Sandbar • Island 2",
    paragraphs: [
      "We made it to <strong>Coconut Sandbar</strong>! Just as I promised, here is my <strong>Iron Rod</strong>.",
      "Bottles here have a <strong>75% catch chance</strong>. If you reel in a boot or a fish, just cast again!"
    ],
    btnText: "Take Iron Rod & Start Quest 2"
  },
  3: {
    subtitle: "Arrived at Emerald Woods • Island 3",
    paragraphs: [
      "Welcome to <strong>Emerald Woods</strong>. The waters are deeper here and bottles have a <strong>65% catch chance</strong>.",
      "Take the <strong>Diamond Rod</strong>. Its control bar is reinforced for the forest currents!"
    ],
    btnText: "Take Diamond Rod & Start Quest 3"
  },
  4: {
    subtitle: "Arrived at Caldera Volcano • Island 4",
    paragraphs: [
      "This is the caldera. The <strong>Molten Kraken</strong> waits below the boiling water!",
      "Take the <strong>Trident Rod</strong>. Keep the line in the bar for <strong>1.5 seconds</strong> to strike, and dodge the magma rocks (<kbd>A</kbd>/<kbd>D</kbd>)."
    ],
    btnText: "Take Trident Rod & Face the Kraken"
  }
};

// ---------------------------------------------------------------------------
// 1. LINE SNAP SOUND
// ---------------------------------------------------------------------------
SoundEngine.prototype.playLineSnap = function () {
  if (this.muted) return;
  this.init();
  if (!this.ctx) return;
  const ctx = this.ctx;
  const now = ctx.currentTime;

  const len = Math.floor(ctx.sampleRate * 0.12);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);

  const src = ctx.createBufferSource();
  src.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1800;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.35, now);
  src.connect(hp);
  hp.connect(g);
  g.connect(ctx.destination);
  src.start(now);

  this.playTone(900, "square", 0.08, 0.12, 300);
  setTimeout(() => this.playTone(180, "sawtooth", 0.2, 0.15, 90), 70);
};

// ---------------------------------------------------------------------------
// 2. BOSS HUD HELPERS (health sync, red flash + shake on each strike)
// ---------------------------------------------------------------------------
function syncBossHud() {
  const f = gameState.fisch;
  f.progress = 1 - (f.bossHp / f.bossMaxHp);
  ui.bossHpText.textContent = `${Math.ceil(f.bossHp)} / ${f.bossMaxHp} HP`;
  ui.bossHpFill.style.width = `${(f.bossHp / f.bossMaxHp) * 100}%`;
}

function flashBossHit() {
  ui.bossHpFill.classList.add("boss-hp-hit");
  ui.bossHudBar.classList.remove("boss-hud-shake");
  void ui.bossHudBar.offsetWidth; // restart the shake animation
  ui.bossHudBar.classList.add("boss-hud-shake");
  clearTimeout(flashBossHit.timer);
  flashBossHit.timer = setTimeout(() => {
    ui.bossHpFill.classList.remove("boss-hp-hit");
    ui.bossHudBar.classList.remove("boss-hud-shake");
  }, 350);
}

function applyBossDamageTick() {
  const f = gameState.fisch;
  const w = window.innerWidth;
  const waterY = window.innerHeight * 0.67;

  f.bossHp = Math.max(0, f.bossHp - BOSS_TICK_DAMAGE);
  sfx.playBossHit();
  f.screenShake = 6;
  f.lightningBolts.push({ life: 0.22, seed: Math.random() });
  f.damagePopups.push({
    x: w * 0.76 + (Math.random() - 0.5) * 44,
    y: waterY - 82,
    text: `-${BOSS_TICK_DAMAGE} ⚡`,
    color: "#fef08a",
    alpha: 1,
    vy: -42
  });
  flashBossHit();
  syncBossHud();
}

// ---------------------------------------------------------------------------
// 3. LINE SNAP (non-boss fishing ends when progress reaches 0)
// ---------------------------------------------------------------------------
function snapFishingLine() {
  const f = gameState.fisch;
  f.active = false;
  f.holding = false;
  f.boulders = [];
  f.holdTimer = 0;
  gameState.player.castingState = "idle";

  ui.fischBarOverlay.classList.add("hidden");
  ui.bossHudBar.classList.add("hidden");
  ui.bossDodgeControls.classList.add("hidden");

  sfx.playLineSnap();
  showToast("💥 SNAP! The line broke. Cast again and keep the line in the bar!");
}

// ---------------------------------------------------------------------------
// 4. FISHING MINI-GAME (faster bar, line snap, boss ticks + healing)
// Replaces the function of the same name in main.js
// ---------------------------------------------------------------------------
function updateFischMiniGame(dt) {
  const f = gameState.fisch;
  const rod = gameState.equippedRod || RODS[1];
  const w = window.innerWidth;
  const waterY = window.innerHeight * 0.67;

  // Control bar: faster acceleration and less friction (was 155 accel / 0.88 friction, which felt sluggish)
  const accel = 420;
  const maxSpeed = 120;
  if (f.holding) {
    f.barVel += accel * dt;
    ui.controlArrowRight.classList.remove("opacity-30");
    ui.controlArrowRight.classList.add("text-slate-900");
    ui.controlArrowLeft.classList.add("opacity-30");
  } else {
    f.barVel -= accel * dt;
    ui.controlArrowLeft.classList.remove("opacity-30");
    ui.controlArrowLeft.classList.add("text-slate-900");
    ui.controlArrowRight.classList.add("opacity-30");
  }
  f.barVel = Math.max(-maxSpeed, Math.min(maxSpeed, f.barVel));
  f.barVel *= Math.pow(0.9, dt * 60);
  f.barPos += f.barVel * dt;

  const maxBarLeft = 100 - f.barWidth;
  if (f.barPos < 0) {
    f.barPos = 0;
    f.barVel = Math.max(0, -f.barVel * 0.35);
  } else if (f.barPos > maxBarLeft) {
    f.barPos = maxBarLeft;
    f.barVel = Math.min(0, -f.barVel * 0.35);
  }

  // Fish movement (unchanged)
  f.fishTimer -= dt;
  if (f.fishTimer <= 0) {
    f.fishTimer = (f.isBoss ? 0.55 : 0.75) + Math.random() * 0.85;
    f.fishTarget = 8 + Math.random() * 84;
  }
  const diff = f.fishTarget - f.fishPos;
  const moveStep = Math.sign(diff) * Math.min(Math.abs(diff), (rod.fishSpeed * 100) * dt);
  f.fishPos += moveStep + Math.sin(gameState.world.time * 5.2) * (f.isBoss ? 14 : 7) * dt;
  f.fishPos = Math.max(3, Math.min(97, f.fishPos));

  const inside = f.fishPos >= f.barPos && f.fishPos <= (f.barPos + f.barWidth);
  ui.fischControlBar.classList.toggle("bg-amber-200", inside);
  ui.fischControlBar.classList.toggle("bg-white", !inside);

  if (inside) {
    if (f.isBoss) {
      f.holdTimer = (f.holdTimer || 0) + dt;
      ui.fischProgressCaption.textContent =
        `Holding the line: ${Math.min(f.holdTimer, BOSS_HOLD_TIME).toFixed(1)}s / ${BOSS_HOLD_TIME}s`;
      if (f.holdTimer >= BOSS_HOLD_TIME) {
        f.holdTimer = 0;
        applyBossDamageTick();
        if (f.bossHp <= 0) {
          startBossDefeatSequence();
          return;
        }
      }
    } else {
      f.progress = Math.min(1, f.progress + rod.progressGain * dt);
      if (f.progress >= 1) {
        completeFischCatch();
        return;
      }
    }
  } else {
    if (f.isBoss) {
      f.holdTimer = 0;
      ui.fischProgressCaption.textContent = `Keep the line in the bar for ${BOSS_HOLD_TIME}s to strike!`;
      if (f.bossHp < f.bossMaxHp) {
        f.bossHp = Math.min(f.bossMaxHp, f.bossHp + f.bossMaxHp * BOSS_HEAL_PER_SEC * dt);
        syncBossHud();
      }
    } else {
      f.progress = Math.max(0, f.progress - rod.progressDrain * dt);
      if (f.progress <= 0) {
        snapFishingLine();
        return;
      }
    }
  }

  // Magma rocks (boss only, unchanged)
  if (f.isBoss) {
    if (f.invulnTimer > 0) f.invulnTimer -= dt;

    f.rockSpawnTimer -= dt;
    if (f.rockSpawnTimer <= 0) {
      f.rockSpawnTimer = 2.65;
      spawnMagmaBoulder();
    }

    const playerScreenX = gameState.player.x * w;
    const playerCenterY = waterY - 26;

    for (let i = f.boulders.length - 1; i >= 0; i--) {
      const b = f.boulders[i];
      b.x += b.vx * dt;
      b.vy += b.gravity * dt;
      b.y += b.vy * dt;
      b.rotation += b.rotSpeed * dt;

      const dist = Math.hypot(b.x - playerScreenX, b.y - playerCenterY);
      if (dist < b.radius + 18 && f.invulnTimer <= 0) {
        f.playerHp = Math.max(0, f.playerHp - 20);
        f.invulnTimer = 0.85;
        f.screenShake = 12;
        sfx.playTone(110, "sawtooth", 0.25, 0.25, 50);

        ui.playerHpText.textContent = `${f.playerHp} / ${f.playerMaxHp} HP`;
        ui.playerHpFill.style.width = `${(f.playerHp / f.playerMaxHp) * 100}%`;

        f.damagePopups.push({
          x: playerScreenX,
          y: playerCenterY - 26,
          text: "-20 HP! 🔥",
          color: "#fb7185",
          alpha: 1,
          vy: -48
        });

        f.boulders.splice(i, 1);

        if (f.playerHp <= 0) {
          triggerKrakenDeathScreen();
          return;
        }
        continue;
      }

      if (b.y >= b.groundY + 10) {
        gameState.world.ripples.push({ x: b.x, y: waterY + 6, radius: 5, alpha: 0.9 });
        f.boulders.splice(i, 1);
      }
    }
  }

  ui.fischControlBar.style.left = `${f.barPos}%`;
  ui.fischLine.style.left = `${f.fishPos}%`;
  ui.fischTargetIndicator.style.left = `${f.fishPos}%`;
  ui.fischProgressFill.style.width = `${Math.round(f.progress * 100)}%`;
}

// ---------------------------------------------------------------------------
// 5. ROD ONLY GIVEN WHEN YOU TALK TO YORI ON THE ARRIVAL ISLAND
// ---------------------------------------------------------------------------
// Replaces startBoatVoyage: the boat no longer hands out the rod on arrival.
function startBoatVoyage(toIslandId, rodId) {
  const bt = gameState.boatTrip;
  bt.active = true;
  bt.fromIsland = gameState.currentIsland;
  bt.toIsland = toIslandId;
  bt.progress = 0;
  bt.duration = 3.2;
  bt.pendingRodId = 0;             // stops the automatic grant in updateSimulation
  gameState.arrivalRodId = rodId;  // rod to hand out when you talk to Yori there
  arrivalPrepared = false;

  sfx.playTone(220, "triangle", 0.5, 0.16, 330);
  showToast(`⛵ Yori started the boat! Sailing to ${ISLANDS[toIslandId].name}...`);
  updateHud();
}

// Swaps in the arrival dialogue for the current quest key once the boat lands
function prepareArrival() {
  const rodId = gameState.arrivalRodId;
  const rod = RODS[rodId];
  const data = ARRIVAL_DIALOGUES[rodId];
  if (!rod || !data) return;

  YORI_DIALOGUES[rodId - 1] = {
    subtitle: data.subtitle,
    paragraphs: data.paragraphs,
    rewardRodId: rodId,
    btnText: data.btnText
  };
  arrivalPrepared = true;
  showToast(`⛵ Arrived! Talk to Yori to receive the ${rod.icon} ${rod.name}.`);
}

// Watches for the boat landing and keeps the quest text pointing at Yori
setInterval(() => {
  if (!gameState.arrivalRodId || gameState.boatTrip.active) return;
  if (!arrivalPrepared) prepareArrival();

  const island = ISLANDS[gameState.currentIsland] || ISLANDS[1];
  const rod = RODS[gameState.arrivalRodId];
  ui.questBadgeText.textContent = `ARRIVED • ${island.shortName.toUpperCase()}`;
  ui.questTitleText.textContent = "Talk to Yori to Receive Your Rod";
  ui.questDescText.textContent = `Yori is waiting on ${island.shortName}. Talk to him (E) to get the ${rod.name}.`;
}, 200);

// Clear the pending arrival once the rod has actually been accepted
ui.acceptQuestBtn.addEventListener("click", () => {
  const rod = gameState.equippedRod;
  if (gameState.arrivalRodId && rod && rod.id >= gameState.arrivalRodId) {
    gameState.arrivalRodId = 0;
    arrivalPrepared = false;
  }
});

// Restore the original Yori dialogues and clear arrival state on any restart
function cleanupAfterRestart() {
  Object.keys(ORIGINAL_YORI).forEach((k) => {
    YORI_DIALOGUES[k] = JSON.parse(JSON.stringify(ORIGINAL_YORI[k]));
  });
  gameState.arrivalRodId = 0;
  arrivalPrepared = false;
}
[ui.restartAfterDeathBtn, ui.restartGameVictoryBtn, ui.restartFromExitBtn].forEach((btn) =>
  btn.addEventListener("click", cleanupAfterRestart)
);

// ---------------------------------------------------------------------------
// 6. MAIN MENU (keyboard + mouse, Esc to open/close)
// ---------------------------------------------------------------------------
const mainMenu = document.getElementById("mainMenu");
const menuCredits = document.getElementById("menuCredits");
const menuButtons = Array.from(mainMenu.querySelectorAll(".rtr-menu-list .rtr-menu-btn"));
let menuIndex = 0;
let menuOpen = true;

function setMenuFocus(i) {
  menuIndex = (i + menuButtons.length) % menuButtons.length;
  menuButtons.forEach((b, k) => b.classList.toggle("active", k === menuIndex));
}

function openMainMenu() {
  menuOpen = true;
  menuCredits.classList.add("hidden");
  mainMenu.classList.remove("hidden");
  setMenuFocus(0);
}

function closeMainMenu() {
  menuOpen = false;
  mainMenu.classList.add("hidden");
}

function anyGameOverlayOpen() {
  const modals = [
    ui.yoriDialogueModal, ui.puzzleModal, ui.victoryDossierModal,
    ui.krakenDeathModal, ui.thankYouExitModal, ui.rodUnlockModal,
    ui.bottleModal, ui.bycatchModal
  ];
  return modals.some((m) => !m.classList.contains("hidden")) ||
    gameState.fisch.active || gameState.tapReel.active ||
    gameState.bottleOpen.active || gameState.boatTrip.active ||
    gameState.bossDefeat.active;
}

menuButtons.forEach((b, i) => b.addEventListener("mouseenter", () => setMenuFocus(i)));

document.getElementById("menuContinueBtn").addEventListener("click", closeMainMenu);

document.getElementById("menuNewGameBtn").addEventListener("click", () => {
  resetFullGame();
  cleanupAfterRestart();
  closeMainMenu();
});

document.getElementById("menuCreditsBtn").addEventListener("click", () => {
  menuCredits.classList.remove("hidden");
});

document.getElementById("menuCreditsBackBtn").addEventListener("click", () => {
  menuCredits.classList.add("hidden");
});

document.getElementById("menuQuitBtn").addEventListener("click", () => {
  showToast("🎣 Thanks for playing Reel To Remember!");
  setTimeout(() => window.close(), 600); // browsers may block this for normal tabs
});

// Capture phase: while the menu is open, the game never receives the keys
window.addEventListener("keydown", (e) => {
  if (!menuOpen) {
    if (e.code === "Escape" && !anyGameOverlayOpen()) {
      e.preventDefault();
      openMainMenu();
    }
    return;
  }

  e.stopImmediatePropagation();
  e.preventDefault();

  if (e.code === "ArrowUp" || e.code === "KeyW") {
    setMenuFocus(menuIndex - 1);
  } else if (e.code === "ArrowDown" || e.code === "KeyS") {
    setMenuFocus(menuIndex + 1);
  } else if (e.code === "Enter") {
    menuButtons[menuIndex].click();
  } else if (e.code === "Escape") {
    if (!menuCredits.classList.contains("hidden")) {
      menuCredits.classList.add("hidden");
    } else {
      closeMainMenu();
    }
  }
}, true);

setMenuFocus(0);