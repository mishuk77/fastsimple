export function getElapsedMs(startTime: string): number {
  return Date.now() - new Date(startTime).getTime();
}

export function getProgress(startTime: string, targetHours: number): number {
  const elapsed = getElapsedMs(startTime);
  const target = targetHours * 3600000;
  return Math.min(elapsed / target, 1.5); // Cap at 150%
}

export function getElapsedHours(startTime: string): number {
  return getElapsedMs(startTime) / 3600000;
}
