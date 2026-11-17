// ============================================================================
// MAIN GAME ENGINE: STATE, FISHING MECHANICS, PUZZLE BOARD & INPUT CONTROLS
// ============================================================================

const gameState = {
  currentIsland: 1,
  questStage: 0,
  equippedRod: null,
  obtainedRods: new Set(),
  unlockedPieces: new Set(),
  placedPieces: new Set(),
  selectedPieceId: null,
  stormCleared: false,

  boatTrip: {
    active: false,
    fromIsland: 1,
    toIsland: 2,
    progress: 0,
    duration: 3.2,
    pendingRodId: 2
  },

  player: {
    x: 0.36,
    targetX: 0.36,
    facing: 1,
    walkPhase: 0,
    castingState: "idle",
    bobberProgress: 0,
    bobberX: 0,
    bobberY: 0,
    biteTimer: 0
  },

  tapReel: {
    active: false,
    taps: 0,
    requiredTaps: 7,
    timeLeft: 5.5,
    maxTime: 5.5
  },

  fisch: {
    active: false,
    isBoss: false,
    barPos: 30,
    barVel: 0,
    barWidth: 26,
    fishPos: 50,
    fishTarget: 55,
    fishTimer: 0,
    progress: 0.28,
    holding: false,
    bossHp: 1000,
    bossMaxHp: 1000,
    playerHp: 100,
    playerMaxHp: 100,
    hitCooldown: 0,
    invulnTimer: 0,
    rockSpawnTimer: 1.6,
    boulders: [],
    damagePopups: [],
    screenShake: 0,
    lightningBolts: []
  },

  bossDefeat: {
    active: false,
    progress: 0,
    duration: 3.4
  },

  bottleOpen: {
    active: false,
    pieceId: 1,
    progress: 0
  },

  world: {
    time: 0,
    raindrops: [],
    embers: [],
    ripples: [],
    lightningAlpha: 0,
    nextLightning: 6
  },

  keys: {
    left: false,
    right: false
  }
};

const ui = {
  canvas: document.getElementById("gameCanvas"),
  questBadgeText: document.getElementById("questBadgeText"),
  puzzleCountPill: document.getElementById("puzzleCountPill"),
  islandNameBadge: document.getElementById("islandNameBadge"),
  bottleChanceBadge: document.getElementById("bottleChanceBadge"),
  questTitleText: document.getElementById("questTitleText"),
  questDescText: document.getElementById("questDescText"),
  equippedRodText: document.getElementById("equippedRodText"),
  questLockStrip: document.getElementById("questLockStrip"),
  openPuzzleHudBtn: document.getElementById("openPuzzleHudBtn"),
  hudPuzzleBadge: document.getElementById("hudPuzzleBadge"),
  openDossierQuickBtn: document.getElementById("openDossierQuickBtn"),
  muteToggleBtn: document.getElementById("muteToggleBtn"),

  bossHudBar: document.getElementById("bossHudBar"),
  bossHpText: document.getElementById("bossHpText"),
  bossHpFill: document.getElementById("bossHpFill"),
  playerHpText: document.getElementById("playerHpText"),
  playerHpFill: document.getElementById("playerHpFill"),

  toastBanner: document.getElementById("toastBanner"),
  toastText: document.getElementById("toastText"),

  tapReelOverlay: document.getElementById("tapReelOverlay"),
  tapReelTitle: document.getElementById("tapReelTitle"),
  tapReelFill: document.getElementById("tapReelFill"),
  tapReelBtn: document.getElementById("tapReelBtn"),
  tapReelTimeText: document.getElementById("tapReelTimeText"),
  tapReelCounter: document.getElementById("tapReelCounter"),

  fischBarOverlay: document.getElementById("fischBarOverlay"),
  fischHoldInstruction: document.getElementById("fischHoldInstruction"),
  fischControlBar: document.getElementById("fischControlBar"),
  controlArrowLeft: document.getElementById("controlArrowLeft"),
  controlArrowRight: document.getElementById("controlArrowRight"),
  fischTargetIndicator: document.getElementById("fischTargetIndicator"),
  fischTargetEmoji: document.getElementById("fischTargetEmoji"),
  fischLine: document.getElementById("fischLine"),
  fischProgressFill: document.getElementById("fischProgressFill"),
  fischProgressCaption: document.getElementById("fischProgressCaption"),
  bossDodgeControls: document.getElementById("bossDodgeControls"),
  dodgeLeftBtn: document.getElementById("dodgeLeftBtn"),
  holdBarTouchBtn: document.getElementById("holdBarTouchBtn"),
  dodgeRightBtn: document.getElementById("dodgeRightBtn"),

  bycatchModal: document.getElementById("bycatchModal"),
  bycatchEmoji: document.getElementById("bycatchEmoji"),
  bycatchTitle: document.getElementById("bycatchTitle"),
  bycatchDesc: document.getElementById("bycatchDesc"),
  closeBycatchBtn: document.getElementById("closeBycatchBtn"),

  krakenDeathModal: document.getElementById("krakenDeathModal"),
  restartAfterDeathBtn: document.getElementById("restartAfterDeathBtn"),

  thankYouExitModal: document.getElementById("thankYouExitModal"),
  backToDossierFromExitBtn: document.getElementById("backToDossierFromExitBtn"),
  restartFromExitBtn: document.getElementById("restartFromExitBtn"),

  talkYoriBtn: document.getElementById("talkYoriBtn"),
  talkYoriBtnLabel: document.getElementById("talkYoriBtnLabel"),
  castLineBtn: document.getElementById("castLineBtn"),
  castLineBtnLabel: document.getElementById("castLineBtnLabel"),
  openPuzzleBottomBtn: document.getElementById("openPuzzleBottomBtn"),

  yoriDialogueModal: document.getElementById("yoriDialogueModal"),
  yoriSubtitle: document.getElementById("yoriSubtitle"),
  yoriDialogueBody: document.getElementById("yoriDialogueBody"),
  yoriRewardBox: document.getElementById("yoriRewardBox"),
  yoriRewardIcon: document.getElementById("yoriRewardIcon"),
  yoriRewardTitle: document.getElementById("yoriRewardTitle"),
  yoriRewardDesc: document.getElementById("yoriRewardDesc"),
  yoriLockedQuestBox: document.getElementById("yoriLockedQuestBox"),
  yoriLockedTitle: document.getElementById("yoriLockedTitle"),
  yoriLockedDesc: document.getElementById("yoriLockedDesc"),
  closeYoriModalBtn: document.getElementById("closeYoriModalBtn"),
  acceptQuestBtn: document.getElementById("acceptQuestBtn"),

  rodUnlockModal: document.getElementById("rodUnlockModal"),
  rodSunburstBg: document.getElementById("rodSunburstBg"),
  rodUnlockBadge: document.getElementById("rodUnlockBadge"),
  rodUnlockTitle: document.getElementById("rodUnlockTitle"),
  rodUnlockSubtitle: document.getElementById("rodUnlockSubtitle"),
  rodShowcaseStage: document.getElementById("rodShowcaseStage"),
  rodSvgContainer: document.getElementById("rodSvgContainer"),
  rodUnlockBarStat: document.getElementById("rodUnlockBarStat"),
  rodUnlockTraitStat: document.getElementById("rodUnlockTraitStat"),
  startFishingWithNewRodBtn: document.getElementById("startFishingWithNewRodBtn"),

  bottleModal: document.getElementById("bottleModal"),
  bottleModalTitle: document.getElementById("bottleModalTitle"),
  bottleInteractiveStage: document.getElementById("bottleInteractiveStage"),
  foamBurstLayer: document.getElementById("foamBurstLayer"),
  corkSvgGroup: document.getElementById("corkSvgGroup"),
  corkProgressFill: document.getElementById("corkProgressFill"),
  corkPercentText: document.getElementById("corkPercentText"),
  pullCorkBtn: document.getElementById("pullCorkBtn"),

  puzzleModal: document.getElementById("puzzleModal"),
  puzzleModalProgress: document.getElementById("puzzleModalProgress"),
  closePuzzleModalBtn: document.getElementById("closePuzzleModalBtn"),
  unplacedPiecesTray: document.getElementById("unplacedPiecesTray"),
  puzzleNextStepBox: document.getElementById("puzzleNextStepBox"),
  puzzleNextStepText: document.getElementById("puzzleNextStepText"),
  puzzleActionContinueBtn: document.getElementById("puzzleActionContinueBtn"),

  victoryDossierModal: document.getElementById("victoryDossierModal"),
  victoryBadgeTag: document.getElementById("victoryBadgeTag"),
  victorySubMessage: document.getElementById("victorySubMessage"),
  copyEmailBtn: document.getElementById("copyEmailBtn"),
  copyPhoneBtn: document.getElementById("copyPhoneBtn"),
  printResumeBtn: document.getElementById("printResumeBtn"),
  closeDossierBtn: document.getElementById("closeDossierBtn"),
  restartGameVictoryBtn: document.getElementById("restartGameVictoryBtn"),
  keepFishingBtn: document.getElementById("keepFishingBtn"),
  exitThankYouBtn: document.getElementById("exitThankYouBtn")
};

