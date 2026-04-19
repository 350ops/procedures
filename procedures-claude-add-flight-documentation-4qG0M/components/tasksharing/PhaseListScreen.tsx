import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { flightPhases, getPhaseStats } from "@/data/tasksharing";

export default function PhaseListScreen() {
  const router = useRouter();
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, { backgroundColor: colors.accent }]}
          onPress={() =>
            router.push({
              pathname: "/tasksharing/practice",
            })
          }
        >
          <Text style={[styles.modeButtonIcon]}>{"  "}</Text>
          <Text style={[styles.modeButtonText, { color: "#fff" }]}>
            Practice
          </Text>
          <Text style={[styles.modeButtonSub, { color: "rgba(255,255,255,0.7)" }]}>
            Tap to reveal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, { backgroundColor: colors.quiz }]}
          onPress={() =>
            router.push({
              pathname: "/tasksharing/quiz",
            })
          }
        >
          <Text style={[styles.modeButtonIcon]}>{"  "}</Text>
          <Text style={[styles.modeButtonText, { color: "#fff" }]}>Quiz</Text>
          <Text style={[styles.modeButtonSub, { color: "rgba(255,255,255,0.7)" }]}>
            Test your knowledge
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>
        FLIGHT PHASES
      </Text>

      {flightPhases.map((phase, index) => {
        const stats = getPhaseStats(phase);
        const roleLabel =
          phase.sections[0]?.roleLabeling === "CM1_CM2"
            ? "CM1 / CM2"
            : "PF / PM";
        return (
          <TouchableOpacity
            key={phase.id}
            style={[
              styles.phaseRow,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.separator,
                borderBottomWidth:
                  index < flightPhases.length - 1 ? StyleSheet.hairlineWidth : 0,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/tasksharing/browse",
                params: { phaseId: phase.id },
              })
            }
            activeOpacity={0.6}
          >
            <View
              style={[
                styles.phaseIcon,
                { backgroundColor: colors.iconBg },
              ]}
            >
              <Text style={styles.phaseNumber}>{index + 1}</Text>
            </View>
            <View style={styles.phaseInfo}>
              <Text style={[styles.phaseName, { color: colors.text }]}>
                {phase.name}
              </Text>
              <Text
                style={[styles.phaseMeta, { color: colors.secondaryText }]}
              >
                {stats.total} items · {roleLabel}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.secondaryText }]}>
              ›
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const lightColors = {
  bg: "#f2f2f7",
  card: "#ffffff",
  text: "#000000",
  secondaryText: "#8e8e93",
  separator: "#c6c6c8",
  accent: "#007AFF",
  quiz: "#FF9500",
  iconBg: "#e8e8ed",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  separator: "#38383a",
  accent: "#0A84FF",
  quiz: "#FF9F0A",
  iconBg: "#2c2c2e",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeSelector: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  modeButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modeButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  modeButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  modeButtonSub: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  phaseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  phaseNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: "500",
  },
  phaseMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    marginLeft: 8,
  },
});
