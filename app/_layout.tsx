import 'react-native-get-random-values';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/theme';
import { useEffect } from 'react';
import { useAppStore } from '../src/store/useAppStore';

function RootLayoutInner() {
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pro"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'FastSimple Pro',
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.textPrimary,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const loadSettings = useAppStore((s) => s.loadSettings);
  const loadFasts = useAppStore((s) => s.loadFasts);
  const initDB = useAppStore((s) => s.initDB);

  useEffect(() => {
    (async () => {
      await initDB();
      await loadSettings();
      await loadFasts();
    })();
  }, []);

  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}
