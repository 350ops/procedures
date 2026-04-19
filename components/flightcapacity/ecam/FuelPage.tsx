import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { G, Line, Path } from "react-native-svg";

export default function FuelPage() {
  return (
    <View style={styles.page}>
      <View style={styles.row}>
        <Pump label="LH FUEL PUMP" variant="fuel" state="On" />
        <Pump label="RH FUEL PUMP" variant="fuel" state="On" />
      </View>
      <View style={styles.row}>
        <Pump label="LH STANDBY PUMP" variant="standby" state="On" />
        <Pump label="RH STANDBY PUMP" variant="standby" state="On" />
      </View>
    </View>
  );
}

type PumpVariant = "fuel" | "standby";
type ChipState = "On" | "Primer" | "Off";

function Pump({
  label,
  variant,
  state,
}: {
  label: string;
  variant: PumpVariant;
  state: ChipState;
}) {
  const chips: ChipState[] =
    variant === "fuel" ? ["On", "Primer", "Off"] : ["On", "Off"];
  return (
    <View style={styles.pump}>
      <Text style={styles.pumpLabel}>{label}</Text>
      <DialGauge />
      <View style={styles.chipRow}>
        {chips.map((c) => (
          <View
            key={c}
            style={[styles.chip, state === c ? styles.chipActive : styles.chipInactive]}
          >
            <Text
              style={[
                styles.chipText,
                state === c ? styles.chipTextActive : styles.chipTextInactive,
              ]}
            >
              {c}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function DialGauge() {
  const size = 90;
  const r = 38;
  const cx = size / 2;
  const cy = size - 10;
  // Half-circle from 180deg (left) sweeping to 0deg (right) across the top.
  // Danger red arc from ~-20 deg to 0 deg (top-right quadrant end).
  const toXY = (angleDeg: number, radius = r) => {
    const rad = ((180 - angleDeg) * Math.PI) / 180;
    return {
      x: cx + Math.cos(rad) * radius,
      y: cy - Math.sin(rad) * radius,
    };
  };
  const arcPath = (a0: number, a1: number, radius = r) => {
    const p0 = toXY(a0, radius);
    const p1 = toXY(a1, radius);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 0 ${p1.x} ${p1.y}`;
  };

  const needleAngle = 30; // pointing upper-left (low reading)
  const needleEnd = toXY(needleAngle, r - 4);

  return (
    <Svg width={size} height={size - 5}>
      <G>
        {/* White baseline arc */}
        <Path
          d={arcPath(0, 180)}
          stroke="#ffffff"
          strokeWidth={3}
          fill="none"
        />
        {/* Red danger zone (upper right) */}
        <Path
          d={arcPath(140, 180)}
          stroke="#ef4444"
          strokeWidth={4}
          fill="none"
        />
        {/* Tick marks */}
        {[0, 45, 90, 135, 180].map((a) => {
          const outer = toXY(a, r);
          const inner = toXY(a, r - 6);
          return (
            <Line
              key={a}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              stroke="#ffffff"
              strokeWidth={2}
            />
          );
        })}
        {/* Pivot */}
        <Path
          d={`M ${cx - 3} ${cy} L ${cx + 3} ${cy} L ${cx} ${cy - 4} Z`}
          fill="#ffffff"
        />
        {/* Needle */}
        <Line
          x1={cx}
          y1={cy}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#ffffff"
          strokeWidth={2.5}
        />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  pump: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  pumpLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  chipRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    minWidth: 40,
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "#5b8de6",
  },
  chipInactive: {
    backgroundColor: "#2a3340",
    borderWidth: 1,
    borderColor: "#5b8de6",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  chipTextInactive: {
    color: "#8aa6d1",
  },
});
