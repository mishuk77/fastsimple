import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FastRecord, UserSettings } from '../types';
import { getSettings, saveSettings } from '../utils/storage';
import { initDatabase, insertFast, getFasts, updateFast as dbUpdateFast, deleteFast as dbDeleteFast } from '../utils/database';
import { calculateStreak, calculateLongestStreak } from '../utils/streak';
import { checkMilestones } from '../utils/milestones';

interface AppState {
  // Settings
  settings: UserSettings;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<UserSettings>) => Promise<void>;

  // Database
  initDB: () => Promise<void>;

  // Fasts
  fasts: FastRecord[];
  loadFasts: () => Promise<void>;
  updateFast: (id: string, updates: Partial<FastRecord>) => Promise<void>;
  deleteFast: (id: string) => Promise<void>;

  // Derived stats
  currentStreak: number;
  longestStreak: number;
  averageFastHours: number;

  // Active fast actions
  startFast: (targetHours: number, plan: string) => Promise<void>;
  endFast: () => Promise<{ record: FastRecord; newMilestones: string[] }>;

  // Milestones
  pendingMilestones: string[];
  clearPendingMilestones: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  default_plan: '16:8',
  custom_target_hours: null,
  notifications: {
    goal_reached: true,
    reminder_enabled: false,
    reminder_time: '20:00',
    halfway: false,
  },
  theme: 'dark',
  sounds_enabled: false,
  haptics_enabled: true,
  is_pro: false,
  current_fast: { active: false, start_time: '', target_hours: 16 },
  unlocked_milestones: [],
  last_weekly_recap_date: '',
};

function computeStats(fasts: FastRecord[]) {
  const currentStreak = calculateStreak(fasts);
  const longestStreak = calculateLongestStreak(fasts);
  const averageFastHours =
    fasts.length > 0 ? fasts.reduce((sum, f) => sum + f.actual_hours, 0) / fasts.length : 0;
  return { currentStreak, longestStreak, averageFastHours };
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  fasts: [],
  currentStreak: 0,
  longestStreak: 0,
  averageFastHours: 0,
  pendingMilestones: [],

  initDB: async () => {
    await initDatabase();
  },

  loadSettings: async () => {
    const settings = await getSettings();
    set({ settings });
  },

  updateSettings: async (partial) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    await saveSettings(updated);
    set({ settings: updated });
  },

  loadFasts: async () => {
    const fasts = await getFasts();
    const stats = computeStats(fasts);
    set({ fasts, ...stats });
  },

  startFast: async (targetHours, plan) => {
    const settings = get().settings;
    const currentFast = {
      active: true,
      start_time: new Date().toISOString(),
      target_hours: targetHours,
    };
    const updated = { ...settings, current_fast: currentFast, default_plan: plan };
    await saveSettings(updated);
    set({ settings: updated });
  },

  endFast: async () => {
    const { settings, fasts } = get();
    const { current_fast } = settings;

    const startTime = new Date(current_fast.start_time);
    const endTime = new Date();
    const actualHours = Math.round(((endTime.getTime() - startTime.getTime()) / 3600000) * 10) / 10;

    const record: FastRecord = {
      id: uuidv4(),
      start_time: current_fast.start_time,
      end_time: endTime.toISOString(),
      target_hours: current_fast.target_hours,
      actual_hours: actualHours,
      goal_met: actualHours >= current_fast.target_hours,
      plan: settings.default_plan,
      note: '',
    };

    await insertFast(record);

    const updatedFasts = [record, ...fasts];
    const stats = computeStats(updatedFasts);

    // Check milestones
    const newMilestones = checkMilestones(
      updatedFasts,
      stats.currentStreak,
      settings.unlocked_milestones,
    );

    const updatedSettings = {
      ...settings,
      current_fast: { active: false, start_time: '', target_hours: current_fast.target_hours },
      unlocked_milestones: [...settings.unlocked_milestones, ...newMilestones],
    };

    await saveSettings(updatedSettings);

    set({
      settings: updatedSettings,
      fasts: updatedFasts,
      ...stats,
      pendingMilestones: newMilestones,
    });

    return { record, newMilestones };
  },

  updateFast: async (id, updates) => {
    await dbUpdateFast(id, updates);
    const fasts = await getFasts();
    const stats = computeStats(fasts);
    set({ fasts, ...stats });
  },

  deleteFast: async (id) => {
    await dbDeleteFast(id);
    const fasts = await getFasts();
    const stats = computeStats(fasts);
    set({ fasts, ...stats });
  },

  clearPendingMilestones: () => set({ pendingMilestones: [] }),
}));
