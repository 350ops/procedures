import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  pitchDeg: number;
  bankDeg: number;
  width: number;
  height: number;
};

const PX_PER_DEG = 8;
const LADDER_DEGS = [-30, -20, -10, -5, 5, 10, 20, 30];
const BANK_MARKS = [-60, -45, -30, -20, -10, 10, 20, 30, 45, 60];

export default function AttitudeIndicator({
  pitchDeg,
  bankDeg,
  width,
  height,
}: Props) {
  const pitchOffset = pitchDeg * PX_PER_DEG;
  const radius = Math.min(width, height) * 0.45;

  return (
    <View style={[styles.wrap, { width, height }]}>
      {/* Rotating + translating sky/ground group */}
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
              style={[styles.ladderRow, { top: y - 8 }]}
            >
              <View style={[styles.ladderBar, { width: w }]} />
              <Text style={styles.ladderLabel}>{Math.abs(d)}</Text>
              <View style={[styles.ladderBar, { width: w }]} />
            </View>
          );
        })}
      </View>

      {/* Bank scale — rotates with aircraft, scale itself is fixed */}
      <View
        style={[
          styles.bankScale,
          {
            width: radius * 2,
            height: radius * 2,
            top: height / 2 - radius,
            left: width / 2 - radius,
          },
        ]}
        pointerEvents="none"
      >
        {BANK_MARKS.map((a) => {
          const isMajor = Math.abs(a) % 30 === 0;
          return (
            <View
              key={a}
              style={[
                styles.bankMark,
                {
                  transform: [{ rotate: `${a}deg` }],
                  width: 2,
                  height: isMajor ? 12 : 6,
                },
              ]}
            />
          );
        })}
        {/* Sky pointer (fixed, points up) */}
        <View style={styles.bankPointer} />
        {/* Roll indicator — rotates with bank */}
        <View
          style={[
            styles.rollIndicator,
            { transform: [{ rotate: `${-bankDeg}deg` }] },
          ]}
          pointerEvents="none"
        >
          <View style={styles.rollArrow} />
        </View>
      </View>

      {/* Fixed aircraft reference symbol */}
      <View style={styles.aircraftSymbol} pointerEvents="none">
        <View style={[styles.aircraftBar, { width: 40 }]} />
        <View style={styles.aircraftDot} />
        <View style={[styles.aircraftBar, { width: 40 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "#000",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
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
    backgroundColor: "#3a7ac8",
  },
  horizonBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#8a6a3a",
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
  bankScale: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bankMark: {
    position: "absolute",
    top: 0,
    backgroundColor: "#ffffff",
  },
  bankPointer: {
    position: "absolute",
    top: -2,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#ffe600",
  },
  rollIndicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rollArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffe600",
    marginTop: 12,
  },
  aircraftSymbol: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    marginTop: -4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  aircraftBar: {
    height: 4,
    backgroundColor: "#ffe600",
    borderWidth: 1,
    borderColor: "#000",
  },
  aircraftDot: {
    width: 8,
    height: 8,
    backgroundColor: "#ffe600",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#000",
  },
});
