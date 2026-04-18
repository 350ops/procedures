import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  width: number;
  height: number;
  stickX: number;
  stickY: number;
  thrust: number;
};

export default function PFD({ width, height, stickX, stickY, thrust }: Props) {
  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.fmaRow}>
        <Text style={styles.fmaCell}>SPEED</Text>
        <Text style={styles.fmaCell}>APP-DES</Text>
        <Text style={styles.fmaCell}>NAV</Text>
        <Text style={styles.fmaMin}>BARO 940</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.horizonTop} />
        <View style={styles.horizonBottom} />
        <View style={styles.horizonLine} />

        <View style={styles.aircraftSymbol}>
          <View style={styles.aircraftBar} />
          <View style={styles.aircraftDot} />
          <View style={styles.aircraftBar} />
        </View>

        <View style={styles.placeholderLabel}>
          <Text style={styles.placeholderText}>PFD</Text>
          <Text style={styles.placeholderSub}>physics pending (M2)</Text>
        </View>
      </View>

      <View style={styles.hud}>
        <Text style={styles.hudText}>
          stick  x {stickX.toFixed(2)}   y {stickY.toFixed(2)}
        </Text>
        <Text style={styles.hudText}>
          thrust {(thrust * 100).toFixed(0)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#ffe600",
    overflow: "hidden",
  },
  fmaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,230,0,0.4)",
    gap: 8,
  },
  fmaCell: {
    flex: 1,
    textAlign: "center",
    color: "#00e676",
    fontSize: 12,
    fontWeight: "700",
  },
  fmaMin: {
    color: "#00e5ff",
    fontSize: 12,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
    backgroundColor: "#ffffff",
  },
  aircraftSymbol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  aircraftBar: {
    width: 34,
    height: 4,
    backgroundColor: "#ffe600",
  },
  aircraftDot: {
    width: 8,
    height: 8,
    backgroundColor: "#ffe600",
    borderRadius: 2,
  },
  placeholderLabel: {
    position: "absolute",
    bottom: 24,
    alignItems: "center",
  },
  placeholderText: {
    color: "#00e676",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 4,
  },
  placeholderSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
    marginTop: 2,
  },
  hud: {
    position: "absolute",
    left: 8,
    bottom: 8,
    gap: 2,
  },
  hudText: {
    color: "#00e676",
    fontSize: 11,
    fontFamily: "Courier",
  },
});
