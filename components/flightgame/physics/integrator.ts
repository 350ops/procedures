import { casToTas, isa, tasToCas } from "./atmosphere";
import { AircraftState, C, D2R, FT_TO_M, MS_TO_KT } from "./state";

export type Inputs = {
  stickX: number; // -1..1, right = +roll
  stickY: number; // -1..1, pull-back (+) = nose up (more nz)
  thrust: number; // 0..1
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const TWO_PI = Math.PI * 2;
const wrap2pi = (x: number) => ((x % TWO_PI) + TWO_PI) % TWO_PI;

const GAMMA_LIMIT = 60 * D2R;
const STICK_DEADBAND = 0.05;

export function step(
  s: AircraftState,
  i: Inputs,
  dt: number
): AircraftState {
  const altitude = -s.z;
  const { rho } = isa(altitude);
  const v = Math.max(s.vTAS, 1);
  const vCASKt = tasToCas(s.vTAS, rho) * MS_TO_KT;

  // Thrust: first-order lag, density lapse.
  const thrustCmd = clamp(i.thrust, 0, 1);
  const lagAlpha = 1 - Math.exp(-dt / C.tauThrust);
  const thrustPct = s.thrustPct + (thrustCmd - s.thrustPct) * lagAlpha;
  const T = thrustPct * C.TmaxSL * (rho / C.rho0);

  // --- Protection flags (use prior-step α / current vCAS) ---
  const alphaMax = C.CLmax / C.CLalpha + C.alpha0;
  const alphaProt = C.alphaProtFrac * alphaMax;
  const alphaProtActive = s.alpha > alphaProt;
  const overspeed = vCASKt > C.vmoKt;
  const phiLimit =
    alphaProtActive || overspeed ? C.phiMaxProt : C.phiMaxClean;
  const rollRateMax = alphaProtActive ? C.rollRateProt : C.rollRateMax;

  // --- Lateral law: roll-rate demand + neutral-stick spiral logic ---
  const stickX = clamp(i.stickX, -1, 1);
  let rollRateCmd: number;
  if (Math.abs(stickX) < STICK_DEADBAND) {
    if (Math.abs(s.phi) <= C.phiHold) {
      // Neutral spiral stability: hold current bank.
      rollRateCmd = 0;
    } else {
      // Positive spiral stability: roll back toward ±33°.
      const target = Math.sign(s.phi) * C.phiHold;
      rollRateCmd = clamp(
        (target - s.phi) / C.rollBackTau,
        -rollRateMax,
        rollRateMax
      );
    }
  } else {
    rollRateCmd = stickX * rollRateMax;
  }
  let phi = s.phi + rollRateCmd * dt;
  phi = clamp(phi, -phiLimit, phiLimit);

  // Heading via coordinated turn.
  const psiDot = (C.g * Math.tan(phi)) / v;
  const psi = wrap2pi(s.psi + psiDot * dt);

  // --- Longitudinal law: load-factor demand with turn compensation ---
  const stickY = clamp(i.stickY, -1, 1);
  // Turn compensation only inside the 33° envelope (FCOM Normal Law).
  const turnComp =
    Math.abs(phi) <= C.phiHold ? 1 / Math.cos(phi) : 1;
  // Pulling back adds g above turnComp; pushing forward subtracts toward 0 g.
  const nzSpan =
    stickY >= 0 ? C.nzMax - turnComp : turnComp - C.nzMin;
  let nzCmd = turnComp + stickY * nzSpan;

  // High-speed protection: bias nose-up if overspeed.
  if (overspeed) {
    const ramp = clamp(
      (vCASKt - C.vmoKt) / C.vmoBiasRangeKt,
      0,
      1
    );
    nzCmd = Math.max(nzCmd, turnComp + 0.3 * ramp);
  }
  const nz = clamp(nzCmd, C.nzMin, C.nzMax);

  // Required CL at current q, with α-max clamp (= stall protection).
  const qS = 0.5 * rho * v * v * C.S;
  const liftNeeded = nz * s.mass * C.g;
  let targetCL = liftNeeded / Math.max(qS, 1);
  if (targetCL > C.CLmax) targetCL = C.CLmax;
  
  const targetAlpha = C.alpha0 + targetCL / C.CLalpha;

  // Airbus FBW / pitch inertia simulation: smooth alpha transitions so attitude doesn't snap abruptly
  const tauPitch = 0.5;
  const alphaLagAlpha = 1 - Math.exp(-dt / tauPitch);
  const alpha = s.alpha + (targetAlpha - s.alpha) * alphaLagAlpha;

  // Re-derive CL from the smoothed alpha for exact lift calculation
  const CL = (alpha - C.alpha0) * C.CLalpha;
  const L = CL * qS;

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

  // Ground reaction logic
  let z = s.z - vTAS * Math.sin(gamma) * dt;
  if (z >= 0) {
    z = 0;
    if (gamma < 0) gamma = 0;
  }

  // Attitude.
  let theta = gamma + alpha;
  theta = clamp(theta, C.thetaMin, C.thetaMax);

  // NED position integration.
  const vN = vTAS * Math.cos(gamma) * Math.cos(psi);
  const vE = vTAS * Math.cos(gamma) * Math.sin(psi);
  const x = s.x + vN * dt;
  const y = s.y + vE * dt;

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
  // Start the aircraft positioned to smoothly fly the defaultILS (aligned at y=0, starting around x=0, heading 90 degrees)
  return {
    x: 0,
    y: 0,
    z: -altM,
    vTAS,
    gamma: -3 * D2R,
    psi: C.initHeadingDeg * D2R,
    phi: 0,
    theta: 1 * D2R,
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
