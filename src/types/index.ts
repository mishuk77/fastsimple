export interface FastRecord {
  id: string;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  target_hours: number;
  actual_hours: number; // decimal, 1 place
  goal_met: boolean;
  plan: string; // "16:8" | "18:6" | "20:4" | "omad" | "custom"
  note: string;
}

export interface CurrentFast {
  active: boolean;
  start_time: string; // ISO 8601
  target_hours: number;
}

export interface NotificationSettings {
  goal_reached: boolean;
  reminder_enabled: boolean;
  reminder_time: string; // "HH:MM"
  halfway: boolean;
}

export interface UserSettings {
  default_plan: string;
  custom_target_hours: number | null;
  notifications: NotificationSettings;
  theme: 'dark' | 'light' | 'system';
  sounds_enabled: boolean;
  haptics_enabled: boolean;
  is_pro: boolean;
  current_fast: CurrentFast;
  unlocked_milestones: string[];
  last_weekly_recap_date: string; // ISO date
}

export interface Plan {
  id: string;
  name: string;
  label: string;
  fast_hours: number | null;
  eat_hours: number | null;
  description: string;
  requires_pro?: boolean;
}

export interface Zone {
  min_hours: number;
  max_hours: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Milestone {
  id: string;
  type: 'streak' | 'duration' | 'total';
  threshold: number;
  badge: string;
  name: string;
}

export interface ThemeColors {
  background: string;
  card: string;
  accent: string;
  success: string;
  exceeded: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  ring: string;
  ringTrack: string;
}
