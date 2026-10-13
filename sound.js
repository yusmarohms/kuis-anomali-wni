// Efek suara terisolasi dalam modul agar logika kuis tetap ringkas.
let soundEnabled = true;
let audioCtx = null;
export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
}
function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
export function playTone(freqs, duration = 0.1, type = "sine") {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    freqs.forEach((freq, i) => {
      const start = ctx.currentTime + i * duration,
        osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.15, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    });
  } catch {
    /* audio adalah pelengkap */
  }
}
export const sfxClick = () => playTone([520], 0.08);
export const sfxTimeout = () => playTone([300, 220], 0.12, "triangle");
export const sfxBack = () => playTone([420, 340], 0.06);
export const sfxResult = () =>
  playTone([523, 659, 784, 1047], 0.13, "triangle");
