import React from "react";
import {
  GestureResponderEvent,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

interface Props {
  onInput: (next: {
    pitch?: number;
    roll?: number;
    speed?: number;
    ball?: number;
  }) => void;
}

function clamp(value: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export default function PfdControls({ onInput }: Props) {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  const attitudeResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_evt, gesture) => {
      onInput({
        roll: clamp(gesture.dx / 80),
        pitch: clamp(-gesture.dy / 80),
      });
    },
    onPanResponderRelease: () => {
      onInput({ roll: 0, pitch: 0 });
    },
  });

  const ballResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_evt, gesture) => {
      onInput({ ball: clamp(gesture.dx / 120) });
    },
    onPanResponderRelease: () => onInput({ ball: 0 }),
  });

  const nudge = (direction: number) => (_evt: GestureResponderEvent) => {
    onInput({ speed: direction });
    setTimeout(() => onInput({ speed: 0 }), 120);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.pad, { backgroundColor: colors.card, borderColor: colors.border }]}
        {...attitudeResponder.panHandlers}
      >
        <Text style={[styles.padTitle, { color: colors.secondary }]}>Attitude Pad</Text>
        <Text style={[styles.padHelp, { color: colors.text }]}>Drag to control pitch/roll</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.speedBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={nudge(1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.speedLabel, { color: colors.text }]}>Speed +</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.speedBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={nudge(-1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.speedLabel, { color: colors.text }]}>Speed -</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.padSmall, { backgroundColor: colors.card, borderColor: colors.border }]}
        {...ballResponder.panHandlers}
      >
        <Text style={[styles.padTitle, { color: colors.secondary }]}>Slip Ball Pad</Text>
        <Text style={[styles.padHelp, { color: colors.text }]}>Drag left/right to center</Text>
      </View>
    </View>
  );
}

const lightColors = {
  card: "#ffffff",
  text: "#111111",
  secondary: "#6d7280",
  border: "#e3e3e8",
};

const darkColors = {
  card: "#1c1c1e",
  text: "#ffffff",
  secondary: "#8e8e93",
  border: "#2f2f33",
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  pad: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 82,
    padding: 12,
    justifyContent: "center",
  },
  padSmall: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 70,
    padding: 12,
    justifyContent: "center",
  },
  padTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  padHelp: {
    fontSize: 14,
    marginTop: 3,
    fontWeight: "500",
  },
  speedBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  speedLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
