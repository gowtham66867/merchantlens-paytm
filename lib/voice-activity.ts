// Local energy-based endpointing. This detects pauses, not words or speakers.
export class VoiceActivity {
 private noise = 0.004;
 private candidateAt: number | null = null;
 private lastVoice: number | null = null;
 private speech = false;
 private startedAt: number;
 private silenceMs: number;
 constructor(startedAt: number, silenceMs = 2000) { this.startedAt=startedAt; this.silenceMs=silenceMs; }
 sample(rms: number, now: number): 'waiting' | 'speech' | 'pause' | 'stop' | 'empty' {
  const voiced = rms >= Math.max(0.012, this.noise * 3);
  if (!voiced) this.noise = this.noise * 0.98 + Math.min(rms, 0.012) * 0.02;
  if (voiced) {
   if (this.candidateAt === null) this.candidateAt = now;
   if (now - this.candidateAt >= 200) this.speech = true;
   if (this.speech) this.lastVoice = now;
  } else this.candidateAt = null;
  if (!this.speech) return now - this.startedAt >= 10000 ? 'empty' : 'waiting';
  if (now - this.lastVoice! >= this.silenceMs) return 'stop';
  return voiced ? 'speech' : 'pause';
 }
}
export function monitorVoice(stream: MediaStream, silenceMs: number, onState: (s: string) => void, onEnd: (empty: boolean) => void): () => void {
 const context = new AudioContext();
 const source = context.createMediaStreamSource(stream), analyser = context.createAnalyser();
 analyser.fftSize = 2048; source.connect(analyser);
 const samples = new Float32Array(analyser.fftSize), detector = new VoiceActivity(performance.now(), silenceMs);
 let closed = false;
 const cleanup = () => { if (closed) return; closed = true; clearInterval(timer); source.disconnect(); analyser.disconnect(); void context.close().catch(() => {}); };
 const timer = setInterval(() => {
  if (context.state !== 'running') return;
  analyser.getFloatTimeDomainData(samples);
  const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
  const state = detector.sample(rms, performance.now()); onState(state);
  if (state === 'stop' || state === 'empty') { cleanup(); onEnd(state === 'empty'); }
 }, 50);
 void context.resume().catch(cleanup);
 return cleanup;
}
