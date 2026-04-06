import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/useAppStore';

function isEnabled(): boolean {
  return useAppStore.getState().settings.haptics_enabled;
}

export function hapticButton() {
  if (isEnabled()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticStart() {
  if (isEnabled()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function hapticEnd() {
  if (isEnabled()) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticGoal() {
  if (isEnabled()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function hapticMilestone() {
  if (isEnabled()) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
