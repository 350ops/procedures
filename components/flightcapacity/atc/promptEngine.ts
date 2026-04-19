import type {
  FlightCapacityPrompt,
  FlightCapacityPromptType,
  FlightCapacityStateSnapshot,
} from "./types";

const PROMPT_TYPES: FlightCapacityPromptType[] = [
  "descentTime",
  "topOfDescent",
  "headingTurn",
  "frequencyReadback",
];

const DESCENT_RATES_FPM = [500, 750, 1000, 1500];
const ALTITUDE_BUCKETS_FT = [
  3000, 4000, 5000, 6000, 7000, 8000, 10000, 12000, 14000, 16000, 18000,
  20000, 22000, 24000, 26000, 28000, 30000,
];
const TURN_DELTAS = [20, 30, 40, 50, 60, 70, 80, 90, 110, 130, 150];

type PromptBuilder = (
  snapshot: FlightCapacityStateSnapshot,
  rng: () => number,
) => FlightCapacityPrompt | null;

type BuildPromptOptions = {
  preferredType?: FlightCapacityPromptType;
  rng?: () => number;
};

const roundToNearestHundred = (value: number) => Math.round(value / 100) * 100;

const normalizeHeading = (headingDeg: number) => {
  const normalized = Math.round(headingDeg) % 360;
  return normalized <= 0 ? normalized + 360 : normalized;
};

const formatAltitude = (altitudeFt: number) =>
  `${roundToNearestHundred(altitudeFt).toLocaleString("en-US")} feet`;

const formatHeading = (headingDeg: number) =>
  normalizeHeading(headingDeg).toString().padStart(3, "0");

const formatFrequency = (frequencyMhz: number) => frequencyMhz.toFixed(3);

const createPromptId = (type: FlightCapacityPromptType, timestampMs: number) =>
  `${type}-${timestampMs}-${Math.round((timestampMs % 997) + 1)}`;

const pickOne = <T>(items: T[], rng: () => number) =>
  items[Math.floor(rng() * items.length)];

const shuffled = <T>(items: T[], rng: () => number) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildDescentTimePrompt: PromptBuilder = (snapshot, rng) => {
  const currentAltitudeFt = roundToNearestHundred(snapshot.altitudeFt);
  if (currentAltitudeFt < 5500) {
    return null;
  }

  const targetOptions = ALTITUDE_BUCKETS_FT.filter((targetFt) => {
    const delta = currentAltitudeFt - targetFt;
    return targetFt >= 3000 && delta >= 2000 && delta <= 12000;
  });

  if (targetOptions.length === 0) {
    return null;
  }

  const targetAltitudeFt = pickOne(targetOptions, rng);
  const rateFpm = pickOne(DESCENT_RATES_FPM, rng);
  const minutes = (currentAltitudeFt - targetAltitudeFt) / rateFpm;

  return {
    id: createPromptId("descentTime", snapshot.timestampMs),
    type: "descentTime",
    spokenText: `Speedbird 512, descend and maintain ${targetAltitudeFt} feet with a rate of ${rateFpm} feet per minute. How many minutes between the two levels will pass?`,
    transcriptText: `Descend ${formatAltitude(currentAltitudeFt)} to ${formatAltitude(targetAltitudeFt)} at ${rateFpm.toLocaleString("en-US")} fpm. How many minutes?`,
    expectedAnswer: Number(minutes.toFixed(2)),
    tolerance: 0.5,
    stateSnapshot: snapshot,
  };
};

