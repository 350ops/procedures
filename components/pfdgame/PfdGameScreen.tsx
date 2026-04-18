import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PfdControls from "@/components/pfdgame/PfdControls";
import PfdInstrumentRenderer from "@/components/pfdgame/PfdInstrumentRenderer";
import { computeQuality, Difficulty } from "@/data/pfdgame";
import { usePfdGameEngine } from "@/hooks/pfdgame/usePfdGameEngine";

const BEST_SCORE_KEY = "pfd_best_score_v1";

export default function PfdGameScreen() {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [bestScore, setBestScore] = useState(0);
  const { state, running, start, reset, setInput, config } = usePfdGameEngine(difficulty);
  const quality = useMemo(() => computeQuality(state), [state]);
  const remainingMs = Math.max(0, config.sessionMs - state.elapsedMs);

  useEffect(() => {
    AsyncStorage.getItem(BEST_SCORE_KEY).then((raw) => {
      if (!raw) return;
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        setBestScore(parsed);
      }
    });
  }, []);

  useEffect(() => {
    if (!state.over) return;
    const roundedScore = Math.round(state.score);
    if (roundedScore > bestScore) {
      setBestScore(roundedScore);
      AsyncStorage.setItem(BEST_SCORE_KEY, String(roundedScore)).catch(() => undefined);
    }
  }, [bestScore, state.over, state.score]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>PFD Test</Text>
        <Text style={[styles.desc, { color: colors.secondary }]}>
          Follow the director, match target speed, keep the ball centered.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          {(["easy", "standard", "hard"] as Difficulty[]).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.pill,
                {
                  backgroundColor: difficulty === level ? colors.accent : colors.bg,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: difficulty === level ? "#fff" : colors.text },
                ]}
              >
                {level.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.stat, { color: colors.text }]}>
            Score: {Math.round(state.score)}
          </Text>
          <Text style={[styles.stat, { color: colors.text }]}>
            Best: {Math.round(bestScore)}
          </Text>
          <Text style={[styles.stat, { color: colors.text }]}>
            Time: {(remainingMs / 1000).toFixed(0)}s
          </Text>
        </View>
      </View>

      <PfdInstrumentRenderer state={state} quality={quality} theme={theme} />
      <PfdControls onInput={setInput} />

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {!running && !state.over ? (
          <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.accent }]} onPress={start}>
            <Text style={styles.mainBtnText}>Start Run</Text>
          </TouchableOpacity>
        ) : null}
        {state.over ? (
          <>
            <Text style={[styles.summary, { color: colors.text }]}>
              Run complete. Score {Math.round(state.score)} with best combo{" "}
              {(state.bestComboMs / 1000).toFixed(1)}s.
            </Text>
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.accent }]} onPress={start}>
              <Text style={styles.mainBtnText}>Play Again</Text>
            </TouchableOpacity>
          </>
        ) : null}
        {running ? (
          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: colors.bg, borderColor: colors.border, borderWidth: 1 }]}
            onPress={reset}
          >
            <Text style={[styles.mainBtnText, { color: colors.text }]}>Abort & Reset</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
}

const lightColors = {
  bg: "#f2f2f7",
  card: "#ffffff",
  text: "#111111",
  secondary: "#6d7280",
  accent: "#007AFF",
  border: "#e3e3e8",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondary: "#8e8e93",
  accent: "#0A84FF",
  border: "#2f2f33",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 36,
    paddingTop: 128,
    gap: 10,
  },
  card: {
    borderRadius: 14,
    padding: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  desc: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 19,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: "center",
  },
  pillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    fontSize: 13,
    fontWeight: "600",
  },
  mainBtn: {
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  mainBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  summary: {
    fontSize: 14,
    lineHeight: 19,
  },
});
