import { FastRecord } from '../types';
import { STREAK_MILESTONES, DURATION_MILESTONES, TOTAL_MILESTONES } from '../constants/milestones';

export function checkMilestones(
  fasts: FastRecord[],
  currentStreak: number,
  unlockedMilestones: string[],
): string[] {
  const newlyUnlocked: string[] = [];
  const unlocked = new Set(unlockedMilestones);

  // Streak milestones
  for (const m of STREAK_MILESTONES) {
    if (currentStreak >= m.threshold && !unlocked.has(m.id)) {
      newlyUnlocked.push(m.id);
    }
  }

  // Duration milestones (check latest fast)
  if (fasts.length > 0) {
    const latest = fasts[0]; // fasts sorted by start_time desc
    for (const m of DURATION_MILESTONES) {
      if (latest.actual_hours >= m.threshold && !unlocked.has(m.id)) {
        newlyUnlocked.push(m.id);
      }
    }
  }

  // Total fasts milestones
  const totalFasts = fasts.length;
  for (const m of TOTAL_MILESTONES) {
    if (totalFasts >= m.threshold && !unlocked.has(m.id)) {
      newlyUnlocked.push(m.id);
    }
  }

  return newlyUnlocked;
}
