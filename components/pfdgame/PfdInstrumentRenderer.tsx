import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GameState } from "@/data/pfdgame";

interface Props {
  state: GameState;
  quality: number;
  theme: "light" | "dark";
}

export default function PfdInstrumentRenderer({ state, quality, theme }: Props) {
  const colors = theme === "dark" ? darkColors : lightColors;
  const playerX = useSharedValue(0);
  const playerY = useSharedValue(0);
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const ballX = useSharedValue(0);

  useEffect(() => {
    playerX.value = withTiming(state.player.roll * 60, { duration: 80 });
    playerY.value = withTiming(state.player.pitch * 40, { duration: 80 });
    targetX.value = withTiming(state.targets.roll * 60, { duration: 80 });
    targetY.value = withTiming(state.targets.pitch * 40, { duration: 80 });
    ballX.value = withTiming((state.player.ball - state.targets.ball) * 110, { duration: 80 });
  }, [ballX, playerX, playerY, state, targetX, targetY]);

  const playerCrosshair = useAnimatedStyle(() => ({
    transform: [{ translateX: playerX.value }, { translateY: playerY.value }],
  }));

  const targetDirector = useAnimatedStyle(() => ({
    transform: [{ translateX: targetX.value }, { translateY: targetY.value }],
  }));

  const ballStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: ballX.value }],
  }));

  const speedNow = Math.round(300 + state.player.speed * 40);
  const speedTarget = Math.round(300 + state.targets.speed * 40);
  const altNow = Math.round(28000 + state.player.pitch * 1200);
  const altTarget = Math.round(28000 + state.targets.pitch * 1200);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.tapeRow}>
        <View style={styles.tape}>
          <Text style={[styles.tapeLabel, { color: colors.secondary }]}>SPD</Text>
          <Text style={[styles.tapeValue, { color: colors.text }]}>{speedNow}</Text>
          <Text style={[styles.tapeTarget, { color: colors.accent }]}>TGT {speedTarget}</Text>
        </View>
        <View style={[styles.pfd, { backgroundColor: colors.horizonBg }]}>
          <Animated.View style={[styles.targetDirector, { borderColor: colors.accent }, targetDirector]} />
          <Animated.View style={[styles.playerCrosshair, { borderColor: colors.text }, playerCrosshair]} />
          <View style={[styles.midLine, { backgroundColor: colors.separator }]} />
        </View>
        <View style={styles.tape}>
          <Text style={[styles.tapeLabel, { color: colors.secondary }]}>ALT</Text>
          <Text style={[styles.tapeValue, { color: colors.text }]}>{altNow}</Text>
          <Text style={[styles.tapeTarget, { color: colors.accent }]}>TGT {altTarget}</Text>
        </View>
      </View>

      <View style={styles.ballArea}>
        <View style={[styles.ballTrack, { borderColor: colors.separator }]}>
          <Animated.View style={[styles.ball, { backgroundColor: colors.accent }, ballStyle]} />
        </View>
      </View>

      <View style={styles.meters}>
        <View style={styles.meterBlock}>
          <Text style={[styles.meterLabel, { color: colors.secondary }]}>Combo</Text>
          <Text style={[styles.meterValue, { color: colors.text }]}>
            {(state.comboMs / 1000).toFixed(1)}s
          </Text>
        </View>
        <View style={styles.meterBlock}>
          <Text style={[styles.meterLabel, { color: colors.secondary }]}>Quality</Text>
          <Text style={[styles.meterValue, { color: quality > 0.7 ? colors.ok : colors.warn }]}>
            {(quality * 100).toFixed(0)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const lightColors = {
  card: "#ffffff",
  text: "#111111",
  secondary: "#6d7280",
  accent: "#007AFF",
  separator: "#c6c6c8",
  border: "#e3e3e8",
  horizonBg: "#f5f7fb",
  ok: "#1b8f3f",
  warn: "#e08500",
};

const darkColors = {
  card: "#1c1c1e",
  text: "#ffffff",
  secondary: "#8e8e93",
  accent: "#0A84FF",
  separator: "#3c3c43",
  border: "#2f2f33",
  horizonBg: "#101113",
  ok: "#45c66f",
  warn: "#f4a340",
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  tapeRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },
  tape: {
    width: 84,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tapeLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  tapeValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  tapeTarget: {
    fontSize: 11,
    fontWeight: "600",
  },
  pfd: {
    flex: 1,
    minHeight: 170,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  targetDirector: {
    position: "absolute",
    width: 92,
    height: 56,
    borderWidth: 3,
    borderRadius: 4,
  },
  playerCrosshair: {
    position: "absolute",
    width: 48,
    height: 28,
    borderWidth: 3,
    borderRadius: 4,
  },
  midLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 2,
  },
  ballArea: {
    paddingHorizontal: 16,
  },
  ballTrack: {
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    overflow: "hidden",
  },
  ball: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  meters: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meterBlock: {
    flex: 1,
  },
  meterLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  meterValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
  },
});
