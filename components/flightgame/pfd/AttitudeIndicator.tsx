import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  pitchDeg: number;
  bankDeg: number;
  width: number;
  height: number;
  locNorm?: number;
  gsNorm?: number;
  locValid?: boolean;
  gsValid?: boolean;
  fpaDeg?: number;
  birdTrackDeg?: number;
  ilsDmeNm?: number;
};

const PX_PER_DEG = 8;
const LADDER_DEGS = [-30, -20, -10, -5, 5, 10, 20, 30];
const BANK_MARKS = [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60];

export default function AttitudeIndicator({
  pitchDeg,
  bankDeg,
  width,
  height,
  locNorm,
  gsNorm,
  locValid,
  gsValid,
  fpaDeg,
  birdTrackDeg,
  ilsDmeNm,
}: Props) {
  const pitchOffset = pitchDeg * PX_PER_DEG;
  const radius = Math.min(width, height) * 0.45;

  const locHalfW = radius * 0.6;
  const locY = height * 0.85;
  const locX = width / 2 + (locNorm !== undefined ? Math.max(-1.1, Math.min(1.1, locNorm)) : 0) * locHalfW;

  const gsHalfH = radius * 0.6;
  const gsX = width * 0.88;
  const gsCenterY = height / 2;
  const gsY = gsCenterY - (gsNorm !== undefined ? Math.max(-1.1, Math.min(1.1, gsNorm)) : 0) * gsHalfH;

  // Green Bird FPV laterally rests at the center unless there is wind drift.
  const driftDeg = 0; // (track - heading)
  const birdX = width / 2 + driftDeg;
  
  // The bird's vertical position relative to the SCREEN center must account for the Horizon offset.
  // Horizon moves by `pitchDeg`, bird must reflect `fpaDeg` relative to the Horizon.
  const birdY = height / 2 + (pitchDeg - (fpaDeg || 0)) * PX_PER_DEG;
  const showBird = fpaDeg !== undefined && birdTrackDeg !== undefined;

  return (
    <View style={[styles.wrap, { width, height }]}>
      {/* Circular clipping area for the globe */}
      <View style={[styles.globeClip, { width: width, height: height, borderRadius: width / 2 }]}>
        <View
          style={[
            styles.horizonGroup,
            {
              transform: [
                { rotate: `${-bankDeg}deg` },
                { translateY: pitchOffset },
              ],
            },
          ]}
        >
          <View style={styles.horizonTop} />
          <View style={styles.horizonBottom} />
          <View style={styles.horizonLine} />

          {LADDER_DEGS.map((d) => {
            const y = -d * PX_PER_DEG;
            const isMajor = Math.abs(d) % 10 === 0;
            const w = isMajor ? 90 : 50;
            return (
              <View
                key={d}
                style={[styles.ladderRow, { top: "50%", marginTop: y - 8 }]}
              >
                <View style={[styles.ladderBar, { width: w }]} />
                <Text style={styles.ladderLabel}>{Math.abs(d)}</Text>
                <View style={[styles.ladderBar, { width: w }]} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Fixed Bank Scale Ticks and Top Inverted Triangle */}
      <View
        style={[
          styles.bankScaleOrbit,
          {
            width: radius * 2,
            height: radius * 2,
            top: height / 2 - radius,
            left: width / 2 - radius,
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.fixedRollGroup}>
          <View style={styles.rollPointerOutline} />
        </View>

        {BANK_MARKS.map((a) => {
          const isMajor = Math.abs(a) % 30 === 0;
          return (
            <View
              key={a}
              style={[
                styles.bankOrbitor,
                { transform: [{ rotate: `${a}deg` }] },
              ]}
            >
              <View style={[styles.bankMark, { height: isMajor ? 12 : 6 }]} />
            </View>
          );
        })}
      </View>

      {/* Rotating Roll Pointer and Slip Indicator */}
      <View
        style={[
          styles.bankScaleOrbit,
           {
            width: radius * 2,
            height: radius * 2,
            top: height / 2 - radius,
            left: width / 2 - radius,
            transform: [{ rotate: `${bankDeg}deg` }],
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.rotatingRollGroup}>
          <View style={styles.rollArrow} />
          <View style={styles.betaTarget} />
        </View>
      </View>

      {/* Fixed aircraft reference symbol - black center squares with yellow borders */}
      <View style={styles.aircraftSymbol} pointerEvents="none">
        <View style={styles.aircraftWingLeft}>
          <View style={styles.wingHorizLeft} />
          <View style={styles.wingVertLeft} />
        </View>
        <View style={styles.aircraftDot} />
        <View style={styles.aircraftWingRight}>
          <View style={styles.wingHorizRight} />
          <View style={styles.wingVertRight} />
        </View>
      </View>

      {/* LOC Scale and Diamond */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[styles.ilsDot, { left: width / 2 - locHalfW, top: locY }]} />
        <View style={[styles.ilsDot, { left: width / 2 - locHalfW / 2, top: locY }]} />
        <View style={[styles.ilsDot, { left: width / 2 + locHalfW / 2, top: locY }]} />
        <View style={[styles.ilsDot, { left: width / 2 + locHalfW, top: locY }]} />
        {locValid !== false && locNorm !== undefined && (
          <View style={[styles.locDiamond, { left: locX, top: locY }]} />
        )}
      </View>

      {/* GS Scale and Diamond */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {gsValid !== false && <View style={[styles.ilsDot, { top: gsCenterY - gsHalfH, left: gsX }]} />}
        {gsValid !== false && <View style={[styles.ilsDot, { top: gsCenterY - gsHalfH / 2, left: gsX }]} />}
        {gsValid !== false && <View style={[styles.ilsDot, { top: gsCenterY + gsHalfH / 2, left: gsX }]} />}
        {gsValid !== false && <View style={[styles.ilsDot, { top: gsCenterY + gsHalfH, left: gsX }]} />}
        {gsValid !== false && gsNorm !== undefined && (
          <View style={[styles.gsDiamond, { top: gsY, left: gsX }]} />
        )}
      </View>

      {/* Green Bird (FPV) */}
      {showBird && (
        <View
          style={[
            styles.birdGroup,
            { top: birdY, left: birdX },
          ]}
          pointerEvents="none"
        >
          <View style={styles.birdFin} />
          <View style={styles.birdWingRow}>
            <View style={styles.birdWing} />
            <View style={styles.birdBody} />
            <View style={styles.birdWing} />
          </View>
        </View>
      )}

      {/* ILS DME Indicator on Bottom Left */}
      {ilsDmeNm !== undefined && (
        <View style={styles.ilsDmeBlock}>
          <Text style={styles.ilsDmeLabel}>ILS</Text>
          <Text style={styles.ilsDmeValue}>
            {ilsDmeNm.toFixed(1)} <Text style={styles.ilsDmeUnit}>NM</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#000",
  },
  globeClip: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center", // creates the circle effect tangent to Left/Right
  },
  horizonGroup: {
    position: "absolute",
    top: "-150%",
    bottom: "-150%",
    left: "-150%",
    right: "-150%",
    alignItems: "center",
    justifyContent: "center",
  },
  horizonTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#0072ff",
  },
  horizonBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#653b1b",
  },
  horizonLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 2,
    marginTop: -1,
    backgroundColor: "#ffffff",
  },
  ladderRow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ladderBar: {
    height: 2,
    backgroundColor: "#ffffff",
  },
  ladderLabel: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Courier",
    fontWeight: "700",
  },
  bankScaleOrbit: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bankOrbitor: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bankMark: {
    width: 2,
    backgroundColor: "#ffffff",
    marginTop: -4, 
  },
  fixedRollGroup: {
    position: "absolute",
    top: -2,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  rollPointerOutline: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffe600",
  },
  rotatingRollGroup: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  rollArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ffe600",
    marginBottom: 2,
  },
  betaTarget: {
    width: 14,
    height: 6,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#ffe600",
  },
  aircraftSymbol: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    marginTop: -8,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  aircraftWingLeft: {
    width: 60,
    height: 20,
    marginTop: 4,
  },
  wingHorizLeft: {
    width: 60,
    height: 8,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffe600",
  },
  wingVertLeft: {
    position: "absolute",
    right: 0,
    top: 2,
    width: 8,
    height: 18,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffe600",
    borderTopWidth: 0,
  },
  aircraftWingRight: {
    width: 60,
    height: 20,
    marginTop: 4,
  },
  wingHorizRight: {
    width: 60,
    height: 8,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffe600",
  },
  wingVertRight: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 8,
    height: 18,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffe600",
    borderTopWidth: 0,
  },
  aircraftDot: {
    width: 8,
    height: 8,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffe600",
    marginHorizontal: 30,
    marginTop: 8,
  },
  ilsDot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "transparent",
    marginLeft: -3,
    marginTop: -3,
  },
  locDiamond: {
    position: "absolute",
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: "#ff00ff", // Magenta for ILS deviations
    transform: [{ rotate: "45deg" }],
    marginLeft: -6,
    marginTop: -6,
  },
  gsDiamond: {
    position: "absolute",
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: "#ff00ff",
    transform: [{ rotate: "45deg" }],
    marginLeft: -6,
    marginTop: -6,
  },
  birdGroup: {
    position: "absolute",
    width: 40,
    height: 40,
    marginLeft: -20,
    marginTop: -20,
    alignItems: "center",
    justifyContent: "center",
  },
  birdWingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  birdBody: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#00ff00",
  },
  birdWing: {
    width: 12,
    height: 0,
    borderTopWidth: 2,
    borderColor: "#00ff00",
  },
  birdFin: {
    width: 0,
    height: 8,
    borderLeftWidth: 2,
    borderColor: "#00ff00",
    marginBottom: -2,
  },
  ilsDmeBlock: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  ilsDmeLabel: {
    color: "#ff00ff",
    fontSize: 14,
    fontFamily: "Courier",
    fontWeight: "bold",
  },
  ilsDmeValue: {
    color: "#ff00ff",
    fontSize: 16,
    fontFamily: "Courier",
    fontWeight: "bold",
  },
  ilsDmeUnit: {
    fontSize: 12,
  },
});
