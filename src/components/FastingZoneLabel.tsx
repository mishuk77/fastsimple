import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getZoneForHours } from '../constants/zones';

interface Props {
  elapsedHours: number;
}

export default function FastingZoneLabel({ elapsedHours }: Props) {
  const zone = getZoneForHours(elapsedHours);

  return (
    <View style={[styles.container, { backgroundColor: zone.color + '20' }]}>
      <Text style={styles.icon}>{zone.icon}</Text>
      <Text style={[styles.name, { color: zone.color }]}>{zone.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
});
