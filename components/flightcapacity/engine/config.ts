import type { EngineConfig, VorStation } from "./types";

export const DEFAULT_CONFIG: EngineConfig = {
  durationSec: 180,
  trafficSpawnIntervalSec: 12,
  trafficSpeedNM_per_s: 0.18,
  threatAltWindowFt: 1000,
  radarMaxNM: 12,
  innerRingNM: 2.5,
  outerRingNM: 5,
  alertRingNM: 10,
  ecamSpawnIntervalSec: 35,
  tickRateHz: 20,
};

export const VOR_STATIONS: VorStation[] = [
  { id: "VPM", pos: { x: -0.3, y: -4.2 } },
  { id: "ZCV", pos: { x: 2.2, y: -3.0 } },
  { id: "TBJ", pos: { x: -3.8, y: 2.5 } },
  { id: "DOK", pos: { x: 3.6, y: -4.5 } },
  { id: "WQR", pos: { x: 4.1, y: 1.2 } },
];

export const RADIO_FREQ_CHOICES = [118.35, 121.5, 124.1, 126.75, 132.2];
export const ALTITUDE_CHOICES = [18000, 20000, 21000, 22500, 24000];
