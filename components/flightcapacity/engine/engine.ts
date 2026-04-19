import type {
  EcamEvent,
  EcamPage,
  EngineConfig,
  EngineEvent,
  EngineState,
  Score,
  Traffic,
  VorStation,
} from "./types";
import {
  ALTITUDE_CHOICES,
  DEFAULT_CONFIG,
  RADIO_FREQ_CHOICES,
  VOR_STATIONS,
} from "./config";

const CALLSIGN_PREFIXES = ["AI", "SB", "WA", "AL", "A", "KL"];

export function emptyScore(): Score {
  return {
    tcas: { correct: 0, incorrect: 0 },
    audio: { correct: 0, incorrect: 0 },
    hyd: { correct: 0, incorrect: 0 },
    fuel: { correct: 0, incorrect: 0 },
    snapshot: { correct: 0, incorrect: 0 },
  };
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCallsign(): string {
  const prefix = pick(CALLSIGN_PREFIXES);
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

function spawnTraffic(cfg: EngineConfig): Traffic {
  const edge = cfg.radarMaxNM - 0.5;
  const angle = Math.random() * Math.PI * 2;
  const pos = { x: Math.cos(angle) * edge, y: Math.sin(angle) * edge };
  const jitter = (Math.random() - 0.5) * 3;
  const toOwn = { x: -pos.x, y: -pos.y };
  const len = Math.hypot(toOwn.x, toOwn.y) || 1;
  const dirX = toOwn.x / len;
  const dirY = toOwn.y / len;
  const perpX = -dirY;
  const perpY = dirX;
  const vx = (dirX + perpX * (jitter / 4)) * cfg.trafficSpeedNM_per_s;
  const vy = (dirY + perpY * (jitter / 4)) * cfg.trafficSpeedNM_per_s;
  const isThreat = Math.random() < 0.65;
  const window = cfg.threatAltWindowFt;
  const relAlt = isThreat
    ? Math.round(((Math.random() - 0.5) * 2 * window) / 100) * 100
    : (Math.random() < 0.5 ? -1 : 1) *
      Math.round((window + 500 + Math.random() * 2500) / 100) *
      100;
  return {
    id: `t-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    callsign: randomCallsign(),
    pos,
    vel: { x: vx, y: vy },
    relAlt,
    selected: false,
    entered10NM: false,
    everInAltWindow: false,
    trafficCalloutFired: false,
    resolved: null,
  };
}

function pickDifferent<T>(arr: readonly T[], exclude: T): T {
  for (let i = 0; i < 10; i++) {
    const v = pick(arr);
    if (v !== exclude) return v;
  }
  return arr[0];
}

export function initialState(
  cfg: EngineConfig = DEFAULT_CONFIG
): EngineState {
  const targetVor = pick(VOR_STATIONS).id;
  const targetFreq = pick(RADIO_FREQ_CHOICES);
  const targetAlt = pick(ALTITUDE_CHOICES);
  const vors: VorStation[] = VOR_STATIONS;
  return {
    elapsedSec: 0,
    running: false,
    finished: false,
    traffic: [],
    vors,
    ecam: [],
    activeEcamPage: "none",
    masterCaution: false,
    masterWarning: false,
    verify: {
      radioFreq: pickDifferent(RADIO_FREQ_CHOICES, targetFreq),
      altitude: pickDifferent(ALTITUDE_CHOICES, targetAlt),
      vorStation: null,
      radioFreqVerified: false,
      altitudeVerified: false,
    },
    target: {
      radioFreq: targetFreq,
      altitude: targetAlt,
      vorStation: targetVor,
    },
    score: emptyScore(),
  };
}

type TickResult = {
  state: EngineState;
  events: EngineEvent[];
};

export function tick(
  state: EngineState,
  dtSec: number,
  cfg: EngineConfig = DEFAULT_CONFIG
): TickResult {
  if (!state.running || state.finished) return { state, events: [] };

  const events: EngineEvent[] = [];
  const elapsedSec = state.elapsedSec + dtSec;
  const finished = elapsedSec >= cfg.durationSec;

  const traffic: Traffic[] = [];
  const score: Score = {
    tcas: { ...state.score.tcas },
    audio: { ...state.score.audio },
    hyd: { ...state.score.hyd },
    fuel: { ...state.score.fuel },
    snapshot: { ...state.score.snapshot },
  };
  let masterWarning = state.masterWarning;

  for (const t of state.traffic) {
    if (t.resolved) continue;
    const nx = t.pos.x + t.vel.x * dtSec;
    const ny = t.pos.y + t.vel.y * dtSec;
    const dist = Math.hypot(nx, ny);
    const inAltWindow = Math.abs(t.relAlt) <= cfg.threatAltWindowFt;

    let next: Traffic = {
      ...t,
      pos: { x: nx, y: ny },
      entered10NM: t.entered10NM || dist <= cfg.alertRingNM,
      everInAltWindow: t.everInAltWindow || inAltWindow,
    };

    if (
      !next.trafficCalloutFired &&
      !next.selected &&
      dist <= cfg.innerRingNM &&
      next.everInAltWindow
    ) {
      next = {
        ...next,
        trafficCalloutFired: true,
        resolved: "incorrect" as const,
      };
      score.tcas.incorrect += 1;
      score.audio.incorrect += 1;
      events.push({ type: "traffic_callout" });
      masterWarning = true;
      events.push({ type: "master_warning" });
      continue;
    }

    if (
      t.entered10NM &&
      dist > cfg.alertRingNM &&
      !next.resolved &&
      next.everInAltWindow
    ) {
      if (next.selected) {
        score.tcas.incorrect += 1;
      } else {
        score.tcas.correct += 1;
      }
      continue;
    }

    if (dist > cfg.radarMaxNM + 1) {
      continue;
    }

    traffic.push(next);
  }

  return {
    state: {
      ...state,
      elapsedSec,
      finished,
      running: state.running && !finished,
      traffic,
      masterWarning,
      score,
    },
    events,
  };
}

export function selectTraffic(
  state: EngineState,
  id: string,
  cfg: EngineConfig = DEFAULT_CONFIG
): EngineState {
  let correctDelta = 0;
  const traffic: Traffic[] = [];
  for (const t of state.traffic) {
    if (t.id !== id || t.resolved) {
      traffic.push(t);
      continue;
    }
    const dist = Math.hypot(t.pos.x, t.pos.y);
    if (!t.selected) {
      if (dist > cfg.alertRingNM) {
        traffic.push(t);
      } else {
        traffic.push({ ...t, selected: true });
      }
      continue;
    }
    const inAltWindow = Math.abs(t.relAlt) <= cfg.threatAltWindowFt;
    if (inAltWindow && dist <= cfg.alertRingNM && dist > cfg.innerRingNM) {
      correctDelta += 1;
      // drop it from the list (resolved)
      continue;
    }
    traffic.push({ ...t, selected: false });
  }
  const score = correctDelta
    ? {
        ...state.score,
        tcas: {
          ...state.score.tcas,
          correct: state.score.tcas.correct + correctDelta,
        },
      }
    : state.score;
  return { ...state, traffic, score };
}

export function maybeSpawnTraffic(
  state: EngineState,
  lastSpawnSec: number,
  cfg: EngineConfig = DEFAULT_CONFIG
): { state: EngineState; lastSpawnSec: number } {
  if (!state.running || state.finished) return { state, lastSpawnSec };
  if (state.elapsedSec - lastSpawnSec < cfg.trafficSpawnIntervalSec) {
    return { state, lastSpawnSec };
  }
  if (state.traffic.filter((t) => !t.resolved).length >= 4) {
    return { state, lastSpawnSec };
  }
  return {
    state: { ...state, traffic: [...state.traffic, spawnTraffic(cfg)] },
    lastSpawnSec: state.elapsedSec,
  };
}

export function maybeSpawnEcam(
  state: EngineState,
  lastSpawnSec: number,
  cfg: EngineConfig = DEFAULT_CONFIG
): { state: EngineState; lastSpawnSec: number; event: EngineEvent | null } {
  if (!state.running || state.finished)
    return { state, lastSpawnSec, event: null };
  const openUnacked = state.ecam.some((e) => !e.acknowledged && !e.cleared);
  if (openUnacked) return { state, lastSpawnSec, event: null };
  if (state.elapsedSec - lastSpawnSec < cfg.ecamSpawnIntervalSec) {
    return { state, lastSpawnSec, event: null };
  }
  const page: EcamPage = Math.random() < 0.5 ? "fuel" : "hyd";
  const severity: "caution" | "warning" =
    Math.random() < 0.5 ? "caution" : "warning";
  const evt: EcamEvent = {
    id: `ecam-${Date.now()}`,
    page,
    severity,
    requestsSnapshot: Math.random() < 0.5,
    appearedAt: state.elapsedSec,
    acknowledged: false,
    cleared: false,
    snapshotTaken: false,
  };
  return {
    state: {
      ...state,
      ecam: [...state.ecam, evt],
      masterCaution: severity === "caution" ? true : state.masterCaution,
      masterWarning: severity === "warning" ? true : state.masterWarning,
      activeEcamPage: page,
    },
    lastSpawnSec: state.elapsedSec,
    event: { type: "ecam_appear", page, severity },
  };
}

export function acknowledgeMaster(state: EngineState): EngineState {
  const ecam = state.ecam.map((e) =>
    !e.acknowledged && !e.cleared ? { ...e, acknowledged: true } : e
  );
  return {
    ...state,
    masterCaution: false,
    masterWarning: false,
    ecam,
  };
}

export function clearEcam(state: EngineState): {
  state: EngineState;
  scored: boolean;
  correct: boolean;
} {
  const idx = state.ecam.findIndex((e) => !e.cleared);
  if (idx < 0) return { state, scored: false, correct: false };
  const e = state.ecam[idx];
  if (!e.acknowledged) {
    // Pressing CLR without acknowledging master first counts incorrect
    const score = {
      ...state.score,
      [e.page]: {
        ...state.score[e.page],
        incorrect: state.score[e.page].incorrect + 1,
      },
    };
    const ecam = state.ecam.map((x, i) =>
      i === idx ? { ...x, cleared: true } : x
    );
    return {
      state: { ...state, ecam, score },
      scored: true,
      correct: false,
    };
  }
  const snapshotOk = !e.requestsSnapshot || e.snapshotTaken;
  const score = {
    ...state.score,
    [e.page]: {
      ...state.score[e.page],
      correct: state.score[e.page].correct + (snapshotOk ? 1 : 0),
      incorrect: state.score[e.page].incorrect + (snapshotOk ? 0 : 1),
    },
    snapshot: {
      ...state.score.snapshot,
      correct:
        state.score.snapshot.correct +
        (e.requestsSnapshot && e.snapshotTaken ? 1 : 0),
      incorrect:
        state.score.snapshot.incorrect +
        (e.requestsSnapshot && !e.snapshotTaken ? 1 : 0),
    },
  };
  const ecam = state.ecam.map((x, i) =>
    i === idx ? { ...x, cleared: true } : x
  );
  const anyOpen = ecam.some((x) => !x.cleared);
  return {
    state: {
      ...state,
      ecam,
      score,
      activeEcamPage: anyOpen ? state.activeEcamPage : "none",
    },
    scored: true,
    correct: snapshotOk,
  };
}

export function setEcamPage(state: EngineState, page: EcamPage): EngineState {
  return { ...state, activeEcamPage: page };
}

export function takeSnapshot(state: EngineState): EngineState {
  const idx = state.ecam.findIndex((e) => !e.cleared);
  if (idx < 0) return state;
  const e = state.ecam[idx];
  if (e.page !== state.activeEcamPage) return state;
  const ecam = state.ecam.map((x, i) =>
    i === idx ? { ...x, snapshotTaken: true } : x
  );
  return { ...state, ecam };
}

export function verifyRadioFreq(state: EngineState): {
  state: EngineState;
  correct: boolean;
} {
  const correct = Math.abs(state.verify.radioFreq - state.target.radioFreq) < 0.005;
  const score = {
    ...state.score,
    audio: {
      correct: state.score.audio.correct + (correct ? 1 : 0),
      incorrect: state.score.audio.incorrect + (correct ? 0 : 1),
    },
  };
  return {
    state: {
      ...state,
      verify: { ...state.verify, radioFreqVerified: correct },
      score,
    },
    correct,
  };
}

export function verifyAltitude(state: EngineState): {
  state: EngineState;
  correct: boolean;
} {
  const correct = state.verify.altitude === state.target.altitude;
  const score = {
    ...state.score,
    audio: {
      correct: state.score.audio.correct + (correct ? 1 : 0),
      incorrect: state.score.audio.incorrect + (correct ? 0 : 1),
    },
  };
  return {
    state: {
      ...state,
      verify: { ...state.verify, altitudeVerified: correct },
      score,
    },
    correct,
  };
}

export function adjustRadio(state: EngineState, delta: number): EngineState {
  return {
    ...state,
    verify: {
      ...state.verify,
      radioFreq: Math.round((state.verify.radioFreq + delta) * 100) / 100,
      radioFreqVerified: false,
    },
  };
}

export function adjustAltitude(state: EngineState, delta: number): EngineState {
  return {
    ...state,
    verify: {
      ...state.verify,
      altitude: Math.max(0, state.verify.altitude + delta),
      altitudeVerified: false,
    },
  };
}

export function setVorStation(
  state: EngineState,
  vor: string | null
): EngineState {
  return { ...state, verify: { ...state.verify, vorStation: vor } };
}

export function start(state: EngineState): EngineState {
  return { ...state, running: true };
}

export function stop(state: EngineState): EngineState {
  return { ...state, running: false };
}

export function scoreTotals(score: Score): { correct: number; incorrect: number } {
  let correct = 0;
  let incorrect = 0;
  for (const k of Object.keys(score) as (keyof Score)[]) {
    correct += score[k].correct;
    incorrect += score[k].incorrect;
  }
  return { correct, incorrect };
}
