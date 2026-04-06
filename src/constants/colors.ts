import { ThemeColors } from '../types';

export const DARK_COLORS: ThemeColors = {
  background: '#0A0A0F',
  card: '#1A1A24',
  accent: '#6366F1',
  success: '#22C55E',
  exceeded: '#F59E0B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#2A2A3A',
  ring: '#6366F1',
  ringTrack: '#1E1E2E',
};

export const LIGHT_COLORS: ThemeColors = {
  background: '#FAFBFC',
  card: '#FFFFFF',
  accent: '#6366F1',
  success: '#22C55E',
  exceeded: '#F59E0B',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  ring: '#6366F1',
  ringTrack: '#E8E8EE',
};

// Color shift keyframes: progress % -> color for ring and background accent
export const COLOR_SHIFT_KEYFRAMES = [
  { progress: 0, ring: '#6366F1', bg: '#0A0A0F' },     // indigo
  { progress: 0.5, ring: '#06B6D4', bg: '#0A0F14' },   // teal
  { progress: 0.75, ring: '#22C55E', bg: '#0A0F0A' },   // green
  { progress: 1.0, ring: '#F59E0B', bg: '#0F0E0A' },    // gold
  { progress: 1.5, ring: '#F59E0B', bg: '#0F0E0A' },    // gold (cap)
];
