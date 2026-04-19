import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { flightPhases } from "@/data/tasksharing";

interface Props {
  phaseId: string;
}

export default function BrowseScreen({ phaseId }: Props) {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;
  const phase = flightPhases.find((p) => p.id === phaseId);

  if (!phase) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.text, padding: 20 }}>Phase not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentInsetAdjustmentBehavior="automatic"
    >
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

            {/* Column headers */}
            <View
              style={[
                styles.headerRow,
                { backgroundColor: colors.headerBg },
              ]}
            >
              <View style={styles.roleColumn}>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: colors.leftBadge },
                  ]}
                >
                  <Text style={styles.roleBadgeText}>{leftLabel}</Text>
                </View>
              </View>
              <View style={styles.actionColumn}>
                <Text
                  style={[
                    styles.headerActionText,
                    { color: colors.secondaryText },
                  ]}
                >
                  ACTION
                </Text>
              </View>
              <View style={styles.roleColumn}>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: colors.rightBadge },
                  ]}
                >
                  <Text style={styles.roleBadgeText}>{rightLabel}</Text>
                </View>
              </View>
            </View>

            {/* Task items */}
            {section.items.map((item, idx) => {
              const isLeft =
                item.role === "CM1" ||
                item.role === "PF";
              const isRight =
                item.role === "CM2" ||
                item.role === "PM";
              const isBoth = item.role === "BOTH";

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
                  <View
                    style={[
                      styles.itemRow,
                      {
                        backgroundColor: colors.card,
                        borderBottomColor: colors.separator,
                        borderBottomWidth:
                          idx < section.items.length - 1
                            ? StyleSheet.hairlineWidth
                            : 0,
                      },
                    ]}
                  >
                    {/* Left indicator */}
                    <View style={styles.roleColumn}>
                      {(isLeft || isBoth) && (
                        <View
                          style={[
                            styles.roleIndicator,
                            {
                              backgroundColor: isBoth
                                ? colors.bothBadge
                                : colors.leftBadge,
                            },
                          ]}
                        >
                          <Text style={styles.roleIndicatorText}>
                            {isBoth ? "●" : "●"}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Action + Value */}
                    <View style={styles.actionColumn}>
                      <Text
                        style={[styles.actionText, { color: colors.text }]}
                        numberOfLines={2}
                      >
                        {item.action}
                      </Text>
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

                    {/* Right indicator */}
                    <View style={styles.roleColumn}>
                      {(isRight || isBoth) && (
                        <View
                          style={[
                            styles.roleIndicator,
                            {
                              backgroundColor: isBoth
                                ? colors.bothBadge
                                : colors.rightBadge,
                            },
                          ]}
                        >
                          <Text style={styles.roleIndicatorText}>●</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
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
  headerBg: "#e8e8ed",
  leftBadge: "#007AFF",
  rightBadge: "#FF9500",
  bothBadge: "#34C759",
  valueText: "#007AFF",
  conditionBg: "#fff3cd",
  conditionText: "#856404",
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  separator: "#38383a",
  headerBg: "#2c2c2e",
  leftBadge: "#0A84FF",
  rightBadge: "#FF9F0A",
  bothBadge: "#30D158",
  valueText: "#0A84FF",
  conditionBg: "#3a3000",
  conditionText: "#FFD60A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  headerActionText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textAlign: "center",
  },
  roleColumn: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  actionColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 48,
  },
  roleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  roleIndicatorText: {
    fontSize: 6,
    color: "transparent",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Menlo",
  },
  valueText: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
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