const ctx = ui.canvas.getContext("2d");

let toastTimeout = null;
function showToast(msg) {
  ui.toastText.textContent = msg;
  ui.toastBanner.classList.remove("opacity-0", "-translate-y-2");
  ui.toastBanner.classList.add("opacity-100", "translate-y-0");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    ui.toastBanner.classList.remove("opacity-100", "translate-y-0");
    ui.toastBanner.classList.add("opacity-0", "-translate-y-2");
  }, 3400);
}

function updateHud() {
  const placedCount = gameState.placedPieces.size;
  const island = ISLANDS[gameState.currentIsland] || ISLANDS[1];

  ui.puzzleCountPill.textContent = `${placedCount}/4 Pieces`;
  ui.hudPuzzleBadge.textContent = `${placedCount}/4`;
  ui.puzzleModalProgress.textContent = `${placedCount}/4`;

  ui.islandNameBadge.textContent = `🏝️ ${island.name}`;
  ui.bottleChanceBadge.textContent =
    island.id === 4 ? "🌋 Boss Battle" : `🍾 Bottle: ${island.chanceLabel}`;

  if (gameState.equippedRod) {
    ui.equippedRodText.textContent = `${gameState.equippedRod.icon} ${gameState.equippedRod.name}`;
    ui.castLineBtn.classList.remove("hidden");
  } else {
    ui.equippedRodText.textContent = "None (Talk to Yori)";
    ui.castLineBtn.classList.add("hidden");
  }

  if (ui.questLockStrip) {
    ui.questLockStrip.querySelectorAll("[data-qstep]").forEach((el) => {
      const step = parseInt(el.dataset.qstep, 10);
      const rodIcon = RODS[step].icon;
      if (gameState.placedPieces.has(step)) {
        el.className = "px-1.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300";
        el.textContent = `✅ Q${step}`;
      } else if (gameState.questStage === step) {
        el.className = "px-1.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/60 text-amber-200";
        el.textContent = `${rodIcon} Q${step}`;
      } else {
        el.className = "px-1.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-500";
        el.textContent = `🔒 Q${step}`;
      }
    });
  }

  if (gameState.boatTrip.active) {
    ui.questBadgeText.textContent = `SAILING TO ISLAND ${gameState.boatTrip.toIsland}`;
    ui.questTitleText.textContent = `Yori is Driving the Boat...`;
    ui.questDescText.textContent = `Crossing the ocean to ${ISLANDS[gameState.boatTrip.toIsland].name}!`;
    ui.castLineBtn.classList.add("hidden");
    return;
  }

  if (gameState.questStage === 0) {
    ui.questBadgeText.textContent = "QUEST 0 / 4 • ISLAND 1 TUTORIAL";
    ui.questTitleText.textContent = "Talk to Yori on the Shore";
    ui.questDescText.textContent = "Speak with Yori to get your first rod and start recovering your memories.";
    ui.talkYoriBtnLabel.textContent = "Talk to Yori (E)";
  } else if (gameState.questStage === 1) {
    ui.questBadgeText.textContent = "QUEST 1 / 4 • IDENTITY & OBJECTIVE";
    if (gameState.placedPieces.has(1)) {
      ui.questTitleText.textContent = "Quest 1 Done! Talk to Yori for Boat Ride";
      ui.questDescText.textContent = "Yori will drive his boat to Sand Island (Island 2) & give you the Iron Rod.";
      ui.talkYoriBtnLabel.textContent = "Sail with Yori (E)";
    } else {
      ui.questTitleText.textContent = "Fish Up Bottle #1 (100% Drop)";
      ui.questDescText.textContent = "Cast off the dock, tap REEL!, keep the line in the bar, and assemble Piece I.";
      ui.talkYoriBtnLabel.textContent = "Talk to Yori (E)";
    }
  } else if (gameState.questStage === 2) {
    ui.questBadgeText.textContent = "QUEST 2 / 4 • EDUCATION (SAND ISLAND)";
    if (gameState.placedPieces.has(2)) {
      ui.questTitleText.textContent = "Quest 2 Done! Talk to Yori for Boat Ride";
      ui.questDescText.textContent = "Yori will drive his boat to Forest Island (Island 3) & give you the Diamond Rod.";
      ui.talkYoriBtnLabel.textContent = "Sail with Yori (E)";
    } else {
      ui.questTitleText.textContent = "Fish Up Bottle #2 (75% Drop Rate)";
      ui.questDescText.textContent = "Bottles have a 75% chance on Coconut Sandbar. Catch Bottle #2 & assemble Piece II.";
      ui.talkYoriBtnLabel.textContent = "Talk to Yori (E)";
    }
  } else if (gameState.questStage === 3) {
    ui.questBadgeText.textContent = "QUEST 3 / 4 • EXPERIENCE (FOREST ISLAND)";
    if (gameState.placedPieces.has(3)) {
      ui.questTitleText.textContent = "Quest 3 Done! Sail to Volcano Island";
      ui.questDescText.textContent = "Yori will drive his boat to Volcano Island (Island 4) & give you the Trident Rod!";
      ui.talkYoriBtnLabel.textContent = "Sail with Yori (E)";
    } else {
      ui.questTitleText.textContent = "Fish Up Bottle #3 (65% Drop Rate)";
      ui.questDescText.textContent = "Bottles have a 65% chance at Emerald Woods. Catch Bottle #3 & assemble Piece III.";
      ui.talkYoriBtnLabel.textContent = "Talk to Yori (E)";
    }
  } else if (gameState.questStage === 4) {
    if (placedCount === 4) {
      ui.questBadgeText.textContent = "ALL 4 QUESTS COMPLETE • MEMORIES RESTORED";
      ui.questTitleText.textContent = "You Remember Yourself, Yul!";
      ui.questDescText.textContent = "Your complete resume is unlocked! Open the Resume Dossier to view, restart, or finish.";
      ui.talkYoriBtnLabel.textContent = "Talk to Yori (E)";
      ui.castLineBtnLabel.textContent = "Free Fish (SPACE)";
    } else {
      ui.questBadgeText.textContent = "FINAL BOSS • MOLTEN KRAKEN (VOLCANO)";
      ui.questTitleText.textContent = "Defeat the Molten Kraken & Dodge Rocks!";
      ui.questDescText.textContent = "Keep the line in the bar to damage the boss & dodge magma rocks (-20 HP each)!";
      ui.castLineBtnLabel.textContent = "Challenge Boss (SPACE)";
    }
  }
}

