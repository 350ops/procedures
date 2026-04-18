import { casToTas, isa } from "./atmosphere";
import { AircraftState, C, D2R, FT_TO_M } from "./state";

export type Inputs = {
  stickX: number; // -1..1, right = +roll
  stickY: number; // -1..1, pull-back (+) = nose up
  thrust: number; // 0..1
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const TWO_PI = Math.PI * 2;
const wrap2pi = (x: number) => ((x % TWO_PI) + TWO_PI) % TWO_PI;

const GAMMA_LIMIT = 60 * D2R;

export function step(
  s: AircraftState,
  i: Inputs,
  dt: number
): AircraftState {
  const altitude = -s.z;
  const { rho } = isa(altitude);

  // Thrust: first-order lag toward command, lapse linear with density.
  const thrustCmd = clamp(i.thrust, 0, 1);
  const lagAlpha = 1 - Math.exp(-dt / C.tauThrust);
  const thrustPct = s.thrustPct + (thrustCmd - s.thrustPct) * lagAlpha;
  const T = thrustPct * C.TmaxSL * (rho / C.rho0);

  // Roll: stick-x → roll-rate demand, integrate phi, clamp.
  const rollRateCmd = clamp(i.stickX, -1, 1) * C.rollRateMax;
  let phi = s.phi + rollRateCmd * dt;
  phi = clamp(phi, -C.phiMax, C.phiMax);

  // Heading via coordinated turn.
  const v = Math.max(s.vTAS, 1);
  const psiDot = (C.g * Math.tan(phi)) / v;
  const psi = wrap2pi(s.psi + psiDot * dt);

  // Pitch demand: nz from stick-y (pull back = +stickY → nz > 1).
  const nzCmd = 1 + clamp(i.stickY, -1, 1);
  const nz = clamp(nzCmd, C.nzMin, C.nzMax);

  // Required lift coefficient at current q, with stall clamp.
  const qS = 0.5 * rho * v * v * C.S;
  const liftNeeded = nz * s.mass * C.g;
  let CL = liftNeeded / Math.max(qS, 1);
  const stalled = CL > C.CLmax;
  if (stalled) CL = C.CLmax;
  const L = CL * qS;
  const alpha = C.alpha0 + CL / C.CLalpha;

  // Drag polar.
  const CD = C.CD0 + C.k * CL * CL;
  const D = CD * qS;

  // Longitudinal flight-path dynamics.
  const vDot =
    (T * Math.cos(alpha) - D - s.mass * C.g * Math.sin(s.gamma)) / s.mass;
  const gammaDot =
    (L * Math.cos(phi) - s.mass * C.g * Math.cos(s.gamma)) / (s.mass * v);

  const vTAS = Math.max(0, s.vTAS + vDot * dt);
  let gamma = s.gamma + gammaDot * dt;
  gamma = clamp(gamma, -GAMMA_LIMIT, GAMMA_LIMIT);

  // Attitude.
  let theta = gamma + alpha;
  theta = clamp(theta, C.thetaMin, C.thetaMax);

  // NED position integration.
  const vN = vTAS * Math.cos(gamma) * Math.cos(psi);
  const vE = vTAS * Math.cos(gamma) * Math.sin(psi);
  const vD = -vTAS * Math.sin(gamma);
  const x = s.x + vN * dt;
  const y = s.y + vE * dt;
  let z = s.z + vD * dt;
  // Hard floor at ground level (no terrain yet).
  if (z > 0) z = 0;

  return {
    x,
    y,
    z,
    vTAS,
    gamma,
    psi,
    phi,
    theta,
    alpha,
    mass: s.mass,
    thrustCmd,
    thrustPct,
  };
}

export function initialState(): AircraftState {
  const altM = C.initAltFt * FT_TO_M;
  const { rho } = isa(altM);
  const vTAS = casToTas(C.initCasKt / 1.94384, rho);
  return {
    x: 0,
    y: 0,
    z: -altM,
    vTAS,
    gamma: 0,
    psi: C.initHeadingDeg * D2R,
    phi: 0,
    theta: 0,
    alpha: 0,
    mass: C.initMass,
    thrustCmd: C.initThrust,
    thrustPct: C.initThrust,
  };
}

export function isStalled(s: AircraftState): boolean {
  const { rho } = isa(-s.z);
  const v = Math.max(s.vTAS, 1);
  const qS = 0.5 * rho * v * v * C.S;
  const CL = (s.mass * C.g) / Math.max(qS, 1);
  return CL > C.CLmax;
}
