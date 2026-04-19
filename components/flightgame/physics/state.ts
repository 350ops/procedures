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

  // Control law (A350 Normal Law, FCOM-derived)
  tauThrust: 2.0, // s, first-order thrust lag

  // Lateral law
  phiHold: (33 * Math.PI) / 180, // knee for spiral stability + turn comp
  phiMaxClean: (67 * Math.PI) / 180, // bank limit, clean
  phiMaxProt: (45 * Math.PI) / 180, // bank limit when a protection is active
  rollRateMax: (15 * Math.PI) / 180, // rad/s, full sidestick
  rollRateProt: (7.5 * Math.PI) / 180, // rad/s, under α-prot
  rollBackTau: 4, // s, time const to roll back toward 33° beyond knee

  // Pitch / load-factor law
  thetaMax: (30 * Math.PI) / 180, // FCOM: +30° pitch attitude limit
  thetaMin: (-15 * Math.PI) / 180, // FCOM: -15° pitch attitude limit
  nzMin: -1.0, // clean FBW
  nzMax: 2.5, // clean 
  overspeedMinNz: 0.65, // keep some descent authority under high-speed protection

  // α-protection
  alphaProtFrac: 0.9, // α_prot ≈ 0.9·α_max
  // High-speed protection
  vmoKt: 340, // CAS, m/s converted at use site
  vmoBiasRangeKt: 20, // CAS overshoot to ramp full nose-up bias

  // Initial condition
  initAltFt: 3500, // below the glidepath at 15 NM so GS comes alive later
  initCasKt: 210,
  initHeadingDeg: 60, // 30° intercept to the 090 localizer
  initDistanceNm: 15,
  initCrossTrackNm: -3.5, // south of the localizer
  initGammaDeg: 0,
  initThrust: 0.18,
  initMass: 220_000, // kg
};

export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;
export const MS_TO_KT = 1.94384;
export const KT_TO_MS = 1 / MS_TO_KT;
export const M_TO_FT = 3.28084;
export const FT_TO_M = 1 / M_TO_FT;
export const MS_TO_FPM = 196.85;