let typewriterTimer = null;
let currentFullParagraphs = [];

function finishTypewriterImmediately() {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
  ui.yoriDialogueBody.innerHTML = currentFullParagraphs.map(p => `<p>${p}</p>`).join("");
}

function openYoriDialogue() {
  if (gameState.boatTrip.active || gameState.bossDefeat.active) return;
  sfx.init();
  sfx.playTone(420, "sine", 0.1, 0.1);

  const isStageCompleted =
    gameState.questStage === 0 ||
    (gameState.questStage >= 1 && gameState.questStage <= 4 && gameState.placedPieces.has(gameState.questStage));

  if (!isStageCompleted) {
    const reminder = YORI_ACTIVE_REMINDERS[gameState.questStage];
    ui.yoriSubtitle.textContent = reminder.subtitle;
    currentFullParagraphs = reminder.paragraphs;

    if (typewriterTimer) clearInterval(typewriterTimer);
    ui.yoriDialogueBody.innerHTML = "";
    const joinedPlain = reminder.paragraphs.map(p => p.replace(/<[^>]+>/g, "")).join("\n\n");
    let charIdx = 0;

    typewriterTimer = setInterval(() => {
      charIdx += 4;
      if (charIdx >= joinedPlain.length) {
        finishTypewriterImmediately();
      } else {
        const partial = joinedPlain.slice(0, charIdx);
        ui.yoriDialogueBody.innerHTML = partial
          .split("\n\n")
          .map(seg => `<p>${seg}</p>`)
          .join("");
      }
    }, 18);

    ui.yoriRewardBox.classList.add("hidden");
    ui.yoriLockedQuestBox.classList.remove("hidden");
    ui.yoriLockedTitle.textContent = reminder.lockedTitle;
    ui.yoriLockedDesc.textContent = reminder.lockedDesc;
    ui.acceptQuestBtn.textContent = reminder.btnText;
    ui.acceptQuestBtn.dataset.grantRod = "";
    ui.acceptQuestBtn.dataset.sailTo = "";

    ui.yoriDialogueModal.classList.remove("hidden");
    ui.yoriDialogueModal.classList.add("flex");
    return;
  }

  ui.yoriLockedQuestBox.classList.add("hidden");
  const dialogueKey = gameState.questStage;
  const data = YORI_DIALOGUES[dialogueKey] || YORI_DIALOGUES[0];
  ui.yoriSubtitle.textContent = data.subtitle;
  currentFullParagraphs = data.paragraphs;

  if (typewriterTimer) clearInterval(typewriterTimer);
  ui.yoriDialogueBody.innerHTML = "";
  const joinedPlain = data.paragraphs.map(p => p.replace(/<[^>]+>/g, "")).join("\n\n");
  let charIdx = 0;

  typewriterTimer = setInterval(() => {
    charIdx += 4;
    if (charIdx >= joinedPlain.length) {
      finishTypewriterImmediately();
    } else {
      const partial = joinedPlain.slice(0, charIdx);
      ui.yoriDialogueBody.innerHTML = partial
        .split("\n\n")
        .map(seg => `<p>${seg}</p>`)
        .join("");
    }
  }, 18);

  if (data.rewardRodId && (!gameState.equippedRod || gameState.equippedRod.id < data.rewardRodId)) {
    const rod = RODS[data.rewardRodId];
    ui.yoriRewardBox.classList.remove("hidden");
    ui.yoriRewardIcon.textContent = rod.icon;
    ui.yoriRewardTitle.textContent = rod.name;
    ui.yoriRewardDesc.textContent = `Control Bar Width: ${rod.barWidthPct}% • ${rod.bonusText}`;
    ui.acceptQuestBtn.textContent = data.btnText;
    ui.acceptQuestBtn.dataset.grantRod = rod.id;
    ui.acceptQuestBtn.dataset.sailTo = data.sailToIsland || "";
  } else {
    ui.yoriRewardBox.classList.add("hidden");
    ui.acceptQuestBtn.textContent = dialogueKey === 4 ? "View Complete Interviewer Resume" : "Got it!";
    ui.acceptQuestBtn.dataset.grantRod = "";
    ui.acceptQuestBtn.dataset.sailTo = "";
  }

  ui.yoriDialogueModal.classList.remove("hidden");
  ui.yoriDialogueModal.classList.add("flex");
}

ui.yoriDialogueBody.addEventListener("click", finishTypewriterImmediately);

function closeYoriDialogue() {
  if (typewriterTimer) clearInterval(typewriterTimer);
  ui.yoriDialogueModal.classList.add("hidden");
  ui.yoriDialogueModal.classList.remove("flex");
}

function startBoatVoyage(toIslandId, rodId) {
  gameState.boatTrip.active = true;
  gameState.boatTrip.fromIsland = gameState.currentIsland;
  gameState.boatTrip.toIsland = toIslandId;
  gameState.boatTrip.progress = 0;
  gameState.boatTrip.duration = 3.2;
  gameState.boatTrip.pendingRodId = rodId;

  sfx.playTone(220, "triangle", 0.5, 0.16, 330);
  showToast(`⛵ Yori started the boat! Sailing to ${ISLANDS[toIslandId].name}...`);
  updateHud();
}

function grantAndShowcaseNewRod(rodId) {
  const rod = RODS[rodId];
  if (!rod) return;

  gameState.equippedRod = rod;
  gameState.questStage = rodId;
  updateHud();

  if (gameState.obtainedRods.has(rodId)) {
    return;
  }
  gameState.obtainedRods.add(rodId);

  ui.rodUnlockBadge.textContent = rod.badgeText;
  ui.rodUnlockTitle.textContent = rod.name;
  ui.rodUnlockSubtitle.textContent = rod.subtitle;
  ui.rodUnlockBarStat.textContent = `${rod.barWidthPct}% Width`;
  ui.rodUnlockTraitStat.textContent = rod.traitLabel;

  ui.rodSunburstBg.style.background = `repeating-conic-gradient(from 0deg, ${rod.rayColor} 0deg 12deg, transparent 12deg 24deg)`;
  ui.rodSvgContainer.style.filter = `drop-shadow(0 0 26px ${rod.glowColor})`;
  ui.rodSvgContainer.innerHTML = getRodShowcaseSvg(rodId);

  ui.rodShowcaseStage.classList.remove("animate-rod-pop");
  void ui.rodShowcaseStage.offsetWidth;
  ui.rodShowcaseStage.classList.add("animate-rod-pop");

  sfx.playVictoryFanfare();
  ui.rodUnlockModal.classList.remove("hidden");
  ui.rodUnlockModal.classList.add("flex");
}

ui.startFishingWithNewRodBtn.addEventListener("click", () => {
  ui.rodUnlockModal.classList.add("hidden");
  ui.rodUnlockModal.classList.remove("flex");
  const rod = gameState.equippedRod;
  if (rod) {
    showToast(`Equipped ${rod.icon} ${rod.name}! Casting your line...`);
  }
  startCasting();
});

ui.acceptQuestBtn.addEventListener("click", () => {
  const grantId = parseInt(ui.acceptQuestBtn.dataset.grantRod || "0", 10);
  const sailTo = parseInt(ui.acceptQuestBtn.dataset.sailTo || "0", 10);
  closeYoriDialogue();

  if (sailTo && sailTo !== gameState.currentIsland) {
    startBoatVoyage(sailTo, grantId);
    return;
  }

  if (grantId && RODS[grantId]) {
    grantAndShowcaseNewRod(grantId);
  } else if (gameState.placedPieces.size === 4) {
    openVictoryDossier(true);
  }
});

