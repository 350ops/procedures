import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type NavigationDisplayData = {
  along_m: number;
  cross_m: number;
  headingErrorDeg: number;
  ilsDmeNm: number;
};

type Props = {
  width: number;
  height: number;
  data: NavigationDisplayData;
};

const RANGE_NM = 15;
const RANGE_M = RANGE_NM * 1852;

export default function NavigationDisplay({ width, height, data }: Props) {
  const centerX = width / 2;
  const aircraftY = height * 0.84;
  const pad = Math.min(width, height) * 0.1;
  const usableHalfW = Math.max(width / 2 - pad, 1);
  const usableH = Math.max(aircraftY - pad, 1);

  const runwayX =
    centerX +
    Math.max(
      -usableHalfW,
      Math.min(usableHalfW, (data.cross_m / RANGE_M) * usableHalfW)
    );
  const thresholdY =
    aircraftY -
    Math.max(0, Math.min(usableH, (data.along_m / RANGE_M) * usableH));
  const runwayLength = Math.max(24, height * 0.12);

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.modeText}>APP</Text>
      <Text style={styles.rangeText}>{RANGE_NM} NM</Text>

      {[5, 10, 15].map((nm) => {
        const diameter = ((nm * 1852) / RANGE_M) * usableH * 2;
        return (
          <View
            key={nm}
            style={[
              styles.arc,
              {
                width: diameter,
                height: diameter,
                borderRadius: diameter / 2,
                left: centerX - diameter / 2,
                top: aircraftY - diameter / 2,
              },
            ]}
          />
        );
      })}

      {[5, 10, 15].map((nm) => {
        const y = aircraftY - ((nm * 1852) / RANGE_M) * usableH;
        return (
          <Text key={`label-${nm}`} style={[styles.arcLabel, { top: y - 10, right: 10 }]}>
            {nm}
          </Text>
        );
      })}

      <View
        style={[
          styles.localizer,
          {
            left: runwayX - 1,
            top: pad,
            height: Math.max(thresholdY - pad, 0),
          },
        ]}
      />

      <View
        style={[
          styles.runway,
          {
            left: runwayX - 10,
            top: thresholdY - runwayLength,
            height: runwayLength,
          },
        ]}
      />

      <Text style={[styles.runwayLabel, { left: runwayX - 24, top: thresholdY + 6 }]}>
        RWY 09
      </Text>

      <View
        style={[
          styles.aircraftGroup,
          {
            left: centerX,
            top: aircraftY,
            transform: [{ rotate: `${data.headingErrorDeg}deg` }],
          },
        ]}
      >
        <View style={styles.aircraftStem} />
        <View style={styles.aircraftWings} />
        <View style={styles.aircraftTail} />
      </View>

      <View
        style={[
          styles.centerlineBug,
          { left: centerX - 1, top: pad, height: aircraftY - pad },
        ]}
      />

      <View style={styles.infoBlock}>
        <Text style={styles.infoLabel}>DME</Text>
        <Text style={styles.infoValue}>{data.ilsDmeNm.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    overflow: "hidden",
  },
  modeText: {
    position: "absolute",
    top: 10,
    left: 12,
    color: "#00d084",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  rangeText: {
    position: "absolute",
    top: 10,
    right: 12,
    color: "#00d7ff",
    fontSize: 16,
    fontWeight: "700",
  },
  arc: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    borderBottomWidth: 0,
  },
  arcLabel: {
    position: "absolute",
    color: "#00d7ff",
    fontSize: 12,
    fontWeight: "600",
  },
  localizer: {
    position: "absolute",
    width: 2,
    backgroundColor: "rgba(0, 208, 132, 0.85)",
  },
  runway: {
    position: "absolute",
    width: 20,
    backgroundColor: "#d8dde6",
    borderRadius: 3,
  },
  runwayLabel: {
    position: "absolute",
    color: "#d8dde6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  aircraftGroup: {
    position: "absolute",
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  aircraftStem: {
    position: "absolute",
    width: 3,
    height: 24,
    backgroundColor: "#f2c94c",
    top: -24,
  },
  aircraftWings: {
    position: "absolute",
    width: 28,
    height: 3,
    backgroundColor: "#f2c94c",
    top: -8,
    left: -14,
  },
  aircraftTail: {
    position: "absolute",
    width: 12,
    height: 3,
    backgroundColor: "#f2c94c",
    top: 2,
    left: -6,
  },
  centerlineBug: {
    position: "absolute",
    width: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  infoBlock: {
    position: "absolute",
    left: 12,
    bottom: 14,
  },
  infoLabel: {
    color: "#8aa2b4",
    fontSize: 12,
    letterSpacing: 1.2,
  },
  infoValue: {
    color: "#00d7ff",
    fontSize: 24,
    fontWeight: "700",
  },
});
