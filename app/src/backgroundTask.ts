import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

import { checkJackpotAndNotify } from './jackpot';

const JACKPOT_TASK = 'jackpot-check';

// Must run at module scope, so this file is imported from index.ts.
TaskManager.defineTask(JACKPOT_TASK, async () => {
  try {
    await checkJackpotAndNotify();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setUpJackpotAlerts(): Promise<boolean> {
  // Android 13+ only shows the permission prompt once a channel exists.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Jackpot alerts',
      importance: AndroidImportance.HIGH,
    });
  }

  const { granted } = await Notifications.requestPermissionsAsync();

  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Available &&
      !(await TaskManager.isTaskRegisteredAsync(JACKPOT_TASK))) {
    // Draws are Tue/Fri evenings; the OS treats this as a minimum, not a schedule.
    await BackgroundTask.registerTaskAsync(JACKPOT_TASK, { minimumInterval: 60 * 6 });
  }

  return granted;
}
