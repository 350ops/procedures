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

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          A350 Procedures
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Training & Flow Practice
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push("/tasksharing")}
        activeOpacity={0.7}
      >
        <View style={[styles.cardIcon, { backgroundColor: colors.accentBg }]}>
          <Text style={styles.cardEmoji}>👥</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Task Sharing
          </Text>
          <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
            FCOM crew duties by flight phase — Browse, Practice, Quiz
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push("/flowsimulator")}
        activeOpacity={0.7}
      >
        <View style={[styles.cardIcon, { backgroundColor: colors.flowBg }]}>
          <Text style={styles.cardEmoji}>✈️</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Flow Simulator
          </Text>
          <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
            Tutorial slides — Browse extracted content & practice flows
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => router.push("/flightgame")}
        activeOpacity={0.7}
      >
        <View style={[styles.cardIcon, { backgroundColor: colors.gameBg }]}>
          <Text style={styles.cardEmoji}>🕹️</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Flight Game
          </Text>
          <Text style={[styles.cardDesc, { color: colors.secondaryText }]}>
            Two-finger PFD flying — left thrust, right sidestick
          </Text>
        </View>
        <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const lightColors = {
  bg: "#f2f2f7",
  card: "#ffffff",
  text: "#000000",
  secondaryText: "#8e8e93",
  accentBg: "#E3F0FF",
  flowBg: "#FFF3E0",
  gameBg: "#E8F5E9",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  accentBg: "#1a2a3a",
  flowBg: "#3a2a1a",
  gameBg: "#1a3a20",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 17,
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  cardDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    marginLeft: 8,
  },
});
