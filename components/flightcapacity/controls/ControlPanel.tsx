import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { VorStation } from "@/components/flightcapacity/engine/types";

type Props = {
  radioFreq: number;
  altitude: number;
  vorOptions: VorStation[];
  vorSelected: string | null;
  onAdjustRadio: (delta: number) => void;
  onAdjustAltitude: (delta: number) => void;
  onVerifyRadio: () => void;
  onVerifyAltitude: () => void;
  onSelectVor: (id: string | null) => void;
};

export default function ControlPanel({
  radioFreq,
  altitude,
  vorOptions,
  vorSelected,
  onAdjustRadio,
  onAdjustAltitude,
  onVerifyRadio,
  onVerifyAltitude,
  onSelectVor,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nmText, setNmText] = useState("");
  const [rocText, setRocText] = useState("");

  return (
    <View style={styles.panel}>
      <Group label="Radio Freq">
        <Display>{radioFreq.toFixed(2)}</Display>
        <View style={styles.row}>
          <PlusMinus
            onMinus={() => onAdjustRadio(-0.05)}
            onPlus={() => onAdjustRadio(0.05)}
          />
          <VerifyButton onPress={onVerifyRadio} />
        </View>
      </Group>

      <Group label="Altitude">
        <Display>{altitude.toString()}</Display>
        <View style={styles.row}>
          <PlusMinus
            onMinus={() => onAdjustAltitude(-500)}
            onPlus={() => onAdjustAltitude(500)}
          />
          <VerifyButton onPress={onVerifyAltitude} />
        </View>
      </Group>

      <Group label="VOR Station">
        <View style={styles.dropdownWrap}>
          <View style={styles.dropdownBody}>
            <Text style={styles.dropdownText}>{vorSelected ?? ""}</Text>
          </View>
          <TouchableOpacity
            style={styles.dropdownArrowBtn}
            activeOpacity={0.7}
            onPress={() => setDropdownOpen((o) => !o)}
          >
            <Text style={styles.dropdownArrow}>▾</Text>
          </TouchableOpacity>
        </View>
        {dropdownOpen && (
          <View style={styles.menu}>
            <MenuItem
              label="(none)"
              onPress={() => {
                onSelectVor(null);
                setDropdownOpen(false);
              }}
            />
            {vorOptions.map((v) => (
              <MenuItem
                key={v.id}
                label={v.id}
                onPress={() => {
                  onSelectVor(v.id);
                  setDropdownOpen(false);
                }}
              />
            ))}
          </View>
        )}
      </Group>

      <Group label="NM">
        <View style={styles.row}>
          <TextInput
            value={nmText}
            onChangeText={setNmText}
            style={styles.entry}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.okBtn} onPress={() => setNmText("")}>
            <Text style={styles.okText}>ok</Text>
          </TouchableOpacity>
        </View>
      </Group>

      <Group label="ROC/ROD">
        <View style={styles.row}>
          <TextInput
            value={rocText}
            onChangeText={setRocText}
            style={styles.entry}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.okBtn} onPress={() => setRocText("")}>
            <Text style={styles.okText}>ok</Text>
          </TouchableOpacity>
        </View>
      </Group>
    </View>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Display({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.display}>
      <Text style={styles.displayText}>{children}</Text>
    </View>
  );
}

function PlusMinus({
  onMinus,
  onPlus,
}: {
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <View style={styles.pill}>
      <TouchableOpacity onPress={onMinus} style={styles.pillBtn}>
        <Text style={styles.pillText}>−</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPlus} style={styles.pillBtn}>
        <Text style={styles.pillText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function VerifyButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.verify} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.verifyText}>Verify</Text>
    </TouchableOpacity>
  );
}

function MenuItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    alignItems: "stretch",
    gap: 12,
    paddingHorizontal: 6,
  },
  group: {
    gap: 4,
    alignItems: "stretch",
  },
  label: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  display: {
    backgroundColor: "#000",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    height: 34,
  },
  displayText: {
    color: "#00ffff",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
    fontFamily: "Courier",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#b3d79f",
    borderRadius: 24,
    paddingHorizontal: 8,
    width: 56,
    height: 44,
    borderWidth: 1,
    borderColor: "#8caa7c",
  },
  pillBtn: {
    paddingHorizontal: 2,
  },
  pillText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  verify: {
    flex: 1,
    backgroundColor: "#24a82a",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1a7f1f",
    height: 44,
  },
  verifyText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dropdownWrap: {
    flexDirection: "row",
    height: 34,
    backgroundColor: "#000",
  },
  dropdownBody: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dropdownText: {
    color: "#00ffff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Courier",
  },
  dropdownArrowBtn: {
    width: 40,
    backgroundColor: "#24a82a",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#1a7f1f",
  },
  dropdownArrow: {
    color: "rgba(0,0,0,0.6)",
    fontSize: 20,
    fontWeight: "900",
  },
  menu: {
    marginTop: 2,
    backgroundColor: "#1d1d1f",
  },
  menuItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  menuItemText: {
    color: "#00ffff",
    fontSize: 14,
  },
  entry: {
    flex: 1,
    backgroundColor: "#000",
    color: "#00ffff",
    paddingHorizontal: 10,
    height: 34,
    fontSize: 16,
    fontFamily: "Courier",
  },
  okBtn: {
    backgroundColor: "#24a82a",
    paddingHorizontal: 14,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#1a7f1f",
    minWidth: 48,
  },
  okText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