ui.closeYoriModalBtn.addEventListener("click", closeYoriDialogue);

function startCasting() {
  if (gameState.boatTrip.active || gameState.bossDefeat.active) return;
  sfx.init();
  if (!gameState.equippedRod) {
    showToast("Talk to Yori first to get a fishing rod!");
    openYoriDialogue();
    return;
  }

  if (gameState.questStage >= 1 && gameState.questStage <= 4) {
    const s = gameState.questStage;
    if (gameState.unlockedPieces.has(s) && !gameState.placedPieces.has(s)) {
      showToast(`📜 Place Piece #${s} onto the Puzzle Board first to complete Quest ${s}!`);
      openPuzzleModal(s);
      return;
    }
    if (gameState.placedPieces.has(s) && s < 4) {
      showToast(`✅ Quest ${s} complete! Talk to Yori so he can boat you to Island ${s + 1}.`);
      openYoriDialogue();
      return;
    }
  }

  if (gameState.player.castingState !== "idle" || gameState.fisch.active || gameState.tapReel.active || gameState.bottleOpen.active) {
    return;
  }

  gameState.player.targetX = 0.45;
  gameState.player.facing = 1;
  gameState.player.castingState = "casting";
  gameState.player.bobberProgress = 0;
  sfx.playTone(320, "sine", 0.18, 0.12, 540);
}

function triggerBiteAlert() {
  gameState.player.castingState = "bite";
  sfx.playBiteAlert();

  const isBossStage = gameState.questStage === 4 && !gameState.placedPieces.has(4);
  gameState.tapReel.active = true;
  gameState.tapReel.taps = 0;
  gameState.tapReel.requiredTaps = isBossStage ? 9 : 6;
  gameState.tapReel.timeLeft = 5.5;
  gameState.tapReel.maxTime = 5.5;

  ui.tapReelTitle.textContent = isBossStage
    ? "🌋 THE MOLTEN KRAKEN SEIZED YOUR TRIDENT LINE!"
    : "❗ SOMETHING BIT YOUR HOOK!";
  ui.tapReelFill.style.width = "8%";
  ui.tapReelCounter.textContent = `0 / ${gameState.tapReel.requiredTaps} TAPS`;
  ui.tapReelTimeText.textContent = "5.5s";
  ui.tapReelOverlay.classList.remove("hidden");
}

function handleTapReelAction() {
  if (!gameState.tapReel.active) return;
  gameState.tapReel.taps += 1;
  sfx.playTapTick(gameState.tapReel.taps);

  const pct = Math.min(100, Math.round((gameState.tapReel.taps / gameState.tapReel.requiredTaps) * 100));
  ui.tapReelFill.style.width = `${pct}%`;
  ui.tapReelCounter.textContent = `${gameState.tapReel.taps} / ${gameState.tapReel.requiredTaps} TAPS`;

  if (gameState.tapReel.taps >= gameState.tapReel.requiredTaps) {
    gameState.tapReel.active = false;
    ui.tapReelOverlay.classList.add("hidden");
    startFischControlMiniGame();
  }
}

ui.tapReelBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  handleTapReelAction();
});

function startFischControlMiniGame() {
  const rod = gameState.equippedRod || RODS[1];
  const isBoss = gameState.questStage === 4 && !gameState.placedPieces.has(4);

  gameState.player.castingState = "reeling";
  gameState.fisch.active = true;
  gameState.fisch.isBoss = isBoss;
  gameState.fisch.barWidth = rod.barWidthPct;
  gameState.fisch.barPos = 50 - rod.barWidthPct / 2;
  gameState.fisch.barVel = 0;
  gameState.fisch.fishPos = 50;
  gameState.fisch.fishTarget = 62;
  gameState.fisch.fishTimer = 0.7;
  gameState.fisch.progress = isBoss ? 0.12 : 0.28;
  gameState.fisch.holding = false;
  gameState.fisch.bossHp = 1000;
  gameState.fisch.bossMaxHp = 1000;
  gameState.fisch.playerHp = 100;
  gameState.fisch.playerMaxHp = 100;
  gameState.fisch.hitCooldown = 0;
  gameState.fisch.invulnTimer = 0;
  gameState.fisch.rockSpawnTimer = 1.5;
  gameState.fisch.boulders = [];
  gameState.fisch.damagePopups = [];
  gameState.fisch.lightningBolts = [];

  gameState.player.x = 0.34;
  gameState.player.targetX = 0.34;

  ui.fischControlBar.style.width = `${rod.barWidthPct}%`;
  ui.fischControlBar.style.left = `${gameState.fisch.barPos}%`;
  ui.fischLine.style.left = "50%";
  ui.fischTargetIndicator.style.left = "50%";
  ui.fischProgressFill.style.width = `${Math.round(gameState.fisch.progress * 100)}%`;

  if (isBoss) {
    ui.fischTargetEmoji.textContent = "🐙";
    ui.fischHoldInstruction.textContent = "Hold/Release Bar + Move (A/D or ◀/▶) to Dodge Rocks!";
    ui.fischProgressCaption.textContent = "Line in bar = Trident Strike! Avoid magma rocks (-20 HP)!";
    ui.bossHudBar.classList.remove("hidden");
    ui.bossDodgeControls.classList.remove("hidden");
    ui.bossHpText.textContent = "1000 / 1000 HP";
    ui.bossHpFill.style.width = "100%";
    ui.playerHpText.textContent = "100 / 100 HP";
    ui.playerHpFill.style.width = "100%";
  } else {
    ui.fischTargetEmoji.textContent = "🍾";
    ui.fischHoldInstruction.textContent = "Click & Hold Anywhere!";
    ui.fischProgressCaption.textContent = "Keep the line inside the white bar!";
    ui.bossHudBar.classList.add("hidden");
    ui.bossDodgeControls.classList.add("hidden");
  }

  ui.fischBarOverlay.classList.remove("hidden");
}

function spawnMagmaBoulder() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const waterY = h * 0.67;

  const targetScreenX = Math.max(w * 0.16, Math.min(w * 0.48, gameState.player.x * w + (Math.random() - 0.5) * 35));
  const startX = w * 0.76;
  const startY = waterY - 88;
  const groundY = waterY - 14;

  const flightTime = 2.25;
  const gravity = 460;
  const vx = (targetScreenX - startX) / flightTime;
  const vy = (groundY - startY - 0.5 * gravity * flightTime * flightTime) / flightTime;

  gameState.fisch.boulders.push({
    x: startX,
    y: startY,
    vx,
    vy,
    gravity,
    radius: 17,
    targetX: targetScreenX,
    groundY,
    rotation: 0,
    rotSpeed: (Math.random() > 0.5 ? 1 : -1) * 3.5
  });
}

function triggerKrakenDeathScreen() {
  gameState.fisch.active = false;
  gameState.fisch.holding = false;
  gameState.fisch.boulders = [];
  gameState.player.castingState = "idle";

  ui.fischBarOverlay.classList.add("hidden");
  ui.bossHudBar.classList.add("hidden");
  ui.bossDodgeControls.classList.add("hidden");

  sfx.playTone(140, "sawtooth", 0.55, 0.25, 42);
  ui.krakenDeathModal.classList.remove("hidden");
  ui.krakenDeathModal.classList.add("flex");
}

