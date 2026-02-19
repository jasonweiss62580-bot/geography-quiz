/** Singleton AudioContext with synthesized sounds. */

let ctx: AudioContext | null = null;

export function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

/** Must be called inside a user gesture to resume iOS Safari AudioContext. */
export async function resumeCtx(): Promise<void> {
  const c = getCtx();
  if (c.state === 'suspended') await c.resume();
}

function playNote(
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.25,
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  g.gain.setValueAtTime(gain, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/** Ascending C5→E5→G5 chime (correct answer). */
export function playCorrect(): void {
  const c = getCtx();
  const now = c.currentTime;
  playNote(523.25, now, 0.15);        // C5
  playNote(659.25, now + 0.12, 0.15); // E5
  playNote(783.99, now + 0.24, 0.25); // G5
}

/** Short A3→F3 descending buzz (wrong answer). */
export function playWrong(): void {
  const c = getCtx();
  const now = c.currentTime;
  playNote(220, now, 0.18, 'sawtooth', 0.2);       // A3
  playNote(174.61, now + 0.15, 0.25, 'sawtooth', 0.2); // F3
}

/** C major arpeggio C4→E4→G4→C5 fanfare (quiz complete). */
export function playFanfare(): void {
  const c = getCtx();
  const now = c.currentTime;
  playNote(261.63, now, 0.2);         // C4
  playNote(329.63, now + 0.15, 0.2); // E4
  playNote(392, now + 0.3, 0.2);     // G4
  playNote(523.25, now + 0.45, 0.6); // C5
  // sustained harmony
  playNote(329.63, now + 0.45, 0.6, 'sine', 0.15); // E4
  playNote(392, now + 0.45, 0.6, 'sine', 0.12);    // G4
}