const buildTopOfDescentPrompt: PromptBuilder = (snapshot, rng) => {
  const currentAltitudeFt = roundToNearestHundred(snapshot.altitudeFt);
  if (currentAltitudeFt < 9000) {
    return null;
  }

  const targetOptions = ALTITUDE_BUCKETS_FT.filter((targetFt) => {
    const delta = currentAltitudeFt - targetFt;
    return targetFt >= 3000 && delta >= 3000 && delta <= 18000;
  });

  if (targetOptions.length === 0) {
    return null;
  }

  const targetAltitudeFt = pickOne(targetOptions, rng);
  const altitudeToLoseFt = currentAltitudeFt - targetAltitudeFt;
  const distanceNm = (altitudeToLoseFt / 1000) * 3;

  return {
    id: createPromptId("topOfDescent", snapshot.timestampMs),
    type: "topOfDescent",
    spokenText: `Speedbird 512, calculate top of descent from ${currentAltitudeFt} feet down to ${targetAltitudeFt} feet using the three to one rule. How many nautical miles before level-off should descent begin?`,
    transcriptText: `Three-to-one TOD: ${formatAltitude(currentAltitudeFt)} to ${formatAltitude(targetAltitudeFt)}. How many NM before level-off?`,
    expectedAnswer: Number(distanceNm.toFixed(2)),
    tolerance: 3,
    stateSnapshot: snapshot,
  };
};

const buildHeadingTurnPrompt: PromptBuilder = (snapshot, rng) => {
  const currentHeading = normalizeHeading(snapshot.headingDeg);
  const direction = rng() >= 0.5 ? "right" : "left";
  const delta = pickOne(TURN_DELTAS, rng);
  const assignedHeading =
    direction === "right"
      ? normalizeHeading(currentHeading + delta)
      : normalizeHeading(currentHeading - delta);

  return {
    id: createPromptId("headingTurn", snapshot.timestampMs),
    type: "headingTurn",
    spokenText: `Speedbird 512, present heading ${formatHeading(currentHeading)}. Turn ${direction} heading ${formatHeading(assignedHeading)}. How many degrees of turn will that be?`,
    transcriptText: `Present heading ${formatHeading(currentHeading)}. Turn ${direction} heading ${formatHeading(assignedHeading)}. Degrees of turn?`,
    expectedAnswer: delta,
    tolerance: 0,
    stateSnapshot: snapshot,
  };
};

const buildFrequencyReadbackPrompt: PromptBuilder = (snapshot, rng) => {
  const channelSteps = Math.floor(760 * rng());
  const frequency = 118 + channelSteps * 0.025;
  const normalized = formatFrequency(frequency);

  return {
    id: createPromptId("frequencyReadback", snapshot.timestampMs),
    type: "frequencyReadback",
    spokenText: `Speedbird 512, contact approach on ${normalized.replace(".", " decimal ")}. Type the new frequency.`,
    transcriptText: `Contact approach on ${normalized}.`,
    expectedAnswer: normalized,
    tolerance: null,
    stateSnapshot: snapshot,
  };
};

const BUILDERS: Record<FlightCapacityPromptType, PromptBuilder> = {
  descentTime: buildDescentTimePrompt,
  topOfDescent: buildTopOfDescentPrompt,
  headingTurn: buildHeadingTurnPrompt,
  frequencyReadback: buildFrequencyReadbackPrompt,
};

export function captureFlightCapacitySnapshot(args: {
  altitudeFt: number;
  headingDeg: number;
  vsFpm: number;
  iasKt: number;
}): FlightCapacityStateSnapshot {
  return {
    altitudeFt: roundToNearestHundred(args.altitudeFt),
    headingDeg: normalizeHeading(args.headingDeg),
    vsFpm: Math.round(args.vsFpm),
    iasKt: Math.round(args.iasKt),
    timestampMs: Date.now(),
  };
}

export function buildFlightCapacityPrompt(
  snapshot: FlightCapacityStateSnapshot,
  options: BuildPromptOptions = {},
): FlightCapacityPrompt {
  const rng = options.rng ?? Math.random;
  const orderedTypes = options.preferredType
    ? [options.preferredType]
    : shuffled(PROMPT_TYPES, rng);

  for (const type of orderedTypes) {
    const prompt = BUILDERS[type](snapshot, rng);
    if (prompt) {
      return prompt;
    }
  }

  return buildHeadingTurnPrompt(snapshot, rng)!;
}
