import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

const SETTINGS_KEY = '@fastsimple_settings';

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
  current_fast: {
    active: false,
    start_time: '',
    target_hours: 16,
  },
  unlocked_milestones: [],
  last_weekly_recap_date: '',
};

export async function getSettings(): Promise<UserSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  const stored = JSON.parse(raw);
  // Merge with defaults to handle schema additions
  return { ...DEFAULT_SETTINGS, ...stored, notifications: { ...DEFAULT_SETTINGS.notifications, ...stored.notifications }, current_fast: { ...DEFAULT_SETTINGS.current_fast, ...stored.current_fast } };
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
