import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: number; // 0 to 1.5
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor: string;
  children?: React.ReactNode;
  ghostProgress?: number; // "Beat Yesterday" ghost line
}

export default function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 12,
  color,
  trackColor,
  children,
  ghostProgress,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const animatedProps = useAnimatedProps(() => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1.5);
    const offset = circumference * (1 - clampedProgress);
    return {
      strokeDashoffset: withTiming(offset, { duration: 800 }),
    };
  });

  const ghostAnimatedProps = useAnimatedProps(() => {
    const gp = Math.min(Math.max(ghostProgress ?? 0, 0), 1.5);
    const offset = circumference * (1 - gp);
    return {
      strokeDashoffset: withTiming(offset, { duration: 800 }),
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Ghost line (Beat Yesterday) */}
        {ghostProgress !== undefined && ghostProgress > 0 && (
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth * 0.6}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={ghostAnimatedProps}
            strokeLinecap="round"
            rotation="-90"
            origin={`${center}, ${center}`}
            opacity={0.2}
            strokeDashoffset={0}
          />
        )}
        {/* Progress */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[styles.content, { width: size, height: size }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
