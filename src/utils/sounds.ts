import { useAppStore } from '../store/useAppStore';

// Sounds are opt-in and disabled by default.
// For MVP, we implement the interface but skip actual audio loading
// since we don't have real sound files yet.
// When real .wav files are added to src/assets/sounds/, uncomment the Audio import.

function isEnabled(): boolean {
  return useAppStore.getState().settings.sounds_enabled;
}

export function playStart() {
  if (!isEnabled()) return;
  // TODO: play start.wav
}

export function playGoal() {
  if (!isEnabled()) return;
  // TODO: play goal.wav
}

export function playEnd() {
  if (!isEnabled()) return;
  // TODO: play end.wav
}

export function playMilestone() {
  if (!isEnabled()) return;
  // TODO: play milestone.wav
}

export function playHalfway() {
  if (!isEnabled()) return;
  // TODO: play halfway.wav
}
