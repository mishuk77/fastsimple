import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 40;
const COLORS = ['#6366F1', '#06B6D4', '#22C55E', '#F59E0B', '#EC4899', '#F97316'];

interface Props {
  onComplete?: () => void;
}

function Particle({ delay, onLast }: { delay: number; onLast?: () => void }) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = 6 + Math.random() * 6;
  const angle = Math.random() * Math.PI * 2;
  const distance = 80 + Math.random() * 160;

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 200 }));
    translateX.value = withDelay(delay, withTiming(Math.cos(angle) * distance, { duration: 2000, easing: Easing.out(Easing.cubic) }));
    translateY.value = withDelay(delay, withTiming(Math.sin(angle) * distance + 100, { duration: 2000, easing: Easing.out(Easing.cubic) }));
    opacity.value = withDelay(delay + 1000, withTiming(0, { duration: 1000 }, () => {
      if (onLast) runOnJS(onLast)();
    }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export default function ConfettiBurst({ onComplete }: Props) {
  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle
          key={i}
          delay={Math.random() * 300}
          onLast={i === 0 ? onComplete : undefined}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
