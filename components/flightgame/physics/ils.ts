import type { AircraftState } from "./state";

export type RunwayILS = {
  thresholdX_m: number;
  thresholdY_m: number;
  runwayCourseRad: number; // inbound final approach course
  thresholdElevation_m: number;
  glidePathDeg: number; // usually 3.0
  tch_m: number; // threshold crossing height
};

export const defaultILS: RunwayILS = {
  thresholdX_m: 18520, // Exactly 10 NM
  thresholdY_m: 0,
  runwayCourseRad: Math.PI / 2, // 90°
  thresholdElevation_m: 0,
  glidePathDeg: 3.0,
  tch_m: 15,
};

export function runwayFrame(ac: AircraftState, ils: RunwayILS) {
  const dx = ils.thresholdX_m - ac.x;
  const dy = ils.thresholdY_m - ac.y;

  const dirX = Math.sin(ils.runwayCourseRad);
  const dirY = Math.cos(ils.runwayCourseRad);

  const rightX = Math.cos(ils.runwayCourseRad);
  const rightY = -Math.sin(ils.runwayCourseRad);

  const along_m = dx * dirX + dy * dirY;
  const cross_m = dx * rightX + dy * rightY; // Positive = runway is to the right

  return { along_m, cross_m };
}

export function locErrorDeg(along_m: number, cross_m: number): number {
  const safeAlong = Math.max(along_m, 1);
  return (Math.atan2(cross_m, safeAlong) * 180) / Math.PI;
}

export function normLoc(locDeg: number): number {
  return Math.max(-1.1, Math.min(1.1, locDeg / 2.5));
}

export function gsErrorDeg(
  ac: AircraftState,
  ils: RunwayILS,
  along_m: number
): number {
  const acAltAgl_m = -ac.z - ils.thresholdElevation_m;
  const gpRad = (ils.glidePathDeg * Math.PI) / 180;
  const desiredAlt_m = Math.tan(gpRad) * Math.max(along_m, 0) + ils.tch_m;
  const error_m = desiredAlt_m - acAltAgl_m; // Positive if desired > current (ie glideslope is above us, fly up -> positive error -> gsNorm > 0)
  const safeAlong = Math.max(along_m, 1);
  return (Math.atan2(error_m, safeAlong) * 180) / Math.PI;
}

export function normGs(gsDeg: number): number {
  return Math.max(-1.1, Math.min(1.1, gsDeg / 0.7));
}

export function flightPathAngleDeg(ac: AircraftState): number {
  // Ground speed is roughly identical to TAS v for a windless basic game
  // vertical speed is strictly vTAS * sin(gamma)... Wait, we can just use gamma!
  // v * cos(gamma) is horizontal ground speed.
  const gs = Math.max(ac.vTAS * Math.cos(ac.gamma), 0.1);
  const vs = ac.vTAS * Math.sin(ac.gamma);
  return (Math.atan2(vs, gs) * 180) / Math.PI;
}

export function normalize180(deg: number): number {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

export function computeILSAndBird(
  ac: AircraftState,
  ils: RunwayILS,
  selectedTrackDeg: number
) {
  const { along_m, cross_m } = runwayFrame(ac, ils);
  const locDeg = locErrorDeg(along_m, cross_m);
  const gsDeg = gsErrorDeg(ac, ils, along_m);
  const locNorm = normLoc(locDeg);
  const gsNorm = normGs(gsDeg);
  const fpaDeg = flightPathAngleDeg(ac);

  // Note: aircraft 'track' in a game without wind is just heading 'psi'
  const trackDeg = (ac.psi * 180) / Math.PI;
  const birdTrackDeg = normalize180(trackDeg - selectedTrackDeg);

  // Compute direct slant distance to runway threshold for DME
  const dme_m = Math.hypot(
    ils.thresholdX_m - ac.x,
    ils.thresholdY_m - ac.y,
    -ac.z - ils.thresholdElevation_m
  );
  const ilsDmeNm = dme_m / 1852.0;

  return {
    along_m,
    cross_m,
    locDeg,
    gsDeg,
    locNorm,
    gsNorm,
    fpaDeg,
    birdTrackDeg,
    ilsDmeNm,
    locValid: along_m > 0,
    gsValid: along_m > 926 && along_m < 22224, // valid from ~0.5 NM to 12 NM
  };
}
