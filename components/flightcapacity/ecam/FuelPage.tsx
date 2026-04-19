import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FuelPage() {
  return (
    <View style={styles.page}>
      <View style={styles.row}>
        <Pump label="LH FUEL PUMP" primer />
        <Pump label="RH FUEL PUMP" primer />
      </View>
      <View style={styles.row}>
        <Pump label="LH STANDBY PUMP" />
        <Pump label="RH STANDBY PUMP" />
      </View>
    </View>
  );
}

function Pump({ label, primer }: { label: string; primer?: boolean }) {
  return (
    <View style={styles.pump}>
      <Text style={styles.pumpLabel}>{label}</Text>
      <View style={styles.gauge}>
        <View style={styles.gaugeNeedle} />
        <Text style={styles.gaugeLow}>Low</Text>
        <Text style={styles.gaugeHigh}>High</Text>
      </View>
      <View style={styles.controls}>
        <Chip label="On" />
        {primer && <Chip label="Primer" />}
        <Chip label="Off" />
      </View>
    </View>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  pump: {
    flex: 1,
    alignItems: "center",
  },
  pumpLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  gauge: {
    width: 80,
    height: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  gaugeNeedle: {
    position: "absolute",
    bottom: 0,
    width: 2,
    height: 36,
    backgroundColor: "#fff",
    transform: [{ rotate: "30deg" }],
  },
  gaugeLow: {
    position: "absolute",
    left: 4,
    bottom: 2,
    color: "#fff",
    fontSize: 8,
  },
  gaugeHigh: {
    position: "absolute",
    right: 4,
    bottom: 2,
    color: "#fff",
    fontSize: 8,
  },
  controls: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  chip: {
    backgroundColor: "#5eb8ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
