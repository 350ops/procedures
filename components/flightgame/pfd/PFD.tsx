import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type PFDData = {
  iasKt: number;
  altFt: number;
  vsFpm: number;
  headingDeg: number;
  pitchDeg: number;
  bankDeg: number;
  thrustPct: number;
  stalled: boolean;
  onGround: boolean;
};

type Props = {
  width: number;
  height: number;
  data: PFDData;
};

export default function PFD({ width, height, data }: Props) {
  const pitchOffset = data.pitchDeg * 6;

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.fmaRow}>
        <Text style={styles.fmaCell}>SPEED</Text>
        <Text style={styles.fmaCell}>APP-DES</Text>
        <Text style={styles.fmaCell}>NAV</Text>
        <Text style={styles.fmaMin}>BARO 940</Text>
      </View>

      <View style={styles.body}>
        <View
          style={[
            styles.horizon,
            {
              transform: [
                { translateY: pitchOffset },
                { rotate: `${-data.bankDeg}deg` },
              ],
            },
          ]}
        >
          <View style={styles.horizonTop} />
          <View style={styles.horizonBottom} />
          <View style={styles.horizonLine} />
        </View>

        <View style={styles.aircraftSymbol}>
          <View style={styles.aircraftBar} />
          <View style={styles.aircraftDot} />
          <View style={styles.aircraftBar} />
        </View>

        {data.stalled && (
          <View style={styles.stallBanner}>
            <Text style={styles.stallText}>STALL</Text>
          </View>
        )}
        {data.onGround && (
          <View style={styles.groundBanner}>
            <Text style={styles.groundText}>GROUND</Text>
          </View>
        )}
      </View>

      <View style={styles.hud}>
        <Row label="IAS" value={`${Math.round(data.iasKt)} kt`} />
        <Row label="ALT" value={`${Math.round(data.altFt)} ft`} />
        <Row label="V/S" value={`${Math.round(data.vsFpm)} fpm`} sign />
        <Row label="HDG" value={`${pad3(data.headingDeg)}°`} />
        <Row label="PIT" value={`${fmt1(data.pitchDeg)}°`} sign />
        <Row label="BNK" value={`${fmt1(data.bankDeg)}°`} sign />
        <Row label="THR" value={`${Math.round(data.thrustPct)}%`} />
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  sign = false,
}: {
  label: string;
  value: string;
  sign?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, sign && styles.rowValueMono]}>
        {value}
      </Text>
    </View>
  );
}

function pad3(v: number) {
  const n = Math.round(((v % 360) + 360) % 360);
  return n.toString().padStart(3, "0");
}

function fmt1(v: number) {
  const sign = v >= 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}`;
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
    overflow: "hidden",
  },
  horizon: {
    position: "absolute",
    top: "-100%",
    left: "-50%",
    right: "-50%",
    bottom: "-100%",
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
  stallBanner: {
    position: "absolute",
    top: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#ff1744",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  stallText: {
    color: "#ff1744",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  groundBanner: {
    position: "absolute",
    bottom: 48,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#ffb300",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  groundText: {
    color: "#ffb300",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  hud: {
    position: "absolute",
    left: 8,
    bottom: 8,
    gap: 2,
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  rowLabel: {
    width: 32,
    color: "rgba(0,230,118,0.7)",
    fontSize: 11,
    fontFamily: "Courier",
  },
  rowValue: {
    color: "#00e676",
    fontSize: 11,
    fontFamily: "Courier",
  },
  rowValueMono: {
    minWidth: 60,
  },
});
