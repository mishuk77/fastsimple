import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../theme';
import { useTimer } from '../hooks/useTimer';
import { getTargetHours } from '../utils/plans';
import { getColorForProgress } from '../utils/colorShift';
import { formatTime, formatDurationShort } from '../utils/format';
import { hapticStart, hapticEnd, hapticGoal } from '../utils/haptics';
import { playStart, playEnd, playGoal } from '../utils/sounds';
import { requestPermissions, scheduleGoalNotification, scheduleHalfwayNotification, cancelAllNotifications } from '../utils/notifications';
import ProgressRing from '../components/ProgressRing';
import TimerDisplay from '../components/TimerDisplay';
import FastingZoneLabel from '../components/FastingZoneLabel';
import PlanSelector from '../components/PlanSelector';
import StreakFire from '../components/StreakFire';
import ConfettiBurst from '../components/ConfettiBurst';
import MilestoneOverlay from '../components/MilestoneOverlay';

export default function TimerScreen() {
  const { colors } = useTheme();
  const timer = useTimer();
  const settings = useAppStore((s) => s.settings);
  const fasts = useAppStore((s) => s.fasts);
  const currentStreak = useAppStore((s) => s.currentStreak);
  const startFast = useAppStore((s) => s.startFast);
  const endFast = useAppStore((s) => s.endFast);
  const pendingMilestones = useAppStore((s) => s.pendingMilestones);
  const clearPendingMilestones = useAppStore((s) => s.clearPendingMilestones);

  const [selectedPlan, setSelectedPlan] = useState(settings.default_plan);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const goalCelebratedRef = useRef(false);

  // Celebrate when goal is reached
  useEffect(() => {
    if (timer.isActive && timer.progress >= 1.0 && !goalCelebratedRef.current) {
      goalCelebratedRef.current = true;
      setShowConfetti(true);
      hapticGoal();
      playGoal();
    }
    if (!timer.isActive) {
      goalCelebratedRef.current = false;
    }
  }, [timer.isActive, timer.progress]);

  // Show milestone overlays
  useEffect(() => {
    if (pendingMilestones.length > 0 && !showMilestone) {
      setShowMilestone(pendingMilestones[0]);
    }
  }, [pendingMilestones]);

  const handleStartFast = async () => {
    const targetHours = getTargetHours(selectedPlan, settings.custom_target_hours);
    hapticStart();
    playStart();
    await startFast(targetHours, selectedPlan);

    // Schedule notifications
    await requestPermissions();
    const startTime = new Date();
    if (settings.notifications.goal_reached) {
      const goalTime = new Date(startTime.getTime() + targetHours * 3600000);
      await scheduleGoalNotification(goalTime, targetHours);
    }
    if (settings.notifications.halfway) {
      const halfwayTime = new Date(startTime.getTime() + (targetHours / 2) * 3600000);
      await scheduleHalfwayNotification(halfwayTime);
    }
  };

  const handleEndFast = () => {
    Alert.alert('End Fast', 'Are you sure you want to end this fast?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Fast',
        style: 'destructive',
        onPress: async () => {
          hapticEnd();
          playEnd();
          await endFast();
          await cancelAllNotifications();
        },
      },
    ]);
  };

  const dismissMilestone = () => {
    setShowMilestone(null);
    clearPendingMilestones();
  };

  // Color shift based on progress
  const progressColors = timer.isActive
    ? getColorForProgress(timer.progress)
    : { ring: colors.accent, bg: colors.background };

  // Ghost line: previous fast's progress at the same elapsed time
  const lastFast = fasts.length > 0 ? fasts[0] : null;
  const ghostProgress = timer.isActive && lastFast
    ? Math.min(timer.elapsedMs / (lastFast.actual_hours * 3600000), 1)
    : undefined;

  const startTime = timer.isActive ? new Date(settings.current_fast.start_time) : null;
  const endTimeProjected = startTime
    ? new Date(startTime.getTime() + settings.current_fast.target_hours * 3600000)
    : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: timer.isActive ? progressColors.bg : colors.background }]}>
      <View style={styles.content}>
        {/* Progress Ring */}
        <ProgressRing
          progress={timer.isActive ? timer.progress : 0}
          color={timer.isActive ? progressColors.ring : colors.ringTrack}
          trackColor={colors.ringTrack}
          ghostProgress={ghostProgress}
        >
          {timer.isActive ? (
            <View style={styles.ringContent}>
              <TimerDisplay
                hours={timer.hours}
                minutes={timer.minutes}
                seconds={timer.seconds}
                color={colors.textPrimary}
              />
              <FastingZoneLabel elapsedHours={timer.elapsedHours} />
            </View>
          ) : (
            <View style={styles.ringContent}>
              <Text style={[styles.readyText, { color: colors.textSecondary }]}>
                Ready to fast
              </Text>
            </View>
          )}
        </ProgressRing>

        {/* Info below ring */}
        {timer.isActive && startTime && endTimeProjected && (
          <View style={styles.infoSection}>
            <Text style={[styles.goalText, { color: colors.textSecondary }]}>
              Goal: {settings.current_fast.target_hours} hours
            </Text>
            <Text style={[styles.timesText, { color: colors.textSecondary }]}>
              Started {formatTime(startTime)} · Ends {formatTime(endTimeProjected)}
            </Text>
          </View>
        )}

        {!timer.isActive && (
          <View style={styles.infoSection}>
            {/* Last fast summary */}
            {lastFast && (
              <View style={[styles.lastFastCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.lastFastLabel, { color: colors.textSecondary }]}>
                  Last fast
                </Text>
                <Text style={[styles.lastFastDuration, { color: colors.textPrimary }]}>
                  {formatDurationShort(lastFast.actual_hours)}
                </Text>
                <Text style={[styles.lastFastGoal, { color: lastFast.goal_met ? colors.success : colors.exceeded }]}>
                  {lastFast.goal_met ? '✅ Goal met' : '⚠️ Goal not met'}
                </Text>
              </View>
            )}

            {/* Streak */}
            {currentStreak > 0 && (
              <View style={styles.streakContainer}>
                <StreakFire streak={currentStreak} />
                <Text style={[styles.streakText, { color: colors.textPrimary }]}>
                  {currentStreak} day streak
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {!timer.isActive && (
          <PlanSelector selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
        )}
        <View style={styles.buttonContainer}>
          {timer.isActive ? (
            <TouchableOpacity
              style={[styles.button, styles.endButton, { borderColor: colors.textSecondary }]}
              onPress={handleEndFast}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: colors.textSecondary }]}>End Fast</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.startButton, { backgroundColor: colors.accent }]}
              onPress={handleStartFast}
              activeOpacity={0.7}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Start Fast</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Celebrations */}
      {showConfetti && <ConfettiBurst onComplete={() => setShowConfetti(false)} />}
      {showMilestone && (
        <MilestoneOverlay milestoneId={showMilestone} onDismiss={dismissMilestone} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  ringContent: {
    alignItems: 'center',
    gap: 8,
  },
  readyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  infoSection: {
    alignItems: 'center',
    gap: 12,
  },
  goalText: {
    fontSize: 15,
  },
  timesText: {
    fontSize: 13,
  },
  lastFastCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  lastFastLabel: {
    fontSize: 13,
  },
  lastFastDuration: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lastFastGoal: {
    fontSize: 13,
    fontWeight: '500',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 20,
    gap: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {},
  endButton: {
    borderWidth: 1.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
