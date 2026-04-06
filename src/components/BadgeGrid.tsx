import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ALL_MILESTONES } from '../constants/milestones';
import { useTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';

export default function BadgeGrid() {
  const { colors } = useTheme();
  const unlocked = useAppStore((s) => s.settings.unlocked_milestones);
  const unlockedSet = new Set(unlocked);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Badges</Text>
      <View style={styles.grid}>
        {ALL_MILESTONES.map((m) => {
          const isUnlocked = unlockedSet.has(m.id);
          return (
            <View key={m.id} style={[styles.badge, { backgroundColor: colors.card }]}>
              <Text style={[styles.emoji, { opacity: isUnlocked ? 1 : 0.2 }]}>
                {m.badge}
              </Text>
              <Text
                style={[
                  styles.name,
                  { color: isUnlocked ? colors.textPrimary : colors.textSecondary, opacity: isUnlocked ? 1 : 0.4 },
                ]}
                numberOfLines={1}
              >
                {m.name}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
