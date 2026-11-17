// ============================================================================
// GAME DATA: ISLANDS, BYCATCH, RODS, PUZZLE FRAGMENTS & YORI DIALOGUES
// ============================================================================

const ISLANDS = {
  1: {
    id: 1,
    name: "Island 1: Misty Monolith",
    shortName: "Misty Monolith",
    bottleChance: 1.0,
    chanceLabel: "100%",
    desc: "Tutorial Shore • Guaranteed Memory Bottle"
  },
  2: {
    id: 2,
    name: "Island 2: Coconut Sandbar",
    shortName: "Coconut Sandbar",
    bottleChance: 0.75,
    chanceLabel: "75%",
    desc: "Tropical Sand Island • 75% Bottle Drop Rate"
  },
  3: {
    id: 3,
    name: "Island 3: Emerald Woods",
    shortName: "Emerald Woods",
    bottleChance: 0.65,
    chanceLabel: "65%",
    desc: "Ancient Forest Island • 65% Bottle Drop Rate"
  },
  4: {
    id: 4,
    name: "Island 4: Caldera Volcano",
    shortName: "Caldera Volcano",
    bottleChance: 1.0,
    chanceLabel: "BOSS",
    desc: "Molten Kraken Lair • Dodge Rocks (-20 HP)"
  }
};

const BYCATCH_ITEMS = [
  {
    emoji: "🐟",
    name: "Silver Reef Fish",
    desc: "Just an ordinary fish swimming near the shore—no glass bottle or resume scrap here! Cast again."
  },
  {
    emoji: "👢",
    name: "Waterlogged Old Boot",
    desc: "A soggy left boot tangled in seaweed. Definitely not part of your resume! Cast your line again."
  },
  {
    emoji: "🗑️",
    name: "Drifting Sea Trash",
    desc: "A clump of ocean litter and driftwood scraps. Keep fishing to find the sealed Memory Bottle!"
  },
  {
    emoji: "🦴",
    name: "Picked-Clean Fish Bones",
    desc: "Only bare fish bones came up on your hook! Cast out once more for the Memory Bottle."
  },
  {
    emoji: "🫙",
    name: "Cracked Empty Bottle",
    desc: "An empty bottle with no cork and no parchment paper inside! Keep casting for the real Memory Bottle."
  }
];

const RODS = [
  null,
  {
    id: 1,
    name: "Wooden Rod",
    icon: "🪵",
    color: "#d97706",
    glowColor: "rgba(251, 191, 36, 0.75)",
    rayColor: "rgba(251, 191, 36, 0.42)",
    badgeText: "✨ QUEST 1 ROD UNLOCKED!",
    subtitle: "Handcrafted Twine-Wrapped Rod • Misty Monolith",
    traitLabel: "100% Bottle Waters",
    barWidthPct: 26,
    fishSpeed: 0.24,
    progressGain: 0.24,
    progressDrain: 0.14,
    bonusText: "Starter Wooden Rod • Tutorial Quest 1"
  },
  {
    id: 2,
    name: "Iron Rod",
    icon: "⚙️",
    color: "#cbd5e1",
    glowColor: "rgba(56, 189, 248, 0.8)",
    rayColor: "rgba(56, 189, 248, 0.42)",
    badgeText: "✨ QUEST 2 ROD UNLOCKED!",
    subtitle: "Steel-Forged Spinning Rod • Coconut Sandbar",
    traitLabel: "+6% Wider Control Bar",
    barWidthPct: 32,
    fishSpeed: 0.30,
    progressGain: 0.28,
    progressDrain: 0.13,
    bonusText: "Wider Control Bar • Sand Island Quest 2"
  },
  {
    id: 3,
    name: "Diamond Rod",
    icon: "💎",
    color: "#2dd4bf",
    glowColor: "rgba(45, 212, 191, 0.85)",
    rayColor: "rgba(45, 212, 191, 0.45)",
    badgeText: "✨ QUEST 3 ROD UNLOCKED!",
    subtitle: "Crystalline Turquoise Rod • Emerald Woods",
    traitLabel: "Max 38% Control Bar",
    barWidthPct: 38,
    fishSpeed: 0.35,
    progressGain: 0.32,
    progressDrain: 0.12,
    bonusText: "Reinforced Reel • Forest Island Quest 3"
  },
  {
    id: 4,
    name: "Trident Rod",
    icon: "🔱",
    color: "#facc15",
    glowColor: "rgba(250, 204, 21, 0.92)",
    rayColor: "rgba(249, 115, 22, 0.48)",
    badgeText: "🔥 FINAL BOSS ROD UNLOCKED!",
    subtitle: "Radiant Golden Trident • Caldera Volcano",
    traitLabel: "Slays Molten Kraken",
    barWidthPct: 34,
    fishSpeed: 0.42,
    progressGain: 0.30,
    progressDrain: 0.10,
    bonusText: "Boss-Slayer Trident • Volcano Island Quest 4"
  }
];

