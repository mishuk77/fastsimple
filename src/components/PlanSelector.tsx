import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PLANS } from '../constants/plans';
import { useTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { hapticButton } from '../utils/haptics';

interface Props {
  selectedPlan: string;
  onSelect: (planId: string) => void;
}

export default function PlanSelector({ selectedPlan, onSelect }: Props) {
  const { colors } = useTheme();
  const isPro = useAppStore((s) => s.settings.is_pro);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {PLANS.map((plan) => {
        const isSelected = plan.id === selectedPlan;
        const isLocked = plan.requires_pro && !isPro;

        return (
          <TouchableOpacity
            key={plan.id}
            onPress={() => {
              if (!isLocked) {
                hapticButton();
                onSelect(plan.id);
              }
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.accent : colors.card,
                borderColor: isSelected ? colors.accent : colors.border,
                opacity: isLocked ? 0.5 : 1,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              {plan.name}
            </Text>
            {isLocked && <Text style={styles.lock}>🔒</Text>}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  lock: {
    fontSize: 12,
  },
});
