
// Synthetic audio generator for a realistic shutter sound
// "Ka-Chick" effect without external files

export const playPolaroidSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const t = ctx.currentTime;

    // Master gain for overall volume control
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.8; // Slightly softer max volume
    masterGain.connect(ctx.destination);

    // --- PART 1: "Ka" (The Shutter Release) ---
    // 1a. High pitch impact (Metal/Plastic click)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2000, t);
    osc1.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    
    gain1.gain.setValueAtTime(0.4, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(t);
    osc1.stop(t + 0.06);

    // 1b. Initial air/friction burst
    const bufferSize = ctx.sampleRate * 0.1;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    
    const noiseSrc1 = ctx.createBufferSource();
    noiseSrc1.buffer = noiseBuffer;
    const noiseFilter1 = ctx.createBiquadFilter();
    noiseFilter1.type = 'lowpass';
    noiseFilter1.frequency.value = 2500;
    
    const noiseGain1 = ctx.createGain();
    noiseGain1.gain.setValueAtTime(0.5, t);
    noiseGain1.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    
    noiseSrc1.connect(noiseFilter1);
    noiseFilter1.connect(noiseGain1);
    noiseGain1.connect(masterGain);
    noiseSrc1.start(t);

    // --- PART 2: "Chik" (The Mechanism Locking) ---
    const t2 = t + 0.08; // 80ms delay for the second part

    // 2a. The "Thud" (Mechanism stopping)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    osc2.type = 'square'; // Square wave gives a hollow mechanical sound
    osc2.frequency.setValueAtTime(800, t2);
    osc2.frequency.exponentialRampToValueAtTime(50, t2 + 0.1);
    
    gain2.gain.setValueAtTime(0.3, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.1);
    
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(t2);
    osc2.stop(t2 + 0.15);
    
    // 2b. Secondary noise burst (Closing friction)
    const noiseSrc2 = ctx.createBufferSource();
    noiseSrc2.buffer = noiseBuffer;
    
    const noiseFilter2 = ctx.createBiquadFilter();
    noiseFilter2.type = 'bandpass';
    noiseFilter2.frequency.value = 500; // Lower frequency for the closing sound
    
    const noiseGain2 = ctx.createGain();
    noiseGain2.gain.setValueAtTime(0.5, t2);
    noiseGain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.08);
    
    noiseSrc2.connect(noiseFilter2);
    noiseFilter2.connect(noiseGain2);
    noiseGain2.connect(masterGain);
    noiseSrc2.start(t2);

  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
