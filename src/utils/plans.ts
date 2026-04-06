import { PLANS } from '../constants/plans';
import { Plan } from '../types';

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getTargetHours(planId: string, customHours?: number | null): number {
  if (planId === 'custom' && customHours) return customHours;
  const plan = getPlanById(planId);
  return plan?.fast_hours ?? 16;
}
