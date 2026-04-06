import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

const FEATURES = [
  { icon: '⏱', title: 'Custom Fasting Durations', desc: 'Set any fasting window from 1-72 hours' },
  { icon: '📱', title: 'Home Screen Widget', desc: 'See your timer at a glance' },
  { icon: '📊', title: 'CSV Export', desc: 'Export your fasting data' },
  { icon: '🎨', title: 'Alternate App Icons', desc: 'Dark, light, and minimal options' },
  { icon: '🚫', title: 'Remove Ads', desc: 'Clean, ad-free experience' },
];

export default function ProScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>FastSimple Pro</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          One-time purchase. No subscription.
        </Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f, i) => (
          <View key={i} style={[styles.feature, { backgroundColor: colors.card }]}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{f.title}</Text>
              <Text style={[styles.featureDesc, { color: colors.textSecondary }]}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: colors.accent }]}
          activeOpacity={0.7}
        >
          <Text style={styles.buyText}>Unlock Pro — $3.99</Text>
          <Text style={styles.buySubtext}>One-time purchase</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={[styles.restoreText, { color: colors.textSecondary }]}>
            Restore Purchase
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
  },
  features: {
    gap: 8,
    flex: 1,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 14,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDesc: {
    fontSize: 13,
  },
  bottom: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 20,
  },
  buyButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  buyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buySubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  restoreText: {
    fontSize: 14,
  },
});
