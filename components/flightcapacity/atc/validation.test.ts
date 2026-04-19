import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeFrequencyAnswer,
  validateFlightCapacityAnswer,
} from "./validation";
import type { FlightCapacityPrompt, FlightCapacityStateSnapshot } from "./types";

const snapshot: FlightCapacityStateSnapshot = {
  altitudeFt: 18000,
  headingDeg: 90,
  vsFpm: -600,
  iasKt: 250,
  timestampMs: 1,
};

function prompt(overrides: Partial<FlightCapacityPrompt>): FlightCapacityPrompt {
  return {
    id: "p-1",
    type: "descentTime",
    spokenText: "",
    transcriptText: "",
    expectedAnswer: 8,
    tolerance: 0.5,
    stateSnapshot: snapshot,
    ...overrides,
  };
}

test("normalizes frequency inputs to three decimals", () => {
  assert.equal(normalizeFrequencyAnswer("121.8"), "121.800");
  assert.equal(normalizeFrequencyAnswer("121,80"), "121.800");
  assert.equal(normalizeFrequencyAnswer(" 121.800 "), "121.800");
});

test("validates numeric answers within tolerance", () => {
  const feedback = validateFlightCapacityAnswer(
    prompt({ type: "descentTime" }),
    "8.4",
  );
  assert.equal(feedback.correct, true);
  assert.equal(feedback.correctAnswerText, "8 min");
});

test("rejects heading answers that do not match exactly", () => {
  const feedback = validateFlightCapacityAnswer(
    prompt({
      type: "headingTurn",
      expectedAnswer: 40,
      tolerance: 0,
    }),
    "39",
  );

  assert.equal(feedback.correct, false);
  assert.equal(feedback.correctAnswerText, "40 deg");
});

test("accepts normalized frequency matches", () => {
  const feedback = validateFlightCapacityAnswer(
    prompt({
      type: "frequencyReadback",
      expectedAnswer: "121.800",
      tolerance: null,
    }),
    "121.8",
  );

  assert.equal(feedback.correct, true);
  assert.equal(feedback.normalizedAnswer, "121.800");
});
