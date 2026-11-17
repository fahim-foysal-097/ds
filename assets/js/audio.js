/**
 * Nintendo DS / DSi-inspired Web Audio Engine
 * BGM tune-up: chord-safe counterline, clean eighth-note articulation,
 * smoother tempo, and octave-only repeat variations.
 *
 * This is an original synthesis, not a recording or bit-perfect recreation
 * of Nintendo firmware audio. The layered transients, decaying partials,
 * restrained stereo/reverb, and plucked instruments aim for DS/DSi character.
 */
class DSAudioEngine {
  constructor() {
    this.ctx = null;

    this.sfxEnabled = true;
    this.bgmEnabled = false;
    this.bgmVolume = 0.28;
    this.sfxVolume = 0.45;

    // Lookahead scheduler state. Keep the same timing and looping behavior.
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bgmLoop = 0;
    this.nextStepTime = 0;
    this.stepDuration = 0.225;

    this.noiseBuffer = null;
    this.bgmMasterGain = null;
    this.bgmFilter = null;
    this.bgmCompressor = null;
    this.bgmReverb = null;
    this.bgmReverbGain = null;

    // Sixteen bars of original, DSi-inspired music in C major / A minor.
    // Each 16-step phrase spans two 4/4 bars at eighth-note resolution.
    this.melody = [
      // Cmaj7
      79, null, 84, 83, 79, null, 76, 72,
      76, null, 79, 84, 83, null, 79, null,
      // Am7
      81, null, 84, 88, 88, null, 84, 81,
      76, null, 79, 84, 88, null, 84, null,
      // Fmaj7
      81, null, 84, 88, 89, null, 88, 84,
      81, null, 77, 81, 84, null, 81, null,
      // G6
      79, null, 83, 86, 88, null, 86, 83,
      79, null, 83, 86, 88, null, 86, null,
      // Em7
      79, null, 83, 86, 88, null, 86, 83,
      79, null, 76, 79, 83, null, 79, null,
      // Am7
      81, null, 84, 88, 91, null, 88, 84,
      81, null, 84, 88, 91, null, 88, null,
      // Dm7
      77, null, 81, 84, 86, null, 84, 81,
      77, null, 74, 77, 81, null, 77, null,
      // G7 turnaround resolving to Cmaj7 on the loop
      79, null, 83, 86, 89, null, 86, 83,
      79, null, 83, 79, 74, null, 72, null
    ];

    this.chords = [
      [60, 64, 67, 71], // Cmaj7
      [57, 60, 64, 67], // Am7
      [53, 57, 60, 64], // Fmaj7
      [55, 59, 62, 64], // G6
      [52, 55, 59, 62], // Em7
      [57, 60, 64, 67], // Am7
      [50, 53, 57, 60], // Dm7
      [55, 59, 62, 65]  // G7
    ];

    // Eight quarter-note bass notes for each 16-step harmony phrase.
    this.bassPatterns = [
      [48, 55, 60, 55, 48, 55, 52, 55], // C
      [45, 52, 57, 52, 45, 52, 48, 52], // Am
      [41, 48, 53, 48, 41, 48, 45, 48], // F
      [43, 50, 55, 50, 43, 50, 47, 50], // G
      [40, 47, 52, 47, 40, 47, 43, 47], // Em
      [45, 52, 57, 52, 45, 52, 48, 52], // Am
      [38, 45, 50, 45, 38, 45, 41, 45], // Dm
      [43, 50, 55, 50, 43, 50, 47, 50]  // G7
    ];

    this.sparkles = new Map([
      [14, 91], [30, 88], [46, 93], [62, 91],
      [78, 88], [94, 93], [110, 86], [126, 89]
    ]);
  }

  init() {
    if (this.ctx) return;

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass({ latencyHint: "interactive" });
    } catch (error) {
      // Older browsers may not accept AudioContext options.
      this.ctx = new AudioContextClass();
    }

    this._createNoiseBuffer();
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      // AudioContext.resume() is permitted when called from a user gesture.
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  _midiToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  _createNoiseBuffer() {
    if (!this.ctx || this.noiseBuffer) return;

    const length = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      // A very small fade avoids a hard edge when a noise burst is stopped.
      const edge = Math.min(1, i / 24, (length - i) / 24);
      data[i] = (Math.random() * 2 - 1) * Math.max(0, edge);
    }

