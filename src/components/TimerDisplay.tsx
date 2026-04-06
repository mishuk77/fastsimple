import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OdometerDigit from './OdometerDigit';

interface Props {
  hours: number;
  minutes: number;
  seconds: number;
  color: string;
}

export default function TimerDisplay({ hours, minutes, seconds, color }: Props) {
  const h1 = Math.floor(hours / 10);
  const h2 = hours % 10;
  const m1 = Math.floor(minutes / 10);
  const m2 = minutes % 10;
  const s1 = Math.floor(seconds / 10);
  const s2 = seconds % 10;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {hours >= 10 && <OdometerDigit digit={h1} color={color} />}
        <OdometerDigit digit={h2} color={color} />
        <Text style={[styles.label, { color }]}>h</Text>
        <View style={{ width: 8 }} />
        <OdometerDigit digit={m1} color={color} />
        <OdometerDigit digit={m2} color={color} />
        <Text style={[styles.label, { color }]}>m</Text>
        <View style={{ width: 8 }} />
        <OdometerDigit digit={s1} color={color} fontSize={32} />
        <OdometerDigit digit={s2} color={color} fontSize={32} />
        <Text style={[styles.labelSmall, { color }]}>s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 2,
  },
  labelSmall: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 2,
    opacity: 0.6,
  },
});
