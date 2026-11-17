/**
 * Nintendo DS Web Audio Sound Synthesizer & BGM Engine (v4.0)
 * Sample-accurate recreation of Nintendo DS audio:
 * - Boot Chime (Dual harmonic bells)
 * - Tactile Stylus Tap (Subtle acoustic click)
 * - Menu Select & Cancel chirps
 * - Cartridge Mechanical Snap
 * - PictoChat Send Chime
 * - Full 128-Step (~27s) Multi-Movement Nintendo DSi / Wii Shop Marimba Soundtrack:
 *   • Section A: Main DSi Shop bouncy walk
 *   • Section B: Sunshine high-octave counter-melody with sparkling chimes
 *   • Section C: Dreamy PictoChat arpeggios & deep walking bass
 *   • Section D: Joyful staccato breakdown with turnaround triplets
 * - Lookahead Web Audio scheduling for sample-accurate timing across all browsers.
 */

class DSAudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.bgmEnabled = false;
    this.bgmVolume = 0.28;
    this.sfxVolume = 0.45;

    // BGM Lookahead Scheduler state
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.nextStepTime = 0;
    this.stepDuration = 0.21; // ~142 BPM in 4/4 meter (8th note steps)
    this.noiseBuffer = null;
    this.bgmMasterGain = null;
    this.bgmFilter = null;
    this.bgmCompressor = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * OG Nintendo DS Stylus Screen Tap Sound
   * Soft, high-passed acoustic plastic tick (12ms)
   */
  playStylusTap() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(3.0, now);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

    gain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * OG Nintendo DS Menu Select / Button Chirp
   */
  playSelect() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.035); // E6

    gain.gain.setValueAtTime(0.22 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  }

  /**
   * OG Nintendo DS Cancel / Back Blip
   */
  playCancel() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.setValueAtTime(587.33, now + 0.035); // D5

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /**
   * OG Nintendo DS Startup Double Bell Chime
   */
  playBootChime() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._ringBell(1046.5, now + 0.02, 0.85, 0.35); // C6
    this._ringBell(2093.0, now + 0.02, 0.5, 0.15);  // Octave harmonic
    this._ringBell(2093.0, now + 0.28, 1.1, 0.45);  // High C7
    this._ringBell(3135.9, now + 0.28, 0.7, 0.12);  // G7 shimmer
  }

  _ringBell(freq, time, duration, gainVal) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(gainVal * this.sfxVolume, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  /**
   * Cartridge Insertion Mechanical Snap Click
   */
  playCartridgeSnap() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._noiseClick(now, 0.018, 0.32);
    this._noiseClick(now + 0.035, 0.028, 0.45);
  }

  _noiseClick(startTime, duration, vol) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(540, startTime);
    osc.frequency.exponentialRampToValueAtTime(110, startTime + duration);

    gain.gain.setValueAtTime(vol * this.sfxVolume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  /**
   * PictoChat Send Chime
   */
  playPictoChatSend() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [659.25, 783.99, 987.77, 1318.51].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.04;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.11);
    });
  }

  // ==========================================================================
  // Nintendo DS Synthesized BGM Engine (128-Step Extended Soundtrack)
  // ==========================================================================

  _createNoiseBuffer() {
    if (!this.ctx || this.noiseBuffer) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  _initBgmBus() {
    if (this.bgmMasterGain) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Master Dynamics Compressor for balanced retro acoustics
    this.bgmCompressor = this.ctx.createDynamicsCompressor();
    this.bgmCompressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
    this.bgmCompressor.knee.setValueAtTime(10, this.ctx.currentTime);
    this.bgmCompressor.ratio.setValueAtTime(3, this.ctx.currentTime);
    this.bgmCompressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
    this.bgmCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);

    // Warm Retro Lowpass Filter (8200Hz)
    this.bgmFilter = this.ctx.createBiquadFilter();
    this.bgmFilter.type = "lowpass";
    this.bgmFilter.frequency.setValueAtTime(8200, this.ctx.currentTime);

    this.bgmMasterGain = this.ctx.createGain();
    this.bgmMasterGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);

    this.bgmMasterGain.connect(this.bgmFilter);
    this.bgmFilter.connect(this.bgmCompressor);
    this.bgmCompressor.connect(this.ctx.destination);

    this._createNoiseBuffer();
  }

  /**
   * Resonant Wooden Marimba Note
   */
  _playMarimba(freq, time, dur, velocity = 1.0) {
    if (!freq || freq <= 0) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(freq * 3.6, 7500), time);

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, time);

    const vol = 0.20 * velocity;
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmMasterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur + 0.05);
    osc2.stop(time + dur + 0.05);
  }

  /**
   * Deep Retro Triangle Bass
   */
  _playBass(freq, time, dur) {
    if (!freq || freq <= 0) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(360, time);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  /**
   * Sparkling Glockenspiel Bell Chime
   */
  _playChime(freq, time, dur) {
    if (!freq || freq <= 0) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, time);

    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur + 0.05);
    osc2.stop(time + dur + 0.05);
  }

  /**
   * Retro Stylus Shaker / Brush Hi-Hat
   */
  _playBrush(time) {
    if (!this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(6800, time);
    filter.Q.setValueAtTime(2.2, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.032, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.024);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);

    src.start(time);
    src.stop(time + 0.03);
  }

  /**
   * Hollow Retro Woodblock Tap
   */
  _playWoodblock(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(820, time);
    filter.Q.setValueAtTime(4.0, time);

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, time);
    osc.frequency.exponentialRampToValueAtTime(460, time + 0.022);

    gain.gain.setValueAtTime(0.07, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(time);
    osc.stop(time + 0.04);
  }

  /**
   * Web Audio Lookahead Scheduler
   */
  _scheduleAhead() {
    if (!this.bgmEnabled || !this.ctx) return;

    // Schedule events up to 0.12s in advance
    while (this.nextStepTime < this.ctx.currentTime + 0.12) {
      this._playStep(this.bgmStep, this.nextStepTime);
      this.nextStepTime += this.stepDuration;
      this.bgmStep = (this.bgmStep + 1) % 128;
    }

    if (this.bgmEnabled) {
      this.bgmTimer = setTimeout(() => this._scheduleAhead(), 25);
    }
  }

  _playStep(step, time) {
    // 128-step Multi-part melody (C Major / A Minor)
    const melody = [
      // ================= Section 1: Main Theme A (DSi Shop Stroll - 32 steps) =================
      { f: 587.33, d: 0.18, v: 0.9 }, { f: 659.25, d: 0.16, v: 0.8 }, { f: 783.99, d: 0.22, v: 1.0 }, { f: 987.77, d: 0.18, v: 0.85 },
      { f: 880.00, d: 0.16, v: 0.8 }, { f: 783.99, d: 0.16, v: 0.8 }, { f: 659.25, d: 0.24, v: 0.95 }, { f: 587.33, d: 0.18, v: 0.75 },
      { f: 523.25, d: 0.18, v: 0.9 }, { f: 659.25, d: 0.16, v: 0.8 }, { f: 880.00, d: 0.22, v: 1.0 }, { f: 1046.50, d: 0.20, v: 0.9 },
      { f: 987.77, d: 0.18, v: 0.85 }, { f: 783.99, d: 0.18, v: 0.8 }, { f: 659.25, d: 0.24, v: 0.9 }, { f: 587.33, d: 0.18, v: 0.75 },
      { f: 587.33, d: 0.18, v: 0.85 }, { f: 698.46, d: 0.16, v: 0.8 }, { f: 880.00, d: 0.20, v: 0.95 }, { f: 987.77, d: 0.18, v: 0.85 },
      { f: 1046.50, d: 0.22, v: 1.0 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.18, v: 0.8 }, { f: 698.46, d: 0.18, v: 0.75 },
      { f: 783.99, d: 0.22, v: 0.95 }, { f: 587.33, d: 0.16, v: 0.8 }, { f: 659.25, d: 0.18, v: 0.85 }, { f: 783.99, d: 0.20, v: 0.9 },
      { f: 0, d: 0.10, v: 0 }, { f: 880.00, d: 0.18, v: 0.85 }, { f: 987.77, d: 0.22, v: 0.95 }, { f: 0, d: 0.10, v: 0 },

      // ================= Section 2: Theme B (Sunshine High Octave & Chimes - 32 steps) =================
      { f: 1046.50, d: 0.22, v: 1.0 }, { f: 0, d: 0.10, v: 0 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 783.99, d: 0.18, v: 0.8 },
      { f: 880.00, d: 0.20, v: 0.9 }, { f: 0, d: 0.10, v: 0 }, { f: 783.99, d: 0.18, v: 0.8 }, { f: 659.25, d: 0.22, v: 0.85 },
      { f: 783.99, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.18, v: 0.85 }, { f: 1046.50, d: 0.20, v: 0.95 }, { f: 1174.66, d: 0.22, v: 1.0 },
      { f: 1046.50, d: 0.22, v: 0.9 }, { f: 0, d: 0.10, v: 0 }, { f: 880.00, d: 0.18, v: 0.8 }, { f: 783.99, d: 0.18, v: 0.75 },
      { f: 698.46, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.18, v: 0.85 }, { f: 1046.50, d: 0.20, v: 0.95 }, { f: 1318.51, d: 0.24, v: 1.0 },
      { f: 1174.66, d: 0.22, v: 0.9 }, { f: 0, d: 0.10, v: 0 }, { f: 1046.50, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.18, v: 0.8 },
      { f: 987.77, d: 0.20, v: 0.9 }, { f: 0, d: 0.10, v: 0 }, { f: 783.99, d: 0.18, v: 0.8 }, { f: 880.00, d: 0.18, v: 0.85 },
      { f: 783.99, d: 0.18, v: 0.8 }, { f: 659.25, d: 0.18, v: 0.8 }, { f: 587.33, d: 0.18, v: 0.75 }, { f: 523.25, d: 0.22, v: 0.85 },

      // ================= Section 3: Theme C (PictoChat Dreamy Arpeggios - 32 steps) =================
      { f: 659.25, d: 0.20, v: 0.9 }, { f: 783.99, d: 0.18, v: 0.85 }, { f: 987.77, d: 0.20, v: 0.9 }, { f: 1318.51, d: 0.24, v: 1.0 },
      { f: 1174.66, d: 0.20, v: 0.9 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 783.99, d: 0.18, v: 0.8 }, { f: 659.25, d: 0.22, v: 0.85 },
      { f: 523.25, d: 0.20, v: 0.85 }, { f: 659.25, d: 0.18, v: 0.8 }, { f: 880.00, d: 0.20, v: 0.9 }, { f: 1046.50, d: 0.22, v: 0.95 },
      { f: 987.77, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.18, v: 0.8 }, { f: 659.25, d: 0.20, v: 0.85 }, { f: 523.25, d: 0.22, v: 0.8 },
      { f: 587.33, d: 0.20, v: 0.85 }, { f: 698.46, d: 0.18, v: 0.8 }, { f: 880.00, d: 0.20, v: 0.9 }, { f: 1174.66, d: 0.24, v: 1.0 },
      { f: 1046.50, d: 0.20, v: 0.9 }, { f: 880.00, d: 0.18, v: 0.85 }, { f: 698.46, d: 0.18, v: 0.8 }, { f: 587.33, d: 0.22, v: 0.8 },
      { f: 783.99, d: 0.20, v: 0.9 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 1174.66, d: 0.20, v: 0.95 }, { f: 1396.91, d: 0.22, v: 1.0 },
      { f: 1318.51, d: 0.22, v: 0.95 }, { f: 1174.66, d: 0.20, v: 0.9 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 783.99, d: 0.22, v: 0.85 },

      // ================= Section 4: Theme D (Joyful Staccato Breakdown & Turnaround - 32 steps) =================
      { f: 523.25, d: 0.16, v: 0.9 }, { f: 523.25, d: 0.16, v: 0.85 }, { f: 659.25, d: 0.18, v: 0.9 }, { f: 783.99, d: 0.20, v: 0.95 },
      { f: 1046.50, d: 0.18, v: 1.0 }, { f: 1046.50, d: 0.18, v: 0.9 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.20, v: 0.9 },
      { f: 587.33, d: 0.16, v: 0.85 }, { f: 587.33, d: 0.16, v: 0.8 }, { f: 698.46, d: 0.18, v: 0.9 }, { f: 880.00, d: 0.20, v: 0.95 },
      { f: 1174.66, d: 0.18, v: 1.0 }, { f: 1174.66, d: 0.18, v: 0.9 }, { f: 1046.50, d: 0.18, v: 0.85 }, { f: 987.77, d: 0.20, v: 0.9 },
      { f: 659.25, d: 0.18, v: 0.9 }, { f: 783.99, d: 0.18, v: 0.9 }, { f: 1046.50, d: 0.20, v: 0.95 }, { f: 1318.51, d: 0.22, v: 1.0 },
      { f: 1174.66, d: 0.18, v: 0.9 }, { f: 1046.50, d: 0.18, v: 0.85 }, { f: 987.77, d: 0.18, v: 0.85 }, { f: 880.00, d: 0.20, v: 0.9 },
      { f: 783.99, d: 0.16, v: 0.85 }, { f: 880.00, d: 0.16, v: 0.85 }, { f: 987.77, d: 0.18, v: 0.9 }, { f: 1046.50, d: 0.18, v: 0.95 },
      { f: 1174.66, d: 0.20, v: 1.0 }, { f: 1318.51, d: 0.22, v: 1.05 }, { f: 1567.98, d: 0.24, v: 1.1 }, { f: 1046.50, d: 0.28, v: 1.0 }
    ];

    // 64-step walking bassline (each note plays for 2 steps / 1 beat)
    const bass = [
      // S1 Bass (C -> Am -> F -> G)
      130.81, 196.00, 220.00, 164.81, 174.61, 261.63, 196.00, 146.83,
      130.81, 196.00, 220.00, 164.81, 174.61, 261.63, 196.00, 246.94,

      // S2 Bass (F -> G -> Em -> Am -> Dm -> G -> C)
      174.61, 261.63, 196.00, 293.66, 164.81, 246.94, 220.00, 164.81,
      146.83, 220.00, 196.00, 293.66, 130.81, 196.00, 130.81, 196.00,

      // S3 Bass (Dreamy descending walk)
      130.81, 196.00, 246.94, 196.00, 220.00, 164.81, 196.00, 146.83,
      174.61, 261.63, 164.81, 246.94, 146.83, 220.00, 196.00, 246.94,

      // S4 Bass (Energetic Turnaround)
      130.81, 164.81, 146.83, 174.61, 164.81, 196.00, 174.61, 220.00,
      146.83, 174.61, 196.00, 246.94, 130.81, 164.81, 196.00, 196.00
    ];

    // 1. Play Lead Marimba
    const note = melody[step];
    if (note && note.f > 0) {
      this._playMarimba(note.f, time, note.d, note.v);
    }

    // 2. Play Bass (on every 2 steps)
    if (step % 2 === 0) {
      const bassIndex = Math.floor(step / 2) % bass.length;
      this._playBass(bass[bassIndex], time, 0.36);
    }

    // 3. Play Counter-Chimes on melodic accents
    const chimeTable = {
      // S2 Sparkles
      34: 1567.98, 38: 1760.00, 42: 2093.00, 46: 1760.00,
      50: 1567.98, 54: 1318.51, 58: 1760.00, 62: 2093.00,
      // S3 Atmospheric echoes
      66: 1318.51, 70: 1567.98, 74: 1760.00, 78: 1318.51,
      82: 1174.66, 86: 1318.51, 90: 1567.98, 94: 1760.00,
      // S4 Turnaround fanfare
      96: 1046.50, 100: 1174.66, 104: 1318.51, 108: 1396.91,
      112: 1567.98, 116: 1760.00, 120: 1975.53, 124: 2093.00
    };
    if (chimeTable[step]) {
      this._playChime(chimeTable[step], time, 0.38);
    }

    // 4. Subtle Shaker / Brush on off-beats
    if (step % 2 === 1) {
      this._playBrush(time);
    }

    // 5. Woodblock tap on turnaround accents (Section 4)
    if (step >= 96 && (step % 4 === 2)) {
      this._playWoodblock(time);
    }
  }

  /**
   * Smooth, Nostalgic Nintendo DSi / Wii Shop Chill Marimba Theme
   * 100% royalty-free & synthesized natively with Web Audio oscillators.
   */
  toggleBGM() {
    this.ensureContext();

    if (this.bgmEnabled) {
      this.bgmEnabled = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
      if (this.bgmMasterGain && this.ctx) {
        // Quick 50ms fade-out to prevent pop/click
        this.bgmMasterGain.gain.setValueAtTime(this.bgmMasterGain.gain.value, this.ctx.currentTime);
        this.bgmMasterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      }
      return false;
    }

    this._initBgmBus();
    if (!this.ctx) return false;

    // Reset gain to normal volume
    this.bgmMasterGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);

    this.bgmEnabled = true;
    this.bgmStep = 0;
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this._scheduleAhead();

    return true;
  }
}

window.dsAudio = new DSAudioEngine();
