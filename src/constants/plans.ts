import { Plan } from '../types';

export const PLANS: Plan[] = [
  {
    id: '16:8',
    name: '16:8',
    label: 'Popular',
    fast_hours: 16,
    eat_hours: 8,
    description: 'Fast 16 hours, eat within 8 hours',
  },
  {
    id: '18:6',
    name: '18:6',
    label: 'Intermediate',
    fast_hours: 18,
    eat_hours: 6,
    description: 'Fast 18 hours, eat within 6 hours',
  },
  {
    id: '20:4',
    name: '20:4',
    label: 'Warrior',
    fast_hours: 20,
    eat_hours: 4,
    description: 'Fast 20 hours, eat within 4 hours',
  },
  {
    id: 'omad',
    name: 'OMAD',
    label: 'One Meal',
    fast_hours: 23,
    eat_hours: 1,
    description: 'One meal a day — 23 hour fast',
  },
  {
    id: 'custom',
    name: 'Custom',
    label: 'Pro',
    fast_hours: null,
    eat_hours: null,
    description: 'Set your own fasting window',
    requires_pro: true,
  },
];
