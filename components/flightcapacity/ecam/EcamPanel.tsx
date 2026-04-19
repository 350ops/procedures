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
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.clock}>
          <Text style={styles.clockText}>{clock}</Text>
        </View>
        <View style={styles.masterRow}>
          <TouchableOpacity
            onPress={onPressMasterCaution}
            style={[
              styles.master,
              masterCaution && styles.masterActiveAmber,
            ]}
            activeOpacity={0.7}
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
            activeOpacity={0.7}
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
          <TouchableOpacity style={styles.clrBtn} onPress={onClear}>
            <Text style={styles.clrText}>CLR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        {pendingEvent && pendingEvent.requestsSnapshot && !pendingEvent.snapshotTaken && activePage === pendingEvent.page ? (
          <View style={styles.snapshot}>
            <Text style={styles.snapshotText}>
              Take a snapshot of {pendingEvent.page.toUpperCase()} page
            </Text>
            <TouchableOpacity onPress={onTakeSnapshot} style={styles.camBtn}>
              <Text style={styles.camText}>◉</Text>
            </TouchableOpacity>
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
    >
      <Text style={styles.pageBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#2e6a2e",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  clock: {
    position: "absolute",
    top: 12,
    right: 14,
    backgroundColor: "#86b7ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  clockText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
  masterRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
    marginLeft: 20,
  },
  master: {
    borderWidth: 2,
    borderColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  masterWarning: {
    borderColor: "#ff3b30",
  },
  masterActiveAmber: {
    backgroundColor: "#ffb300",
  },
  masterActiveRed: {
    backgroundColor: "#ff3b30",
  },
  masterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  pageBtn: {
    backgroundColor: "#c9d1d9",
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 2,
  },
  pageBtnActive: {
    backgroundColor: "#ffffff",
  },
  pageBtnText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
  clrBtn: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 2,
  },
  clrText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
  body: {
    flex: 1,
  },
  snapshot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  snapshotText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "500",
  },
  camBtn: {
    width: 64,
    height: 64,
    borderWidth: 2,
    borderColor: "#5eb8ff",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  camText: {
    color: "#5eb8ff",
    fontSize: 32,
  },
});
