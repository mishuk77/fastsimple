import { Zone } from '../types';

export const ZONES: Zone[] = [
  {
    min_hours: 0,
    max_hours: 4,
    name: 'Fed state',
    icon: '🍽️',
    color: '#94A3B8',
    description: 'Body is digesting recent meal',
  },
  {
    min_hours: 4,
    max_hours: 12,
    name: 'Early fasting',
    icon: '⏳',
    color: '#6366F1',
    description: 'Blood sugar normalizing, insulin dropping',
  },
  {
    min_hours: 12,
    max_hours: 14,
    name: 'Fat burning starts',
    icon: '🔥',
    color: '#F97316',
    description: 'Body transitioning to fat as fuel',
  },
  {
    min_hours: 14,
    max_hours: 18,
    name: 'Fat burning',
    icon: '🔥',
    color: '#EF4444',
    description: 'Actively burning stored fat',
  },
  {
    min_hours: 18,
    max_hours: 24,
    name: 'Autophagy zone',
    icon: '♻️',
    color: '#22C55E',
    description: 'Cellular cleanup and renewal',
  },
  {
    min_hours: 24,
    max_hours: 999,
    name: 'Extended fast',
    icon: '⭐',
    color: '#F59E0B',
    description: 'Deep autophagy and ketosis',
  },
];

export function getZoneForHours(hours: number): Zone {
  return ZONES.find((z) => hours >= z.min_hours && hours < z.max_hours) ?? ZONES[ZONES.length - 1];
}