function getRodShowcaseSvg(rodId) {
  if (rodId === 1) {
    return `
      <svg viewBox="0 0 220 220" class="w-full h-full overflow-visible">
        <path d="M186 30 Q118 24 116 62 Q112 104 98 134" fill="none" stroke="#f8fafc" stroke-width="1.6" opacity="0.9"/>
        <line x1="34" y1="194" x2="188" y2="28" stroke="#d97706" stroke-width="6.5" stroke-linecap="round"/>
        <line x1="34" y1="194" x2="188" y2="28" stroke="#fde68a" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
        <line x1="32" y1="196" x2="74" y2="151" stroke="#f5deb3" stroke-width="10" stroke-linecap="round"/>
        <path d="M36 192 L41 196 M43 184 L48 188 M50 177 L55 181 M57 169 L62 173 M64 162 L69 166" stroke="#92400e" stroke-width="2"/>
        <g stroke="#451a03" stroke-width="2.5">
          <line x1="102" y1="118" x2="107" y2="123"/>
          <circle cx="101" cy="116" r="3" fill="none" stroke="#78350f" stroke-width="1.5"/>
          <line x1="131" y1="87" x2="136" y2="92"/>
          <circle cx="130" cy="85" r="3" fill="none" stroke="#78350f" stroke-width="1.5"/>
          <line x1="159" y1="57" x2="164" y2="62"/>
          <circle cx="158" cy="55" r="3" fill="none" stroke="#78350f" stroke-width="1.5"/>
        </g>
        <g transform="translate(80, 144) rotate(-47)">
          <rect x="-10" y="-14" width="20" height="26" rx="4" fill="#78350f" stroke="#451a03" stroke-width="2"/>
          <line x1="-10" y1="-2" x2="10" y2="-2" stroke="#fef3c7" stroke-width="2.5" opacity="0.7"/>
          <path d="M0 -14 L0 -22 L-8 -25" fill="none" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>
        </g>
        <g transform="translate(116, 62)">
          <circle cx="0" cy="0" r="9.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
          <path d="M-9.5 0 A9.5 9.5 0 0 1 9.5 0 Z" fill="#dc2626" transform="rotate(-35)"/>
          <circle cx="-3" cy="-3" r="2.2" fill="#ffffff" opacity="0.85"/>
        </g>
      </svg>
    `;
  }
  if (rodId === 2) {
    return `
      <svg viewBox="0 0 220 220" class="w-full h-full overflow-visible">
        <g transform="translate(110, 110) rotate(36) translate(-110, -110)">
          <line x1="110" y1="146" x2="110" y2="16" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round"/>
          <line x1="109" y1="146" x2="109" y2="16" stroke="#f8fafc" stroke-width="1.6" stroke-linecap="round"/>
          <g fill="#0f172a" stroke="#cbd5e1" stroke-width="1.4">
            <rect x="107" y="114" width="6" height="4" rx="1"/>
            <circle cx="103" cy="116" r="3" fill="none"/>
            <rect x="107" y="88" width="6" height="4" rx="1"/>
            <circle cx="104" cy="90" r="2.8" fill="none"/>
            <rect x="107" y="62" width="6" height="4" rx="1"/>
            <circle cx="105" cy="64" r="2.5" fill="none"/>
            <rect x="107" y="38" width="6" height="4" rx="1"/>
            <circle cx="105" cy="40" r="2.2" fill="none"/>
            <circle cx="108" cy="16" r="2.5" fill="none"/>
          </g>
          <rect x="105" y="132" width="10" height="16" rx="3" fill="#1e293b"/>
          <rect x="106" y="148" width="8" height="18" rx="1.5" fill="#0284c7" stroke="#38bdf8" stroke-width="1"/>
          <rect x="104" y="167" width="12" height="38" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
          <line x1="105" y1="174" x2="115" y2="174" stroke="#334155" stroke-width="1.2"/>
          <line x1="105" y1="181" x2="115" y2="181" stroke="#334155" stroke-width="1.2"/>
          <line x1="105" y1="188" x2="115" y2="188" stroke="#334155" stroke-width="1.2"/>
          <line x1="105" y1="195" x2="115" y2="195" stroke="#334155" stroke-width="1.2"/>
          <path d="M107 156 L92 158 L92 168 L107 161 Z" fill="#1e293b"/>
          <rect x="84" y="145" width="15" height="11" rx="2" fill="#eab308" stroke="#1e293b" stroke-width="1.8"/>
          <rect x="82" y="143" width="19" height="3.5" rx="1" fill="#0f172a"/>
          <rect x="82" y="155" width="19" height="3.5" rx="1" fill="#0f172a"/>
          <ellipse cx="91.5" cy="166" rx="6" ry="9" fill="#0f172a" stroke="#475569" stroke-width="1.2"/>
        </g>
      </svg>
    `;
  }
  if (rodId === 3) {
    return `
      <svg viewBox="0 0 220 220" class="w-full h-full overflow-visible">
        <polyline points="86,138 126,104 162,72 192,45" fill="none" stroke="#e2e8f0" stroke-width="1.8"/>
        <line x1="88" y1="126" x2="192" y2="36" stroke="#2dd4bf" stroke-width="9" stroke-linecap="round"/>
        <line x1="88" y1="124" x2="192" y2="34" stroke="#99f6e4" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="122" cy="97" r="6" fill="#14b8a6"/>
        <circle cx="126" cy="104" r="4.5" fill="none" stroke="#64748b" stroke-width="2.5"/>
        <circle cx="158" cy="66" r="5.5" fill="#14b8a6"/>
        <circle cx="162" cy="72" r="4" fill="none" stroke="#64748b" stroke-width="2.3"/>
        <circle cx="192" cy="36" r="5.5" fill="#2dd4bf"/>
        <circle cx="192" cy="44" r="3.8" fill="none" stroke="#64748b" stroke-width="2.2"/>
        <line x1="78" y1="135" x2="90" y2="124" stroke="#b47b56" stroke-width="12" stroke-linecap="round"/>
        <line x1="28" y1="184" x2="62" y2="152" stroke="#b47b56" stroke-width="15" stroke-linecap="round"/>
        <line x1="28" y1="182" x2="62" y2="150" stroke="#d6a27e" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
        <circle cx="72" cy="144" r="16" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
        <circle cx="77" cy="148" r="14" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>
        <path d="M77 148 L90 156 L96 150" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="98" cy="148" r="4.5" fill="#b47b56"/>
      </svg>
    `;
  }
  return `
    <svg viewBox="0 0 220 220" class="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="tridentGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="45%" stop-color="#eab308"/>
          <stop offset="85%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <linearGradient id="tridentAuraGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.75"/>
          <stop offset="65%" stop-color="#facc15" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g transform="translate(112, 114) rotate(14) translate(-112, -114)">
        <polygon points="104,164 82,42 138,42 114,164" fill="url(#tridentAuraGrad)"/>
        <rect x="103" y="168" width="12" height="38" rx="2" fill="url(#tridentGoldGrad)" stroke="#92400e" stroke-width="1.5"/>
        <circle cx="98" cy="164" r="11" fill="#eab308" stroke="#92400e" stroke-width="1.8"/>
        <path d="M109 164 L119 164 L119 171" fill="none" stroke="#fde047" stroke-width="3" stroke-linecap="round"/>
        <rect x="106.5" y="64" width="5" height="104" fill="url(#tridentGoldGrad)"/>
        <path d="M84 68 L96 56 L109 64 L122 56 L134 68 L124 72 L109 67 L94 72 Z" fill="#facc15" stroke="#a16207" stroke-width="1.4"/>
        <path d="M86 68 L88 26 L93 36 L90 36 L90 66 Z" fill="url(#tridentGoldGrad)"/>
        <polygon points="88,18 83,32 93,32" fill="#fef08a"/>
        <rect x="107.2" y="20" width="3.6" height="46" fill="url(#tridentGoldGrad)"/>
        <polygon points="109,8 103,24 115,24" fill="#ffffff"/>
        <path d="M132 68 L130 26 L125 36 L128 36 L128 66 Z" fill="url(#tridentGoldGrad)"/>
        <polygon points="130,18 125,32 135,32" fill="#fef08a"/>
        <path d="M109 0 L111 7 L118 9 L111 11 L109 18 L107 11 L100 9 L107 7 Z" fill="#ffffff" opacity="0.9"/>
      </g>
    </svg>
  `;
}

