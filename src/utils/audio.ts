// Web Audio API Synthesizer for Victory Celebration Fanfare & Cheering
class SoundPlayer {
  private ctx: AudioContext | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playVictoryFanfare() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fanfare notes (Triumph melody: C4, G4, C5, E5, G5)
      const notes = [
        { freq: 261.63, start: 0.0, dur: 0.18 }, // C4
        { freq: 329.63, start: 0.2, dur: 0.18 }, // E4
        { freq: 392.00, start: 0.4, dur: 0.22 }, // G4
        { freq: 523.25, start: 0.65, dur: 0.55 }, // C5
        { freq: 440.00, start: 1.25, dur: 0.18 }, // A4
        { freq: 523.25, start: 1.45, dur: 0.18 }, // C5
        { freq: 659.25, start: 1.65, dur: 0.22 }, // E5
        { freq: 783.99, start: 1.9, dur: 0.8 },  // G5
      ];

      notes.forEach(({ freq, start, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(0.25, now + start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur + 0.05);
      });

      // Subtle crowd applause noise synthesis
      this.playApplauseNoise(now + 0.8, 2.5);
    } catch {
      // Audio playback fails gracefully if muted or blocked
    }
  }

  private playApplauseNoise(startTime: number, duration: number) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // pink-ish noise simulation for applause
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, startTime);
      filter.Q.setValueAtTime(1.5, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(startTime);
      whiteNoise.stop(startTime + duration);
    } catch {
      // Ignore audio sandbox errors
    }
  }
}

export const soundPlayer = new SoundPlayer();
