import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { getTopicById, getTopicPageCount, parseFlowSteps } from "@/data/flowsimulator";
import { usePdfExtraction } from "@/hooks/usePdfExtraction";

interface Props {
  topicId: string;
}

export default function FlowViewerScreen({ topicId }: Props) {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  const topic = getTopicById(topicId);
  const startPage = topic?.startPage ?? 1;
  const endPage = topic?.endPage ?? 1;

  const { pages, loading, progress, error, totalPages, extractedCount, available } =
    usePdfExtraction(startPage, endPage);

  const [currentPageIdx, setCurrentPageIdx] = useState(0);

  const currentPage = pages[currentPageIdx];
  const steps = useMemo(
    () => (currentPage ? parseFlowSteps(currentPage.text) : []),
    [currentPage]
  );

  if (!topic) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.text, padding: 20 }}>Topic not found</Text>
      </View>
    );
  }

  // Not available (Expo Go)
  if (!available) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorIcon]}>⚠️</Text>
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

  // Loading state with progress
  if (loading && pages.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Extracting slides...
        </Text>
        <Text style={[styles.progressText, { color: colors.secondaryText }]}>
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

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.bg }]}>
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Extraction Error
        </Text>
        <Text style={[styles.errorText, { color: colors.secondaryText }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Page header */}
      <View style={[styles.pageHeader, { backgroundColor: colors.card }]}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>
          Slide {currentPage?.pageNumber ?? "—"}
        </Text>
        <Text style={[styles.pageSubtitle, { color: colors.secondaryText }]}>
          {currentPageIdx + 1} of {pages.length} pages
          {loading && ` (extracting ${extractedCount}/${totalPages}...)`}
        </Text>
      </View>

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {steps.length > 0 ? (
          steps.map((step) => (
            <View
              key={step.id}
              style={[
                styles.stepRow,
                {
                  backgroundColor: colors.card,
                  borderBottomColor: colors.separator,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={[styles.stepBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.stepBadgeText}>{step.order}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepAction, { color: colors.text }]}>
                  {step.action}
                </Text>
                {step.detail ? (
                  <Text style={[styles.stepDetail, { color: colors.valueText }]}>
                    {step.detail}
                  </Text>
                ) : null}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {currentPage?.text
                ? "No structured steps found on this slide."
                : "No text content on this slide."}
            </Text>
            {currentPage?.text ? (
              <View style={[styles.rawTextBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.rawText, { color: colors.text }]}>
                  {currentPage.text}
                </Text>
              </View>
            ) : null}
          </View>
        )}
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
          onPress={() => setCurrentPageIdx((i) => i - 1)}
          disabled={currentPageIdx === 0}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color: currentPageIdx === 0 ? colors.secondaryText : colors.accent,
              },
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        <Text style={[styles.pageCounter, { color: colors.secondaryText }]}>
          {currentPageIdx + 1} / {pages.length}
        </Text>
        <TouchableOpacity
          onPress={() => setCurrentPageIdx((i) => i + 1)}
          disabled={currentPageIdx >= pages.length - 1}
          style={styles.navButton}
        >
          <Text
            style={[
              styles.navButtonText,
              {
                color:
                  currentPageIdx >= pages.length - 1
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
};

const darkColors = {
  bg: "#000000",
  card: "#1c1c1e",
  text: "#ffffff",
  secondaryText: "#8e8e93",
  separator: "#38383a",
  accent: "#0A84FF",
  valueText: "#0A84FF",
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
  progressText: {
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
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
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
  emptyState: {
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 12,
  },
  rawTextBox: {
    borderRadius: 10,
    padding: 16,
  },
  rawText: {
    fontSize: 13,
    fontFamily: "Menlo",
    lineHeight: 20,
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
  pageCounter: {
    fontSize: 14,
    fontWeight: "500",
  },
});
