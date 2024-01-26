export function secondsToMinutes(seconds: number): { minutes: number; remainingSeconds: number } {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return { minutes, remainingSeconds };
}
