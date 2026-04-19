import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  flightPhases,
  getAllTaskItems,
  type CrewRole,
  type RoleLabeling,
} from "@/data/tasksharing";
import { iOS } from "./quizDesign";
import { savePhaseResult } from "./quizProgress";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Question = {
  id: string;
  action: string;
  value: string;
  condition?: string;
  role: CrewRole;
  options: CrewRole[];
  phaseName: string;
  sectionTitle: string;
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildQuestions(phaseId?: string): Question[] {
  const all = getAllTaskItems();
  const filtered = phaseId
    ? all.filter((item) => {
        const phase = flightPhases.find((p) => p.id === phaseId);
        return phase ? phase.name === item.phaseName : true;
      })
    : all;
  return shuffle(filtered).map((item) => ({
    id: item.id,
    action: item.action,
    value: item.value,
    condition: item.condition,
    role: item.role,
    options: optionsFor(item.roleLabeling),
    phaseName: item.phaseName,
    sectionTitle: item.sectionTitle,
  }));
}

function optionsFor(labeling: RoleLabeling): CrewRole[] {
  return labeling === "CM1_CM2" ? ["CM1", "CM2"] : ["PF", "PM"];
}

function roleDescription(role: CrewRole): string {
  switch (role) {
    case "CM1":
      return "Commander (LH seat)";
    case "CM2":
      return "Co-pilot (RH seat)";
    case "PF":
      return "Pilot Flying";
    case "PM":
      return "Pilot Monitoring";
    default:
      return "Both pilots";
  }
}

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phaseId?: string }>();
  const phaseId = params.phaseId;
  const phase = useMemo(
    () => flightPhases.find((p) => p.id === phaseId),
    [phaseId],
  );
  const initialQuestions = useMemo(() => buildQuestions(phaseId), [phaseId]);

  // Cap the quiz to 10 questions for a focused session
  const QUIZ_LENGTH = Math.min(10, initialQuestions.length);
  const [questions, setQuestions] = useState<Question[]>(() =>
    initialQuestions.slice(0, QUIZ_LENGTH),
  );
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<CrewRole | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[qIdx];
  const total = questions.length;
  const isCorrect = revealed && selected === q?.role;

  const handleSelect = useCallback(
    (role: CrewRole) => {
      if (revealed) return;
      setSelected(role);
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      }
    },
    [revealed],
  );

  const handleSubmit = useCallback(() => {
    if (selected === null || !q) return;
    const correct = selected === q.role;
    setRevealed(true);
    setAnswers((a) => [...a, correct]);
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(
        correct
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
    }
  }, [selected, q]);

  const handleNext = useCallback(() => {
    if (qIdx + 1 >= total) {
      const correctCount = answers.filter(Boolean).length;
      const pct = (correctCount / total) * 100;
      savePhaseResult(phaseId ?? "_global", pct);
      setFinished(true);
      return;
    }
    setQIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }, [qIdx, total, answers, phaseId]);

  const handleRetry = useCallback(() => {
    const fresh = buildQuestions(phaseId).slice(0, QUIZ_LENGTH);
    setQuestions(fresh);
    setQIdx(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setFinished(false);
  }, [phaseId, QUIZ_LENGTH]);

  if (!q && !finished) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: iOS.bg }}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No questions available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <ResultsScreen
        phaseName={phase?.name ?? "Mixed phases"}
        answers={answers}
        onRetry={handleRetry}
        onHome={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: iOS.bg }}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeBtn,
            pressed && { transform: [{ scale: 0.94 }] },
          ]}
          hitSlop={12}
        >
          <IconSymbol
            name="xmark"
            size={12}
            color={iOS.label}
            weight="semibold"
            style={{ width: 12, height: 12 }}
          />
        </Pressable>
        <View style={styles.pillRow}>
          {questions.map((_, i) => {
            let bg: string = iOS.fill3;
            if (i < qIdx) bg = answers[i] ? iOS.green : iOS.red;
            else if (i === qIdx)
              bg = revealed ? (isCorrect ? iOS.green : iOS.red) : iOS.label;
            return <View key={i} style={[styles.pill, { backgroundColor: bg }]} />;
          })}
        </View>
        <Text style={styles.counter}>
          {qIdx + 1}/{total}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase chip */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <View style={styles.chipDot} />
            <Text style={styles.chipText}>
              {q.phaseName} · {q.sectionTitle}
            </Text>
          </View>
        </View>

        {/* Question */}
        <Animated.View
          key={`q-${qIdx}`}
          entering={FadeInDown.duration(320).easing(
            Easing.out(Easing.cubic),
          )}
          style={styles.questionBlock}
        >
          <Text style={styles.questionAction}>{q.action}</Text>
          {q.value ? <Text style={styles.questionValue}>{q.value}</Text> : null}
          {q.condition ? (
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{q.condition}</Text>
            </View>
          ) : null}
          <Text style={styles.prompt}>Who performs this action?</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.options}>
          {q.options.map((role, i) => {
            const isSel = selected === role;
            const isAns = role === q.role;
            let bg: string = iOS.bgSecondary;
            let border: string = "transparent";
            let labelColor: string = iOS.label;
            let bubbleBg: string = iOS.fill3;
            let bubbleColor: string = iOS.label;
            let reveal: "ok" | "no" | null = null;

            if (revealed) {
              if (isAns) {
                bg = "rgba(48,209,88,0.15)";
                border = iOS.green;
                bubbleBg = iOS.green;
                bubbleColor = "#fff";
                reveal = "ok";
              } else if (isSel) {
                bg = "rgba(255,69,58,0.12)";
                border = iOS.red;
                bubbleBg = iOS.red;
                bubbleColor = "#fff";
                reveal = "no";
              } else {
                labelColor = iOS.label2;
              }
            } else if (isSel) {
              bg = "rgba(10,132,255,0.15)";
              border = iOS.blue;
              bubbleBg = iOS.blue;
              bubbleColor = "#fff";
            }

            return (
              <Pressable
                key={role}
                onPress={() => handleSelect(role)}
                disabled={revealed}
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: bg,
                    borderColor: border,
                    transform: [
                      { scale: pressed && !revealed ? 0.98 : 1 },
                    ],
                  },
                ]}
              >
                <View
                  style={[styles.optionBubble, { backgroundColor: bubbleBg }]}
                >
                  <Text
                    style={[styles.optionBubbleText, { color: bubbleColor }]}
                  >
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.optionLabel, { color: labelColor }]}>
                    {role}
                  </Text>
                  <Text style={styles.optionSubtitle}>
                    {roleDescription(role)}
                  </Text>
                </View>
                {reveal === "ok" && (
                  <Animated.View entering={ZoomIn.duration(280)}>
                    <IconSymbol
                      name="checkmark.circle.fill"
                      size={22}
                      color={iOS.green}
                      weight="semibold"
                      style={{ width: 22, height: 22 }}
                    />
                  </Animated.View>
                )}
                {reveal === "no" && (
                  <Animated.View entering={ZoomIn.duration(280)}>
                    <IconSymbol
                      name="xmark.circle.fill"
                      size={22}
                      color={iOS.red}
                      weight="semibold"
                      style={{ width: 22, height: 22 }}
                    />
                  </Animated.View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Explanation */}
        {revealed && (
          <Animated.View
            entering={FadeInUp.duration(260)}
            style={styles.explanation}
          >
            <View style={styles.explanationHeader}>
              <IconSymbol
                name={
                  isCorrect
                    ? "checkmark.circle.fill"
                    : "xmark.circle.fill"
                }
                size={18}
                color={isCorrect ? iOS.green : iOS.red}
                weight="semibold"
                style={{ width: 18, height: 18 }}
              />
              <Text
                style={[
                  styles.explanationTitle,
                  { color: isCorrect ? iOS.green : iOS.red },
                ]}
              >
                {isCorrect ? "Correct" : "Not quite"}
              </Text>
            </View>
            <Text style={styles.explanationBody}>
              {isCorrect
                ? `${q.role} performs this action — ${roleDescription(q.role)}.`
                : `The correct role is ${q.role} — ${roleDescription(q.role)}.`}
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaWrap}>
        {!revealed ? (
          <Pressable
            onPress={handleSubmit}
            disabled={selected === null}
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: selected !== null ? iOS.blue : iOS.fill3,
                transform: [
                  { scale: pressed && selected !== null ? 0.98 : 1 },
                ],
              },
            ]}
          >
            <Text
              style={[
                styles.ctaText,
                { color: selected !== null ? "#fff" : iOS.label3 },
              ]}
            >
              Check Answer
            </Text>
          </Pressable>
        ) : (
          <Animated.View entering={FadeIn.duration(200)}>
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.cta,
                {
                  backgroundColor: iOS.blue,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text style={[styles.ctaText, { color: "#fff" }]}>
                {qIdx + 1 >= total ? "See Results" : "Next Question"}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ───────────── Results Screen ─────────────
function ResultsScreen({
  phaseName,
  answers,
  onRetry,
  onHome,
}: {
  phaseName: string;
  answers: boolean[];
  onRetry: () => void;
  onHome: () => void;
}) {
  const correct = answers.filter(Boolean).length;
  const total = answers.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 70;
  const tint = passed ? iOS.green : iOS.orange;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: iOS.bg }}
    >
      <View style={styles.resultsTopBar}>
        <Pressable
          onPress={onHome}
          style={({ pressed }) => [
            styles.closeBtn,
            pressed && { transform: [{ scale: 0.94 }] },
          ]}
          hitSlop={12}
        >
          <IconSymbol
            name="xmark"
            size={12}
            color={iOS.label}
            weight="semibold"
            style={{ width: 12, height: 12 }}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.resultsScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ringWrap}>
          <Svg
            width={180}
            height={180}
            viewBox="0 0 180 180"
            style={{ transform: [{ rotate: "-90deg" }] }}
          >
            <Circle
              cx={90}
              cy={90}
              r={radius}
              stroke={iOS.fill4}
              strokeWidth={12}
              fill="none"
            />
            <AnimatedRing
              radius={radius}
              circumference={circumference}
              tint={tint}
              pct={pct}
            />
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringValue}>{pct}</Text>
            <Text style={styles.ringUnit}>percent</Text>
          </View>
        </View>

        <Animated.Text
          entering={FadeIn.duration(400).delay(200)}
          style={styles.resultsTitle}
        >
          {passed ? "Nice work!" : "Keep practicing"}
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.duration(400).delay(280)}
          style={styles.resultsSubtitle}
        >
          {correct} of {total} correct · {phaseName}
        </Animated.Text>

        <View style={styles.answersWrap}>
          <Text style={styles.answersHeader}>YOUR ANSWERS</Text>
          <View style={styles.answersGrid}>
            {answers.map((c, i) => (
              <Animated.View
                key={i}
                entering={FadeIn.duration(240).delay(300 + i * 40)}
                style={[
                  styles.answerTile,
                  {
                    backgroundColor: c
                      ? "rgba(48,209,88,0.18)"
                      : "rgba(255,69,58,0.18)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.answerTileText,
                    { color: c ? iOS.green : iOS.red },
                  ]}
                >
                  {i + 1}
                </Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.resultsCtaStack}>
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: iOS.blue,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={[styles.ctaText, { color: "#fff" }]}>Try Again</Text>
        </Pressable>
        <Pressable
          onPress={onHome}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: iOS.fill3,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={[styles.ctaText, { color: iOS.label }]}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function AnimatedRing({
  radius,
  circumference,
  tint,
  pct,
}: {
  radius: number;
  circumference: number;
  tint: string;
  pct: number;
}) {
  const offset = useSharedValue(circumference);

  React.useEffect(() => {
    offset.value = withTiming(circumference * (1 - pct / 100), {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [pct, circumference, offset]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.value,
  }));

  return (
    <AnimatedCircle
      cx={90}
      cy={90}
      r={radius}
      stroke={tint}
      strokeWidth={12}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={`${circumference} ${circumference}`}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: iOS.label2,
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: iOS.fill3,
    alignItems: "center",
    justifyContent: "center",
  },
  pillRow: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  pill: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  counter: {
    fontSize: 15,
    fontWeight: "600",
    color: iOS.label2,
    letterSpacing: -0.24,
    fontVariant: ["tabular-nums"],
    minWidth: 38,
    textAlign: "right",
  },
  scroll: {
    paddingBottom: 40,
  },
  chipRow: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    flexDirection: "row",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(10,132,255,0.15)",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: iOS.blue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: iOS.blue,
    letterSpacing: -0.08,
  },
  questionBlock: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  questionAction: {
    fontSize: 24,
    fontWeight: "700",
    color: iOS.label,
    letterSpacing: 0.35,
    lineHeight: 30,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  questionValue: {
    fontSize: 18,
    fontWeight: "600",
    color: iOS.blue,
    letterSpacing: -0.3,
    marginTop: 6,
  },
  conditionBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,214,10,0.18)",
    marginTop: 10,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: "600",
    color: iOS.yellow,
    letterSpacing: -0.08,
  },
  prompt: {
    fontSize: 15,
    color: iOS.label2,
    letterSpacing: -0.24,
    marginTop: 14,
  },
  options: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 15,
  },
  optionBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionBubbleText: {
    fontSize: 13,
    fontWeight: "700",
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: iOS.label2,
    letterSpacing: -0.08,
    marginTop: 1,
  },
  explanation: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    backgroundColor: iOS.bgSecondary,
    borderRadius: 14,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.24,
  },
  explanationBody: {
    fontSize: 15,
    color: iOS.label2,
    letterSpacing: -0.24,
    lineHeight: 20,
  },
  ctaWrap: {
    padding: 16,
    paddingBottom: 8,
  },
  cta: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.43,
  },
  resultsTopBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  resultsScroll: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  ringWrap: {
    width: 180,
    height: 180,
    marginTop: 20,
    marginBottom: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringValue: {
    fontSize: 54,
    fontWeight: "700",
    color: iOS.label,
    letterSpacing: -1,
    lineHeight: 54,
    fontVariant: ["tabular-nums"],
  },
  ringUnit: {
    fontSize: 17,
    color: iOS.label2,
    letterSpacing: -0.43,
    marginTop: 2,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: iOS.label,
    letterSpacing: 0.38,
    lineHeight: 32,
    marginBottom: 6,
    textAlign: "center",
  },
  resultsSubtitle: {
    fontSize: 17,
    color: iOS.label2,
    letterSpacing: -0.43,
    marginBottom: 30,
    textAlign: "center",
  },
  answersWrap: {
    width: "100%",
    paddingHorizontal: 0,
    marginBottom: 18,
  },
  answersHeader: {
    fontSize: 13,
    color: iOS.label2,
    letterSpacing: -0.08,
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  answersGrid: {
    backgroundColor: iOS.bgSecondary,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  answerTile: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  answerTileText: {
    fontSize: 15,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  resultsCtaStack: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
});
