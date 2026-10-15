import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { setUpJackpotAlerts } from './src/backgroundTask';
import { ALERT_THRESHOLD_MILLIONS, checkJackpotAndNotify } from './src/jackpot';
import { formatPick, Pick, pickNumbers } from './src/picker';

const light = { bg: '#F7F5F0', text: '#1A1918', sub: '#6B6A65', ball: '#FFFFFF', border: '#DDD9CF', accent: '#E0A100', primary: '#1F3A8A', onPrimary: '#FFFFFF' };
const dark = { bg: '#121212', text: '#F2F0EA', sub: '#A3A19A', ball: '#1E1E1E', border: '#3A3833', accent: '#F2B705', primary: '#4F6FD8', onPrimary: '#FFFFFF' };

export default function App() {
  const c = useColorScheme() === 'dark' ? dark : light;
  const [pick, setPick] = useState<Pick | null>(null);
  const [copied, setCopied] = useState(false);
  const [jackpot, setJackpot] = useState<number | null>(null);
  const [alertsOn, setAlertsOn] = useState(true);

  useEffect(() => {
    setUpJackpotAlerts().then(setAlertsOn).catch(() => setAlertsOn(false));
    checkJackpotAndNotify().then(setJackpot).catch(() => {});
  }, []);

  const generate = () => {
    setPick(pickNumbers());
    setCopied(false);
  };

  const copy = async () => {
    if (!pick) return;
    await Clipboard.setStringAsync(formatPick(pick));
    setCopied(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <Text style={[styles.title, { color: c.text }]}>Eurojackpot</Text>

      <View style={styles.numbers}>
        {pick ? (
          <>
            <View style={styles.row}>
              {pick.main.map((n) => (
                <View key={n} style={[styles.ball, { backgroundColor: c.ball, borderColor: c.border }]}>
                  <Text style={[styles.ballText, { color: c.text }]}>{n}</Text>
                </View>
              ))}
            </View>
            <View style={styles.row}>
              {pick.euro.map((n) => (
                <View key={n} style={[styles.ball, { backgroundColor: c.accent, borderColor: c.accent }]}>
                  <Text style={[styles.ballText, { color: '#1A1918' }]}>{n}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={{ color: c.sub }}>Tap the button for your numbers</Text>
        )}
      </View>

      <Pressable
        onPress={generate}
        style={({ pressed }) => [styles.button, { backgroundColor: c.primary, opacity: pressed ? 0.85 : 1 }]}
      >
        <Text style={[styles.buttonText, { color: c.onPrimary }]}>Give me numbers</Text>
      </Pressable>

      <Pressable
        onPress={copy}
        disabled={!pick}
        style={({ pressed }) => [styles.secondary, { borderColor: c.border, opacity: !pick ? 0.4 : pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.secondaryText, { color: c.text }]}>{copied ? 'Copied ✓' : 'Copy'}</Text>
      </Pressable>

      <Text style={[styles.footer, { color: c.sub }]}>
        {jackpot !== null ? `Next jackpot: €${jackpot}M` : 'Next jackpot: –'}
        {'\n'}
        {alertsOn
          ? `You'll get a notification at €${ALERT_THRESHOLD_MILLIONS}M`
          : 'Notifications are off. Enable them in Settings for jackpot alerts'}
      </Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 32 },
  numbers: { minHeight: 140, justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 32 },
  row: { flexDirection: 'row', gap: 10 },
  ball: { width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  ballText: { fontSize: 20, fontWeight: '600', fontVariant: ['tabular-nums'] },
  button: { alignSelf: 'stretch', paddingVertical: 18, borderRadius: 14, alignItems: 'center' },
  buttonText: { fontSize: 18, fontWeight: '600' },
  secondary: { alignSelf: 'stretch', marginTop: 12, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  secondaryText: { fontSize: 16, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 48, textAlign: 'center', fontSize: 13, lineHeight: 20 },
});
