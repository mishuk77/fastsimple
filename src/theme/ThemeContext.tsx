import React, { createContext, useContext, useMemo } from 'react';
import { Appearance } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/colors';
import { ThemeColors } from '../types';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: DARK_COLORS,
  isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.settings.theme);

  const value = useMemo(() => {
    let isDark: boolean;
    if (theme === 'system') {
      isDark = Appearance.getColorScheme() !== 'light';
    } else {
      isDark = theme === 'dark';
    }
    return {
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
      isDark,
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
