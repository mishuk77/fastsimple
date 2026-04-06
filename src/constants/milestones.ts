import { Milestone } from '../types';

export const STREAK_MILESTONES: Milestone[] = [
  { id: 'streak_3', type: 'streak', threshold: 3, badge: '🌱', name: 'Getting Started' },
  { id: 'streak_7', type: 'streak', threshold: 7, badge: '⚡', name: 'One Week Strong' },
  { id: 'streak_14', type: 'streak', threshold: 14, badge: '💪', name: 'Two Week Warrior' },
  { id: 'streak_21', type: 'streak', threshold: 21, badge: '🧠', name: 'Habit Formed' },
  { id: 'streak_30', type: 'streak', threshold: 30, badge: '🏆', name: 'Iron Will' },
  { id: 'streak_60', type: 'streak', threshold: 60, badge: '💎', name: 'Diamond Discipline' },
  { id: 'streak_100', type: 'streak', threshold: 100, badge: '👑', name: 'Centurion' },
  { id: 'streak_365', type: 'streak', threshold: 365, badge: '🌟', name: 'Full Year' },
];

export const DURATION_MILESTONES: Milestone[] = [
  { id: 'duration_16', type: 'duration', threshold: 16, badge: '🎯', name: 'First Goal' },
  { id: 'duration_20', type: 'duration', threshold: 20, badge: '🔥', name: 'Warrior Fast' },
  { id: 'duration_24', type: 'duration', threshold: 24, badge: '⭐', name: 'Full Day' },
  { id: 'duration_36', type: 'duration', threshold: 36, badge: '🚀', name: 'Extended Explorer' },
  { id: 'duration_48', type: 'duration', threshold: 48, badge: '🏔️', name: 'Summit' },
];

export const TOTAL_MILESTONES: Milestone[] = [
  { id: 'total_10', type: 'total', threshold: 10, badge: '🔟', name: 'Double Digits' },
  { id: 'total_50', type: 'total', threshold: 50, badge: '🎖️', name: 'Fifty Strong' },
  { id: 'total_100', type: 'total', threshold: 100, badge: '💯', name: 'The Century' },
  { id: 'total_500', type: 'total', threshold: 500, badge: '🏅', name: 'Legendary' },
];

export const ALL_MILESTONES: Milestone[] = [
  ...STREAK_MILESTONES,
  ...DURATION_MILESTONES,
  ...TOTAL_MILESTONES,
];
