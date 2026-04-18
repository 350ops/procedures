import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  headingDeg: number;
  width: number;
  height: number;
};

const PX_PER_DEG = 4;
const MAJOR_EVERY = 5;
const LABEL_EVERY = 10;
const VISIBLE_DEG = 50;

const CARDINALS: Record<number, string> = {
  0: "N",
  90: "E",
  180: "S",
  270: "W",
};

function wrap360(d: number) {
  return ((d % 360) + 360) % 360;
}

export default function HeadingTape({ headingDeg, width, height }: Props) {
  const hdg = wrap360(headingDeg);
  const ticks = useMemo(() => {
    const lo = Math.floor((hdg - VISIBLE_DEG) / MAJOR_EVERY) * MAJOR_EVERY;
    const hi = Math.ceil((hdg + VISIBLE_DEG) / MAJOR_EVERY) * MAJOR_EVERY;
    const out: number[] = [];
    for (let v = lo; v <= hi; v += MAJOR_EVERY) out.push(v);
    return out;
  }, [hdg]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <View style={styles.track}>
        {ticks.map((v) => {
          const offset = (v - hdg) * PX_PER_DEG;
          const isLabel = v % LABEL_EVERY === 0;
          const display = wrap360(v);
          const cardinal = CARDINALS[display];
          return (
            <View
              key={v}
              style={[
                styles.tickCol,
                { left: width / 2 + offset - 12 },
              ]}
            >
              <View
                style={[
                  styles.tick,
                  { height: isLabel ? 10 : 6 },
                ]}
              />
              {isLabel && (
                <Text style={cardinal ? styles.cardinal : styles.label}>
                  {cardinal ?? (display / 10).toFixed(0).padStart(2, "0")}
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.center} pointerEvents="none">
        <View style={styles.readout}>
          <Text style={styles.readoutText}>
            {Math.round(hdg).toString().padStart(3, "0")}
          </Text>
        </View>
        <View style={styles.pointer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  tickCol: {
    position: "absolute",
    top: 2,
    width: 24,
    alignItems: "center",
  },
  tick: {
    width: 2,
    backgroundColor: "#ffffff",
  },
  label: {
    marginTop: 1,
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Courier",
    fontWeight: "700",
  },
  cardinal: {
    marginTop: 1,
    color: "#ffe600",
    fontSize: 13,
    fontFamily: "Courier",
    fontWeight: "800",
  },
  center: {
    position: "absolute",
    top: 0,
    left: "50%",
    alignItems: "center",
    width: 40,
    marginLeft: -20,
  },
  readout: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#ffe600",
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  readoutText: {
    color: "#ffe600",
    fontSize: 14,
    fontWeight: "800",
    fontFamily: "Courier",
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#ffe600",
    marginTop: -1,
  },
});
