import { describe, expect, it } from "vitest";
import { createInitialState, DIFFICULTY_CONFIG, tickGameState } from "./pfdgame";

describe("pfd game engine", () => {
  it("keeps values bounded and score non-negative", () => {
    const config = DIFFICULTY_CONFIG.standard;
    let state = createInitialState(config);

    for (let i = 0; i < 120; i++) {
      state = tickGameState(
        state,
        {
          pitch: Math.sin(i),
          roll: Math.cos(i),
          speed: Math.sin(i * 0.5),
          ball: Math.cos(i * 0.3),
        },
        33,
        config
      );
      expect(state.targets.pitch).toBeGreaterThanOrEqual(-1);
      expect(state.targets.pitch).toBeLessThanOrEqual(1);
      expect(state.targets.roll).toBeGreaterThanOrEqual(-1);
      expect(state.targets.roll).toBeLessThanOrEqual(1);
      expect(state.score).toBeGreaterThanOrEqual(0);
    }
  });

  it("ends session when timer reaches limit", () => {
    const config = DIFFICULTY_CONFIG.easy;
    let state = createInitialState(config);

    state = tickGameState(state, { pitch: 0, roll: 0, speed: 0, ball: 0 }, config.sessionMs, config);
    expect(state.over).toBe(true);
    expect(state.elapsedMs).toBe(config.sessionMs);
  });
});
