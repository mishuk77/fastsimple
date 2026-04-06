import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleGoalNotification(targetDate: Date, targetHours: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Goal Reached! 🎉',
      body: `You hit your ${targetHours}-hour goal!`,
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: targetDate },
  });
}

export async function scheduleHalfwayNotification(halfwayDate: Date): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Halfway There! 💪',
      body: "You're halfway to your fasting goal. Keep going!",
      sound: true,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: halfwayDate },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
