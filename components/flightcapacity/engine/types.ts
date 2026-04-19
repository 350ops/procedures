export type Vec = { x: number; y: number };

export type ScoreCategory =
  | "tcas"
  | "audio"
  | "hyd"
  | "fuel"
  | "snapshot";

export type Score = Record<ScoreCategory, { correct: number; incorrect: number }>;

export type Traffic = {
  id: string;
  callsign: string;
  pos: Vec;
  vel: Vec;
  relAlt: number;
  selected: boolean;
  entered10NM: boolean;
  everInAltWindow: boolean;
  trafficCalloutFired: boolean;
  resolved: "correct" | "incorrect" | null;
};

export type VorStation = {
  id: string;
  pos: Vec;
};

export type EcamPage = "none" | "fuel" | "hyd";

export type EcamEvent = {
  id: string;
  page: EcamPage;
  severity: "caution" | "warning";
  requestsSnapshot: boolean;
  appearedAt: number;
  acknowledged: boolean;
  cleared: boolean;
  snapshotTaken: boolean;
};

export type VerifyTarget = {
  radioFreq: number;
  altitude: number;
  vorStation: string;
};

export type VerifyState = {
  radioFreq: number;
  altitude: number;
  vorStation: string | null;
  radioFreqVerified: boolean;
  altitudeVerified: boolean;
};

export type EngineState = {
  elapsedSec: number;
  running: boolean;
  finished: boolean;
  traffic: Traffic[];
  vors: VorStation[];
  ecam: EcamEvent[];
  activeEcamPage: EcamPage;
  masterCaution: boolean;
  masterWarning: boolean;
  verify: VerifyState;
  target: VerifyTarget;
  score: Score;
};

export type EngineEvent =
  | { type: "traffic_callout" }
  | { type: "master_caution" }
  | { type: "master_warning" }
  | { type: "ecam_appear"; page: EcamPage; severity: "caution" | "warning" };

export type EngineConfig = {
  durationSec: number;
  trafficSpawnIntervalSec: number;
  trafficSpeedNM_per_s: number;
  threatAltWindowFt: number;
  radarMaxNM: number;
  innerRingNM: number;
  outerRingNM: number;
  alertRingNM: number;
  ecamSpawnIntervalSec: number;
  tickRateHz: number;
};
