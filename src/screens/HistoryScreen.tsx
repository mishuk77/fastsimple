import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { dateToKey } from '../utils/format';
import CalendarHeatmap from '../components/CalendarHeatmap';
import StatsBadge from '../components/StatsBadge';
import FastCard from '../components/FastCard';
import BadgeGrid from '../components/BadgeGrid';
import StreakFire from '../components/StreakFire';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const fasts = useAppStore((s) => s.fasts);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const averageFastHours = useAppStore((s) => s.averageFastHours);

  const heatmapData = useMemo(() => {
    const data: { [key: string]: { duration: number; goalMet: boolean } } = {};
    for (const fast of fasts) {
      const key = dateToKey(new Date(fast.start_time));
      const existing = data[key];
      if (!existing || fast.actual_hours > existing.duration) {
        data[key] = { duration: fast.actual_hours, goalMet: fast.goal_met };
      }
    }
    return data;
  }, [fasts]);

  const ListHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>History</Text>

      <CalendarHeatmap data={heatmapData} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatsBadge icon="🔥" value={String(currentStreak)} label="Current" />
        <StatsBadge icon="🏆" value={String(longestStreak)} label="Longest" />
        <StatsBadge icon="⏱" value={`${averageFastHours.toFixed(1)}h`} label="Average" />
        <StatsBadge icon="📊" value={String(fasts.length)} label="Total" />
      </View>

      {/* Badges */}
      <BadgeGrid />

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Past Fasts</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={fasts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FastCard fast={item} />}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No fasts yet. Start your first fast!
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});