const PUZZLE_PIECES = {
  1: {
    id: 1,
    roman: "I",
    title: "Identity, Objective & Contact",
    subtitle: "Bottle #1 • Island 1 (Misty Monolith)",
    shortSummary: "Yul Carlos D. Bolonia • BS Computer Engineering Student • Contact & Career Objective",
    html: `
      <div class="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">Fragment I — Identity &amp; Objective</div>
      <div class="font-display text-base sm:text-lg font-extrabold text-stone-900">YUL CARLOS D. BOLONIA</div>
      <div class="text-[11px] font-semibold text-stone-700 mt-0.5">
        📞 09624340313 | ✉️ yyulcarlos011@gmail.com<br/>
        📍 097 Zapote 2, Zone 3 Bacoor Cavite
      </div>
      <p class="text-xs text-stone-800 mt-2 leading-relaxed">
        <strong>Objective:</strong> A dedicated and curious Computer Engineering student with a strong willingness to learn and grow. As a fast learner, I adapt quickly to new environments and enjoy taking on new experiences, I aim to develop my technical and interpersonal skills while growing both personally and professionally.
      </p>
    `
  },
  2: {
    id: 2,
    roman: "II",
    title: "Education",
    subtitle: "Bottle #2 • Island 2 (Coconut Sandbar)",
    shortSummary: "PUP Parañaque (BS Computer Engineering) & Olivarez College (STEM)",
    html: `
      <div class="text-xs font-black uppercase tracking-wider text-amber-900 mb-1.5">Fragment II — Education</div>
      <div class="space-y-2 text-xs text-stone-800">
        <div>
          <div class="font-extrabold text-stone-900">Polytechnic University of the Philippines - Parañaque City Campus</div>
          <div>Bachelor of Science in Computer Engineering <span class="font-mono-code font-bold text-amber-900">(2024 - Present)</span></div>
        </div>
        <div>
          <div class="font-extrabold text-stone-900">Olivarez College</div>
          <div>Science, Technology, Engineering, and Mathematics (STEM) <span class="font-mono-code font-bold text-amber-900">(2022 - 2024)</span></div>
        </div>
      </div>
    `
  },
  3: {
    id: 3,
    roman: "III",
    title: "Experience & Seminars",
    subtitle: "Bottle #3 • Island 3 (Emerald Woods)",
    shortSummary: "Lead, Poster Team (PUP SCENE & Student Council) + 4 Tech Seminars",
    html: `
      <div class="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">Fragment III — Experience &amp; Seminars</div>
      <div class="text-xs text-stone-800">
        <div class="font-extrabold text-stone-900">Lead, Poster Team — Graphics &amp; Multimedia Committee (2025 - 2026)</div>
        <div class="text-stone-700 mb-1">PUP Parañaque City Campus (SCENE &amp; Student Council)</div>
        <p class="leading-relaxed">Led promotional poster design, collaborated with officers &amp; committees, and maintained visual consistency.</p>
        <div class="mt-1.5 font-bold text-stone-900">Seminars:</div>
        <div class="text-[11px] text-stone-700">Code, Connect, Create! • Unlocking the Future of CpE • Arduinnovation • Research Methodologies</div>
      </div>
    `
  },
  4: {
    id: 4,
    roman: "IV",
    title: "Skills & Character References",
    subtitle: "Bottle #4 • Molten Kraken Boss Reward",
    shortSummary: "Python, C, C++, AutoCAD, Canva, Hardware/Troubleshooting & References",
    html: `
      <div class="text-xs font-black uppercase tracking-wider text-rose-900 mb-1">Fragment IV — Skills &amp; References</div>
      <div class="text-xs text-stone-800 space-y-1.5">
        <div><strong>Technical:</strong> Basic Hardware &amp; Software, Trouble Shooting, Programming Fundamentals (Python, C, C++), AutoCAD, Canva, Graphic Design</div>
        <div><strong>Soft Skills:</strong> Problem Solver, Kin to Details, Proactive, Hardworking, Flexible, Goal Oriented</div>
        <div class="text-[11px] text-stone-700 pt-1 border-t border-amber-900/20">
          <strong>References:</strong> Kenneth E. Abaja (College Instructor) &amp; Jefferson F. Serrano (Head, Academic Programs, PUP Parañaque)
        </div>
      </div>
    `
  }
};

