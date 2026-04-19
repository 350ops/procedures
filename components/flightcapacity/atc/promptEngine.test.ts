import assert from "node:assert/strict";
import test from "node:test";

import { buildFlightCapacityPrompt } from "./promptEngine";
import type { FlightCapacityStateSnapshot } from "./types";

const baseSnapshot: FlightCapacityStateSnapshot = {
  altitudeFt: 18000,
  headingDeg: 90,
  vsFpm: -800,
  iasKt: 250,
  timestampMs: 123456,
};

test("builds a descent time prompt when altitude allows it", () => {
  const prompt = buildFlightCapacityPrompt(baseSnapshot, {
    preferredType: "descentTime",
    rng: () => 0,
  });

  assert.equal(prompt.type, "descentTime");
  assert.equal(prompt.expectedAnswer, 24);
  assert.match(prompt.transcriptText, /How many minutes/i);
});

test("builds a top of descent prompt using the 3:1 rule", () => {
  const prompt = buildFlightCapacityPrompt(baseSnapshot, {
    preferredType: "topOfDescent",
    rng: () => 0,
  });

  assert.equal(prompt.type, "topOfDescent");
  assert.equal(prompt.expectedAnswer, 45);
  assert.match(prompt.spokenText, /three to one rule/i);
});

test("falls back away from invalid top of descent snapshots", () => {
  const prompt = buildFlightCapacityPrompt(
    {
      ...baseSnapshot,
      altitudeFt: 4000,
    },
    {
      preferredType: "topOfDescent",
      rng: () => 0,
    },
  );

  assert.notEqual(prompt.type, "topOfDescent");
});

test("falls back away from invalid descent time snapshots", () => {
  const prompt = buildFlightCapacityPrompt(
    {
      ...baseSnapshot,
      altitudeFt: 4500,
    },
    {
      preferredType: "descentTime",
      rng: () => 0,
    },
  );

  assert.notEqual(prompt.type, "descentTime");
});

test("builds a heading prompt from live heading", () => {
  const prompt = buildFlightCapacityPrompt(baseSnapshot, {
    preferredType: "headingTurn",
    rng: () => 0.9,
  });

  assert.equal(prompt.type, "headingTurn");
  assert.equal(prompt.expectedAnswer, 130);
  assert.match(prompt.transcriptText, /Present heading 090/i);
});

test("builds a normalized frequency prompt", () => {
  const prompt = buildFlightCapacityPrompt(baseSnapshot, {
    preferredType: "frequencyReadback",
    rng: () => 0.152,
  });

  assert.equal(prompt.type, "frequencyReadback");
  assert.equal(typeof prompt.expectedAnswer, "string");
  assert.match(String(prompt.expectedAnswer), /^\d{3}\.\d{3}$/);
});
