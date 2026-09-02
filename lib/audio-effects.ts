// Production Audio Engine for Interactive Sound Effects with Real Audio Asset + Web Audio Fallback

class SoundEngine {
  private energyAudio: HTMLAudioElement | null = null;
  private blastAudio: HTMLAudioElement | null = null;
  private isCharging = false;
  private ctx: AudioContext | null = null;

  // Synthesizer fallback nodes
  private chargeOsc1: OscillatorNode | null = null;
  private chargeOsc2: OscillatorNode | null = null;
  private chargeFilter: BiquadFilterNode | null = null;
  private chargeMasterGain: GainNode | null = null;
  private chargeLfo: OscillatorNode | null = null;

  private initAudio() {
    if (typeof window === "undefined") return;

    if (!this.energyAudio) {
      try {
        const audio = new Audio("/skills/energy.mp3");
        audio.preload = "auto";
        audio.loop = false;
        audio.volume = 0.85;
        this.energyAudio = audio;
      } catch {}
    }

    if (!this.blastAudio) {
      try {
        const audio = new Audio("/skills/balloon-burst.mp3");
        audio.preload = "auto";
        audio.volume = 0.95;
        this.blastAudio = audio;
      } catch {}
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Starts energy charging sound (plays /skills/energy.mp3 with seamless Web Audio fallback)
   */
  startEnergyCharge(durationSeconds = 3.0) {
    this.initAudio();
    this.stopEnergyCharge();
    this.isCharging = true;

    // 1. Try playing real energy.mp3 audio file
    if (this.energyAudio) {
      try {
        this.energyAudio.currentTime = 0;
        this.energyAudio.volume = 0.9;
        const playPromise = this.energyAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy or format fallback -> Web Audio Synth
            this.startSynthesizedEnergy(durationSeconds);
          });
        }
        return;
      } catch {}
    }

    // 2. Synthesized fallback
    this.startSynthesizedEnergy(durationSeconds);
  }

  private startSynthesizedEnergy(durationSeconds: number) {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.01, now);
      master.gain.exponentialRampToValueAtTime(0.4, now + 0.1);
      master.gain.linearRampToValueAtTime(0.75, now + durationSeconds * 0.7);
      master.gain.linearRampToValueAtTime(0.95, now + durationSeconds);
      master.connect(ctx.destination);
      this.chargeMasterGain = master;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.setValueAtTime(4.0, now);
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(3600, now + durationSeconds);
      filter.connect(master);
      this.chargeFilter = filter;

      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(1450, now + durationSeconds);
      osc1.connect(filter);
      osc1.start(now);
      this.chargeOsc1 = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(70, now);
      osc2.frequency.exponentialRampToValueAtTime(480, now + durationSeconds);
      osc2.connect(filter);
      osc2.start(now);
      this.chargeOsc2 = osc2;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6, now);
      lfo.frequency.linearRampToValueAtTime(40, now + durationSeconds);
      lfoGain.gain.setValueAtTime(20, now);
      lfo.connect(osc1.frequency);
      lfo.start(now);
      this.chargeLfo = lfo;
    } catch {}
  }

  /**
   * Smoothly stops charging sound on early release
   */
  stopEnergyCharge() {
    if (!this.isCharging) return;
    this.isCharging = false;

    // Pause audio file
    if (this.energyAudio) {
      try {
        this.energyAudio.pause();
        this.energyAudio.currentTime = 0;
      } catch {}
    }

    // Stop synth
    try {
      if (this.chargeMasterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.chargeMasterGain.gain.cancelScheduledValues(now);
        this.chargeMasterGain.gain.setValueAtTime(this.chargeMasterGain.gain.value, now);
        this.chargeMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      }

      setTimeout(() => {
        if (this.chargeOsc1) {
          try {
            this.chargeOsc1.stop();
            this.chargeOsc1.disconnect();
          } catch {}
          this.chargeOsc1 = null;
        }
        if (this.chargeOsc2) {
          try {
            this.chargeOsc2.stop();
            this.chargeOsc2.disconnect();
          } catch {}
          this.chargeOsc2 = null;
        }
        if (this.chargeLfo) {
          try {
            this.chargeLfo.stop();
            this.chargeLfo.disconnect();
          } catch {}
          this.chargeLfo = null;
        }
        this.chargeFilter = null;
        this.chargeMasterGain = null;
      }, 120);
    } catch {}
  }

  /**
   * Plays balloon burst blast sound (plays /skills/balloon-burst.mp3 with synthesized burst fallback)
   */
  playBalloonBurst() {
    this.initAudio();
    this.stopEnergyCharge();

    // 1. Try playing real balloon-burst.mp3 audio file
    if (this.blastAudio) {
      try {
        this.blastAudio.currentTime = 0;
        this.blastAudio.volume = 1.0;
        const playPromise = this.blastAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.playSynthesizedBurst();
          });
        }
        return;
      } catch {}
    }

    // 2. Synthesized blast fallback
    this.playSynthesizedBurst();
  }

  private playSynthesizedBurst() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Snap pop
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = "triangle";
      snapOsc.frequency.setValueAtTime(1200, now);
      snapOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
      snapGain.gain.setValueAtTime(0.95, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.13);

      // Noise explosion
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(180, now + 0.4);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseNode.start(now);

      // Sub-bass punch
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(240, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
      subGain.gain.setValueAtTime(1.0, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.4);
    } catch {}
  }
}

export const soundEffects = new SoundEngine();