function updateFischMiniGame(dt) {
  const f = gameState.fisch;
  const rod = gameState.equippedRod || RODS[1];
  const w = window.innerWidth;
  const h = window.innerHeight;
  const waterY = h * 0.67;

  const accel = 155;
  const maxSpeed = 88;
  if (f.holding) {
    f.barVel += accel * dt;
    ui.controlArrowRight.classList.remove("opacity-30");
    ui.controlArrowRight.classList.add("text-slate-900");
    ui.controlArrowLeft.classList.add("opacity-30");
  } else {
    f.barVel -= accel * 0.92 * dt;
    ui.controlArrowLeft.classList.remove("opacity-30");
    ui.controlArrowLeft.classList.add("text-slate-900");
    ui.controlArrowRight.classList.add("opacity-30");
  }

  f.barVel = Math.max(-maxSpeed, Math.min(maxSpeed, f.barVel));
  f.barVel *= Math.pow(0.88, dt * 60);
  f.barPos += f.barVel * dt;

  const maxBarLeft = 100 - f.barWidth;
  if (f.barPos < 0) {
    f.barPos = 0;
    f.barVel = Math.max(0, -f.barVel * 0.35);
  } else if (f.barPos > maxBarLeft) {
    f.barPos = maxBarLeft;
    f.barVel = Math.min(0, -f.barVel * 0.35);
  }

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

  if (inside) {
    ui.fischControlBar.classList.remove("bg-white");
    ui.fischControlBar.classList.add("bg-amber-200");

    if (f.isBoss) {
      const dps = 165;
      f.bossHp = Math.max(0, f.bossHp - dps * dt);
      f.progress = 1 - (f.bossHp / f.bossMaxHp);
      ui.bossHpText.textContent = `${Math.ceil(f.bossHp)} / ${f.bossMaxHp} HP`;
      ui.bossHpFill.style.width = `${(f.bossHp / f.bossMaxHp) * 100}%`;

      f.hitCooldown -= dt;
      if (f.hitCooldown <= 0) {
        f.hitCooldown = 0.34;
        sfx.playBossHit();
        f.screenShake = 5;
        f.lightningBolts.push({ life: 0.22, seed: Math.random() });
        f.damagePopups.push({
          x: w * 0.76 + (Math.random() - 0.5) * 44,
          y: waterY - 82,
          text: "-55 ⚡",
          color: "#fef08a",
          alpha: 1,
          vy: -42
        });
      }

      if (f.bossHp <= 0) {
        startBossDefeatSequence();
        return;
      }
    } else {
      f.progress = Math.min(1, f.progress + rod.progressGain * dt);
      if (f.progress >= 1) {
        completeFischCatch();
        return;
      }
    }
  } else {
    ui.fischControlBar.classList.add("bg-white");
    ui.fischControlBar.classList.remove("bg-amber-200");
    if (!f.isBoss) {
      f.progress = Math.max(0, f.progress - rod.progressDrain * dt);
    }
  }

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
        gameState.world.ripples.push({
          x: b.x,
          y: waterY + 6,
          radius: 5,
          alpha: 0.9
        });
        f.boulders.splice(i, 1);
      }
    }
  }

  ui.fischControlBar.style.left = `${f.barPos}%`;
  ui.fischLine.style.left = `${f.fishPos}%`;
  ui.fischTargetIndicator.style.left = `${f.fishPos}%`;
  ui.fischProgressFill.style.width = `${Math.round(f.progress * 100)}%`;
}

function startBossDefeatSequence() {
  gameState.fisch.active = false;
  gameState.fisch.holding = false;
  gameState.fisch.boulders = [];
  gameState.fisch.screenShake = 20;
  gameState.player.castingState = "idle";

  gameState.bossDefeat.active = true;
  gameState.bossDefeat.progress = 0;
  gameState.bossDefeat.duration = 3.4;

  ui.fischBarOverlay.classList.add("hidden");
  ui.bossHudBar.classList.add("hidden");
  ui.bossDodgeControls.classList.add("hidden");

  sfx.playTone(135, "sawtooth", 0.85, 0.28, 36);
  setTimeout(() => sfx.playTone(90, "triangle", 1.0, 0.24, 30), 280);
  showToast("🌋 THE MOLTEN KRAKEN IS DEFEATED! IT'S SINKING INTO THE ABYSS!");
}

function openBycatchModal(item, islandChanceLabel) {
  ui.bycatchEmoji.textContent = item.emoji;
  ui.bycatchTitle.textContent = item.name;
  ui.bycatchDesc.textContent = `${item.desc} (Bottle Drop Chance here: ${islandChanceLabel})`;
  ui.bycatchModal.classList.remove("hidden");
  ui.bycatchModal.classList.add("flex");
}

function closeBycatchModal() {
  ui.bycatchModal.classList.add("hidden");
  ui.bycatchModal.classList.remove("flex");
}

ui.closeBycatchBtn.addEventListener("click", () => {
  closeBycatchModal();
  startCasting();
});

function completeFischCatch() {
  gameState.fisch.active = false;
  gameState.fisch.holding = false;
  gameState.fisch.boulders = [];
  gameState.player.castingState = "idle";
  ui.fischBarOverlay.classList.add("hidden");
  ui.bossHudBar.classList.add("hidden");
  ui.bossDodgeControls.classList.add("hidden");

  const currentIsland = ISLANDS[gameState.currentIsland] || ISLANDS[1];

  let targetPiece = gameState.questStage;
  if (targetPiece < 1 || targetPiece > 4 || gameState.unlockedPieces.has(targetPiece)) {
    for (let i = 1; i <= 4; i++) {
      if (!gameState.unlockedPieces.has(i)) {
        targetPiece = i;
        break;
      }
    }
  }

  if (gameState.unlockedPieces.size >= 4) {
    sfx.playSplash();
    showToast("🐟 You caught a shimmering Deep-Sea Moonfish! All 4 memories are already restored.");
    return;
  }

  const roll = Math.random();
  if (roll > currentIsland.bottleChance) {
    const bycatch = BYCATCH_ITEMS[Math.floor(Math.random() * BYCATCH_ITEMS.length)];
    sfx.playTone(230, "triangle", 0.25, 0.16, 150);
    openBycatchModal(bycatch, currentIsland.chanceLabel);
    return;
  }

  sfx.playPuzzleSnap();
  openBottleMiniGame(targetPiece);
}

function openBottleMiniGame(pieceId) {
  gameState.bottleOpen.active = true;
  gameState.bottleOpen.pieceId = pieceId;
  gameState.bottleOpen.progress = 0;

  ui.bottleModalTitle.textContent = `Message in a Bottle #${pieceId}`;
  ui.corkSvgGroup.setAttribute("transform", "translate(0, 0)");
  ui.corkProgressFill.style.width = "0%";
  ui.corkPercentText.textContent = "Cork Loosened: 0%";

  ui.bottleModal.classList.remove("hidden");
  ui.bottleModal.classList.add("flex");
}

function spawnSeaFoamParticles() {
  if (!ui.foamBurstLayer) return;
  ui.foamBurstLayer.innerHTML = "";
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 36 + Math.random() * 34;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 22;
    dot.className = "absolute left-1/2 top-1/3 w-2.5 h-2.5 rounded-full bg-sky-200 shadow-[0_0_8px_#bae6fd]";
    dot.style.transition = "transform 0.45s ease-out, opacity 0.45s ease-out";
    ui.foamBurstLayer.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = `translate(${tx}px, ${ty}px) scale(0.35)`;
      dot.style.opacity = "0";
    });
  }
}

