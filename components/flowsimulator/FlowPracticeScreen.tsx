import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import {
  flowTopics,
  getTopicPageCount,
  parseFlowSteps,
  type FlowStep,
} from "@/data/flowsimulator";
import { usePdfExtraction } from "@/hooks/usePdfExtraction";

export default function FlowPracticeScreen() {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<Set<string>>(new Set());
  const [selfGrades, setSelfGrades] = useState<
    Record<string, "correct" | "incorrect">
  >({});

  const topic = flowTopics[currentTopicIdx];
  const { pages, loading, progress, error, totalPages, extractedCount, available } =
    usePdfExtraction(topic.startPage, topic.endPage);

  // Flatten all steps from all extracted pages
  const allSteps = useMemo(() => {
    const steps: (FlowStep & { pageNumber: number })[] = [];
    for (const page of pages) {
      const parsed = parseFlowSteps(page.text);
      for (const step of parsed) {
        steps.push({
          ...step,
          id: `p${page.pageNumber}-${step.id}`,
          pageNumber: page.pageNumber,
        });
      }
    }
    return steps;
  }, [pages]);

  const totalRevealed = revealedSteps.size;
  const totalCorrect = Object.values(selfGrades).filter(
    (g) => g === "correct"
  ).length;
  const totalGraded = Object.keys(selfGrades).length;

  const handleReveal = useCallback((stepId: string) => {
    setRevealedSteps((prev) => new Set(prev).add(stepId));
  }, []);

  const handleGrade = useCallback(
    (stepId: string, grade: "correct" | "incorrect") => {
      setSelfGrades((prev) => ({ ...prev, [stepId]: grade }));
    },
    []
  );

  const handleNextTopic = useCallback(() => {
    if (currentTopicIdx < flowTopics.length - 1) {
      setCurrentTopicIdx((i) => i + 1);
      setRevealedSteps(new Set());
      setSelfGrades({});
    }
  }, [currentTopicIdx]);

  const handlePrevTopic = useCallback(() => {
    if (currentTopicIdx > 0) {
      setCurrentTopicIdx((i) => i - 1);
      setRevealedSteps(new Set());
      setSelfGrades({});
    }
  }, [currentTopicIdx]);

  const handleReset = useCallback(() => {
    setRevealedSteps(new Set());
    setSelfGrades({});
  }, []);

  // Not available state
  if (!available) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Development Build Required
        </Text>
        <Text style={[styles.errorText, { color: colors.secondaryText }]}>
          PDF text extraction requires a native development build.{"\n"}
          Run: npx expo run:ios
        </Text>
      </View>
    );
  }

  // Loading state
  if (loading && allSteps.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Extracting {topic.name}...
        </Text>
        <Text style={[styles.progressSubtext, { color: colors.secondaryText }]}>
          {extractedCount} of {totalPages} pages
        </Text>
        <View style={[styles.progressBarBg, { backgroundColor: colors.separator }]}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: colors.accent, width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>Error</Text>
        <Text style={[styles.errorText, { color: colors.secondaryText }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Progress header */}
      <View style={[styles.progressBar, { backgroundColor: colors.card }]}>
        <View style={styles.progressInfo}>
          <Text style={[styles.topicTitle, { color: colors.text }]}>
            {topic.name}
          </Text>
          <Text style={[styles.progressText, { color: colors.secondaryText }]}>
            {totalRevealed}/{allSteps.length} revealed
            {totalGraded > 0 && ` · ${totalCorrect}/${totalGraded} correct`}
          </Text>
        </View>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={[styles.resetText, { color: colors.accent }]}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Score dots */}
      <View style={[styles.scoreBar, { backgroundColor: colors.card }]}>
        <View style={styles.scoreTrack}>
          {allSteps.map((step) => {
            const grade = selfGrades[step.id];
            const revealed = revealedSteps.has(step.id);
            let bg = colors.scorePending;
            if (grade === "correct") bg = colors.scoreCorrect;
            else if (grade === "incorrect") bg = colors.scoreIncorrect;
            else if (revealed) bg = colors.scoreRevealed;
            return (
              <View
                key={step.id}
                style={[styles.scoreDot, { backgroundColor: bg }]}
              />
            );
          })}
        </View>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {allSteps.map((step) => {
          const revealed = revealedSteps.has(step.id);
          const grade = selfGrades[step.id];

          return (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepRow,
                {
                  backgroundColor: grade
                    ? grade === "correct"
                      ? colors.correctBg
                      : colors.incorrectBg
                    : colors.card,
                  borderBottomColor: colors.separator,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
              onPress={() => !revealed && handleReveal(step.id)}
              activeOpacity={revealed ? 1 : 0.6}
            >
              <View style={styles.stepContent}>
                <Text style={[styles.stepOrder, { color: colors.secondaryText }]}>
                  Step {step.order} · Slide {step.pageNumber}
                </Text>
                {revealed ? (
                  <View>
                    <Text style={[styles.stepAction, { color: colors.text }]}>
                      {step.action}
                    </Text>
                    {step.detail ? (
                      <Text style={[styles.stepDetail, { color: colors.valueText }]}>
                        {step.detail}
                      </Text>
                    ) : null}
                    {!grade && (
                      <View style={styles.gradeButtons}>
                        <TouchableOpacity
                          style={[
                            styles.gradeBtn,
                            { backgroundColor: colors.correctBtn },
                          ]}
                          onPress={() => handleGrade(step.id, "correct")}
                        >
                          <Text style={styles.gradeBtnText}>Knew it</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.gradeBtn,
                            { backgroundColor: colors.incorrectBtn },
                          ]}
                          onPress={() => handleGrade(step.id, "incorrect")}
                        >
                          <Text style={styles.gradeBtnText}>Missed it</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text
                    style={[styles.tapHint, { color: colors.secondaryText }]}
                  >
                    Tap to reveal this step
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Navigation footer */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderTopColor: colors.separator },
        ]}
      >
        <TouchableOpacity
          onPress={handlePrevTopic}
          disabled={currentTopicIdx === 0}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  currentTopicIdx === 0 ? colors.secondaryText : colors.accent,
              },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        <Text style={[styles.topicCounter, { color: colors.secondaryText }]}>
          {currentTopicIdx + 1} / {flowTopics.length}
        </Text>
        <TouchableOpacity
          onPress={handleNextTopic}
          disabled={currentTopicIdx === flowTopics.length - 1}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  currentTopicIdx === flowTopics.length - 1
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
  valueText: "#007AFF",
  correctBg: "rgba(52, 199, 89, 0.1)",
  incorrectBg: "rgba(255, 59, 48, 0.1)",
  correctBtn: "#34C759",
  incorrectBtn: "#FF3B30",
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
  valueText: "#0A84FF",
  correctBg: "rgba(48, 209, 88, 0.15)",
  incorrectBg: "rgba(255, 69, 58, 0.15)",
  correctBtn: "#30D158",
  incorrectBtn: "#FF453A",
  scorePending: "#38383a",
  scoreRevealed: "#48484a",
  scoreCorrect: "#30D158",
  scoreIncorrect: "#FF453A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 16,
  },
  progressSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    width: "80%",
    marginTop: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
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
  topicTitle: {
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
  stepRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  stepContent: {},
  stepOrder: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  stepAction: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Menlo",
  },
  stepDetail: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  tapHint: {
    fontSize: 13,
    fontStyle: "italic",
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
  topicCounter: {
    fontSize: 14,
    fontWeight: "500",
  },
});
