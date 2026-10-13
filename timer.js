// Timer per soal. Durasi bisa dipilih pengguna (lihat TIMER_OPTIONS).
export const TIMER_OPTIONS = [15, 30, 60];
export const QUESTION_SECONDS = 30; // durasi default
export const URGENT_SECONDS = 5;
export function createQuizTimer({
  onTick,
  onTimeout,
  seconds = QUESTION_SECONDS,
}) {
  const totalMs = seconds * 1000;
  let intervalId = null,
    timeLeftMs = totalMs;
  function stop() {
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
  }
  function tick() {
    timeLeftMs = Math.max(0, timeLeftMs - 100);
    onTick(timeLeftMs, seconds);
    if (timeLeftMs <= 0) {
      stop();
      onTimeout();
    }
  }
  function start() {
    stop();
    timeLeftMs = totalMs;
    onTick(timeLeftMs, seconds);
    intervalId = setInterval(tick, 100);
  }
  function pause() {
    stop();
  }
  function resume() {
    if (intervalId === null && timeLeftMs > 0)
      intervalId = setInterval(tick, 100);
  }
  function reset() {
    stop();
    timeLeftMs = totalMs;
  }
  return { start, stop, pause, resume, reset, getTimeLeft: () => timeLeftMs };
}
