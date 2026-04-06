import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { useAppStore } from '../store/useAppStore';

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  elapsedMs: number;
  elapsedHours: number;
  isActive: boolean;
}

export function useTimer(): TimerState {
  const currentFast = useAppStore((s) => s.settings.current_fast);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!currentFast?.active) return;

    const interval = setInterval(() => setNow(Date.now()), 1000);

    // Re-sync on foreground resume
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(Date.now());
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [currentFast?.active]);

  if (!currentFast?.active) {
    return { hours: 0, minutes: 0, seconds: 0, progress: 0, elapsedMs: 0, elapsedHours: 0, isActive: false };
  }

  const startMs = new Date(currentFast.start_time).getTime();
  const elapsedMs = Math.max(0, now - startMs);
  const targetMs = currentFast.target_hours * 3600000;
  const progress = Math.min(elapsedMs / targetMs, 1.5);

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    progress,
    elapsedMs,
    elapsedHours: elapsedMs / 3600000,
    isActive: true,
  };
}
