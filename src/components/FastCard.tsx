import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FastRecord } from '../types';
import { useTheme } from '../theme';
import { relativeDate, formatDurationShort, formatTime } from '../utils/format';
import { useAppStore } from '../store/useAppStore';

interface Props {
  fast: FastRecord;
}

function getGoalIcon(fast: FastRecord): string {
  if (fast.goal_met) return '✅';
  const ratio = fast.actual_hours / fast.target_hours;
  if (ratio >= 0.75) return '⚠️';
  return '❌';
}

export default function FastCard({ fast }: Props) {
  const { colors } = useTheme();
  const deleteFast = useAppStore((s) => s.deleteFast);

  const handleLongPress = () => {
    Alert.alert('Delete Fast', 'Are you sure you want to delete this fast?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteFast(fast.id),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Text style={[styles.date, { color: colors.textPrimary }]}>
          {relativeDate(fast.start_time)}
        </Text>
        <Text style={[styles.times, { color: colors.textSecondary }]}>
          {formatTime(new Date(fast.start_time))} → {formatTime(new Date(fast.end_time))}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.duration, { color: colors.textPrimary }]}>
          {formatDurationShort(fast.actual_hours)}
        </Text>
        <Text style={styles.goal}>{getGoalIcon(fast)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  left: {
    gap: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
  },
  times: {
    fontSize: 13,
  },
  duration: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  goal: {
    fontSize: 14,
  },
});
