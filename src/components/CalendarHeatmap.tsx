import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { dateToKey } from '../utils/format';

interface HeatmapData {
  [dateKey: string]: { duration: number; goalMet: boolean };
}

interface Props {
  data: HeatmapData;
}

const CELL_SIZE = 14;
const CELL_GAP = 2;
const WEEKS_TO_SHOW = 13; // ~3 months

function getWeeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (WEEKS_TO_SHOW * 7 - 1) - startDate.getDay());

  let currentWeek: string[] = [];
  const date = new Date(startDate);

  while (date <= today) {
    currentWeek.push(dateToKey(date));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    date.setDate(date.getDate() + 1);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export default function CalendarHeatmap({ data }: Props) {
  const { colors } = useTheme();
  const weeks = getWeeks();
  const todayKey = dateToKey(new Date());

  function getCellColor(dateKey: string): string {
    const entry = data[dateKey];
    if (!entry) return colors.card;
    if (entry.goalMet) return colors.success;
    if (entry.duration >= 12) return colors.accent + '99';
    if (entry.duration >= 6) return colors.accent + '66';
    return colors.accent + '33';
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.week}>
            {week.map((dateKey) => (
              <View
                key={dateKey}
                style={[
                  styles.cell,
                  {
                    backgroundColor: getCellColor(dateKey),
                    borderWidth: dateKey === todayKey ? 1.5 : 0,
                    borderColor: colors.accent,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  week: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 3,
  },
});
