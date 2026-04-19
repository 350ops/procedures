import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { flightPhases, getPhaseStats } from "@/data/tasksharing";
import { iOS, type PhaseProgress } from "./quizDesign";
import { readProgress } from "./quizProgress";

const liquidGlass = Platform.OS === "ios" && isLiquidGlassAvailable();

export default function PhaseListScreen() {
  const router = useRouter();
  const [progress, setProgress] = React.useState<Record<string, PhaseProgress>>(
    {},
  );

  React.useEffect(() => {
    readProgress().then(setProgress);
  }, []);

  const phases = useMemo(() => flightPhases, []);
  const totalQuestions = useMemo(
    () => phases.reduce((n, p) => n + getPhaseStats(p).total, 0),
    [phases],
  );

  const phaseEntries = Object.entries(progress).filter(
    ([k]) => !k.startsWith("_"),
  );
  const mastered = phaseEntries.filter(([, p]) => p.best === 1).length;
  const avg =
    phaseEntries.length > 0
      ? Math.round(
          (phaseEntries.reduce((s, [, p]) => s + p.best, 0) /
            phaseEntries.length) *
            100,
        )
      : 0;

  // Pick the first "useful" phase for the daily challenge — first non-trivial phase
  const daily = phases.find((p) => getPhaseStats(p).total >= 5) ?? phases[0];
  const dailyStats = getPhaseStats(daily);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: iOS.bg }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Back row */}
        <Pressable
          style={styles.backRow}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <SymbolView
            name="chevron.left"
            size={18}
            tintColor={iOS.blue}
            weight="semibold"
            resizeMode="scaleAspectFit"
            style={{ width: 11, height: 18 }}
          />
          <Text style={styles.backText}>A350</Text>
        </Pressable>

        {/* Large title */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Quiz</Text>
          <Text style={styles.subtitle}>
            Test your knowledge on flight procedures.
          </Text>
        </View>

        {/* Daily challenge */}
        <View style={styles.heroWrap}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/tasksharing/quiz",
                params: { phaseId: daily.id },
              })
            }
            style={({ pressed }) => [
              styles.hero,
              pressed && { transform: [{ scale: 0.985 }] },
            ]}
          >
            <View style={styles.heroHeader}>
              <SymbolView
                name="sparkles"
                size={16}
                tintColor="#fff"
                weight="semibold"
                resizeMode="scaleAspectFit"
                style={{ width: 16, height: 16 }}
              />
              <Text style={styles.heroKicker}>DAILY CHALLENGE</Text>
            </View>
            <Text style={styles.heroTitle}>{daily.name}</Text>
            <Text style={styles.heroMeta}>
              {dailyStats.total} questions · ~
              {Math.max(2, Math.round(dailyStats.total * 0.5))} min
            </Text>
            <View style={styles.heroFooter}>
              <View style={styles.heroDots}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.heroDot,
                      {
                        backgroundColor:
                          i < Math.round((progress[daily.id]?.best ?? 0) * 6)
                            ? "#fff"
                            : "rgba(255,255,255,0.3)",
                      },
                    ]}
                  />
                ))}
              </View>
              {liquidGlass ? (
                <GlassView
                  glassEffectStyle="regular"
                  tintColor="rgba(255,255,255,0.25)"
                  colorScheme="dark"
                  style={styles.heroPill}
                >
                  <Text style={styles.heroPillText}>Start</Text>
                </GlassView>
              ) : (
                <View style={[styles.heroPill, styles.heroPillFallback]}>
                  <Text style={styles.heroPillText}>Start</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            symbol="flag.fill"
            tint={iOS.orange}
            value={String(progress["_streak"]?.best ?? 0)}
            label="Streak"
          />
          <StatCard
            symbol="checkmark.circle.fill"
            tint={iOS.green}
            value={String(mastered)}
            label="Mastered"
          />
          <StatCard
            symbol="chart.bar.fill"
            tint={iOS.purple}
            value={`${avg}%`}
            label="Avg"
          />
        </View>

        {/* Section header */}
        <Text style={styles.sectionHeader}>FLIGHT PHASES</Text>

        {/* Grouped list */}
        <View style={styles.group}>
          {phases.map((phase, i) => {
            const stats = getPhaseStats(phase);
            const pr = progress[phase.id];
            const roleLabel =
              phase.sections[0]?.roleLabeling === "CM1_CM2"
                ? "CM1 / CM2"
                : "PF / PM";
            return (
              <PhaseRow
                key={phase.id}
                index={i + 1}
                name={phase.name}
                count={stats.total}
                crew={roleLabel}
                progress={pr?.best}
                isLast={i === phases.length - 1}
                onPress={() =>
                  router.push({
                    pathname: "/tasksharing/quiz",
                    params: { phaseId: phase.id },
                  })
                }
                onLongPress={() =>
                  router.push({
                    pathname: "/tasksharing/browse",
                    params: { phaseId: phase.id },
                  })
                }
              />
            );
          })}
        </View>

        {/* Secondary modes */}
        <Text style={styles.sectionHeader}>OTHER MODES</Text>
        <View style={styles.group}>
          <ModeRow
            symbol="rectangle.stack.fill"
            tint={iOS.blue}
            title="Practice"
            subtitle="Tap-to-reveal flashcards"
            onPress={() => router.push("/tasksharing/practice")}
          />
          <ModeRow
            symbol="list.bullet"
            tint={iOS.purple}
            title="Browse"
            subtitle="Full procedure reference"
            isLast
            onPress={() =>
              router.push({
                pathname: "/tasksharing/browse",
                params: { phaseId: phases[0].id },
              })
            }
          />
        </View>

        <Text style={styles.footNote}>
          {totalQuestions} questions · Source: FCOM PRO-NOR-TSK
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  symbol,
  tint,
  value,
  label,
}: {
  symbol: string;
  tint: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <SymbolView
        name={symbol as any}
        size={18}
        tintColor={tint}
        weight="semibold"
        resizeMode="scaleAspectFit"
        style={{ width: 18, height: 18, marginBottom: 8 }}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function PhaseRow({
  index,
  name,
  count,
  crew,
  progress,
  isLast,
  onPress,
  onLongPress,
}: {
  index: number;
  name: string;
  count: number;
  crew: string;
  progress?: number;
  isLast: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const pct =
    typeof progress === "number" ? Math.round(progress * 100) : null;
  const complete = progress === 1;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.phaseRow,
        pressed && { backgroundColor: iOS.fill4 },
      ]}
    >
      <View
        style={[
          styles.phaseBadge,
          {
            backgroundColor: complete ? iOS.green : iOS.fill3,
          },
        ]}
      >
        {complete ? (
          <SymbolView
            name="checkmark"
            size={14}
            tintColor="#fff"
            weight="bold"
            resizeMode="scaleAspectFit"
            style={{ width: 14, height: 14 }}
          />
        ) : (
          <Text style={styles.phaseBadgeText}>{index}</Text>
        )}
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={styles.phaseName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </Text>
        <View style={styles.phaseMeta}>
          <Text style={styles.phaseMetaText}>{count} questions</Text>
          <View style={styles.dotSep} />
          <Text style={styles.phaseMetaText}>{crew}</Text>
        </View>
        {pct !== null && !complete && (
          <View style={styles.progressLine}>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${pct}%` }]}
              />
            </View>
            <Text style={styles.progressPct}>{pct}%</Text>
          </View>
        )}
      </View>

      <SymbolView
        name="chevron.right"
        size={13}
        tintColor={iOS.label3}
        weight="semibold"
        resizeMode="scaleAspectFit"
        style={{ width: 8, height: 13 }}
      />

      {!isLast && <View style={styles.rowSeparator} />}
    </Pressable>
  );
}

function ModeRow({
  symbol,
  tint,
  title,
  subtitle,
  isLast,
  onPress,
}: {
  symbol: string;
  tint: string;
  title: string;
  subtitle: string;
  isLast?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.modeRow,
        pressed && { backgroundColor: iOS.fill4 },
      ]}
    >
      <View style={[styles.modeIcon, { backgroundColor: `${tint}26` }]}>
        <SymbolView
          name={symbol as any}
          size={18}
          tintColor={tint}
          weight="semibold"
          resizeMode="scaleAspectFit"
          style={{ width: 18, height: 18 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.modeTitle}>{title}</Text>
        <Text style={styles.modeSubtitle}>{subtitle}</Text>
      </View>
      <SymbolView
        name="chevron.right"
        size={13}
        tintColor={iOS.label3}
        weight="semibold"
        resizeMode="scaleAspectFit"
        style={{ width: 8, height: 13 }}
      />
      {!isLast && <View style={styles.rowSeparator} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOS.bg,
  },
  content: {
    paddingBottom: 40,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backText: {
    color: iOS.blue,
    fontSize: 17,
    letterSpacing: -0.43,
  },
  titleBlock: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: iOS.label,
    letterSpacing: 0.37,
    lineHeight: 41,
  },
  subtitle: {
    fontSize: 17,
    color: iOS.label2,
    letterSpacing: -0.43,
    marginTop: 4,
  },
  heroWrap: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  hero: {
    backgroundColor: iOS.blue,
    borderRadius: 20,
    padding: 22,
    shadowColor: iOS.blue,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.4,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroMeta: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: -0.24,
    marginBottom: 18,
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroDots: {
    flexDirection: "row",
    gap: 4,
  },
  heroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  heroPill: {
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  heroPillFallback: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  heroPillText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -0.24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: iOS.bgSecondary,
    borderRadius: 14,
    padding: 14,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: iOS.label,
    letterSpacing: 0.35,
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 12,
    color: iOS.label2,
    letterSpacing: -0.08,
    marginTop: 3,
  },
  sectionHeader: {
    fontSize: 13,
    color: iOS.label2,
    letterSpacing: -0.08,
    textTransform: "uppercase",
    fontWeight: "400",
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 6,
  },
  group: {
    marginHorizontal: 16,
    backgroundColor: iOS.bgSecondary,
    borderRadius: 14,
    overflow: "hidden",
  },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  phaseBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseBadgeText: {
    fontSize: 15,
    fontWeight: "600",
    color: iOS.label,
    letterSpacing: -0.2,
  },
  phaseName: {
    fontSize: 17,
    fontWeight: "400",
    color: iOS.label,
    letterSpacing: -0.43,
    lineHeight: 21,
  },
  phaseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  phaseMetaText: {
    fontSize: 13,
    color: iOS.label2,
    letterSpacing: -0.08,
  },
  dotSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: iOS.label3,
  },
  progressLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: iOS.fill3,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: iOS.blue,
    borderRadius: 1.5,
  },
  progressPct: {
    fontSize: 12,
    color: iOS.label2,
    fontWeight: "500",
    letterSpacing: -0.08,
    fontVariant: ["tabular-nums"],
  },
  rowSeparator: {
    position: "absolute",
    bottom: 0,
    left: 60,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: iOS.separator,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modeTitle: {
    fontSize: 17,
    fontWeight: "400",
    color: iOS.label,
    letterSpacing: -0.43,
  },
  modeSubtitle: {
    fontSize: 13,
    color: iOS.label2,
    letterSpacing: -0.08,
    marginTop: 2,
  },
  footNote: {
    textAlign: "center",
    fontSize: 12,
    color: iOS.label3,
    letterSpacing: -0.08,
    paddingVertical: 24,
  },
});
