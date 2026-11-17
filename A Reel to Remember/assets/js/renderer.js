// ============================================================================
// 2.5D CANVAS RENDERER: 4 ISLANDS, BOAT VOYAGES, CHARACTERS & MOLTEN KRAKEN
// ============================================================================

function drawIsland1MistyMonolith(w, h, waterY, t) {
  ctx.fillStyle = gameState.stormCleared ? "rgba(255, 255, 255, 0.35)" : "rgba(100, 116, 139, 0.22)";
  for (let i = 0; i < 5; i++) {
    const cx = ((w * 0.22 * i + t * 8) % (w + 300)) - 150;
    const cy = h * (0.14 + (i % 3) * 0.06);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 150, 34, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const islBaseX = w * 0.14;
  const islWidth = Math.max(250, w * 0.27);
  const rockDark = gameState.stormCleared ? "#334155" : "#2d3540";
  const rockMid = gameState.stormCleared ? "#475569" : "#3f4a59";
  const rockLight = gameState.stormCleared ? "#64748b" : "#556275";

  // Tall Rectangular Cliff Monolith on Right
  ctx.fillStyle = rockLight;
  ctx.beginPath();
  ctx.moveTo(islBaseX + islWidth * 0.56, waterY);
  ctx.lineTo(islBaseX + islWidth * 0.56, waterY - h * 0.36);
  ctx.lineTo(islBaseX + islWidth * 0.84, waterY - h * 0.39);
  ctx.lineTo(islBaseX + islWidth * 0.88, waterY - h * 0.22);
  ctx.lineTo(islBaseX + islWidth * 0.94, waterY - h * 0.22);
  ctx.lineTo(islBaseX + islWidth * 0.94, waterY);
  ctx.closePath();
  ctx.fill();

  // Overhanging Cliff Arch & Left Crag
  ctx.fillStyle = rockDark;
  ctx.beginPath();
  ctx.moveTo(islBaseX + islWidth * 0.18, waterY);
  ctx.lineTo(islBaseX + islWidth * 0.18, waterY - h * 0.31);
  ctx.lineTo(islBaseX + islWidth * 0.58, waterY - h * 0.30);
  ctx.lineTo(islBaseX + islWidth * 0.58, waterY - h * 0.13);
  ctx.lineTo(islBaseX + islWidth * 0.38, waterY - h * 0.13);
  ctx.lineTo(islBaseX + islWidth * 0.38, waterY);
  ctx.closePath();
  ctx.fill();

  // Stepped Rocky Shore Base
  ctx.fillStyle = rockMid;
  ctx.beginPath();
  ctx.moveTo(islBaseX - 18, waterY + 6);
  ctx.lineTo(islBaseX - 18, waterY - 22);
  ctx.lineTo(islBaseX + islWidth * 0.12, waterY - 22);
  ctx.lineTo(islBaseX + islWidth * 0.12, waterY - 34);
  ctx.lineTo(islBaseX + islWidth * 0.98, waterY - 34);
  ctx.lineTo(islBaseX + islWidth * 1.04, waterY + 6);
  ctx.closePath();
  ctx.fill();

  // Glowing Pink/Crimson Island Flora Tufts
  const floraGlow = 0.72 + Math.sin(t * 3) * 0.22;
  for (const fp of [0.24, 0.34, 0.45, 0.53]) {
    const fx = islBaseX + islWidth * fp;
    const fy = waterY - 34;
    ctx.fillStyle = `rgba(244, 63, 94, ${floraGlow})`;
    ctx.beginPath();
    ctx.arc(fx, fy - 3, 4.5, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = `rgba(251, 113, 133, ${floraGlow})`;
    ctx.beginPath();
    ctx.arc(fx + 5, fy - 2, 3, Math.PI, 0);
    ctx.fill();
  }

  // Tall Evergreen Pine Tree
  const treeX = islBaseX + islWidth * 0.14;
  const treeBaseY = waterY - 34;
  const sway = Math.sin(t * 1.8) * 3;
  ctx.fillStyle = "#292018";
  ctx.fillRect(treeX - 5, treeBaseY - 40, 10, 40);

  const treeColor = gameState.stormCleared ? "#15803d" : "#2f4f4f";
  for (let tier = 0; tier < 5; tier++) {
    const tierY = treeBaseY - 32 - tier * 24;
    const tierHalfW = 36 - tier * 5.5;
    ctx.fillStyle = treeColor;
    ctx.beginPath();
    ctx.moveTo(treeX - tierHalfW + sway * (tier * 0.2), tierY);
    ctx.lineTo(treeX + sway * (tier * 0.35), tierY - 34);
    ctx.lineTo(treeX + tierHalfW + sway * (tier * 0.2), tierY);
    ctx.closePath();
    ctx.fill();
  }

  // Campfire & Rising Embers
  const fireX = w * 0.30;
  const fireY = waterY - 34;
  ctx.fillStyle = "#451a03";
  ctx.fillRect(fireX - 10, fireY - 4, 20, 4);
  const flameH = 14 + Math.sin(t * 16) * 4;
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(fireX - 8, fireY - 3);
  ctx.quadraticCurveTo(fireX, fireY - flameH - 6, fireX + 8, fireY - 3);
  ctx.fill();
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.moveTo(fireX - 4, fireY - 3);
  ctx.quadraticCurveTo(fireX, fireY - flameH * 0.7, fireX + 4, fireY - 3);
  ctx.fill();

  for (const emb of gameState.world.embers) {
    ctx.fillStyle = `rgba(251, 146, 60, ${emb.alpha * (1 - emb.yOffset / 65)})`;
    ctx.beginPath();
    ctx.arc(emb.x * w + Math.sin(t * 4 + emb.yOffset) * 5, fireY - 8 - emb.yOffset, emb.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCoconutPalmTree(baseX, baseY, height, leanDir, t) {
  const sway = Math.sin(t * 1.9 + baseX * 0.01) * 5;
  const topX = baseX + leanDir * 28 + sway;
  const topY = baseY - height;

  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.quadraticCurveTo(baseX + leanDir * 10, baseY - height * 0.55, topX, topY);
  ctx.stroke();

  ctx.strokeStyle = "#92400e";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = "#451a03";
  for (const [ox, oy] of [[-5, 4], [5, 4], [0, 8]]) {
    ctx.beginPath();
    ctx.arc(topX + ox, topY + oy, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const frondAngles = [-2.6, -2.0, -1.2, -0.4, 0.25, 0.75];
  for (const ang of frondAngles) {
    const len = 46;
    const fx = topX + Math.cos(ang) * len;
    const fy = topY + Math.sin(ang) * len + 12;
    ctx.strokeStyle = "#15803d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + Math.cos(ang) * len * 0.55, topY + Math.sin(ang) * len * 0.55 - 8, fx, fy);
    ctx.stroke();

    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.ellipse((topX + fx) * 0.5, (topY + fy) * 0.5 - 2, 16, 5, ang, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIsland2CoconutSandbar(w, h, waterY, t) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
  for (let i = 0; i < 4; i++) {
    const cx = ((w * 0.28 * i + t * 10) % (w + 260)) - 130;
    const cy = h * (0.14 + (i % 2) * 0.06);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 95, 24, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const islBaseX = w * 0.13;
  const islWidth = Math.max(270, w * 0.29);

  const sandGrad = ctx.createLinearGradient(0, waterY - 58, 0, waterY + 6);
  sandGrad.addColorStop(0, "#fef08a");
  sandGrad.addColorStop(0.55, "#facc15");
  sandGrad.addColorStop(1, "#ca8a04");

  ctx.fillStyle = sandGrad;
  ctx.beginPath();
  ctx.moveTo(islBaseX - 24, waterY + 6);
  ctx.quadraticCurveTo(islBaseX + islWidth * 0.48, waterY - 72, islBaseX + islWidth + 14, waterY - 34);
  ctx.lineTo(islBaseX + islWidth + 24, waterY + 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fde047";
  ctx.fillRect(islBaseX + 12, waterY - 36, islWidth - 10, 12);

  drawCoconutPalmTree(islBaseX + islWidth * 0.18, waterY - 36, 132, -0.7, t);
  drawCoconutPalmTree(islBaseX + islWidth * 0.27, waterY - 38, 104, 0.85, t);
  drawCoconutPalmTree(islBaseX + islWidth * 0.68, waterY - 36, 118, 0.6, t);

  ctx.fillStyle = "#fb7185";
  ctx.beginPath();
  ctx.arc(islBaseX + islWidth * 0.42, waterY - 26, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffbeb";
  ctx.beginPath();
  ctx.arc(islBaseX + islWidth * 0.56, waterY - 25, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawIsland3EmeraldWoods(w, h, waterY, t) {
  ctx.fillStyle = "rgba(220, 252, 231, 0.35)";
  for (let i = 0; i < 4; i++) {
    const cx = ((w * 0.26 * i + t * 9) % (w + 260)) - 130;
    const cy = h * (0.16 + (i % 2) * 0.05);
    ctx.beginPath();
    ctx.ellipse(cx, cy, 110, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const islBaseX = w * 0.13;
  const islWidth = Math.max(275, w * 0.29);

  ctx.fillStyle = "#3f2e21";
  ctx.beginPath();
  ctx.moveTo(islBaseX - 20, waterY + 6);
  ctx.lineTo(islBaseX - 10, waterY - 34);
  ctx.lineTo(islBaseX + islWidth + 14, waterY - 34);
  ctx.lineTo(islBaseX + islWidth + 22, waterY + 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#166534";
  ctx.beginPath();
  ctx.moveTo(islBaseX - 10, waterY - 34);
  ctx.quadraticCurveTo(islBaseX + islWidth * 0.35, waterY - 115, islBaseX + islWidth * 0.72, waterY - 34);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(islBaseX - 10, waterY - 38, islWidth + 24, 8);

  const treeSpecs = [
    { x: islBaseX + islWidth * 0.12, h: 128, c: "#14532d" },
    { x: islBaseX + islWidth * 0.25, h: 152, c: "#15803d" },
    { x: islBaseX + islWidth * 0.56, h: 118, c: "#166534" },
    { x: islBaseX + islWidth * 0.74, h: 138, c: "#15803d" }
  ];

  for (const tr of treeSpecs) {
    const sway = Math.sin(t * 1.6 + tr.x) * 2.5;
    ctx.fillStyle = "#451a03";
    ctx.fillRect(tr.x - 4, waterY - 36 - 30, 8, 30);

    for (let tier = 0; tier < 4; tier++) {
      const ty = waterY - 56 - tier * (tr.h * 0.18);
      const hw = 30 - tier * 5;
      ctx.fillStyle = tr.c;
      ctx.beginPath();
      ctx.moveTo(tr.x - hw + sway, ty);
      ctx.lineTo(tr.x + sway * 1.3, ty - 32);
      ctx.lineTo(tr.x + hw + sway, ty);
      ctx.closePath();
      ctx.fill();
    }
  }

  for (let i = 0; i < 12; i++) {
    const fx = islBaseX + 20 + ((i * 37 + Math.sin(t * 2 + i) * 18) % (islWidth - 20));
    const fy = waterY - 46 - ((i * 19 + Math.cos(t * 2.4 + i) * 14) % 95);
    const alpha = 0.45 + Math.sin(t * 5 + i) * 0.45;
    ctx.fillStyle = `rgba(190, 242, 100, ${alpha})`;
    ctx.beginPath();
    ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIsland4CalderaVolcano(w, h, waterY, t) {
  const islBaseX = w * 0.12;
  const islWidth = Math.max(280, w * 0.30);

  const peakX = islBaseX + islWidth * 0.28;
  const peakY = waterY - h * 0.39;

  ctx.fillStyle = "#1c1917";
  ctx.beginPath();
  ctx.moveTo(islBaseX - 28, waterY + 6);
  ctx.lineTo(peakX - 24, peakY);
  ctx.lineTo(peakX + 24, peakY);
  ctx.lineTo(islBaseX + islWidth * 0.72, waterY - 34);
  ctx.lineTo(islBaseX + islWidth + 24, waterY - 34);
  ctx.lineTo(islBaseX + islWidth + 30, waterY + 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.ellipse(peakX, peakY + 2, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.ellipse(peakX, peakY + 2, 14, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  const lavaPulse = 0.75 + Math.sin(t * 5) * 0.25;
  ctx.strokeStyle = `rgba(249, 115, 22, ${lavaPulse})`;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(peakX - 6, peakY + 4);
  ctx.quadraticCurveTo(peakX - 25, waterY - 120, islBaseX + 18, waterY - 34);
  ctx.stroke();

  ctx.strokeStyle = `rgba(253, 224, 71, ${lavaPulse})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#292524";
  ctx.fillRect(islBaseX - 12, waterY - 36, islWidth + 32, 10);

  for (const emb of gameState.world.embers) {
    ctx.fillStyle = `rgba(239, 68, 68, ${emb.alpha})`;
    ctx.beginPath();
    ctx.arc(peakX + Math.sin(t * 3 + emb.yOffset) * 26, peakY - emb.yOffset * 1.3, emb.size + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMoltenGiantOctopus(centerX, waterY) {
  const t = gameState.world.time;
  const isSinking = gameState.bossDefeat.active;
  const sinkProgress = isSinking ? gameState.bossDefeat.progress : 0;
  const sinkOffsetY = sinkProgress * 210;
  const sway = isSinking ? Math.sin(t * 16) * 6 : Math.sin(t * 2.4) * 6;

  ctx.save();

  const ringAlpha = Math.max(0, 1 - sinkProgress * 0.85);
  const drawMoltenPool = (rx, ry, radX, radY) => {
    const grad = ctx.createRadialGradient(rx, ry, 2, rx, ry, radX);
    grad.addColorStop(0, `rgba(254, 249, 195, ${0.95 * ringAlpha})`);
    grad.addColorStop(0.45, `rgba(251, 191, 36, ${0.75 * ringAlpha})`);
    grad.addColorStop(0.8, `rgba(234, 88, 12, ${0.45 * ringAlpha})`);
    grad.addColorStop(1, "rgba(234, 88, 12, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(rx, ry, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  drawMoltenPool(centerX - 6, waterY + 12, 68, 18);
  drawMoltenPool(centerX - 72, waterY + 20, 26, 8);
  drawMoltenPool(centerX + 54, waterY + 20, 26, 8);
  drawMoltenPool(centerX - 96, waterY + 4, 20, 6);
  drawMoltenPool(centerX + 76, waterY + 6, 20, 6);

  ctx.beginPath();
  ctx.rect(centerX - 185, waterY - 265, 370, 286);
  ctx.clip();

  ctx.translate(centerX + sway * 0.4, waterY + 14 + sinkOffsetY);

  const drawCurledArm = (points, baseWidth, hasSuckers = true) => {
    const [x0, y0, cx1, cy1, cx2, cy2, x1, y1] = points;
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = baseWidth + 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0 + 2);
    ctx.bezierCurveTo(cx1, cy1 + 2, cx2, cy2 + 2, x1, y1 + 2);
    ctx.stroke();

    ctx.strokeStyle = "#6b3410";
    ctx.lineWidth = baseWidth;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, y1);
    ctx.stroke();

    if (hasSuckers) {
      for (let s = 0.2; s <= 0.85; s += 0.16) {
        const mt = 1 - s;
        const sx = mt * mt * mt * x0 + 3 * mt * mt * s * cx1 + 3 * mt * s * s * cx2 + s * s * s * x1;
        const sy = mt * mt * mt * y0 + 3 * mt * mt * s * cy1 + 3 * mt * s * s * cy2 + s * s * s * y1;
        ctx.fillStyle = "#fde68a";
        ctx.beginPath();
        ctx.arc(sx, sy + baseWidth * 0.28, Math.max(1.8, baseWidth * 0.22), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const w1 = Math.sin(t * 2.8) * 9;
  const w2 = Math.cos(t * 2.5) * 9;

  drawCurledArm([-44, -6, -98, -68, -94, -158, -56 + w1, -172], 12, true);
  drawCurledArm([-36, -4, -112, -52, -118, -118, -82 - w2, -112], 10, true);
  drawCurledArm([48, -6, 108, -66, 106, -154, 68 - w1, -168], 12, true);
  drawCurledArm([18, -12, 16, -86, 6, -142, 34 + w2, -138], 9, true);

  const drawWhipClub = (x0, y0, cx, cy, tipX, tipY, flipDir) => {
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, tipX, tipY);
    ctx.stroke();

    ctx.strokeStyle = "#57534e";
    ctx.lineWidth = 2.6;
    ctx.stroke();

    ctx.save();
    ctx.translate(tipX, tipY);
    ctx.rotate(flipDir * 0.55);
    ctx.fillStyle = "#57534e";
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -14, 6, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#fef08a";
    ctx.lineWidth = 1.4;
    for (let ty = -26; ty <= -4; ty += 5) {
      ctx.beginPath();
      ctx.moveTo(flipDir * 5, ty);
      ctx.lineTo(flipDir * 11, ty - 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawWhipClub(-96, -8, -112, -62, -62 + w2 * 0.6, -104, 1);
  drawWhipClub(76, -6, 118, -58, 92 - w1 * 0.6, -124, -1);

  ctx.save();
  ctx.translate(14, -76);
  ctx.rotate(0.32);

  ctx.fillStyle = "#57534e";
  ctx.strokeStyle = "#ea580c";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-22, -32);
  ctx.quadraticCurveTo(-44, -44, -20, -64);
  ctx.lineTo(0, -82);
  ctx.lineTo(20, -64);
  ctx.quadraticCurveTo(44, -44, 22, -32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const shellGrad = ctx.createLinearGradient(-32, -70, 34, 38);
  shellGrad.addColorStop(0, "#78716c");
  shellGrad.addColorStop(0.45, "#57534e");
  shellGrad.addColorStop(0.85, "#292524");
  shellGrad.addColorStop(1, "#f97316");
  ctx.fillStyle = shellGrad;
  ctx.beginPath();
  ctx.moveTo(0, -86);
  ctx.lineTo(34, -30);
  ctx.lineTo(32, 34);
  ctx.lineTo(-32, 34);
  ctx.lineTo(-34, -30);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#fb923c";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = "#1c1917";
  ctx.lineWidth = 2.4;
  for (const py of [-32, -14, 4, 20]) {
    ctx.beginPath();
    ctx.moveTo(-32, py + 8);
    ctx.lineTo(0, py - 6);
    ctx.lineTo(32, py + 8);
    ctx.stroke();
  }

  ctx.strokeStyle = "#a8a29e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -82);
  ctx.lineTo(0, 32);
  ctx.stroke();

  ctx.fillStyle = "#d6d3d1";
  for (const sy of [-48, -28, -8, 12]) {
    ctx.beginPath();
    ctx.moveTo(-4, sy + 6);
    ctx.lineTo(0, sy - 7);
    ctx.lineTo(4, sy + 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#78716c";
  ctx.strokeStyle = "#292524";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-35, 28);
  ctx.lineTo(-22, 42);
  ctx.lineTo(-10, 32);
  ctx.lineTo(0, 45);
  ctx.lineTo(10, 32);
  ctx.lineTo(22, 42);
  ctx.lineTo(35, 28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  const headGrad = ctx.createLinearGradient(0, -48, 0, 2);
  headGrad.addColorStop(0, "#7c2d12");
  headGrad.addColorStop(0.55, "#b45309");
  headGrad.addColorStop(1, "#fef08a");
  ctx.fillStyle = headGrad;
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-34, -40);
  ctx.quadraticCurveTo(0, -52, 28, -34);
  ctx.lineTo(42, -4);
  ctx.quadraticCurveTo(0, 8, -46, -4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#9a3412";
  ctx.lineWidth = 2;
  for (let fx = -34; fx <= 30; fx += 12) {
    ctx.beginPath();
    ctx.moveTo(fx, -22);
    ctx.lineTo(fx * 1.15, -2);
    ctx.stroke();
  }

  ctx.fillStyle = "#991b1b";
  ctx.beginPath();
  ctx.ellipse(10, -26, 13, 10, -0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fef08a";
  ctx.shadowColor = "#f97316";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(10, -26, 8.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.arc(10, -26, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#450a0a";
  ctx.beginPath();
  ctx.ellipse(10, -26, 1.8, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCurledArm([-72, 6, -104, -56, -42, -74, -54 + w1 * 0.5, -22], 11, true);
  drawCurledArm([54, 6, 86, -54, 18, -72, 26 - w2 * 0.5, -26], 11, true);

  for (const bolt of gameState.fisch.lightningBolts) {
    ctx.strokeStyle = `rgba(254, 240, 138, ${bolt.life * 4.5})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-24 + bolt.seed * 48, -175);
    ctx.lineTo(14, -96);
    ctx.lineTo(-10, -68);
    ctx.lineTo(4, -36);
    ctx.stroke();
  }

  ctx.restore();
}

function drawYoriBoat(boatX, waterY, isMoving) {
  const bobY = Math.sin(gameState.world.time * (isMoving ? 9 : 3)) * (isMoving ? 3 : 2);
  ctx.save();
  ctx.translate(boatX, waterY + 4 + bobY);

  if (isMoving) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-48, 4);
    ctx.quadraticCurveTo(-70, -4, -92, 6);
    ctx.stroke();
  }

  ctx.fillStyle = "#78350f";
  ctx.strokeStyle = "#451a03";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-42, -6);
  ctx.lineTo(46, -6);
  ctx.lineTo(32, 12);
  ctx.lineTo(-30, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#fde68a";
  ctx.fillRect(-36, -2, 74, 3);

  ctx.fillStyle = "#334155";
  ctx.fillRect(-46, -12, 8, 18);

  if (isMoving) {
    ctx.fillStyle = "#d97706";
    ctx.fillRect(-24, -28, 14, 22);
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(-17, -34, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    ctx.arc(-17, -37, 8, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = "#0ea5e9";
    ctx.fillRect(10, -28, 14, 22);
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(17, -34, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.arc(17, -36, 7.5, Math.PI, 0);
    ctx.fill();
  }

  ctx.restore();
}

function drawCharacter(x, baseY, facing, walkPhase, opts) {
  const bob = Math.abs(Math.sin(walkPhase)) * 3;
  const legSwing = Math.sin(walkPhase) * 6;

  ctx.save();
  ctx.translate(x, baseY - bob);

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-4, -14);
  ctx.lineTo(-4 - legSwing * 0.5, 0);
  ctx.moveTo(4, -14);
  ctx.lineTo(4 + legSwing * 0.5, 0);
  ctx.stroke();

  ctx.fillStyle = opts.rainCloak ? "#334155" : opts.bodyColor;
  ctx.beginPath();
  ctx.roundRect(-10, -34, 20, 22, 6);
  ctx.fill();

  if (opts.rainCloak) {
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.fillStyle = opts.skinColor;
  ctx.beginPath();
  ctx.arc(0, -42, 8.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = opts.rainCloak ? "#334155" : opts.hatColor;
  ctx.beginPath();
  ctx.arc(0, -44, 9, Math.PI, 0);
  ctx.fill();

  if (opts.rod) {
    const tipX = facing * 42;
    const tipY = -52;
    ctx.strokeStyle = opts.rod.color;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(facing * 6, -28);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    if (opts.rod.id === 4) {
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(facing * 0.95);
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(-4, -2);
      ctx.lineTo(4, -2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -7);
      ctx.lineTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.lineTo(6, -7);
      ctx.stroke();
      ctx.restore();
    }
  }

  if (opts.label === "Yori") {
    const glow = 0.65 + Math.sin(gameState.world.time * 7) * 0.25;
    ctx.fillStyle = `rgba(251, 191, 36, ${glow})`;
    ctx.beginPath();
    ctx.arc(-14, -22, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = "700 11px Inter, sans-serif";
  ctx.textAlign = "center";
  const textW = ctx.measureText(opts.label).width + 12;
  ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
  ctx.beginPath();
  ctx.roundRect(-textW / 2, -68, textW, 17, 6);
  ctx.fill();

  ctx.fillStyle = "#f8fafc";
  ctx.fillText(opts.label, 0, -56);

  if (opts.hasQuestMarker) {
    const floatY = Math.sin(gameState.world.time * 5) * 4;
    ctx.fillStyle = "#facc15";
    ctx.font = "900 18px Inter, sans-serif";
    ctx.fillText("!", 0, -76 + floatY);
  }

  ctx.restore();
}

function renderScene() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const waterY = h * 0.67;
  const t = gameState.world.time;

  ctx.save();
  if (gameState.fisch.screenShake > 0) {
    const sx = (Math.random() - 0.5) * gameState.fisch.screenShake;
    const sy = (Math.random() - 0.5) * gameState.fisch.screenShake;
    ctx.translate(sx, sy);
  }

  const skyGrad = ctx.createLinearGradient(0, 0, 0, waterY);
  if (gameState.stormCleared) {
    skyGrad.addColorStop(0, "#38bdf8");
    skyGrad.addColorStop(0.6, "#bae6fd");
    skyGrad.addColorStop(1, "#fef08a");
  } else if (gameState.boatTrip.active) {
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(0.65, "#7dd3fc");
    skyGrad.addColorStop(1, "#e0f2fe");
  } else if (gameState.currentIsland === 1) {
    skyGrad.addColorStop(0, "#94a3b8");
    skyGrad.addColorStop(0.55, "#cbd5e1");
    skyGrad.addColorStop(1, "#e2e8f0");
  } else if (gameState.currentIsland === 2) {
    skyGrad.addColorStop(0, "#0ea5e9");
    skyGrad.addColorStop(0.6, "#7dd3fc");
    skyGrad.addColorStop(1, "#fef9c3");
  } else if (gameState.currentIsland === 3) {
    skyGrad.addColorStop(0, "#065f46");
    skyGrad.addColorStop(0.55, "#34d399");
    skyGrad.addColorStop(1, "#d1fae5");
  } else {
    skyGrad.addColorStop(0, "#1c1917");
    skyGrad.addColorStop(0.5, "#7f1d1d");
    skyGrad.addColorStop(1, "#ea580c");
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, waterY);

  const sunX = w * 0.72;
  const sunY = h * 0.21;
  ctx.fillStyle = gameState.currentIsland === 4 && !gameState.stormCleared
    ? "rgba(251, 146, 60, 0.65)"
    : "rgba(255, 251, 235, 0.75)";
  ctx.beginPath();
  ctx.arc(sunX, sunY, gameState.stormCleared ? 34 : 24, 0, Math.PI * 2);
  ctx.fill();

  if (gameState.world.lightningAlpha > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${gameState.world.lightningAlpha})`;
    ctx.fillRect(0, 0, w, waterY);
  }

  if (gameState.boatTrip.active) {
    const seaGrad = ctx.createLinearGradient(0, waterY, 0, h);
    seaGrad.addColorStop(0, "#0284c7");
    seaGrad.addColorStop(0.5, "#0369a1");
    seaGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, waterY, w, h - waterY);

    for (let row = 0; row < 12; row++) {
      const wy = waterY + 10 + row * ((h - waterY) / 12);
      ctx.strokeStyle = "rgba(224, 242, 254, 0.28)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let wx = 0; wx < w; wx += 48) {
        const offset = Math.sin(t * 4 + wx * 0.03 + row) * 4;
        ctx.moveTo(wx, wy + offset);
        ctx.lineTo(wx + 24, wy - offset);
      }
      ctx.stroke();
    }

    const boatX = w * (0.22 + gameState.boatTrip.progress * 0.56);
    drawYoriBoat(boatX, waterY, true);
    ctx.restore();
    return;
  }

  if (gameState.currentIsland === 1) {
    drawIsland1MistyMonolith(w, h, waterY, t);
  } else if (gameState.currentIsland === 2) {
    drawIsland2CoconutSandbar(w, h, waterY, t);
  } else if (gameState.currentIsland === 3) {
    drawIsland3EmeraldWoods(w, h, waterY, t);
  } else {
    drawIsland4CalderaVolcano(w, h, waterY, t);
  }

  const dockStartX = w * 0.36;
  const dockEndX = w * 0.49;
  const dockY = waterY - 24;
  ctx.fillStyle = "#5c3a21";
  ctx.fillRect(dockStartX, dockY, dockEndX - dockStartX, 9);

  for (let px = dockStartX + 12; px <= dockEndX - 8; px += 28) {
    ctx.fillStyle = "#3e2615";
    ctx.fillRect(px, dockY + 9, 7, 26);
  }

  const seaGrad = ctx.createLinearGradient(0, waterY, 0, h);
  if (gameState.stormCleared) {
    seaGrad.addColorStop(0, "#0284c7");
    seaGrad.addColorStop(0.5, "#0369a1");
    seaGrad.addColorStop(1, "#0f172a");
  } else if (gameState.currentIsland === 1) {
    seaGrad.addColorStop(0, "#64748b");
    seaGrad.addColorStop(0.45, "#475569");
    seaGrad.addColorStop(1, "#1e293b");
  } else if (gameState.currentIsland === 2) {
    seaGrad.addColorStop(0, "#06b6d4");
    seaGrad.addColorStop(0.5, "#0284c7");
    seaGrad.addColorStop(1, "#0f172a");
  } else if (gameState.currentIsland === 3) {
    seaGrad.addColorStop(0, "#0d9488");
    seaGrad.addColorStop(0.5, "#115e59");
    seaGrad.addColorStop(1, "#0f172a");
  } else {
    seaGrad.addColorStop(0, "#7c2d12");
    seaGrad.addColorStop(0.45, "#450a0a");
    seaGrad.addColorStop(1, "#090d16");
  }
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, waterY, w, h - waterY);

  for (let row = 0; row < 14; row++) {
    const wy = waterY + 8 + row * ((h - waterY) / 14);
    const alpha = 0.14 + (1 - row / 14) * 0.14;
    ctx.strokeStyle = gameState.currentIsland === 4 && !gameState.stormCleared
      ? `rgba(251, 146, 60, ${alpha})`
      : gameState.stormCleared
        ? `rgba(186, 230, 253, ${alpha})`
        : `rgba(226, 232, 240, ${alpha})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let wx = 0; wx < w; wx += 44) {
      const waveOffset = Math.sin(t * 2.5 + wx * 0.03 + row) * 3;
      ctx.moveTo(wx, wy + waveOffset);
      ctx.lineTo(wx + 22, wy - waveOffset);
    }
    ctx.stroke();
  }

  drawYoriBoat(dockEndX + 54, waterY, false);

  for (const r of gameState.world.ripples) {
    ctx.strokeStyle = `rgba(224, 242, 254, ${r.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(r.x, r.y, r.radius * 1.6, r.radius * 0.55, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (gameState.currentIsland === 4 && (!gameState.placedPieces.has(4) || gameState.bossDefeat.active)) {
    drawMoltenGiantOctopus(w * 0.77, waterY);
  }

  const yoriScreenX = w * 0.25;
  const yoriBaseY = waterY - 34;
  drawCharacter(yoriScreenX, yoriBaseY, 1, 0, {
    bodyColor: "#d97706",
    hatColor: "#92400e",
    skinColor: "#fde68a",
    label: "Yori",
    hasQuestMarker:
      gameState.questStage === 0 ||
      (gameState.questStage >= 1 && gameState.questStage < 4 && gameState.placedPieces.has(gameState.questStage))
  });

  const playerScreenX = gameState.player.x * w;
  const playerBaseY = gameState.player.x > 0.37 ? dockY : waterY - 34;
  const isInvulnBlink = gameState.fisch.invulnTimer > 0 && Math.floor(t * 20) % 2 === 0;
  if (!isInvulnBlink) {
    drawCharacter(playerScreenX, playerBaseY, gameState.player.facing, gameState.player.walkPhase, {
      bodyColor: "#0ea5e9",
      hatColor: "#1e293b",
      skinColor: "#fed7aa",
      label: "You (Yul)",
      rod: gameState.equippedRod,
      castingState: gameState.player.castingState,
      rainCloak: gameState.currentIsland === 1 && !gameState.stormCleared
    });
  }

  if (gameState.player.castingState !== "idle") {
    const rodTipX = playerScreenX + gameState.player.facing * 42;
    const rodTipY = playerBaseY - 52;
    const bx = gameState.player.bobberX;
    const by = gameState.player.bobberY + Math.sin(t * 6) * 2.5;

    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(rodTipX, rodTipY);
    ctx.quadraticCurveTo((rodTipX + bx) * 0.5, Math.min(rodTipY, by) + 18, bx, by);
    ctx.stroke();

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(bx, by, 5.5, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(bx, by, 5.5, 0, Math.PI);
    ctx.fill();

    if (gameState.player.castingState === "bite") {
      const bounce = Math.sin(t * 22) * 5;
      ctx.fillStyle = "#facc15";
      ctx.font = "900 28px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("!", bx, by - 18 + bounce);
    }
  }

  if (gameState.fisch.active && gameState.fisch.isBoss) {
    for (const b of gameState.fisch.boulders) {
      ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(b.targetX, b.groundY + 4, 22, 6, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);

      ctx.fillStyle = "#7f1d1d";
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(-4, -3, b.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (const pop of gameState.fisch.damagePopups) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, pop.alpha);
    ctx.font = "900 18px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = pop.color || "#fef08a";
    ctx.fillText(pop.text, pop.x, pop.y);
    ctx.restore();
  }

  if (gameState.currentIsland === 1 && !gameState.stormCleared) {
    ctx.strokeStyle = "rgba(226, 232, 240, 0.34)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const drop of gameState.world.raindrops) {
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - drop.len * 0.14, drop.y + drop.len);
    }
    ctx.stroke();
  }

  ctx.restore();
}