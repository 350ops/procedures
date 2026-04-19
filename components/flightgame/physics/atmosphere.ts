import { C } from "./state";

export type AtmosphereSample = {
  rho: number; // kg/m³
  a: number; // speed of sound, m/s
  p: number; // Pa
  T: number; // K
};

const TROPOPAUSE_M = 11_000;
const T_TROPO = C.T0 - C.lapse * TROPOPAUSE_M;
const P_TROPO =
  C.p0 * Math.pow(T_TROPO / C.T0, C.g / (C.lapse * C.R));

export function isa(altitudeM: number): AtmosphereSample {
  const h = Math.max(0, altitudeM);
  let T: number;
  let p: number;
  if (h < TROPOPAUSE_M) {
    T = C.T0 - C.lapse * h;
    p = C.p0 * Math.pow(T / C.T0, C.g / (C.lapse * C.R));
  } else {
    T = T_TROPO;
    p = P_TROPO * Math.exp((-C.g * (h - TROPOPAUSE_M)) / (C.R * T_TROPO));
  }
  const rho = p / (C.R * T);
  const a = Math.sqrt(C.gammaAir * C.R * T);
  return { rho, a, p, T };
}

// Low-speed (incompressible) approximation. Good enough for phase 1.
export function tasToCas(vTAS: number, rho: number): number {
  return vTAS * Math.sqrt(rho / C.rho0);
}

export function casToTas(vCAS: number, rho: number): number {
  return vCAS / Math.sqrt(rho / C.rho0);
}
