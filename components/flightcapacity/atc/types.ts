export type FlightCapacityPromptType =
  | "descentTime"
  | "topOfDescent"
  | "headingTurn"
  | "frequencyReadback";

export type FlightCapacityStateSnapshot = {
  altitudeFt: number;
  headingDeg: number;
  vsFpm: number;
  iasKt: number;
  timestampMs: number;
};

export type FlightCapacityPrompt = {
  id: string;
  type: FlightCapacityPromptType;
  spokenText: string;
  transcriptText: string;
  expectedAnswer: number | string;
  tolerance: number | null;
  stateSnapshot: FlightCapacityStateSnapshot;
};

export type FlightCapacityFeedback = {
  normalizedAnswer: string;
  correct: boolean;
  correctAnswerText: string;
  explanation: string;
};
