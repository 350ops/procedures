import type { PhaseProgress } from "./quizDesign";

// Phase progress is persisted in-memory only for this session. The read/write
// contract is async so a backing store can be swapped in later (e.g. AsyncStorage).
let store: Record<string, PhaseProgress> = {};
const listeners = new Set<(s: Record<string, PhaseProgress>) => void>();

export async function readProgress(): Promise<Record<string, PhaseProgress>> {
  return { ...store };
}

export function savePhaseResult(
  phaseId: string,
  pct: number, // 0..100
): Record<string, PhaseProgress> {
  const prev = store[phaseId];
  const fraction = Math.max(0, Math.min(1, pct / 100));
  const updated: PhaseProgress = {
    best: prev ? Math.max(prev.best, fraction) : fraction,
    attempts: (prev?.attempts ?? 0) + 1,
    lastPct: Math.round(pct),
    updatedAt: Date.now(),
  };
  store = { ...store, [phaseId]: updated };

  // Update the "_streak" pseudo-entry — counts consecutive phases where
  // lastPct >= 70 chronologically.
  const streakEntries = Object.values(store)
    .filter((v, _i, _arr) => true)
    .sort((a, b) => a.updatedAt - b.updatedAt);
  let streak = 0;
  for (const entry of streakEntries.slice().reverse()) {
    if (entry.lastPct >= 70) streak++;
    else break;
  }
  store = {
    ...store,
    _streak: {
      best: streak,
      attempts: streakEntries.length,
      lastPct: streak,
      updatedAt: Date.now(),
    },
  };

  listeners.forEach((l) => l({ ...store }));
  return { ...store };
}

export function subscribeProgress(
  fn: (s: Record<string, PhaseProgress>) => void,
) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