function pullBottleCorkStep() {
  if (!gameState.bottleOpen.active) return;
  gameState.bottleOpen.progress = Math.min(100, gameState.bottleOpen.progress + 22);
  const p = gameState.bottleOpen.progress;
  sfx.playTapTick(Math.floor(p / 20));

  const liftY = -(p / 100) * 32;
  const tilt = (p % 44 === 0 ? 5 : -5) * (p < 100 ? 1 : 0);
  ui.corkSvgGroup.setAttribute("transform", `translate(0, ${liftY}) rotate(${tilt} 75 35)`);
  ui.corkProgressFill.style.width = `${p}%`;
  ui.corkPercentText.textContent = `Cork Loosened: ${p}%`;

  if (p >= 100) {
    gameState.bottleOpen.active = false;
    sfx.playCorkPop();
    spawnSeaFoamParticles();
    const unlockedId = gameState.bottleOpen.pieceId;
    gameState.unlockedPieces.add(unlockedId);
    gameState.selectedPieceId = unlockedId;

    setTimeout(() => {
      ui.bottleModal.classList.add("hidden");
      ui.bottleModal.classList.remove("flex");
      showToast(`📜 Bottle #${unlockedId} opened! Snap Fragment ${PUZZLE_PIECES[unlockedId].roman} into the puzzle.`);
      openPuzzleModal(unlockedId);
    }, 420);
  }
}

ui.pullCorkBtn.addEventListener("click", pullBottleCorkStep);
ui.bottleInteractiveStage.addEventListener("click", pullBottleCorkStep);

function renderPuzzleBoard() {
  document.querySelectorAll(".puzzle-slot").forEach((slotEl) => {
    const slotId = parseInt(slotEl.dataset.slot, 10);
    const placeholder = slotEl.querySelector(".slot-placeholder");
    const content = slotEl.querySelector(".slot-content");

    if (gameState.placedPieces.has(slotId)) {
      slotEl.classList.remove("parchment-slot-empty");
      slotEl.classList.add("parchment-card");
      placeholder.classList.add("hidden");
      content.classList.remove("hidden");
      content.innerHTML = PUZZLE_PIECES[slotId].html;
    } else {
      slotEl.classList.add("parchment-slot-empty");
      slotEl.classList.remove("parchment-card");
      placeholder.classList.remove("hidden");
      content.classList.add("hidden");
      content.innerHTML = "";
    }
  });

  ui.unplacedPiecesTray.innerHTML = "";
  let unplacedCount = 0;

  for (let id = 1; id <= 4; id++) {
    if (gameState.unlockedPieces.has(id) && !gameState.placedPieces.has(id)) {
      unplacedCount++;
      const piece = PUZZLE_PIECES[id];
      const isSelected = gameState.selectedPieceId === id;

      const card = document.createElement("div");
      card.draggable = true;
      card.dataset.pieceId = id;
      card.className = `parchment-card rounded-2xl p-3.5 cursor-pointer transition transform hover:-translate-y-0.5 ${
        isSelected ? "ring-4 ring-amber-400 scale-[1.02]" : ""
      }`;
      card.innerHTML = `
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-900/15 text-amber-950">
            Piece ${piece.roman}
          </span>
          <span class="text-[11px] font-bold text-emerald-800">${isSelected ? "Selected ✓" : "Tap / Drag"}</span>
        </div>
        <div class="font-extrabold text-xs sm:text-sm text-stone-900">${piece.title}</div>
        <div class="text-[11px] text-stone-700 mt-1 line-clamp-2">${piece.shortSummary}</div>
      `;

      card.addEventListener("click", () => {
        gameState.selectedPieceId = id;
        sfx.playTone(480, "sine", 0.08, 0.1);
        renderPuzzleBoard();
      });

      card.addEventListener("dragstart", (e) => {
        gameState.selectedPieceId = id;
        e.dataTransfer.setData("text/plain", String(id));
      });

      ui.unplacedPiecesTray.appendChild(card);
    }
  }

  if (unplacedCount === 0) {
    ui.unplacedPiecesTray.innerHTML = `
      <div class="col-span-full rounded-2xl bg-slate-900/60 border border-slate-700/70 p-4 text-center text-xs text-slate-400">
        ${
          gameState.placedPieces.size === 4
            ? "✨ All 4 resume fragments are locked in place! Your memories are completely restored."
            : "No unplaced scraps in your satchel. Go fish up the next Memory Bottle!"
        }
      </div>
    `;
  }

  const placed = gameState.placedPieces.size;
  if (placed === 4) {
    ui.puzzleNextStepBox.classList.remove("hidden");
    ui.puzzleNextStepText.textContent = "🎉 All 4 Resume Fragments Assembled! You remember who you are!";
    ui.puzzleActionContinueBtn.textContent = "📄 Open Complete Interviewer Resume";
  } else if (placed > 0 && gameState.placedPieces.has(gameState.questStage) && gameState.questStage < 4) {
    ui.puzzleNextStepBox.classList.remove("hidden");
    ui.puzzleNextStepText.textContent = `Quest ${gameState.questStage} Complete! Talk to Yori so he can boat you to Island ${gameState.questStage + 1}!`;
    ui.puzzleActionContinueBtn.textContent = "⛵ Talk to Yori for Boat Ride";
  } else {
    ui.puzzleNextStepBox.classList.add("hidden");
  }

  updateHud();
}

function tryPlacePieceInSlot(slotId, pieceId) {
  if (!pieceId || !gameState.unlockedPieces.has(pieceId)) {
    showToast("Select a recovered paper scrap first!");
    return;
  }
  if (slotId !== pieceId) {
    sfx.playTone(180, "sawtooth", 0.16, 0.14, 120);
    showToast(`That's Piece ${PUZZLE_PIECES[pieceId].roman} (${PUZZLE_PIECES[pieceId].title}) — place it in Slot ${PUZZLE_PIECES[pieceId].roman}!`);
    return;
  }

  gameState.placedPieces.add(slotId);
  gameState.selectedPieceId = null;
  sfx.playPuzzleSnap();
  renderPuzzleBoard();

  if (gameState.placedPieces.size === 4) {
    gameState.stormCleared = true;
    sfx.setStormVolume(true);
    sfx.playVictoryFanfare();
    setTimeout(() => {
      closePuzzleModal();
      openVictoryDossier(true);
    }, 650);
  } else {
    showToast(`✨ Fragment ${PUZZLE_PIECES[slotId].roman} snapped into place! Talk to Yori for your boat ride.`);
  }
}

document.querySelectorAll(".puzzle-slot").forEach((slotEl) => {
  const slotId = parseInt(slotEl.dataset.slot, 10);

  slotEl.addEventListener("click", () => {
    if (gameState.placedPieces.has(slotId)) return;
    let candidate = gameState.selectedPieceId;
    if (!candidate && gameState.unlockedPieces.has(slotId)) {
      candidate = slotId;
    }
    tryPlacePieceInSlot(slotId, candidate);
  });

  slotEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    slotEl.classList.add("drag-over");
  });

  slotEl.addEventListener("dragleave", () => {
    slotEl.classList.remove("drag-over");
  });

  slotEl.addEventListener("drop", (e) => {
    e.preventDefault();
    slotEl.classList.remove("drag-over");
    const droppedId = parseInt(e.dataTransfer.getData("text/plain") || String(gameState.selectedPieceId || 0), 10);
    tryPlacePieceInSlot(slotId, droppedId);
  });
});

function openPuzzleModal(highlightPieceId = null) {
  if (highlightPieceId && gameState.unlockedPieces.has(highlightPieceId) && !gameState.placedPieces.has(highlightPieceId)) {
    gameState.selectedPieceId = highlightPieceId;
  }
  renderPuzzleBoard();
  ui.puzzleModal.classList.remove("hidden");
  ui.puzzleModal.classList.add("flex");
}

function closePuzzleModal() {
  ui.puzzleModal.classList.add("hidden");
  ui.puzzleModal.classList.remove("flex");
}

ui.openPuzzleHudBtn.addEventListener("click", () => openPuzzleModal());
ui.openPuzzleBottomBtn.addEventListener("click", () => openPuzzleModal());
ui.closePuzzleModalBtn.addEventListener("click", closePuzzleModal);

