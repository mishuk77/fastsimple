import { FastRecord } from '../types';
import { dateToKey } from './format';

export function calculateStreak(fasts: FastRecord[]): number {
  if (fasts.length === 0) return 0;

  // Build a set of dates with goal-met fasts
  const goalMetDates = new Set<string>();
  for (const fast of fasts) {
    if (fast.goal_met) {
      goalMetDates.add(dateToKey(new Date(fast.start_time)));
    }
  }

  let streak = 0;
  const now = new Date();
  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // If today doesn't have a goal-met fast, check if there's an active fast
  // (user might still be fasting). Start checking from today.
  // If today has no fast at all, start from yesterday.
  if (!goalMetDates.has(dateToKey(checkDate))) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (goalMetDates.has(dateToKey(checkDate))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

export function calculateLongestStreak(fasts: FastRecord[]): number {
  if (fasts.length === 0) return 0;

  const goalMetDates = new Set<string>();
  let minDate = new Date();
  let maxDate = new Date(0);

  for (const fast of fasts) {
    if (fast.goal_met) {
      const d = new Date(fast.start_time);
      goalMetDates.add(dateToKey(d));
      if (d < minDate) minDate = d;
      if (d > maxDate) maxDate = d;
    }
  }

  if (goalMetDates.size === 0) return 0;

  let longest = 0;
  let current = 0;
  const checkDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  const end = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

  while (checkDate <= end) {
    if (goalMetDates.has(dateToKey(checkDate))) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }

  return longest;
}
