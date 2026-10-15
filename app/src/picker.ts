export type Pick = {
  main: number[];
  euro: number[];
};

// Draws `count` distinct numbers from 1..max, sorted ascending.
function sample(max: number, count: number): number[] {
  const pool = Array.from({ length: max }, (_, i) => i + 1);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (max - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

// Eurojackpot: 5 of 50 main numbers + 2 of 12 euro numbers.
export function pickNumbers(): Pick {
  return { main: sample(50, 5), euro: sample(12, 2) };
}

export function formatPick({ main, euro }: Pick): string {
  return `${main.join(', ')} + ${euro.join(', ')}`;
}
