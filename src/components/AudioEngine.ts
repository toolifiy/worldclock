class AudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;

  constructor() {}

  toggle(enabled: boolean) {
    this.isEnabled = enabled;
    if (enabled && !this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch (e) {
        console.warn('Web Audio API not supported in this browser', e);
      }
    }
  }

  playTick() {
    if (!this.isEnabled || !this.ctx) return;
    this.resumeIfNeeded();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime); // Crispy short tick
      
      gain.gain.setValueAtTime(0.70, this.ctx.currentTime); // Boosted significantly for loud, clear audibility
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06); // Extended duration slightly for body
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      // Ignored if audio context fails
    }
  }

  playWoodpeckerTick() {
    if (!this.isEnabled || !this.ctx) return;
    this.resumeIfNeeded();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Loud, bright woodblock knock sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.95, this.ctx.currentTime); // High volume punch
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Ignored
    }
  }

  playLap() {
    if (!this.isEnabled || !this.ctx) return;
    this.resumeIfNeeded();
    try {
      const now = this.ctx.currentTime;
      // High elegant synthesizer chime for lap split confirmation
      [587.33, 880].forEach((freq) => { // D5, A5
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.40, now); // Boosted for high confirmation tone
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(now + 0.22);
      });
    } catch (e) {
      // Ignored
    }
  }

  playBeep() {
    if (!this.isEnabled || !this.ctx) return;
    this.resumeIfNeeded();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      
      gain.gain.setValueAtTime(0.65, now); // Boosted for bright, audible beeps
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(now + 0.30);
    } catch (e) {
      // Ignored
    }
  }

  private resumeIfNeeded() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
}

export const audioEngine = new AudioEngine();
