import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type {
  EcamEvent,
  EcamPage,
} from "@/components/flightcapacity/engine/types";
import FuelPage from "./FuelPage";
import HydPage from "./HydPage";

type Props = {
  clock: string;
  masterCaution: boolean;
  masterWarning: boolean;
  activePage: EcamPage;
  pendingEvent: EcamEvent | null;
  onPressMasterCaution: () => void;
  onPressMasterWarning: () => void;
  onSelectPage: (page: EcamPage) => void;
  onClear: () => void;
  onTakeSnapshot: () => void;
};

export default function EcamPanel({
  clock,
  masterCaution,
  masterWarning,
  activePage,
  pendingEvent,
  onPressMasterCaution,
  onPressMasterWarning,
  onSelectPage,
  onClear,
  onTakeSnapshot,
}: Props) {
  const showingSnapshotPrompt =
    pendingEvent &&
    pendingEvent.requestsSnapshot &&
    !pendingEvent.snapshotTaken &&
    activePage === pendingEvent.page;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.clock}>
          <Text style={styles.clockText}>{clock}</Text>
        </View>

        <View style={styles.masterRow}>
          <TouchableOpacity
            onPress={onPressMasterCaution}
            style={[styles.master, masterCaution && styles.masterActiveAmber]}
            activeOpacity={0.75}
          >
            <Text style={styles.masterText}>Master</Text>
            <Text style={styles.masterText}>Caution</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressMasterWarning}
            style={[
              styles.master,
              styles.masterWarning,
              masterWarning && styles.masterActiveRed,
            ]}
            activeOpacity={0.75}
          >
            <Text style={styles.masterText}>Master</Text>
            <Text style={styles.masterText}>Warning</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btnRow}>
          <PageButton
            label="HYD"
            active={activePage === "hyd"}
            onPress={() => onSelectPage("hyd")}
          />
          <PageButton
            label="FUEL"
            active={activePage === "fuel"}
            onPress={() => onSelectPage("fuel")}
          />
          <TouchableOpacity style={styles.pageBtn} onPress={onClear}>
            <Text style={styles.pageBtnText}>CLR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {showingSnapshotPrompt ? (
          <View style={styles.snapshot}>
            <Text style={styles.snapshotText}>
              Take a snapshot of {pendingEvent!.page.toUpperCase()} page
            </Text>
            <View style={styles.camFrameWrap}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
              <TouchableOpacity onPress={onTakeSnapshot} style={styles.camBtn}>
                <Text style={styles.camText}>◉</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : activePage === "fuel" ? (
          <FuelPage />
        ) : activePage === "hyd" ? (
          <HydPage />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>
    </View>
  );
}

function PageButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pageBtn, active && styles.pageBtnActive]}
      activeOpacity={0.8}
    >
      <Text style={styles.pageBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: "#000",
    borderLeftWidth: 2,
    borderLeftColor: "#000",
  },
  header: {
    backgroundColor: "#1f591b",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  clock: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#5b8de6",
    paddingHorizontal: 16,
    paddingVertical: 3,
  },
  clockText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
    fontFamily: "Courier",
    letterSpacing: 1,
  },
  masterRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 22,
  },
  master: {
    borderWidth: 3,
    borderColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 110,
    minHeight: 60,
  },
  masterWarning: {
    borderColor: "#ef4444",
  },
  masterActiveAmber: {
    backgroundColor: "#f0a020",
  },
  masterActiveRed: {
    backgroundColor: "#c81a15",
  },
  masterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 16,
  },
  pageBtn: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 4,
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtnActive: {
    backgroundColor: "#ffffff",
  },
  pageBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  body: {
    flex: 1,
    backgroundColor: "#000",
  },
  snapshot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 40,
  },
  snapshotText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
  },
  camFrameWrap: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: "#5b8de6",
  },
  cornerTL: {
    top: -4,
    left: -4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: -4,
    right: -4,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: -4,
    left: -4,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: -4,
    right: -4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  camBtn: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  camText: {
    color: "#5b8de6",
    fontSize: 44,
  },
});