    this.noiseBuffer = buffer;
  }

  /**
   * Small reusable oscillator voice with a shaped envelope.
   * Options: type, attack, startFreq, endFreq, pitchTime, filterType,
   * filterFreq, filterQ, pan, destination.
   */
  _tone(freq, time, duration, peak, options = {}) {
    if (!this.ctx || !freq || freq <= 0 || duration <= 0 || peak <= 0) return;

    const osc = this.ctx.createOscillator();
    const envelope = this.ctx.createGain();
    let output = osc;

    osc.type = options.type || "sine";
    osc.frequency.setValueAtTime(options.startFreq || freq, time);

    if (options.endFreq && options.pitchTime) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, options.endFreq),
        time + options.pitchTime
      );
    }

    if (options.filterType) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = options.filterType;
      filter.frequency.setValueAtTime(options.filterFreq || 1800, time);
      filter.Q.setValueAtTime(options.filterQ || 1, time);
      output.connect(filter);
      output = filter;
    }

    output.connect(envelope);
    let finalOutput = envelope;

    if (typeof options.pan === "number" && this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, options.pan)), time);
      envelope.connect(panner);
      finalOutput = panner;
    }

    finalOutput.connect(options.destination || this.ctx.destination);

    const attack = Math.max(0.001, Math.min(options.attack || 0.004, duration * 0.45));
    const releaseTime = time + Math.max(duration, attack + 0.006);

    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.linearRampToValueAtTime(peak, time + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, releaseTime);

    osc.start(time);
    osc.stop(releaseTime + 0.015);
  }

  _noiseBurst(time, duration, peak, filterType, filterFreq, filterQ = 0.8, destination) {
    if (!this.ctx || !this.noiseBuffer || duration <= 0 || peak <= 0) return;

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const envelope = this.ctx.createGain();

    source.buffer = this.noiseBuffer;
    filter.type = filterType || "highpass";
    filter.frequency.setValueAtTime(filterFreq || 2500, time);
    filter.Q.setValueAtTime(filterQ, time);

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(destination || this.ctx.destination);

    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.linearRampToValueAtTime(peak, time + Math.min(0.002, duration * 0.3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    source.start(time);
    source.stop(time + duration + 0.005);
  }

  /** Filtered noise with a moving cutoff, useful for short plastic/mechanical slides. */
  _noiseSweep(time, duration, peak, startFreq, endFreq, filterType = "bandpass", destination) {
    if (!this.ctx || !this.noiseBuffer || duration <= 0 || peak <= 0) return;

    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const envelope = this.ctx.createGain();

    source.buffer = this.noiseBuffer;
    filter.type = filterType;
    filter.Q.setValueAtTime(1.15, time);
    filter.frequency.setValueAtTime(Math.max(40, startFreq), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), time + duration);

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(destination || this.ctx.destination);

    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.linearRampToValueAtTime(peak, time + Math.min(0.003, duration * 0.25));
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    source.start(time);
    source.stop(time + duration + 0.005);
  }

  // Retained as a compatibility helper from the previous implementation.
  _noiseClick(startTime, duration, vol) {
    this._noiseBurst(startTime, duration, vol * this.sfxVolume, "bandpass", 1500, 1.0);
  }

  // ------------------------------------------------------------------------
  // Nintendo DS-style interface and hardware-inspired sound effects
  // ------------------------------------------------------------------------

  /** Soft plastic/glass stylus contact with a tiny resonant tick. */
  playStylusTap() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._noiseBurst(now, 0.012, 0.16 * this.sfxVolume, "highpass", 2600, 0.9);
    this._tone(2250, now, 0.020, 0.075 * this.sfxVolume, {
      type: "sine", filterType: "bandpass", filterFreq: 2250, filterQ: 3.2,
      attack: 0.001
    });
    this._tone(3450, now + 0.001, 0.010, 0.026 * this.sfxVolume, {
      type: "sine", filterType: "bandpass", filterFreq: 3450, filterQ: 4,
      attack: 0.001
    });
  }

  /** Bright two-part menu confirmation chirp. */
  playSelect() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._tone(987.77, now, 0.092, 0.17 * this.sfxVolume, {
      type: "sine", attack: 0.003, endFreq: 1010, pitchTime: 0.045
    });
    this._tone(1318.51, now + 0.027, 0.105, 0.15 * this.sfxVolume, {
      type: "sine", attack: 0.003, endFreq: 1302, pitchTime: 0.05
    });
    this._noiseBurst(now, 0.006, 0.025 * this.sfxVolume, "highpass", 5200, 1);
  }

  /** Lower descending back/cancel chirp. */
  playCancel() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._tone(880, now, 0.105, 0.16 * this.sfxVolume, {
      type: "sine", startFreq: 880, endFreq: 587.33, pitchTime: 0.043,
      attack: 0.003
    });
    this._tone(587.33, now + 0.035, 0.070, 0.045 * this.sfxVolume, {
      type: "triangle", attack: 0.002
    });
  }

  /**
   * Bell-like startup phrase. Multiple decaying partials give the chime
   * a more physical, slightly metallic attack than a single sine oscillator.
   */
  playBootChime() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    this._ringBell(1046.50, now + 0.018, 0.78, 0.30);
    this._ringBell(2093.00, now + 0.265, 0.92, 0.34);
    this._ringBell(3135.96, now + 0.285, 0.52, 0.075);
  }

  _ringBell(freq, time, duration, gainVal) {
    if (!this.ctx) return;

    const partials = [
      { ratio: 1, amp: 1, decay: 1 },
      { ratio: 2.01, amp: 0.27, decay: 0.58 },
      { ratio: 3.96, amp: 0.105, decay: 0.30 },
      { ratio: 6.35, amp: 0.035, decay: 0.18 }
    ];

    for (const partial of partials) {
      this._tone(freq * partial.ratio, time, duration * partial.decay,
        gainVal * partial.amp * this.sfxVolume, {
          type: "sine", attack: 0.004
        });
    }
  }

  /**
   * Cartridge insertion: finger contact, shell seating, latch snap and a tiny
   * plastic resonance. Kept on the original playCartridgeSnap() hook.
   */
  playCartridgeSnap() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const v = this.sfxVolume;

    // Initial contact and the short scrape as the cartridge enters the slot.
    this._noiseBurst(now, 0.009, 0.12 * v, "highpass", 3600, 1.2);
    this._noiseSweep(now + 0.006, 0.034, 0.105 * v, 3100, 920, "bandpass");

    // Main shell seat: a compact low plastic thud with a hollow mid resonance.
    this._noiseBurst(now + 0.025, 0.021, 0.17 * v, "lowpass", 1350, 0.75);
    this._tone(142, now + 0.024, 0.105, 0.125 * v, {
      type: "triangle", startFreq: 220, endFreq: 112, pitchTime: 0.052,
      filterType: "lowpass", filterFreq: 470, filterQ: 0.72, attack: 0.002
    });
    this._tone(465, now + 0.027, 0.062, 0.055 * v, {
      type: "sine", startFreq: 660, endFreq: 390, pitchTime: 0.028,
      filterType: "bandpass", filterFreq: 520, filterQ: 2.1, attack: 0.001
    });

    // Two tiny latch contacts make the mechanism feel physical, not explosive.
    this._noiseBurst(now + 0.071, 0.010, 0.10 * v, "bandpass", 2450, 1.6);
    this._tone(1760, now + 0.072, 0.034, 0.032 * v, {
      type: "sine", startFreq: 2050, endFreq: 1480, pitchTime: 0.018,
      filterType: "bandpass", filterFreq: 1750, filterQ: 3.0, attack: 0.001
    });
    this._noiseBurst(now + 0.096, 0.008, 0.052 * v, "highpass", 5100, 1.1);
    this._tone(2489, now + 0.097, 0.052, 0.018 * v, {
      type: "sine", attack: 0.0015
    });
  }

  /** Soft cartridge release/open cue for interfaces that want an eject sound. */
  playCartridgeOpen() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const v = this.sfxVolume;

    // Spring latch release followed by the shell lifting free of the slot.
    this._noiseBurst(now, 0.010, 0.095 * v, "bandpass", 2750, 1.5);
    this._tone(1180, now + 0.002, 0.050, 0.040 * v, {
      type: "sine", startFreq: 880, endFreq: 1480, pitchTime: 0.032,
      filterType: "bandpass", filterFreq: 1280, filterQ: 2.0, attack: 0.001
    });
    this._noiseSweep(now + 0.018, 0.048, 0.075 * v, 900, 3200, "highpass");
    this._tone(196, now + 0.026, 0.078, 0.060 * v, {
      type: "triangle", startFreq: 145, endFreq: 205, pitchTime: 0.045,
      filterType: "lowpass", filterFreq: 560, filterQ: 0.7, attack: 0.002
    });
    this._noiseBurst(now + 0.077, 0.008, 0.042 * v, "highpass", 4600, 1.0);
    this._tone(1760, now + 0.078, 0.042, 0.022 * v, {
      type: "sine", attack: 0.001
    });
  }

  /** Short ascending message-send arpeggio with bell partials. */
  playPictoChatSend() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [659.25, 783.99, 987.77, 1318.51];

    notes.forEach((freq, index) => {
      this._ringBell(freq, now + index * 0.052, 0.17, 0.115 - index * 0.012);
    });
  }

  // ------------------------------------------------------------------------
  // BGM sound design
  // ------------------------------------------------------------------------

  _initBgmBus() {
    if (this.bgmMasterGain) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    this.bgmCompressor = this.ctx.createDynamicsCompressor();
    this.bgmCompressor.threshold.setValueAtTime(-17, now);
    this.bgmCompressor.knee.setValueAtTime(12, now);
    this.bgmCompressor.ratio.setValueAtTime(2.5, now);
    this.bgmCompressor.attack.setValueAtTime(0.008, now);
    this.bgmCompressor.release.setValueAtTime(0.24, now);

    // Keep the direct signal clear; gently roll off the harshest top end.
    this.bgmFilter = this.ctx.createBiquadFilter();
    this.bgmFilter.type = "lowpass";
    this.bgmFilter.frequency.setValueAtTime(10800, now);
    this.bgmFilter.Q.setValueAtTime(0.55, now);

    this.bgmMasterGain = this.ctx.createGain();
    this.bgmMasterGain.gain.setValueAtTime(this.bgmVolume, now);

    // A short, quiet synthetic room tail adds space without washing out notes.
    this.bgmReverb = this.ctx.createConvolver();
    const reverbLength = Math.floor(this.ctx.sampleRate * 1.05);
    const impulse = this.ctx.createBuffer(2, reverbLength, this.ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < reverbLength; i++) {
        const progress = i / reverbLength;
        const decay = Math.pow(1 - progress, 3.2);
        data[i] = (Math.random() * 2 - 1) * decay * 0.20;
      }
    }

    this.bgmReverb.buffer = impulse;
    this.bgmReverbGain = this.ctx.createGain();
    this.bgmReverbGain.gain.setValueAtTime(0.10, now);

    // Dry path.
    this.bgmMasterGain.connect(this.bgmFilter);
    this.bgmFilter.connect(this.bgmCompressor);

    // Low-level wet path.
    this.bgmMasterGain.connect(this.bgmReverb);
    this.bgmReverb.connect(this.bgmReverbGain);
    this.bgmReverbGain.connect(this.bgmCompressor);

    this.bgmCompressor.connect(this.ctx.destination);
  }

  /** Rounded DS-style mallet: fast wooden attack, warm body and short inharmonic modes. */
  _playMarimba(freq, time, dur, velocity = 1) {
    if (!freq || freq <= 0) return;

    const v = Math.max(0, velocity);
    const pan = ((Math.floor(time / this.stepDuration) % 4) - 1.5) * 0.055;
    const destination = this.bgmMasterGain;

    this._tone(freq, time, dur, 0.182 * v, {
      type: "sine", startFreq: freq * 1.009, endFreq: freq,
      pitchTime: 0.031, attack: 0.0018, pan, destination
    });
    this._tone(freq * 2.015, time, dur * 0.48, 0.047 * v, {
      type: "sine", attack: 0.0012, pan: pan + 0.035, destination
    });
    this._tone(freq * 3.91, time, dur * 0.22, 0.009 * v, {
      type: "sine", attack: 0.001, pan: pan - 0.035, destination
    });
    this._tone(freq * 5.37, time, 0.019, 0.0028 * v, {
      type: "sine", attack: 0.001, destination
    });
    // A very quiet triangle body stops the mallet from sounding like a pure beep.
    this._tone(freq, time + 0.003, dur * 0.56, 0.018 * v, {
      type: "triangle", filterType: "lowpass", filterFreq: Math.min(4200, freq * 5),
      filterQ: 0.55, attack: 0.003, pan: pan * -0.55, destination
    });
  }

  /** Short plucked counter-voice for the DSi/eShop-like syncopated figures. */
  _playPluck(freq, time, dur = 0.14, velocity = 1, pan = 0) {
    if (!freq || freq <= 0) return;
    const v = Math.max(0, velocity);
    const destination = this.bgmMasterGain;

    this._tone(freq, time, dur, 0.082 * v, {
      type: "triangle", startFreq: freq * 1.018, endFreq: freq,
      pitchTime: Math.min(0.045, dur * 0.42), attack: 0.0015,
      filterType: "lowpass", filterFreq: Math.min(6200, freq * 6),
      filterQ: 0.62, pan, destination
    });
    this._tone(freq * 2.006, time, dur * 0.34, 0.014 * v, {
      type: "sine", attack: 0.001, pan: pan * -0.7, destination
    });
  }

  /** Gentle rounded low drum pulse; intentionally more felt than heard. */
  _playKick(time, velocity = 1) {
    const v = Math.max(0, velocity);
    this._tone(66, time, 0.14, 0.050 * v, {
      type: "sine", startFreq: 118, endFreq: 52, pitchTime: 0.095,
      attack: 0.002, destination: this.bgmMasterGain
    });
  }

  /** Glassy inharmonic bell for phrase lifts and small melodic responses. */
  _playBell(freq, time, dur = 0.24, velocity = 1, pan = 0) {
    if (!freq || freq <= 0) return;
    const v = Math.max(0, velocity);
    this._tone(freq, time, dur, 0.060 * v, {
      type: "sine", attack: 0.002, pan, destination: this.bgmMasterGain
    });
    this._tone(freq * 2.01, time, dur * 0.48, 0.018 * v, {
      type: "sine", attack: 0.0015, pan: -pan, destination: this.bgmMasterGain
    });
    this._tone(freq * 3.96, time, dur * 0.22, 0.0055 * v, {
      type: "sine", attack: 0.001, destination: this.bgmMasterGain
    });
  }

  /** Soft triangle/sine bass with a controlled low fundamental. */
  _playBass(freq, time, dur, velocity = 1) {
    if (!freq || freq <= 0) return;
    const v = Math.max(0, velocity);

    this._tone(freq, time, dur, 0.16 * v, {
      type: "triangle", startFreq: freq * 1.008, endFreq: freq,
      pitchTime: 0.055, attack: 0.005, filterType: "lowpass",
      filterFreq: 520, filterQ: 0.65, destination: this.bgmMasterGain
    });
    this._tone(freq / 2, time, dur * 0.82, 0.032 * v, {
      type: "sine", attack: 0.008, destination: this.bgmMasterGain
    });
  }

  /** Small, glassy accent bell used sparingly above the lead instrument. */
  _playChime(freq, time, dur, velocity = 1) {
    if (!freq || freq <= 0) return;
    this._tone(freq, time, dur, 0.075 * velocity, {
      type: "sine", attack: 0.003, destination: this.bgmMasterGain
    });
    this._tone(freq * 2.01, time, dur * 0.42, 0.015 * velocity, {
      type: "sine", attack: 0.002, destination: this.bgmMasterGain
    });
  }

  /** Quiet filtered-noise shaker, closer to a soft sampled tick than hiss. */
  _playBrush(time, velocity = 1) {
    this._noiseBurst(time, 0.026, 0.012 * velocity, "highpass", 6200, 0.75,
      this.bgmMasterGain);
  }

  /** Short hollow wooden tick for the gentle backbeat. */
  _playWoodblock(time, velocity = 1) {
    this._tone(520, time, 0.043, 0.040 * velocity, {
      type: "sine", startFreq: 980, endFreq: 520, pitchTime: 0.018,
      filterType: "bandpass", filterFreq: 850, filterQ: 3.2,
      attack: 0.001, destination: this.bgmMasterGain
    });
  }

  /** Soft chord bed, used only at phrase boundaries. */
  _playChordPad(midiNotes, time, duration, velocity = 1) {
    for (let i = 0; i < midiNotes.length; i++) {
      this._tone(this._midiToFreq(midiNotes[i]), time, duration,
        0.022 * velocity, {
          type: "triangle", attack: 0.075, pan: (i - 1.5) * 0.10,
          filterType: "lowpass", filterFreq: 1750, filterQ: 0.55,
          destination: this.bgmMasterGain
        });
    }
  }

  // ------------------------------------------------------------------------
  // 128-step lookahead scheduler
  // ------------------------------------------------------------------------

  _scheduleAhead() {
    if (!this.bgmEnabled || !this.ctx) return;

    const lookahead = 0.18;
    while (this.nextStepTime < this.ctx.currentTime + lookahead) {
      this._playStep(this.bgmStep, this.nextStepTime, this.bgmLoop);
      this.nextStepTime += this.stepDuration;
      this.bgmStep += 1;
      if (this.bgmStep >= 128) {
        this.bgmStep = 0;
        this.bgmLoop += 1;
      }
    }

    if (this.bgmEnabled) {
      this.bgmTimer = setTimeout(() => this._scheduleAhead(), 25);
    }
  }

  _variation(loop, step, salt = 0) {
    // Small deterministic hash: variation stays musical and reproducible within a loop.
    let x = Math.imul((loop + 1) ^ Math.imul(step + 17, 0x45d9f3b), 0x27d4eb2d);
    x ^= Math.imul(salt + 31, 0x165667b1);
    x = Math.imul(x ^ (x >>> 15), 0x2c1b3c6d);
    x = Math.imul(x ^ (x >>> 12), 0x297a2d39);
    x ^= x >>> 15;
    return (x >>> 0) / 4294967296;
  }

  _playStep(step, time, loop = 0) {
    const phrase = Math.floor(step / 16);
    const localStep = step % 16;
    const section = Math.floor(step / 32); // A: bright, B: sparkling, C: airy, D: playful fill
    const loopStyle = loop % 4;
    const chord = this.chords[phrase];
    let note = this.melody[step];

    // The lead changes subtly on repeat passes so the 27-second loop does not feel static.
    if (note !== null && note !== undefined) {
      if (loopStyle === 1 && (localStep === 6 || localStep === 14) && section !== 2) note -= 12;
      if (loopStyle === 2 && (localStep === 3 || localStep === 11) && section === 1) note += 12;
      if (loopStyle === 3 && (localStep === 7 || localStep === 15) && section === 3) note += 12;

      const leadVelocity = (localStep === 0 || localStep === 8 ? 0.94 : 0.80) *
        (section === 2 ? 0.78 : section === 3 ? 0.86 : 0.90);
      const leadDuration = section === 3 ? 0.158 : section === 2 ? 0.172 : 0.188;
      this._playMarimba(this._midiToFreq(note), time, leadDuration, leadVelocity);
    }

    // Walking bass with a little variation in the last beat of each two-bar phrase.
    if (step % 2 === 0) {
      const beat = Math.floor(localStep / 2);
      let bassNote = this.bassPatterns[phrase][beat];
      if (loopStyle === 2 && beat === 7 && this._variation(loop, step, 2) > 0.68) bassNote -= 12;
      this._playBass(this._midiToFreq(bassNote), time, section === 2 ? 0.32 : 0.37,
        beat === 0 || beat === 4 ? 1 : 0.78);
    }

    // Soft chord bloom at phrase starts; the second half gets a shorter answer.
    if (localStep === 0) {
      this._playChordPad(chord, time, 1.02, section === 2 ? 0.78 : 1);
      if (section === 1 || section === 3) {
        const upper = chord.map((n) => n + 12);
        this._playChordPad(upper.slice(0, 3), time + 0.012, 0.56, 0.22);
      }
    } else if (localStep === 8) {
      this._playChordPad(chord, time, 0.52, 0.34);
    }

    // Repeating but changing arpeggio density: the airy C section deliberately breathes.
    const arpSlots = section === 1 ? [2, 6, 10, 14] :
      section === 2 ? [6, 14] : section === 3 ? [2, 10, 14] : [2, 10];
    if (arpSlots.includes(localStep)) {
      const chordIndex = (Math.floor(localStep / 4) + phrase + loopStyle) % chord.length;
      const arpNote = chord[chordIndex] + (section === 1 ? 24 : 12);
      const arpTime = time + (localStep % 4 === 2 ? this.stepDuration * 0.08 : 0);
      this._playPluck(this._midiToFreq(arpNote), arpTime,
        section === 3 ? 0.095 : 0.125,
        section === 2 ? 0.42 : 0.60,
        ((step % 3) - 1) * 0.22);
    }

    // High counter-line: denser in the sparkling section, sparse in the dreamy one.
    // Chord-specific counter notes: every pitch is a chord tone, avoiding
    // the old fixed high line that created #11 / semitone clashes on F and G7.
    // Notes land in spaces between lead attacks and are short enough not to smear.
    const counterPatterns = [
      [null, 91, null, null, null, 88, null, null], // Cmaj7: G, E
      [null, 88, null, null, null, 84, null, null], // Am7: E, C
      [null, 88, null, null, null, 84, null, null], // Fmaj7: E, C
      [null, 86, null, null, null, 83, null, null], // G6: D, B
      [null, 88, null, null, null, 86, null, null], // Em7: E, D
      [null, 88, null, null, null, 84, null, null], // Am7: E, C
      [null, 86, null, null, null, 84, null, null], // Dm7: D, C
      [null, 89, null, null, null, 86, null, null]  // G7: F, D
    ];
    const counterNote = counterPatterns[phrase][step % 8];
    const counterChance = section === 1 ? 0.74 : section === 3 ? 0.62 : 0.56;
    if (counterNote && this._variation(loop, step, 5) < counterChance) {
      // Octave changes preserve harmony while giving later loops a gentle lift.
      const octave = loopStyle === 2 && step % 16 === 5 ? -12 : 0;
      this._playBell(this._midiToFreq(counterNote + octave), time + 0.008,
        0.145, section === 2 ? 0.28 : 0.34,
        step % 2 ? 0.20 : -0.18);
    }

    // Phrase-end glints use chord tones only; variation changes octave, never key.
    if (localStep === 14 && (phrase === 1 || phrase === 3 || phrase === 5 || phrase === 7)) {
      const sparkleNotes = [null, 88, null, 86, null, 93, null, 89];
      let sparkle = sparkleNotes[phrase];
      if (loopStyle === 1) sparkle += 12;
      if (loopStyle === 3) sparkle -= 12;
      this._playChime(this._midiToFreq(sparkle), time + 0.018, 0.205, 0.25);
    }

    // Gentle rhythm: soft low pulse, woody taps and a light noise shaker.
    if (localStep === 0 || (localStep === 8 && section !== 2)) {
      this._playKick(time, localStep === 0 ? 0.80 : 0.43);
    }
    if (localStep % 8 === 2 || localStep % 8 === 6) {
      this._playBrush(time + 0.006, localStep === 6 ? 0.58 : 0.44);
    }
    if (localStep === 4 || (section === 3 && localStep === 12)) {
      this._playWoodblock(time, section === 3 ? 0.46 : 0.34);
    }

    // Tiny end-of-section fills make each 8-bar movement feel like an arrangement.
    if (localStep === 12 && (section === 1 || section === 3)) {
      const fill = chord[(phrase + loopStyle) % chord.length] + 24;
      this._playPluck(this._midiToFreq(fill), time + this.stepDuration * 0.48,
        0.12, 0.36, 0.20);
    }
    if (step % 32 === 31) {
      const turnaround = chord[(loopStyle + section) % chord.length] + 24;
      this._playBell(this._midiToFreq(turnaround), time + 0.035, 0.22, 0.44, -0.18);
    }
  }

  /** Start/stop the BGM. Return value remains true when started, false when stopped. */
  toggleBGM() {
    this.ensureContext();
    if (!this.ctx) return false;

    if (this.bgmEnabled) {
      this.bgmEnabled = false;

      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }

      if (this.bgmMasterGain) {
        const now = this.ctx.currentTime;
        this.bgmMasterGain.gain.cancelScheduledValues(now);
        this.bgmMasterGain.gain.setValueAtTime(
          Math.max(0.0001, this.bgmMasterGain.gain.value), now
        );
        this.bgmMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
      }

      return false;
    }

    this._initBgmBus();
    if (!this.bgmMasterGain) return false;

    const now = this.ctx.currentTime;
    this.bgmMasterGain.gain.cancelScheduledValues(now);
    this.bgmMasterGain.gain.setValueAtTime(0.0001, now);
    this.bgmMasterGain.gain.linearRampToValueAtTime(this.bgmVolume, now + 0.055);

    this.bgmEnabled = true;
    this.bgmStep = 0;
    this.bgmLoop = 0;
    this.nextStepTime = now + 0.055;
    this._scheduleAhead();
    return true;
  }
}

// Keep this global exactly as before so existing site code remains compatible.
window.dsAudio = new DSAudioEngine();
