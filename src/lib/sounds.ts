/**
 * Subtle Audio Feedback Utility
 * Using Web Audio API to generate procedural sounds
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

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    this.playTone(800, 'sine', 0.1, 0.05);
  }

  playCorrect() {
    this.playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.1), 100); // E5
  }

  playIncorrect() {
    this.playTone(220, 'triangle', 0.15, 0.1); // A3
    setTimeout(() => this.playTone(196, 'triangle', 0.3, 0.1), 150); // G3
  }

  playHotspot() {
    this.playTone(1200, 'sine', 0.05, 0.02);
    setTimeout(() => this.playTone(1500, 'sine', 0.1, 0.02), 50);
  }
}

export const sounds = new SoundEngine();
