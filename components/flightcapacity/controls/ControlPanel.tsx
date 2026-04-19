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
      <Field label="Radio Freq">
        <Display>{radioFreq.toFixed(2)}</Display>
      </Field>
      <View style={styles.row}>
        <PlusMinus
          onMinus={() => onAdjustRadio(-0.05)}
          onPlus={() => onAdjustRadio(0.05)}
        />
        <VerifyButton onPress={onVerifyRadio} />
      </View>

      <View style={{ height: 18 }} />

      <Field label="Altitude">
        <Display>{altitude.toString()}</Display>
      </Field>
      <View style={styles.row}>
        <PlusMinus
          onMinus={() => onAdjustAltitude(-500)}
          onPlus={() => onAdjustAltitude(500)}
        />
        <VerifyButton onPress={onVerifyAltitude} />
      </View>

      <View style={{ height: 22 }} />

      <Text style={styles.label}>VOR Station</Text>
      <TouchableOpacity
        style={styles.dropdown}
        activeOpacity={0.7}
        onPress={() => setDropdownOpen((o) => !o)}
      >
        <Text style={styles.dropdownText}>{vorSelected ?? ""}</Text>
        <View style={styles.dropdownArrowBox}>
          <Text style={styles.dropdownArrow}>▾</Text>
        </View>
      </TouchableOpacity>
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

      <View style={{ height: 14 }} />

      <Text style={styles.label}>NM</Text>
      <View style={styles.row}>
        <TextInput
          value={nmText}
          onChangeText={setNmText}
          style={styles.entry}
          keyboardType="numeric"
          placeholderTextColor="#555"
        />
        <TouchableOpacity style={styles.okBtn} onPress={() => setNmText("")}>
          <Text style={styles.okText}>ok</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 10 }} />

      <Text style={styles.label}>ROC/ROD</Text>
      <View style={styles.row}>
        <TextInput
          value={rocText}
          onChangeText={setRocText}
          style={styles.entry}
          keyboardType="numeric"
          placeholderTextColor="#555"
        />
        <TouchableOpacity style={styles.okBtn} onPress={() => setRocText("")}>
          <Text style={styles.okText}>ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
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
    <TouchableOpacity style={styles.verify} onPress={onPress}>
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
    maxWidth: 360,
    paddingHorizontal: 18,
    paddingVertical: 18,
    backgroundColor: "#7c8fa5",
  },
  label: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  display: {
    backgroundColor: "#000",
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  displayText: {
    color: "#00d4ff",
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "600",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c9edb8",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pillBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pillText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#142",
  },
  verify: {
    backgroundColor: "#2ea043",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
  },
  verifyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  dropdown: {
    flexDirection: "row",
    backgroundColor: "#000",
    alignItems: "center",
  },
  dropdownText: {
    flex: 1,
    color: "#00d4ff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  dropdownArrowBox: {
    backgroundColor: "#2ea043",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownArrow: {
    color: "#fff",
    fontWeight: "700",
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
    color: "#00d4ff",
    fontSize: 14,
  },
  entry: {
    flex: 1,
    backgroundColor: "#000",
    color: "#00d4ff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  okBtn: {
    backgroundColor: "#2ea043",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  okText: {
    color: "#fff",
    fontWeight: "700",
  },
});
