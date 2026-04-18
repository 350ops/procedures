export type Difficulty = "easy" | "standard" | "hard";

export interface DriftTargets {
  pitch: number;
  roll: number;
  speed: number;
  ball: number;
}

export interface PlayerInputState {
  pitch: number;
  roll: number;
  speed: number;
  ball: number;
}

export interface GameState {
  elapsedMs: number;
  sessionMs: number;
  score: number;
  bestComboMs: number;
  comboMs: number;
  over: boolean;
  targets: DriftTargets;
  player: PlayerInputState;
}

export interface EngineConfig {
  sessionMs: number;
  driftSpeed: number;
  noise: number;
  scorePerSecond: number;
  comboThreshold: number;
  comboBonus: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, EngineConfig> = {
  easy: {
    sessionMs: 90_000,
    driftSpeed: 0.22,
    noise: 0.15,
    scorePerSecond: 60,
    comboThreshold: 0.18,
    comboBonus: 0.15,
  },
  standard: {
    sessionMs: 180_000,
    driftSpeed: 0.35,
    noise: 0.22,
    scorePerSecond: 85,
    comboThreshold: 0.14,
    comboBonus: 0.25,
  },
  hard: {
    sessionMs: 240_000,
    driftSpeed: 0.5,
    noise: 0.3,
    scorePerSecond: 120,
    comboThreshold: 0.11,
    comboBonus: 0.4,
  },
};

function clamp(value: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function nextDrift(current: number, t: number, speed: number, noise: number): number {
  const wave = Math.sin(t * speed) * 0.6 + Math.sin(t * (speed * 0.4 + 0.07)) * 0.4;
  const target = wave * 0.7;
  const jitter = (Math.sin(t * 0.97) + Math.cos(t * 1.63)) * noise * 0.2;
  return clamp(current * 0.93 + target * 0.07 + jitter);
}

export function createInitialState(config: EngineConfig): GameState {
  return {
    elapsedMs: 0,
    sessionMs: config.sessionMs,
    score: 0,
    bestComboMs: 0,
    comboMs: 0,
    over: false,
    targets: { pitch: 0, roll: 0, speed: 0, ball: 0 },
    player: { pitch: 0, roll: 0, speed: 0, ball: 0 },
  };
}

export function computeQuality(state: GameState): number {
  const pitchErr = Math.abs(state.player.pitch - state.targets.pitch);
  const rollErr = Math.abs(state.player.roll - state.targets.roll);
  const speedErr = Math.abs(state.player.speed - state.targets.speed);
  const ballErr = Math.abs(state.player.ball - state.targets.ball);
  const weightedError = pitchErr * 0.3 + rollErr * 0.25 + speedErr * 0.25 + ballErr * 0.2;
  return clamp(1 - weightedError, 0, 1);
}

export function tickGameState(
  prev: GameState,
  input: PlayerInputState,
  deltaMs: number,
  config: EngineConfig
): GameState {
  if (prev.over) return prev;

  const elapsedMs = Math.min(prev.elapsedMs + deltaMs, config.sessionMs);
  const t = elapsedMs / 1000;
  const targets: DriftTargets = {
    pitch: nextDrift(prev.targets.pitch, t + 0.1, config.driftSpeed, config.noise),
    roll: nextDrift(prev.targets.roll, t + 1.3, config.driftSpeed * 1.2, config.noise),
    speed: nextDrift(prev.targets.speed, t + 2.1, config.driftSpeed * 0.8, config.noise),
    ball: nextDrift(prev.targets.ball, t + 0.6, config.driftSpeed * 1.6, config.noise * 0.8),
  };

  const state = {
    ...prev,
    elapsedMs,
    targets,
    player: {
      pitch: clamp(input.pitch),
      roll: clamp(input.roll),
      speed: clamp(input.speed),
      ball: clamp(input.ball),
    },
  };

  const quality = computeQuality(state);
  const comboMs = quality >= 1 - config.comboThreshold ? prev.comboMs + deltaMs : 0;
  const comboMultiplier = 1 + (comboMs / 1000) * config.comboBonus;
  const scoreGain = (deltaMs / 1000) * config.scorePerSecond * quality * comboMultiplier;
  const over = elapsedMs >= config.sessionMs;

  return {
    ...state,
    comboMs,
    bestComboMs: Math.max(prev.bestComboMs, comboMs),
    score: prev.score + scoreGain,
    over,
  };
}
