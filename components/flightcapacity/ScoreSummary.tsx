import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import type { Score, ScoreCategory } from "./engine/types";
import { scoreTotals } from "./engine/engine";

type Props = {
  score: Score;
  onRestart: () => void;
  onExit: () => void;
};

const CATEGORIES: { key: ScoreCategory; label: string }[] = [
  { key: "tcas", label: "TCAS" },
  { key: "audio", label: "Audio" },
  { key: "hyd", label: "HYD" },
  { key: "fuel", label: "Fuel" },
  { key: "snapshot", label: "Snapshot" },
];

export default function ScoreSummary({
  score,
  onRestart,
  onExit,
}: Props) {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;
  const totals = scoreTotals(score);
  const denom = totals.correct + totals.incorrect;
  const pct = denom > 0 ? Math.round((totals.correct / denom) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Test Complete
      </Text>
      <Text style={[styles.scoreBig, { color: colors.accent }]}>
        {totals.correct} / {denom}
      </Text>
      <Text style={[styles.pct, { color: colors.secondaryText }]}>
        {pct}% correct
      </Text>

      <View
        style={[styles.breakdown, { backgroundColor: colors.card }]}
      >
        {CATEGORIES.map((c) => {
          const s = score[c.key];
          const total = s.correct + s.incorrect;
          return (
            <View key={c.key} style={styles.row}>
              <Text style={[styles.catLabel, { color: colors.text }]}>
                {c.label}
              </Text>
              <Text style={[styles.catScore, { color: colors.secondaryText }]}>
                {s.correct} / {total}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.accent }]}
          onPress={onRestart}
        >
          <Text style={styles.btnText}>Run Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.secondaryBtn }]}
          onPress={onExit}
        >
          <Text style={styles.btnText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const lightColors = {
  bg: "#f2f2f7",
  card: "#ffffff",
  text: "#000000",
  secondaryText: "#8e8e93",
  accent: "#007AFF",
  secondaryBtn: "#8e8e93",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  accent: "#0A84FF",
  secondaryBtn: "#48484a",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  scoreBig: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 4,
  },
  pct: {
    fontSize: 18,
    marginBottom: 32,
  },
  breakdown: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  catLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  catScore: {
    fontSize: 16,
    fontFamily: "Menlo",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
