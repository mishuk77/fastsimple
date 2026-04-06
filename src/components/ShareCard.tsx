import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useAppStore } from '../store/useAppStore';
import { useTimer } from '../hooks/useTimer';
import { formatDurationShort } from '../utils/format';
import { getZoneForHours } from '../constants/zones';

export default function ShareButton() {
  const viewRef = useRef<ViewShot>(null);
  const timer = useTimer();
  const currentStreak = useAppStore((s) => s.currentStreak);
  const settings = useAppStore((s) => s.settings);

  const handleShare = async () => {
    if (!viewRef.current?.capture) return;
    try {
      const uri = await viewRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch {
      // Sharing cancelled or failed
    }
  };

  if (!timer.isActive) return null;

  const zone = getZoneForHours(timer.elapsedHours);

  return (
    <>
      {/* Hidden card for capture */}
      <ViewShot
        ref={viewRef}
        options={{ format: 'png', quality: 1, width: 1080, height: 1920 }}
        style={styles.hiddenCard}
      >
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <Text style={styles.cardTime}>
              {timer.hours}h {String(timer.minutes).padStart(2, '0')}m
            </Text>
            <Text style={styles.cardZone}>{zone.icon} {zone.name}</Text>
            {currentStreak > 0 && (
              <Text style={styles.cardStreak}>🔥 {currentStreak} day streak</Text>
            )}
            <Text style={styles.cardGoal}>
              Goal: {settings.current_fast.target_hours}h ({settings.default_plan})
            </Text>
          </View>
          <Text style={styles.watermark}>FastSimple</Text>
        </View>
      </ViewShot>

      {/* Visible share button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
        <Text style={styles.shareIcon}>↗</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  hiddenCard: {
    position: 'absolute',
    left: -9999,
  },
  card: {
    width: 1080,
    height: 1920,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
  },
  cardContent: {
    alignItems: 'center',
    gap: 24,
  },
  cardTime: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  cardZone: {
    fontSize: 48,
    color: '#94A3B8',
  },
  cardStreak: {
    fontSize: 48,
    color: '#F59E0B',
  },
  cardGoal: {
    fontSize: 36,
    color: '#64748B',
  },
  watermark: {
    position: 'absolute',
    bottom: 80,
    fontSize: 32,
    color: '#333',
    fontWeight: '600',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 18,
    color: '#F8FAFC',
    fontWeight: '600',
  },
});
