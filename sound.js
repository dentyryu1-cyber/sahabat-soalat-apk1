// sound.js — Offline Web Audio API Sound Effects & Background Music Engine

const AUDIO_STORAGE_KEY = 'sahabat_salat_audio_prefs';

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;

    this.muted = false;
    this.volume = 0.7;
    this.bgmInterval = null;
    this.bgmPlaying = false;
    this.bgmStep = 0;

    this._loadPrefs();
  }

  _loadPrefs() {
    try {
      const saved = localStorage.getItem(AUDIO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.muted === 'boolean') this.muted = parsed.muted;
        if (typeof parsed.volume === 'number') this.volume = Math.max(0, Math.min(1, parsed.volume));
      }
    } catch {
      // Ignore storage errors
    }
  }

  _savePrefs() {
    try {
      localStorage.setItem(
        AUDIO_STORAGE_KEY,
        JSON.stringify({ muted: this.muted, volume: this.volume })
      );
    } catch {
      // Ignore storage errors
    }
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.bgmGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.bgmGain.gain.value = 0.24;
      this.sfxGain.gain.value = 0.88;

      this.bgmGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this._applyGain();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  _applyGain() {
    if (!this.masterGain || !this.ctx) return;
    const target = this.muted ? 0 : this.volume;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.02);
  }

  setMuted(isMuted) {
    this.muted = Boolean(isMuted);
    this._applyGain();
    this._savePrefs();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, Number(val)));
    if (this.volume > 0 && this.muted) {
      this.muted = false;
    }
    this._applyGain();
    this._savePrefs();
  }

  _playTone(freq, duration, type = 'sine', startTimeOffset = 0, peakGain = 0.25, dest = 'sfx', slideTo = null) {
    if (!this.init()) return;
    const now = this.ctx.currentTime + startTimeOffset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    gain.connect(dest === 'bgm' ? this.bgmGain : this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  _playNoiseBurst(duration, filterFreq, q = 2, startTimeOffset = 0, peakGain = 0.2) {
    if (!this.init()) return;
    const now = this.ctx.currentTime + startTimeOffset;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.Q.setValueAtTime(q, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
    noise.stop(now + duration + 0.02);
  }

  playClick() {
    this._playTone(620, 0.07, 'triangle', 0, 0.16, 'sfx', 760);
  }

  playDiceThrow() {
    this._playNoiseBurst(0.22, 1200, 1.4, 0, 0.24);
    this._playTone(260, 0.18, 'triangle', 0, 0.2, 'sfx', 680);
    this._playTone(420, 0.06, 'sine', 0.08, 0.12, 'sfx', 540);
  }

  playDiceBounce(intensity = 1) {
    const gain = Math.max(0.08, Math.min(0.32, 0.28 * intensity));
    const baseFreq = 220 + (1 - intensity) * 160;
    this._playTone(baseFreq, 0.09, 'triangle', 0, gain, 'sfx', baseFreq * 0.55);
    this._playNoiseBurst(0.045, 900, 2.5, 0, gain * 0.55);
  }

  playStep(stepIndex = 0) {
    const pitch = 390 + (stepIndex % 4) * 35;
    this._playTone(pitch, 0.09, 'sine', 0, 0.18, 'sfx', pitch * 1.18);
  }

  playBump() {
    this._playTone(210, 0.16, 'sawtooth', 0, 0.16, 'sfx', 110);
  }

  playLadderClimb() {
    // Warm ascending pentatonic chime
    const notes = [392, 440, 523.25, 587.33, 659.25, 783.99, 880];
    notes.forEach((n, idx) => {
      this._playTone(n, 0.18, 'triangle', idx * 0.11, 0.2, 'sfx');
    });
  }

  playSnakeHiss() {
    this._playNoiseBurst(0.55, 3400, 3.2, 0, 0.26);
    this._playTone(540, 0.22, 'sine', 0.05, 0.12, 'sfx', 280);
  }

  playSnakeGulp() {
    // Funny cartoon gulp + slide down
    this._playTone(460, 0.12, 'sine', 0, 0.22, 'sfx', 180);
    this._playTone(210, 0.14, 'sine', 0.1, 0.24, 'sfx', 480);
    this._playTone(620, 0.48, 'triangle', 0.25, 0.22, 'sfx', 165);
  }

  playCorrect() {
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((f, idx) => {
      this._playTone(f, 0.28, 'triangle', idx * 0.075, 0.24, 'sfx');
    });
  }

  playWrong() {
    this._playTone(280, 0.2, 'sawtooth', 0, 0.15, 'sfx', 220);
    this._playTone(220, 0.28, 'sawtooth', 0.16, 0.15, 'sfx', 150);
  }

  playVictory() {
    const fanfare = [
      { f: 523.25, d: 0.16, t: 0 },
      { f: 659.25, d: 0.16, t: 0.15 },
      { f: 783.99, d: 0.16, t: 0.3 },
      { f: 1046.5, d: 0.38, t: 0.46 },
      { f: 880, d: 0.16, t: 0.85 },
      { f: 1046.5, d: 0.55, t: 1.02 }
    ];
    fanfare.forEach((n) => {
      this._playTone(n.f, n.d, 'triangle', n.t, 0.28, 'sfx');
      this._playTone(n.f * 0.5, n.d, 'sine', n.t, 0.15, 'sfx');
    });
  }

  startBgm() {
    if (this.bgmPlaying) return;
    if (!this.init()) return;
    this.bgmPlaying = true;

    // Gentle warm Hijaz / Pentatonic marimba-like pattern
    const melody = [
      293.66, 349.23, 440.0, 392.0,
      349.23, 329.63, 293.66, 220.0,
      293.66, 349.23, 440.0, 523.25,
      440.0, 392.0, 349.23, 329.63
    ];

    this.bgmInterval = window.setInterval(() => {
      if (!this.bgmPlaying || this.muted || !this.ctx || this.ctx.state !== 'running') {
        return;
      }
      const note = melody[this.bgmStep % melody.length];
      this._playTone(note, 0.34, 'sine', 0, 0.18, 'bgm');
      if (this.bgmStep % 4 === 0) {
        this._playTone(note * 0.5, 0.55, 'triangle', 0, 0.1, 'bgm');
      }
      this.bgmStep += 1;
    }, 460);
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundEngine();
