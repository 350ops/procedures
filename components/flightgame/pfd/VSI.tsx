import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  vsFpm: number;
  width: number;
  height: number;
};

const MAX_FPM = 6000;

// Non-linear scale: compressed beyond 2000 fpm so the needle is precise
// around cruise but still has range up/down to ±6000.
function fpmToUnit(fpm: number): number {
  const s = Math.sign(fpm);
  const a = Math.abs(fpm);
  if (a <= 2000) return s * (a / 2000) * 0.6;
  const extra = Math.min(1, (a - 2000) / (MAX_FPM - 2000));
  return s * (0.6 + extra * 0.4);
}

export default function VSI({ vsFpm, width, height }: Props) {
  const u = fpmToUnit(vsFpm); // -1..1
  const half = height / 2;
  const needleY = half - u * (half - 8);
  const showReadout = Math.abs(vsFpm) >= 100;

  return (
    <View style={[styles.wrap, { width, height }]}>
      {[2, 1, -1, -2].map((m) => {
        const y = half - fpmToUnit(m * 1000) * (half - 8);
        return (
          <View key={m} style={[styles.tick, { top: y - 1 }]} />
        );
      })}
      {[6, -6].map((m) => {
        const y = half - fpmToUnit(m * 1000) * (half - 8);
        return (
          <View
            key={m}
            style={[styles.tick, { top: y - 1, width: 6 }]}
          />
        );
      })}
      <Text style={[styles.edgeLabel, { top: 2 }]}>6</Text>
      <Text style={[styles.edgeLabel, { bottom: 2 }]}>6</Text>

      <View style={[styles.needle, { top: needleY - 1 }]} />

      {showReadout && (
        <Text
          style={[
            styles.readout,
            vsFpm > 0 ? { top: 18 } : { bottom: 18 },
          ]}
        >
          {(vsFpm >= 0 ? "+" : "") + Math.round(vsFpm / 50) * 50}
        </Text>
      )}

      <View style={styles.centerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.2)",
  },
  tick: {
    position: "absolute",
    left: 0,
    width: 10,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  centerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    marginTop: -0.5,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  needle: {
    position: "absolute",
    left: 0,
    right: 4,
    height: 2,
    backgroundColor: "#ffe600",
  },
  edgeLabel: {
    position: "absolute",
    right: 2,
    color: "rgba(255,255,255,0.7)",
    fontSize: 9,
    fontFamily: "Courier",
  },
  readout: {
    position: "absolute",
    right: 2,
    color: "#ffe600",
    fontSize: 11,
    fontFamily: "Courier",
    fontWeight: "700",
  },
});