ui.puzzleActionContinueBtn.addEventListener("click", () => {
  closePuzzleModal();
  if (gameState.placedPieces.size === 4) {
    openVictoryDossier(true);
  } else {
    openYoriDialogue();
  }
});

function openVictoryDossier(isCelebration = false) {
  if (isCelebration && gameState.placedPieces.size === 4) {
    ui.victoryBadgeTag.textContent = "✨ ALL 4 MEMORIES RESTORED • INTERVIEWER DOSSIER";
    ui.victorySubMessage.textContent = "The Molten Kraken is defeated and all 4 islands are conquered! Choose Restart Game or Exit & Finish below.";
  } else {
    ui.victoryBadgeTag.textContent = "📄 INTERVIEWER QUICK PREVIEW • YUL CARLOS D. BOLONIA";
    ui.victorySubMessage.textContent = `Current Progress: ${gameState.placedPieces.size}/4 Memory Bottles Assembled.`;
  }
  ui.victoryDossierModal.classList.remove("hidden");
  ui.victoryDossierModal.classList.add("flex");
}

function closeVictoryDossier() {
  ui.victoryDossierModal.classList.add("hidden");
  ui.victoryDossierModal.classList.remove("flex");
}

function resetFullGame() {
  gameState.currentIsland = 1;
  gameState.questStage = 0;
  gameState.equippedRod = null;
  gameState.obtainedRods.clear();
  gameState.unlockedPieces.clear();
  gameState.placedPieces.clear();
  gameState.selectedPieceId = null;
  gameState.stormCleared = false;

  gameState.boatTrip.active = false;
  gameState.boatTrip.fromIsland = 1;
  gameState.boatTrip.toIsland = 2;
  gameState.boatTrip.progress = 0;

  gameState.player.x = 0.36;
  gameState.player.targetX = 0.36;
  gameState.player.facing = 1;
  gameState.player.castingState = "idle";
  gameState.player.bobberProgress = 0;

  gameState.tapReel.active = false;
  gameState.fisch.active = false;
  gameState.fisch.holding = false;
  gameState.fisch.boulders = [];
  gameState.fisch.damagePopups = [];
  gameState.fisch.playerHp = 100;
  gameState.fisch.bossHp = 1000;
  gameState.bossDefeat.active = false;
  gameState.bossDefeat.progress = 0;
  gameState.bottleOpen.active = false;

  ui.tapReelOverlay.classList.add("hidden");
  ui.fischBarOverlay.classList.add("hidden");
  ui.bossHudBar.classList.add("hidden");
  ui.bossDodgeControls.classList.add("hidden");
  ui.bycatchModal.classList.add("hidden");
  ui.krakenDeathModal.classList.add("hidden");
  ui.rodUnlockModal.classList.add("hidden");
  ui.bottleModal.classList.add("hidden");
  ui.puzzleModal.classList.add("hidden");
  ui.victoryDossierModal.classList.add("hidden");
  ui.thankYouExitModal.classList.add("hidden");

  sfx.setStormVolume(false);
  updateHud();
  showToast("🏝️ Game restarted! You washed back up on Island 1. Talk to Yori!");
}

ui.restartAfterDeathBtn.addEventListener("click", resetFullGame);
ui.restartGameVictoryBtn.addEventListener("click", resetFullGame);
ui.restartFromExitBtn.addEventListener("click", resetFullGame);

ui.exitThankYouBtn.addEventListener("click", () => {
  closeVictoryDossier();
  sfx.playVictoryFanfare();
  ui.thankYouExitModal.classList.remove("hidden");
  ui.thankYouExitModal.classList.add("flex");
});

ui.backToDossierFromExitBtn.addEventListener("click", () => {
  ui.thankYouExitModal.classList.add("hidden");
  ui.thankYouExitModal.classList.remove("flex");
  openVictoryDossier(true);
});

ui.openDossierQuickBtn.addEventListener("click", () => openVictoryDossier(false));
ui.closeDossierBtn.addEventListener("click", closeVictoryDossier);
ui.keepFishingBtn.addEventListener("click", closeVictoryDossier);
ui.printResumeBtn.addEventListener("click", () => window.print());

function copyTextFallback(text, label) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showToast(`✅ Copied ${label}: ${text}`);
  } catch (err) {
    showToast(`${label}: ${text}`);
  }
  document.body.removeChild(textarea);
}

ui.copyEmailBtn.addEventListener("click", () => copyTextFallback("yyulcarlos011@gmail.com", "Email"));
ui.copyPhoneBtn.addEventListener("click", () => copyTextFallback("09624340313", "Phone"));

ui.talkYoriBtn.addEventListener("click", openYoriDialogue);
ui.castLineBtn.addEventListener("click", startCasting);

ui.muteToggleBtn.addEventListener("click", () => {
  const isMuted = sfx.toggleMute();
  ui.muteToggleBtn.textContent = isMuted ? "🔇" : "🔊";
  showToast(isMuted ? "Audio Muted" : "Ocean & Rain Audio Enabled");
});

window.addEventListener("pointerdown", (e) => {
  if (gameState.fisch.active && !e.target.closest("button")) {
    gameState.fisch.holding = true;
  }
});

window.addEventListener("pointerup", () => {
  gameState.fisch.holding = false;
});

ui.holdBarTouchBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  gameState.fisch.holding = true;
});
ui.holdBarTouchBtn.addEventListener("pointerup", (e) => {
  e.stopPropagation();
  gameState.fisch.holding = false;
});

ui.dodgeLeftBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  gameState.keys.left = true;
});
ui.dodgeLeftBtn.addEventListener("pointerup", (e) => {
  e.stopPropagation();
  gameState.keys.left = false;
});
ui.dodgeLeftBtn.addEventListener("pointerleave", () => {
  gameState.keys.left = false;
});

ui.dodgeRightBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();
  gameState.keys.right = true;
});
ui.dodgeRightBtn.addEventListener("pointerup", (e) => {
  e.stopPropagation();
  gameState.keys.right = false;
});
ui.dodgeRightBtn.addEventListener("pointerleave", () => {
  gameState.keys.right = false;
});

ui.canvas.addEventListener("click", (e) => {
  if (gameState.fisch.active || gameState.tapReel.active || gameState.bottleOpen.active || gameState.boatTrip.active || gameState.bossDefeat.active) return;
  const rect = ui.canvas.getBoundingClientRect();
  const normX = (e.clientX - rect.left) / rect.width;
  const yoriX = 0.25;

  if (Math.abs(normX - yoriX) < 0.065) {
    gameState.player.targetX = yoriX + 0.045;
    openYoriDialogue();
    return;
  }

  const clampedX = Math.max(0.16, Math.min(0.46, normX));
  gameState.player.targetX = clampedX;
  gameState.player.facing = clampedX >= gameState.player.x ? 1 : -1;
});

window.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") gameState.keys.left = true;
  if (e.code === "ArrowRight" || e.code === "KeyD") gameState.keys.right = true;
  if (e.code === "KeyE") {
    if (!ui.yoriDialogueModal.classList.contains("hidden")) {
      closeYoriDialogue();
    } else if (!gameState.boatTrip.active && !gameState.bossDefeat.active) {
      openYoriDialogue();
    }
  }
  if (e.code === "Space") {
    if (!ui.yoriDialogueModal.classList.contains("hidden") ||
        !ui.puzzleModal.classList.contains("hidden") ||
        !ui.victoryDossierModal.classList.contains("hidden") ||
        !ui.krakenDeathModal.classList.contains("hidden") ||
        !ui.thankYouExitModal.classList.contains("hidden")) {
      return;
    }
    e.preventDefault();
    if (!ui.rodUnlockModal.classList.contains("hidden")) {
      ui.startFishingWithNewRodBtn.click();
      return;
    }
    if (!ui.bycatchModal.classList.contains("hidden")) {
      closeBycatchModal();
      startCasting();
      return;
    }
    if (gameState.bottleOpen.active) {
      pullBottleCorkStep();
    } else if (gameState.tapReel.active) {
      handleTapReelAction();
    } else if (gameState.fisch.active) {
      gameState.fisch.holding = true;
    } else if (gameState.player.castingState === "idle") {
      startCasting();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft" || e.code === "KeyA") gameState.keys.left = false;
  if (e.code === "ArrowRight" || e.code === "KeyD") gameState.keys.right = false;
  if (e.code === "Space") gameState.fisch.holding = false;
});

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ui.canvas.width = Math.floor(window.innerWidth * dpr);
  ui.canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

