
/**
 * Professional UI Sound Synthesizer
 * Uses Web Audio API to generate subtle, high-fidelity sounds 
 * to maintain a minimalist aesthetic without external dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createGain(start: number, duration: number, value: number = 0.1) {
    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(value, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    return gain;
  }

  playCardFlick() {
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.createGain(now, 0.1, 0.05);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playActionClick() {
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.createGain(now, 0.05, 0.03);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    
    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playCorrect() {
    this.init();
    const now = this.ctx!.currentTime;
    
    // Suble harmonic "ding"
    [880, 1100, 1320].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.createGain(now + (i * 0.02), 0.3, 0.02);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (i * 0.02));
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(now + (i * 0.02));
      osc.stop(now + 0.4);
    });
  }

  playWrong() {
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.createGain(now, 0.2, 0.05);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const soundEngine = new SoundEngine();
