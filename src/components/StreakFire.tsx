import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

interface Props {
  streak: number;
}

function getFireTier(streak: number): { emoji: string; size: number } {
  if (streak >= 100) return { emoji: '👑🔥', size: 32 };
  if (streak >= 60) return { emoji: '🔥🔥🔥', size: 28 };
  if (streak >= 30) return { emoji: '🔥🔥', size: 26 };
  if (streak >= 14) return { emoji: '🔥', size: 24 };
  if (streak >= 7) return { emoji: '🔥', size: 20 };
  return { emoji: '🔥', size: 16 };
}

export default function StreakFire({ streak }: Props) {
  if (streak <= 0) return null;

  const { emoji, size } = getFireTier(streak);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.1, { duration: 400 }),
            withTiming(0.95, { duration: 400 }),
          ),
          -1,
          true,
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