const YORI_DIALOGUES = {
  0: {
    subtitle: "Island 1 • Misty Monolith (Tutorial)",
    paragraphs: [
      "Whoa, easy there! You washed up on this lonely rock in the middle of a squall. I'm <strong>Yori</strong>—been stranded here with my boat moored nearby.",
      "You don't remember your name or why you're here? Look out at the tide—sealed glass bottles have been drifting across four islands in this archipelago. Each bottle holds a torn scrap of your resume!",
      "This first island is calm enough that your first bottle is <strong>100% guaranteed</strong>. Take my <strong>Wooden Rod</strong>, cast off the dock, tap <strong>REEL!</strong>, and keep the fish line inside the white bar!"
    ],
    rewardRodId: 1,
    btnText: "Take Wooden Rod & Start Quest 1"
  },
  1: {
    subtitle: "Quest 1 Complete — Sail to Sand Island!",
    paragraphs: [
      "<strong>Yul Carlos D. Bolonia</strong>! A Computer Engineering student with a real spark for learning and teamwork.",
      "Hop aboard my boat! I'll drive us across the sea to <strong>Coconut Sandbar (Island 2)</strong> and hand you my <strong>Iron Rod</strong>. Keep in mind—bottles there have a <strong>75% catch chance</strong> among fish and ocean junk!"
    ],
    rewardRodId: 2,
    sailToIsland: 2,
    btnText: "⛵ Sail to Island 2 & Get Iron Rod"
  },
  2: {
    subtitle: "Quest 2 Complete — Sail to Forest Island!",
    paragraphs: [
      "PUP Parañaque Computer Engineering and STEM from Olivarez College! Your academic foundation is restored.",
      "Let's fire up the boat engine again! I'll steer us to <strong>Emerald Woods (Island 3)</strong> and give you the <strong>Diamond Rod</strong>. The waters are deeper there—bottles have a <strong>65% catch chance</strong>!"
    ],
    rewardRodId: 3,
    sailToIsland: 3,
    btnText: "⛵ Sail to Island 3 & Get Diamond Rod"
  },
  3: {
    subtitle: "Quest 3 Complete — Sail to Volcano Island!",
    paragraphs: [
      "Lead of the Poster Team for SCENE &amp; Student Council! Now only one final fragment remains.",
      "Brace yourself—I'm steering my boat to <strong>Caldera Volcano (Island 4)</strong>! A terrifying <strong>Molten Kraken</strong> guards your final bottle there.",
      "Take the <strong>Trident Rod</strong>! While keeping the line in the bar, move left and right (<kbd>A</kbd>/<kbd>D</kbd> or <kbd>◀</kbd>/<kbd>▶</kbd>) to dodge slow magma boulders—each hit deals <strong>-20 HP</strong>!"
    ],
    rewardRodId: 4,
    sailToIsland: 4,
    btnText: "⛵ Sail to Volcano Island & Get Trident Rod"
  },
  4: {
    subtitle: "All 4 Islands Conquered & Memories Restored!",
    paragraphs: [
      "You defeated the Molten Kraken and pieced together every single fragment of your resume!",
      "The volcanic ash has cleared into a golden sunrise. You remember everything now, Yul, and your complete resume is ready for the interviewer!"
    ],
    rewardRodId: null,
    btnText: "View Complete Interviewer Resume"
  }
};

