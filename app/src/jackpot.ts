import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Unofficial JSON endpoint behind lotto.de. `jackpotNew` is the next draw's
// jackpot in millions of euros (matches the amount shown on eurojackpot.de).
const LAST_DRAW_URL = 'https://www.lotto.de/api/stats/entities.eurojackpot/last';

// 120M is the Eurojackpot cap.
export const ALERT_THRESHOLD_MILLIONS = 120;

const ALERTED_KEY = 'jackpotAlerted';

export async function fetchJackpotMillions(): Promise<number> {
  const res = await fetch(LAST_DRAW_URL);
  if (!res.ok) throw new Error(`Jackpot request failed: ${res.status}`);
  const data = await res.json();
  if (typeof data.jackpotNew !== 'number') throw new Error('Unexpected jackpot response');
  return data.jackpotNew;
}

// Notifies once each time the jackpot reaches the threshold; re-arms after it drops back below.
export async function checkJackpotAndNotify(): Promise<number> {
  const millions = await fetchJackpotMillions();
  const alerted = (await AsyncStorage.getItem(ALERTED_KEY)) === 'true';

  if (millions >= ALERT_THRESHOLD_MILLIONS && !alerted) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Eurojackpot is at €${millions}M!`,
        body: 'The jackpot hit the cap. Time to pick your numbers.',
      },
      trigger: null,
    });
    await AsyncStorage.setItem(ALERTED_KEY, 'true');
  } else if (millions < ALERT_THRESHOLD_MILLIONS && alerted) {
    await AsyncStorage.removeItem(ALERTED_KEY);
  }

  return millions;
}
