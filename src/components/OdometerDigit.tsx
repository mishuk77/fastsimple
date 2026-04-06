import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface Props {
  digit: number;
  fontSize?: number;
  color: string;
}

const DIGIT_HEIGHT = 60;

export default function OdometerDigit({ digit, fontSize = 56, color }: Props) {
  const translateY = useSharedValue(-digit * DIGIT_HEIGHT);

  useEffect(() => {
    translateY.value = withSpring(-digit * DIGIT_HEIGHT, {
      damping: 12,
      stiffness: 120,
    });
  }, [digit]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[styles.container, { height: DIGIT_HEIGHT }]}>
      <Animated.View style={animatedStyle}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <Text
            key={d}
            style={[styles.digit, { fontSize, color, height: DIGIT_HEIGHT, lineHeight: DIGIT_HEIGHT }]}
          >
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  digit: {
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },
});
