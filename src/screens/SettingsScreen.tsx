import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { PLANS } from '../constants/plans';

function SettingRow({ label, value, onPress, colors }: { label: string; value?: string; onPress?: () => void; colors: any }) {
  return (
    <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      {value && <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>}
    </TouchableOpacity>
  );
}

function ToggleRow({ label, value, onToggle, colors }: { label: string; value: boolean; onToggle: (v: boolean) => void; colors: any }) {
  return (
    <View style={[styles.row, { backgroundColor: colors.card }]}>
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ true: colors.accent }} />
    </View>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const fasts = useAppStore((s) => s.fasts);

  const currentPlan = PLANS.find((p) => p.id === settings.default_plan);

  const handlePlanChange = () => {
    const options = PLANS.filter((p) => !p.requires_pro || settings.is_pro);
    Alert.alert(
      'Default Fasting Plan',
      'Select your default plan',
      [
        ...options.map((plan) => ({
          text: `${plan.name} — ${plan.description}`,
          onPress: () => updateSettings({ default_plan: plan.id }),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  };

  const handleThemeChange = () => {
    Alert.alert('Appearance', 'Select theme', [
      { text: 'Dark', onPress: () => updateSettings({ theme: 'dark' }) },
      { text: 'Light', onPress: () => updateSettings({ theme: 'light' }) },
      { text: 'System', onPress: () => updateSettings({ theme: 'system' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      `This will permanently delete all ${fasts.length} fasts and reset all settings. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            for (const fast of fasts) {
              await useAppStore.getState().deleteFast(fast.id);
            }
          },
        },
      ],
    );
  };

  const themeLabel = settings.theme === 'system' ? 'System' : settings.theme === 'dark' ? 'Dark' : 'Light';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>

        {/* Plan */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>FASTING PLAN</Text>
        <SettingRow label="Default Plan" value={currentPlan?.name ?? '16:8'} onPress={handlePlanChange} colors={colors} />

        {/* Notifications */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
        <ToggleRow
          label="Goal Reached"
          value={settings.notifications.goal_reached}
          onToggle={(v) => updateSettings({ notifications: { ...settings.notifications, goal_reached: v } })}
          colors={colors}
        />
        <ToggleRow
          label="Daily Reminder"
          value={settings.notifications.reminder_enabled}
          onToggle={(v) => updateSettings({ notifications: { ...settings.notifications, reminder_enabled: v } })}
          colors={colors}
        />
        <ToggleRow
          label="Halfway Alert"
          value={settings.notifications.halfway}
          onToggle={(v) => updateSettings({ notifications: { ...settings.notifications, halfway: v } })}
          colors={colors}
        />

        {/* Appearance */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>APPEARANCE</Text>
        <SettingRow label="Theme" value={themeLabel} onPress={handleThemeChange} colors={colors} />

        {/* Sound & Haptics */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>FEEDBACK</Text>
        <ToggleRow
          label="Sound Effects"
          value={settings.sounds_enabled}
          onToggle={(v) => updateSettings({ sounds_enabled: v })}
          colors={colors}
        />
        <ToggleRow
          label="Haptic Feedback"
          value={settings.haptics_enabled}
          onToggle={(v) => updateSettings({ haptics_enabled: v })}
          colors={colors}
        />

        {/* Data */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>DATA</Text>
        <SettingRow label="Clear All Data" onPress={handleClearData} colors={colors} />

        {/* About */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ABOUT</Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.aboutTitle, { color: colors.textPrimary }]}>FastSimple</Text>
          <Text style={[styles.aboutSubtitle, { color: colors.textSecondary }]}>
            Fasting timer. Nothing else.
          </Text>
          <Text style={[styles.aboutVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.aboutTagline, { color: colors.textSecondary }]}>
            Made with ❤️ — No subscriptions, ever.
          </Text>
        </View>

        {/* Pro */}
        {!settings.is_pro && (
          <TouchableOpacity
            style={[styles.proButton, { backgroundColor: colors.card, borderColor: colors.accent }]}
            onPress={() => router.push('/pro')}
            activeOpacity={0.7}
          >
            <Text style={[styles.proText, { color: colors.accent }]}>✨ Upgrade to Pro</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingTop: 24,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 2,
  },
  rowLabel: {
    fontSize: 15,
  },
  rowValue: {
    fontSize: 15,
  },
  aboutCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  aboutSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  aboutVersion: {
    fontSize: 12,
    marginTop: 8,
  },
  aboutTagline: {
    fontSize: 13,
    marginTop: 4,
  },
  proButton: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  proText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
