export type AircraftState = {
  // Position (NED frame, metres). z is positive down, so altitude = -z.
  x: number;
  y: number;
  z: number;
  // Kinematics
  vTAS: number; // true airspeed, m/s
  gamma: number; // flight-path angle, rad
  psi: number; // heading, rad (0 = north, π/2 = east)
  phi: number; // bank, rad
  theta: number; // pitch, rad
  alpha: number; // angle of attack, rad
  // Mass + thrust
  mass: number; // kg
  thrustCmd: number; // 0..1, commanded
  thrustPct: number; // 0..1, actual (lagged)
};

export const C = {
  // Aero (A350-900 public-data ballparks)
  S: 443, // wing area, m²
  CLalpha: 5.5, // per rad
  CLmax: 1.4, // clean
  CD0: 0.020,
  k: 0.043, // induced drag factor, L/D_max ≈ 17
  alpha0: 0, // zero-lift AoA, rad

  // Engines (2× Trent XWB-84, SL static total)
  TmaxSL: 750_000, // N

  // Atmosphere / physics
  g: 9.80665,
  rho0: 1.225,
  p0: 101325,
  T0: 288.15,
  lapse: 0.0065, // K/m
  R: 287.05,
  gammaAir: 1.4,

  // Control law
  tauThrust: 2.0, // s, first-order thrust lag
  phiMax: (33 * Math.PI) / 180,
  thetaMax: (25 * Math.PI) / 180,
  thetaMin: (-15 * Math.PI) / 180,
  rollRateMax: (15 * Math.PI) / 180, // rad/s
  nzMin: 0.0,
  nzMax: 2.0,

  // Initial condition
  initAltFt: 5000,
  initCasKt: 250,
  initHeadingDeg: 90,
  initThrust: 0.25,
  initMass: 220_000, // kg
};

export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;
export const MS_TO_KT = 1.94384;
export const KT_TO_MS = 1 / MS_TO_KT;
export const M_TO_FT = 3.28084;
export const FT_TO_M = 1 / M_TO_FT;
export const MS_TO_FPM = 196.85;
