import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { flightPhases, type FlightPhase, type TaskItem } from "@/data/tasksharing";

export default function PracticeScreen() {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [selfGrades, setSelfGrades] = useState<
    Record<string, "correct" | "incorrect">
  >({});

  const phase = flightPhases[currentPhaseIdx];
  const allItems = useMemo(
    () => phase.sections.flatMap((s) => s.items),
    [currentPhaseIdx]
  );
  const totalRevealed = revealedItems.size;
  const totalCorrect = Object.values(selfGrades).filter(
    (g) => g === "correct"
  ).length;
  const totalGraded = Object.keys(selfGrades).length;

  const handleReveal = useCallback((itemId: string) => {
    setRevealedItems((prev) => new Set(prev).add(itemId));
  }, []);

  const handleGrade = useCallback(
    (itemId: string, grade: "correct" | "incorrect") => {
      setSelfGrades((prev) => ({ ...prev, [itemId]: grade }));
    },
    []
  );

  const handleNextPhase = useCallback(() => {
    if (currentPhaseIdx < flightPhases.length - 1) {
      setCurrentPhaseIdx((i) => i + 1);
      setRevealedItems(new Set());
      setSelfGrades({});
    }
  }, [currentPhaseIdx]);

  const handlePrevPhase = useCallback(() => {
    if (currentPhaseIdx > 0) {
      setCurrentPhaseIdx((i) => i - 1);
      setRevealedItems(new Set());
      setSelfGrades({});
    }
  }, [currentPhaseIdx]);

  const handleReset = useCallback(() => {
    setRevealedItems(new Set());
    setSelfGrades({});
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Progress header */}
      <View style={[styles.progressBar, { backgroundColor: colors.card }]}>
        <View style={styles.progressInfo}>
          <Text style={[styles.phaseTitle, { color: colors.text }]}>
            {phase.name}
          </Text>
          <Text style={[styles.progressText, { color: colors.secondaryText }]}>
            {totalRevealed}/{allItems.length} revealed
            {totalGraded > 0 &&
              ` · ${totalCorrect}/${totalGraded} correct`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={[styles.resetText, { color: colors.accent }]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Score bar */}
      <View style={[styles.scoreBar, { backgroundColor: colors.card }]}>
        <View style={styles.scoreTrack}>
          {allItems.map((item) => {
            const grade = selfGrades[item.id];
            const revealed = revealedItems.has(item.id);
            let bg = colors.scorePending;
            if (grade === "correct") bg = colors.scoreCorrect;
            else if (grade === "incorrect") bg = colors.scoreIncorrect;
            else if (revealed) bg = colors.scoreRevealed;
            return (
              <View
                key={item.id}
                style={[styles.scoreDot, { backgroundColor: bg }]}
              />
            );
          })}
        </View>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {phase.sections.map((section) => {
          const leftLabel =
            section.roleLabeling === "CM1_CM2" ? "CM1" : "PF";
          const rightLabel =
            section.roleLabeling === "CM1_CM2" ? "CM2" : "PM";

          return (
            <View key={section.id} style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.secondaryText }]}
              >
                {section.title.toUpperCase()}
              </Text>

              {section.items.map((item, idx) => {
                const revealed = revealedItems.has(item.id);
                const grade = selfGrades[item.id];

                return (
                  <View key={item.id}>
                    {item.condition && (
                      <View
                        style={[
                          styles.conditionRow,
                          { backgroundColor: colors.conditionBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.conditionText,
                            { color: colors.conditionText },
                          ]}
                        >
                          {item.condition}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.itemRow,
                        {
                          backgroundColor: grade
                            ? grade === "correct"
                              ? colors.correctBg
                              : colors.incorrectBg
                            : colors.card,
                          borderBottomColor: colors.separator,
                          borderBottomWidth:
                            idx < section.items.length - 1
                              ? StyleSheet.hairlineWidth
                              : 0,
                        },
                      ]}
                      onPress={() => !revealed && handleReveal(item.id)}
                      activeOpacity={revealed ? 1 : 0.6}
                    >
                      <View style={styles.itemContent}>
                        <Text
                          style={[styles.actionText, { color: colors.text }]}
                        >
                          {item.action}
                        </Text>
                        {revealed ? (
                          <View style={styles.revealedContent}>
                            <View style={styles.revealedRow}>
                              <View
                                style={[
                                  styles.roleBadge,
                                  {
                                    backgroundColor:
                                      item.role === "BOTH"
                                        ? colors.bothBadge
                                        : item.role === "CM1" ||
                                            item.role === "PF"
                                          ? colors.leftBadge
                                          : colors.rightBadge,
                                  },
                                ]}
                              >
                                <Text style={styles.roleBadgeText}>
                                  {item.role}
                                </Text>
                              </View>
                              {item.value ? (
                                <Text
                                  style={[
                                    styles.valueText,
                                    { color: colors.valueText },
                                  ]}
                                >
                                  {item.value}
                                </Text>
                              ) : null}
                            </View>
                            {!grade && (
                              <View style={styles.gradeButtons}>
                                <TouchableOpacity
                                  style={[
                                    styles.gradeBtn,
                                    { backgroundColor: colors.correctBtn },
                                  ]}
                                  onPress={() =>
                                    handleGrade(item.id, "correct")
                                  }
                                >
                                  <Text style={styles.gradeBtnText}>
                                    Knew it
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[
                                    styles.gradeBtn,
                                    { backgroundColor: colors.incorrectBtn },
                                  ]}
                                  onPress={() =>
                                    handleGrade(item.id, "incorrect")
                                  }
                                >
                                  <Text style={styles.gradeBtnText}>
                                    Missed it
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.tapHint,
                              { color: colors.secondaryText },
                            ]}
                          >
                            Tap to reveal who does this
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Navigation footer */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.separator }]}>
        <TouchableOpacity
          onPress={handlePrevPhase}
          disabled={currentPhaseIdx === 0}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  currentPhaseIdx === 0
                    ? colors.secondaryText
                    : colors.accent,
              },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        <Text style={[styles.phaseCounter, { color: colors.secondaryText }]}>
          {currentPhaseIdx + 1} / {flightPhases.length}
        </Text>
        <TouchableOpacity
          onPress={handleNextPhase}
          disabled={currentPhaseIdx === flightPhases.length - 1}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  currentPhaseIdx === flightPhases.length - 1
                    ? colors.secondaryText
                    : colors.accent,
              },
            ]}
          >
            Next
          </Text>
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
  separator: "#c6c6c8",
  accent: "#007AFF",
  leftBadge: "#007AFF",
  rightBadge: "#FF9500",
  bothBadge: "#34C759",
  valueText: "#007AFF",
  correctBg: "rgba(52, 199, 89, 0.1)",
  incorrectBg: "rgba(255, 59, 48, 0.1)",
  correctBtn: "#34C759",
  incorrectBtn: "#FF3B30",
  conditionBg: "#fff3cd",
  conditionText: "#856404",
  scorePending: "#e0e0e0",
  scoreRevealed: "#c7c7cc",
  scoreCorrect: "#34C759",
  scoreIncorrect: "#FF3B30",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  separator: "#38383a",
  accent: "#0A84FF",
  leftBadge: "#0A84FF",
  rightBadge: "#FF9F0A",
  bothBadge: "#30D158",
  valueText: "#0A84FF",
  correctBg: "rgba(48, 209, 88, 0.15)",
  incorrectBg: "rgba(255, 69, 58, 0.15)",
  correctBtn: "#30D158",
  incorrectBtn: "#FF453A",
  conditionBg: "#3a3000",
  conditionText: "#FFD60A",
  scorePending: "#38383a",
  scoreRevealed: "#48484a",
  scoreCorrect: "#30D158",
  scoreIncorrect: "#FF453A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressInfo: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 13,
    marginTop: 2,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetText: {
    fontSize: 15,
    fontWeight: "600",
  },
  scoreBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  scoreTrack: {
    flexDirection: "row",
    gap: 3,
    flexWrap: "wrap",
  },
  scoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  itemRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemContent: {},
  actionText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Menlo",
  },
  tapHint: {
    fontSize: 13,
    marginTop: 4,
    fontStyle: "italic",
  },
  revealedContent: {
    marginTop: 8,
  },
  revealedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  valueText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  gradeButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  gradeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  gradeBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  phaseCounter: {
    fontSize: 14,
    fontWeight: "500",
  },
  conditionRow: {
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
  },
});
