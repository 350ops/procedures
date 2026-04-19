import React from "react";
import { StyleSheet, Text, View } from "react-native";

const circuits = [
  { id: "RED", color: "#ff3b30", psi: 0, status: "LOW", pump: "CB 1 ON" },
  { id: "BLUE", color: "#2196f3", psi: 0, status: "LOW", pump: "CE X FEED" },
  {
    id: "GREEN",
    color: "#30d158",
    psi: 2500,
    status: "OK",
    pump: "GREEN HYD PUMP ON",
  },
  {
    id: "WHITE",
    color: "#ffffff",
    psi: 2500,
    status: "OK",
    pump: "WHITE HYD PUMP ON",
  },
];

export default function HydPage() {
  return (
    <View style={styles.page}>
      <View style={styles.row}>
        {circuits.map((c) => (
          <View key={c.id} style={styles.col}>
            <Text style={[styles.heading, { color: c.color }]}>{c.id}</Text>
            <Text style={styles.psi}>{c.psi}</Text>
            <Text style={styles.psiUnit}>PSI</Text>
            <View style={[styles.dot, { borderColor: c.color }]} />
            <View
              style={[
                styles.box,
                { borderColor: c.color },
                c.status === "LOW" && { backgroundColor: "rgba(255,59,48,0.08)" },
              ]}
            >
              <Text style={[styles.boxText, { color: c.color }]}>
                {c.status === "LOW" ? "LOW" : c.pump}
              </Text>
            </View>
            <View style={[styles.tank, { borderColor: c.color, backgroundColor: c.status === "LOW" ? "transparent" : "rgba(48,209,88,0.2)" }]} />
          </View>
        ))}
      </View>
      <Text style={styles.checklist}>CHECKLIST</Text>
      <Text style={styles.line}>LH X FEED ON</Text>
      <Text style={styles.line}>CE X FEED ON</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  col: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  heading: {
    fontSize: 13,
    fontWeight: "700",
  },
  psi: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  psiUnit: {
    color: "#ffd600",
    fontSize: 10,
    fontWeight: "700",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
    marginVertical: 2,
    backgroundColor: "#ffd600",
  },
  box: {
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    width: "100%",
    alignItems: "center",
    marginTop: 2,
  },
  boxText: {
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },
  tank: {
    width: 18,
    height: 26,
    borderWidth: 2,
    marginTop: 6,
  },
  checklist: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 14,
  },
  line: {
    color: "#fff",
    fontSize: 11,
    marginLeft: 8,
  },
});
