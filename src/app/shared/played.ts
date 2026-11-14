// Remembers which games this browser opened today, so "played" survives a refresh
// and resets every morning (most of these games are daily puzzles).

const key = (): string => 'played:' + new Date().toISOString().slice(0, 10);

function read(): number[] {
  try {
    return JSON.parse(localStorage.getItem(key()) || '[]');
  } catch {
    return [];
  }
}

export function playedToday(): Set<number> {
  return new Set(read());
}

export function markPlayed(ids: number[]): void {
  try {
    const all = new Set([...read(), ...ids]);
    // drop older days so storage does not grow forever
    Object.keys(localStorage)
      .filter(k => k.startsWith('played:') && k !== key())
      .forEach(k => localStorage.removeItem(k));
    localStorage.setItem(key(), JSON.stringify([...all]));
  } catch {
    // storage unavailable (private mode) - played state just won't persist
  }
}
