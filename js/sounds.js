/**
 * KidsQuids - Sound Manager
 * Generates fun sounds using Web Audio API
 */

class SoundManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('kidsquids_sound', enabled ? 'on' : 'off');
    }

    isEnabled() {
        const saved = localStorage.getItem('kidsquids_sound');
        if (saved !== null) {
            this.enabled = saved === 'on';
        }
        return this.enabled;
    }

    // Play a pleasant click sound
    playClick() {
        if (!this.enabled || !this.initialized) return;
        this.playTone(800, 0.1, 'sine', 0.3);
    }

    // Play a pop sound for shape clicks
    playPop() {
        if (!this.enabled || !this.initialized) return;
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    }

    // Play success sound (ascending notes)
    playSuccess() {
        if (!this.enabled || !this.initialized) return;
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.3), i * 100);
        });
    }

    // Play level complete fanfare
    playLevelComplete() {
        if (!this.enabled || !this.initialized) return;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.4), i * 150);
        });
    }

    // Play star earned sound
    playStar() {
        if (!this.enabled || !this.initialized) return;
        this.playTone(1200, 0.15, 'sine', 0.3);
        setTimeout(() => this.playTone(1400, 0.15, 'sine', 0.3), 80);
    }

    // Play unlock sound
    playUnlock() {
        if (!this.enabled || !this.initialized) return;
        const notes = [392, 523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.12, 'sine', 0.25), i * 80);
        });
    }

    // Play gentle error/miss sound
    playMiss() {
        if (!this.enabled || !this.initialized) return;
        this.playTone(200, 0.2, 'sine', 0.2);
    }

    // Helper: Play a simple tone
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) return;

        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }
}

const soundManager = new SoundManager();