function initParticles() {
  gameState.world.raindrops = [];
  for (let i = 0; i < 150; i++) {
    gameState.world.raindrops.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: 14 + Math.random() * 18,
      speed: 580 + Math.random() * 260
    });
  }

  gameState.world.embers = [];
  for (let i = 0; i < 24; i++) {
    gameState.world.embers.push({
      x: 0.30 + (Math.random() - 0.5) * 0.03,
      yOffset: Math.random() * 55,
      speed: 18 + Math.random() * 24,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.4 + Math.random() * 0.6
    });
  }
}

function updateSimulation(dt) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const waterY = h * 0.67;

  gameState.world.time += dt;

  if (gameState.boatTrip.active) {
    const bt = gameState.boatTrip;
    bt.progress += dt / bt.duration;
    if (bt.progress >= 1) {
      bt.active = false;
      gameState.currentIsland = bt.toIsland;
      gameState.player.x = 0.36;
      gameState.player.targetX = 0.36;
      if (bt.pendingRodId && RODS[bt.pendingRodId]) {
        grantAndShowcaseNewRod(bt.pendingRodId);
      } else {
        updateHud();
      }
    }
    return;
  }

  if (!gameState.tapReel.active && !gameState.bottleOpen.active && !gameState.bossDefeat.active) {
    const moveSpeed = gameState.fisch.active && gameState.fisch.isBoss ? 0.28 : 0.22;
    if (gameState.keys.left) {
      gameState.player.x -= moveSpeed * dt;
      gameState.player.targetX = gameState.player.x;
      gameState.player.facing = -1;
    }
    if (gameState.keys.right) {
      gameState.player.x += moveSpeed * dt;
      gameState.player.targetX = gameState.player.x;
      gameState.player.facing = 1;
    }
  }

  const dx = gameState.player.targetX - gameState.player.x;
  if (Math.abs(dx) > 0.003) {
    gameState.player.x += Math.sign(dx) * Math.min(Math.abs(dx), 0.22 * dt);
    gameState.player.walkPhase += dt * 11;
  } else {
    gameState.player.walkPhase = 0;
  }
  gameState.player.x = Math.max(0.15, Math.min(0.46, gameState.player.x));

  const p = gameState.player;
  if (p.castingState === "casting") {
    p.bobberProgress += dt * 2.2;
    const startX = p.x * w + 36;
    const startY = waterY - 46;
    const endX = w * 0.56;
    const endY = waterY + 12;
    const t = Math.min(1, p.bobberProgress);
    p.bobberX = startX + (endX - startX) * t;
    p.bobberY = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 75;

    if (t >= 1) {
      p.castingState = "waiting";
      p.biteTimer = 1.2 + Math.random() * 1.1;
      sfx.playSplash();
      gameState.world.ripples.push({ x: endX, y: endY, radius: 4, alpha: 0.9 });
    }
  } else if (p.castingState === "waiting") {
    p.biteTimer -= dt;
    if (Math.random() < 0.04) {
      gameState.world.ripples.push({ x: p.bobberX, y: p.bobberY, radius: 3, alpha: 0.65 });
    }
    if (p.biteTimer <= 0) {
      triggerBiteAlert();
    }
  }

  if (gameState.tapReel.active) {
    gameState.tapReel.timeLeft -= dt;
    ui.tapReelTimeText.textContent = `${Math.max(0, gameState.tapReel.timeLeft).toFixed(1)}s`;
    if (gameState.tapReel.timeLeft <= 0) {
      gameState.tapReel.active = false;
      ui.tapReelOverlay.classList.add("hidden");
      gameState.player.castingState = "idle";
      showToast("The line snapped! Cast again and tap REEL! faster.");
    }
  }

  if (gameState.fisch.active) {
    updateFischMiniGame(dt);
  }

  if (gameState.bossDefeat.active) {
    const bd = gameState.bossDefeat;
    bd.progress = Math.min(1, bd.progress + dt / bd.duration);
    gameState.fisch.screenShake = (1 - bd.progress) * 18 + 3;

    if (Math.random() < 0.5) {
      gameState.world.ripples.push({
        x: w * (0.69 + Math.random() * 0.18),
        y: waterY + 8 + Math.random() * 14,
        radius: 6 + Math.random() * 9,
        alpha: 0.95
      });
    }

    if (bd.progress >= 1) {
      bd.active = false;
      gameState.fisch.screenShake = 0;
      updateHud();
      sfx.playPuzzleSnap();
      showToast("🍾 The Molten Kraken sank! You recovered the final Memory Bottle!");
      openBottleMiniGame(4);
    }
  }

  for (let i = gameState.fisch.lightningBolts.length - 1; i >= 0; i--) {
    gameState.fisch.lightningBolts[i].life -= dt;
    if (gameState.fisch.lightningBolts[i].life <= 0) {
      gameState.fisch.lightningBolts.splice(i, 1);
    }
  }

  for (let i = gameState.fisch.damagePopups.length - 1; i >= 0; i--) {
    const pop = gameState.fisch.damagePopups[i];
    pop.y += pop.vy * dt;
    pop.alpha -= dt * 0.95;
    if (pop.alpha <= 0) {
      gameState.fisch.damagePopups.splice(i, 1);
    }
  }

  if (gameState.fisch.screenShake > 0) {
    gameState.fisch.screenShake = Math.max(0, gameState.fisch.screenShake - dt * 35);
  }

  if (gameState.currentIsland === 1 && !gameState.stormCleared) {
    for (const drop of gameState.world.raindrops) {
      drop.y += drop.speed * dt;
      drop.x -= drop.speed * 0.14 * dt;
      if (drop.y > h) {
        drop.y = -20;
        drop.x = Math.random() * (w + 80);
      }
    }

    gameState.world.nextLightning -= dt;
    if (gameState.world.nextLightning <= 0) {
      gameState.world.lightningAlpha = 0.28;
      gameState.world.nextLightning = 7 + Math.random() * 9;
    }
  }

  if (gameState.world.lightningAlpha > 0) {
    gameState.world.lightningAlpha = Math.max(0, gameState.world.lightningAlpha - dt * 1.4);
  }

  for (const emb of gameState.world.embers) {
    emb.yOffset += emb.speed * dt;
    if (emb.yOffset > 65) emb.yOffset = 0;
  }

  for (let i = gameState.world.ripples.length - 1; i >= 0; i--) {
    const r = gameState.world.ripples[i];
    r.radius += 26 * dt;
    r.alpha -= 0.75 * dt;
    if (r.alpha <= 0) gameState.world.ripples.splice(i, 1);
  }
}

let lastTimestamp = 0;

function animateLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;

  updateSimulation(dt);
  renderScene();

  requestAnimationFrame(animateLoop);
}

window.onload = function () {
  resizeCanvas();
  initParticles();
  updateHud();
  renderPuzzleBoard();
  requestAnimationFrame(animateLoop);
};