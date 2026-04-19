import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { getAllTaskItems, type CrewRole, type RoleLabeling } from "@/data/tasksharing";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizScreen() {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  const allItems = useMemo(() => shuffleArray(getAllTaskItems()), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<CrewRole | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [showResult, setShowResult] = useState(false);

  const currentItem = allItems[currentIdx];
  const isFinished = currentIdx >= allItems.length;

  const getOptions = useCallback(
    (labeling: RoleLabeling): CrewRole[] => {
      return labeling === "CM1_CM2" ? ["CM1", "CM2"] : ["PF", "PM"];
    },
    []
  );

  const handleAnswer = useCallback(
    (answer: CrewRole) => {
      if (showResult) return;
      setSelectedAnswer(answer);
      setShowResult(true);
      if (answer === currentItem.role) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    },
    [showResult, currentItem]
  );

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => i + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, incorrect: 0 });
  }, []);

  if (isFinished) {
    const pct = Math.round(
      (score.correct / (score.correct + score.incorrect)) * 100
    );
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={[styles.finishedTitle, { color: colors.text }]}>
          Quiz Complete!
        </Text>
        <Text style={[styles.finishedScore, { color: colors.accent }]}>
          {score.correct} / {score.correct + score.incorrect}
        </Text>
        <Text style={[styles.finishedPct, { color: colors.secondaryText }]}>
          {pct}% correct
        </Text>
        <View style={styles.finishedBar}>
          <View
            style={[
              styles.finishedBarFill,
              {
                backgroundColor: colors.correctBtn,
                width: `${pct}%`,
              },
            ]}
          />
        </View>
        <TouchableOpacity
          style={[styles.restartBtn, { backgroundColor: colors.accent }]}
          onPress={handleRestart}
        >
          <Text style={styles.restartBtnText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const options = getOptions(currentItem.roleLabeling);
  const total = score.correct + score.incorrect;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Progress */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerInfo}>
          <Text style={[styles.questionCounter, { color: colors.secondaryText }]}>
            Question {currentIdx + 1} of {allItems.length}
          </Text>
          <Text style={[styles.scoreText, { color: colors.text }]}>
            {score.correct} correct · {score.incorrect} wrong
          </Text>
        </View>
        <View
          style={[styles.progressTrack, { backgroundColor: colors.progressBg }]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.accent,
                width: `${((currentIdx + 1) / allItems.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Question card */}
      <View style={styles.cardContainer}>
        <View style={[styles.questionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.phaseLabel, { color: colors.secondaryText }]}>
            {currentItem.phaseName}
          </Text>

          <Text style={[styles.questionAction, { color: colors.text }]}>
            {currentItem.action}
          </Text>
          {currentItem.value ? (
            <Text style={[styles.questionValue, { color: colors.valueText }]}>
              {currentItem.value}
            </Text>
          ) : null}

          {currentItem.condition && (
            <View
              style={[
                styles.conditionBadge,
                { backgroundColor: colors.conditionBg },
              ]}
            >
              <Text
                style={[
                  styles.conditionText,
                  { color: colors.conditionText },
                ]}
              >
                {currentItem.condition}
              </Text>
            </View>
          )}

          <Text
            style={[styles.questionPrompt, { color: colors.secondaryText }]}
          >
            Who performs this action?
          </Text>

          {/* Answer buttons */}
          <View style={styles.answerButtons}>
            {options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentItem.role;

              let btnBg = colors.optionBg;
              let btnBorder = colors.optionBorder;
              let textColor = colors.text;

              if (showResult) {
                if (isCorrect) {
                  btnBg = colors.correctBg;
                  btnBorder = colors.correctBtn;
                  textColor = colors.correctBtn;
                } else if (isSelected && !isCorrect) {
                  btnBg = colors.incorrectBg;
                  btnBorder = colors.incorrectBtn;
                  textColor = colors.incorrectBtn;
                }
              }

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionBtn,
                    {
                      backgroundColor: btnBg,
                      borderColor: btnBorder,
                    },
                  ]}
                  onPress={() => handleAnswer(option)}
                  disabled={showResult}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {option}
                  </Text>
                  <Text
                    style={[styles.optionDesc, { color: colors.secondaryText }]}
                  >
                    {option === "CM1"
                      ? "Commander"
                      : option === "CM2"
                        ? "Co-pilot"
                        : option === "PF"
                          ? "Pilot Flying"
                          : "Pilot Monitoring"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Result feedback */}
          {showResult && (
            <View style={styles.resultContainer}>
              <Text
                style={[
                  styles.resultText,
                  {
                    color:
                      selectedAnswer === currentItem.role
                        ? colors.correctBtn
                        : colors.incorrectBtn,
                  },
                ]}
              >
                {selectedAnswer === currentItem.role
                  ? "Correct!"
                  : `Incorrect — the answer is ${currentItem.role}`}
              </Text>
              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: colors.accent }]}
                onPress={handleNext}
              >
                <Text style={styles.nextBtnText}>Next Question</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  valueText: "#007AFF",
  correctBg: "rgba(52, 199, 89, 0.15)",
  incorrectBg: "rgba(255, 59, 48, 0.15)",
  correctBtn: "#34C759",
  incorrectBtn: "#FF3B30",
  optionBg: "#f2f2f7",
  optionBorder: "#c6c6c8",
  progressBg: "#e0e0e0",
  conditionBg: "#fff3cd",
  conditionText: "#856404",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  accent: "#0A84FF",
  valueText: "#0A84FF",
  correctBg: "rgba(48, 209, 88, 0.2)",
  incorrectBg: "rgba(255, 69, 58, 0.2)",
  correctBtn: "#30D158",
  incorrectBtn: "#FF453A",
  optionBg: "#2c2c2e",
  optionBorder: "#48484a",
  progressBg: "#38383a",
  conditionBg: "#3a3000",
  conditionText: "#FFD60A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  questionCounter: {
    fontSize: 13,
    fontWeight: "500",
  },
  scoreText: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  questionCard: {
    borderRadius: 16,
    padding: 24,
  },
  phaseLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  questionAction: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Menlo",
    marginBottom: 4,
  },
  questionValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  conditionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  questionPrompt: {
    fontSize: 15,
    marginTop: 16,
    marginBottom: 16,
  },
  answerButtons: {
    gap: 12,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionText: {
    fontSize: 20,
    fontWeight: "700",
    width: 44,
  },
  optionDesc: {
    fontSize: 15,
    flex: 1,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultText: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
  },
  nextBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  nextBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  finishedTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  finishedScore: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 4,
  },
  finishedPct: {
    fontSize: 18,
    marginBottom: 24,
  },
  finishedBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    marginBottom: 32,
  },
  finishedBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  restartBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  restartBtnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
});
