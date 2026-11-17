// ============================================================================
// SOUND ENGINE: WEB AUDIO API SYNTHESIZED RAIN, REEL, CORK POP & BOSS FX
// ============================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.rainGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.initialized = true;
      this.startRainAmbience();
    } catch (err) {
      console.warn("Web Audio unavailable:", err);
    }
  }

  startRainAmbience() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = this.muted ? 0 : 0.045;

    noise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.ctx.destination);
    noise.start();
  }

  setStormVolume(cleared) {
    if (!this.rainGain || !this.ctx) return;
    const target = this.muted ? 0 : (cleared ? 0.012 : 0.045);
    this.rainGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.4);
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setTargetAtTime(this.muted ? 0 : 0.04, this.ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  playTone(freq, type = "sine", duration = 0.15, gainVal = 0.14, slideTo = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playSplash() {
    this.playTone(190, "triangle", 0.24, 0.18, 65);
  }

  playBiteAlert() {
    this.playTone(680, "square", 0.12, 0.14, 920);
    setTimeout(() => this.playTone(960, "square", 0.16, 0.14), 110);
  }

  playTapTick(step) {
    this.playTone(340 + step * 45, "sine", 0.07, 0.12);
  }

  playCorkPop() {
    this.playTone(260, "sine", 0.18, 0.28, 880);
  }

  playPuzzleSnap() {
    this.playTone(523.25, "triangle", 0.14, 0.16);
    setTimeout(() => this.playTone(659.25, "triangle", 0.18, 0.16), 90);
  }

  playBossHit() {
    this.playTone(150, "sawtooth", 0.14, 0.16, 75);
  }

  playVictoryFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, "triangle", 0.35, 0.18), idx * 140);
    });
  }
}

const sfx = new SoundEngine();