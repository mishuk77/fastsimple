import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, withTiming } from 'react-native-reanimated';
import { ALL_MILESTONES } from '../constants/milestones';
import { hapticMilestone } from '../utils/haptics';

interface Props {
  milestoneId: string;
  onDismiss: () => void;
}

export default function MilestoneOverlay({ milestoneId, onDismiss }: Props) {
  const milestone = ALL_MILESTONES.find((m) => m.id === milestoneId);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    hapticMilestone();
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });

    // Auto dismiss after 4 seconds
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!milestone) return null;

  return (
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={[styles.badgeContainer, badgeStyle]}>
          <Text style={styles.badge}>{milestone.badge}</Text>
        </Animated.View>
        <Text style={styles.title}>Milestone Unlocked!</Text>
        <Text style={styles.name}>{milestone.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  container: {
    alignItems: 'center',
    gap: 16,
  },
  badgeContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    fontSize: 56,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94A3B8',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
});