const YORI_ACTIVE_REMINDERS = {
  1: {
    subtitle: "Quest 1 In Progress • Boat & Quest 2 Locked",
    paragraphs: [
      "Finish <strong>Quest 1</strong> here on <strong>Misty Monolith</strong> before we set sail for Island 2!",
      "Cast your <strong>Wooden Rod</strong> (100% bottle chance), uncork <strong>Bottle #1</strong>, and snap <strong>Piece I</strong> onto your Puzzle Board."
    ],
    lockedTitle: "🔒 Boat to Island 2 & Iron Rod Locked",
    lockedDesc: "Complete Quest 1 and place Piece I on the Puzzle Board first.",
    btnText: "Continue Quest 1"
  },
  2: {
    subtitle: "Quest 2 In Progress • Boat & Quest 3 Locked",
    paragraphs: [
      "Keep fishing on <strong>Coconut Sandbar</strong>! Bottles here have a <strong>75% chance</strong>—if you reel in a boot or fish, just cast again!",
      "Uncork <strong>Bottle #2</strong> and place <strong>Piece II (Education)</strong> onto the Puzzle Board to unlock the boat to Island 3."
    ],
    lockedTitle: "🔒 Boat to Island 3 & Diamond Rod Locked",
    lockedDesc: "Complete Quest 2 and place Piece II on the Puzzle Board first.",
    btnText: "Continue Quest 2"
  },
  3: {
    subtitle: "Quest 3 In Progress • Boat & Boss Quest Locked",
    paragraphs: [
      "The boat to Volcano Island remains anchored until you complete <strong>Quest 3</strong> here at <strong>Emerald Woods</strong>!",
      "Bottles have a <strong>65% catch chance</strong> here. Reel in <strong>Bottle #3</strong> and assemble <strong>Piece III (Experience &amp; Seminars)</strong>."
    ],
    lockedTitle: "🔒 Boat to Volcano Island & Trident Rod Locked",
    lockedDesc: "Complete Quest 3 and place Piece III on the Puzzle Board first.",
    btnText: "Continue Quest 3"
  },
  4: {
    subtitle: "Final Quest 4 • Defeat the Molten Kraken!",
    paragraphs: [
      "The <strong>Molten Kraken</strong> still rules the volcano caldera!",
      "Cast your <strong>Trident Rod</strong>, dodge its slow magma boulders (-20 HP per hit), defeat the beast, and assemble <strong>Piece IV</strong>!"
    ],
    lockedTitle: "🔒 Full Memory Restoration Locked",
    lockedDesc: "Defeat the Molten Kraken, uncork Bottle #4 & place Piece IV on the puzzle board.",
    btnText: "Continue Final Boss"
  }
};