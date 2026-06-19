let audioCtx: AudioContext | null = null;
const globalVolume = 0.2; // Default polished, safe level
let isMuted = false;

if (typeof window !== 'undefined') {
  const savedMute = localStorage.getItem('app-audio-muted');
  isMuted = savedMute === 'true';
}

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (error) {
    console.warn('Web Audio API is not supported or accessible:', error);
    return null;
  }
}

export const audioService = {
  isMuted(): boolean {
    return isMuted;
  },

  setMuted(muted: boolean) {
    isMuted = muted;
    localStorage.setItem('app-audio-muted', String(muted));
  },

  toggleMute(): boolean {
    isMuted = !isMuted;
    localStorage.setItem('app-audio-muted', String(isMuted));
    return isMuted;
  },

  /**
   * Plays a synthesized frequency pitch with ramp dynamic gain (no audio pops)
   */
  playTone(freq: number, type: 'sine' | 'triangle' | 'sawtooth' | 'square' = 'sine', duration = 0.1, vol = 0.1) {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Clean start-ramp to mitigate clicks/pops
      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(vol * globalVolume, ctx.currentTime + 0.01);
      
      // Decaying ramp-down for pleasant ringing
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Graceful fallback for non-authorized contexts
    }
  },

  /**
   * Maps an arbitrary range value into pleasant musical pitch scales
   */
  playValue(value: number, min = 0, max = 100, type: 'sine' | 'triangle' = 'triangle', duration = 0.12) {
    if (isMuted) return;
    // Map linearly to comfortable range (200 Hz to 900 Hz)
    const baseFreq = 200;
    const maxFreq = 900;
    const mappedFreq = baseFreq + ((value - min) / (Math.max(1, max - min))) * (maxFreq - baseFreq);
    this.playTone(mappedFreq, type, duration, 0.12);
  },

  /**
   * Triggers highly descriptive melodious chimes corresponding to distinct visualizer events
   */
  playStep(type: 'compare' | 'swap' | 'success' | 'node_active' | 'traverse') {
    if (isMuted) return;
    switch (type) {
      case 'compare':
        // Mild midtone frequency to represent dual elements check
        this.playTone(392.00, 'triangle', 0.08, 0.08); // G4
        break;
      case 'swap':
        // Bright dynamic dual-pitch slide
        this.playTone(659.25, 'sine', 0.06, 0.14); // E5
        setTimeout(() => {
          this.playTone(783.99, 'sine', 0.08, 0.14); // G5
        }, 40);
        break;
      case 'traverse':
        // Low warm frequency
        this.playTone(261.63, 'sine', 0.07, 0.08); // C4
        break;
      case 'node_active':
        // Distinct bell tone indicating target search/select has hit
        this.playTone(523.25, 'triangle', 0.12, 0.15); // C5
        break;
      case 'success':
        // Ascension scale chime
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          setTimeout(() => {
            this.playTone(freq, 'sine', 0.22, 0.15);
          }, index * 60);
        });
        break;
      default:
        break;
    }
  }
};
