// Timer per soal, bisa dinonaktifkan pengguna.
export const QUESTION_SECONDS = 30;
export const URGENT_SECONDS = 5;
export function createQuizTimer({ onTick, onTimeout }) {
  let intervalId = null,
    timeLeftMs = QUESTION_SECONDS * 1000;
  function stop() {
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
  }
  function tick() {
    timeLeftMs = Math.max(0, timeLeftMs - 100);
    onTick(timeLeftMs, QUESTION_SECONDS);
    if (timeLeftMs <= 0) {
      stop();
      onTimeout();
    }
  }
  function start() {
    stop();
    timeLeftMs = QUESTION_SECONDS * 1000;
    onTick(timeLeftMs, QUESTION_SECONDS);
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
    timeLeftMs = QUESTION_SECONDS * 1000;
  }
  return { start, stop, pause, resume, reset, getTimeLeft: () => timeLeftMs };
}
