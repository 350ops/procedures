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
import { flowTopics, getTopicPageCount } from "@/data/flowsimulator";

export default function FlowTopicListScreen() {
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
            router.push({ pathname: "/flowsimulator/practice" })
          }
        >
          <Text style={styles.modeButtonIcon}>{"  "}</Text>
          <Text style={[styles.modeButtonText, { color: "#fff" }]}>
            Practice
          </Text>
          <Text
            style={[styles.modeButtonSub, { color: "rgba(255,255,255,0.7)" }]}
          >
            Tap to reveal steps
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>
        TUTORIAL TOPICS
      </Text>

      {flowTopics.map((topic, index) => {
        const pageCount = getTopicPageCount(topic);
        return (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.topicRow,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.separator,
                borderBottomWidth:
                  index < flowTopics.length - 1
                    ? StyleSheet.hairlineWidth
                    : 0,
              },
            ]}
            onPress={() =>
              router.push({
                pathname: "/flowsimulator/viewer",
                params: { topicId: topic.id },
              })
            }
            activeOpacity={0.6}
          >
            <View
              style={[styles.topicIcon, { backgroundColor: colors.iconBg }]}
            >
              <Text style={[styles.topicNumber, { color: colors.accent }]}>
                {index + 1}
              </Text>
            </View>
            <View style={styles.topicInfo}>
              <Text style={[styles.topicName, { color: colors.text }]}>
                {topic.name}
              </Text>
              <Text
                style={[styles.topicMeta, { color: colors.secondaryText }]}
              >
                {pageCount} slides · {topic.description}
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
  iconBg: "#e8e8ed",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  separator: "#38383a",
  accent: "#0A84FF",
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
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  topicIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  topicNumber: {
    fontSize: 15,
    fontWeight: "700",
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 16,
    fontWeight: "500",
  },
  topicMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    marginLeft: 8,
  },
});
