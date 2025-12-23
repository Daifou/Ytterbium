/**
 * Heavenly Ambient Soundscape Service (Endel-inspired)
 * Generates a multi-layered atmospheric pad centered around 475Hz.
 */
class AmbientSoundService {
    private audioCtx: AudioContext | null = null;
    private nodes: AudioNode[] = [];
    private masterGain: GainNode | null = null;
    private isRunning: boolean = false;

    private init() {
        if (this.audioCtx) return;
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    private createLayer(freq: number, type: OscillatorType, volume: number, lfoFreq: number) {
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        // Soft low-pass to remove "beepy" edges
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.Q.setValueAtTime(0.7, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 5);

        // LFO for organic "breathing"
        const lfo = this.audioCtx.createOscillator();
        const lfoGain = this.audioCtx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(lfoFreq, now);
        lfoGain.gain.setValueAtTime(volume * 0.3, now);

        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        osc.connect(filter);
        filter.connect(gain);

        osc.start();
        lfo.start();

        this.nodes.push(osc, lfo);
        return gain;
    }

    private createAtmosphere() {
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;

        // Brown noise for warmth/ocean feel
        const bufferSize = 2 * this.audioCtx.sampleRate;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // balance
        }

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const noiseFilter = this.audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(400, now);

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.04, now + 8);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noise.start();

        this.nodes.push(noise);
        return noiseGain;
    }

    async start() {
        if (this.isRunning) return;
        this.init();
        if (!this.audioCtx) return;

        if (this.audioCtx.state === 'suspended') {
            try { await this.audioCtx.resume(); } catch (e) { return; }
        }

        const now = this.audioCtx.currentTime;
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0, now);
        this.masterGain.gain.linearRampToValueAtTime(1.0, now + 4);

        // Create Space (Delay/Reverb simulation)
        const delay = this.audioCtx.createDelay();
        const feedback = this.audioCtx.createGain();
        delay.delayTime.setValueAtTime(0.8, now);
        feedback.gain.setValueAtTime(0.4, now);

        delay.connect(feedback);
        feedback.connect(delay);

        // Layers
        const root = this.createLayer(475, 'sine', 0.08, 0.1); // Main
        const sub = this.createLayer(237.5, 'sine', 0.05, 0.07); // Octave Down (Warmth)
        const fifth = this.createLayer(712.5, 'sine', 0.03, 0.13); // Perfect Fifth
        const noise = this.createAtmosphere();

        [root, sub, fifth, noise].forEach(g => {
            if (g) {
                g.connect(this.masterGain!);
                g.connect(delay);
            }
        });

        delay.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);

        this.isRunning = true;
        console.log('Heavenly soundscape initiated. 475Hz center.');
    }

    stop() {
        if (!this.isRunning) return;
        const now = this.audioCtx?.currentTime || 0;
        this.masterGain?.gain.linearRampToValueAtTime(0, now + 3);
        setTimeout(() => {
            this.nodes.forEach(n => {
                try { (n as any).stop(); } catch (e) { }
            });
            this.nodes = [];
            this.isRunning = false;
        }, 3100);
    }
}

export const ambientSound = new AmbientSoundService();
