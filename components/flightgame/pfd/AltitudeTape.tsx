import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  altFt: number;
  width: number;
  height: number;
};

const PX_PER_100FT = 14;
const MAJOR_EVERY = 100;
const LABEL_EVERY = 500;
const VISIBLE_FT = 1200; // ± half-range rendered around current altitude

export default function AltitudeTape({ altFt, width, height }: Props) {
  const ticks = useMemo(() => {
    const lo = Math.floor((altFt - VISIBLE_FT) / MAJOR_EVERY) * MAJOR_EVERY;
    const hi = Math.ceil((altFt + VISIBLE_FT) / MAJOR_EVERY) * MAJOR_EVERY;
    const out: number[] = [];
    for (let v = lo; v <= hi; v += MAJOR_EVERY) out.push(v);
    return out;
  }, [altFt]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <View style={styles.track}>
        {ticks.map((v) => {
          const offset = ((v - altFt) / 100) * PX_PER_100FT;
          const isLabel = v % LABEL_EVERY === 0;
          return (
            <View
              key={v}
              style={[styles.tickRow, { top: height / 2 - offset - 8 }]}
            >
              <View
                style={[
                  styles.tick,
                  { width: isLabel ? 10 : 6 },
                ]}
              />
              {isLabel && (
                <Text style={styles.label}>
                  {v.toString().padStart(3, "0")}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.center} pointerEvents="none">
        <View style={styles.readout}>
          <Text style={styles.readoutText}>
            {Math.round(altFt).toString().padStart(5, " ")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "rgba(65,70,100,0.85)",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  tickRow: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tick: {
    height: 2,
    backgroundColor: "#ffffff",
    marginRight: 4,
  },
  label: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Courier",
    fontWeight: "700",
  },
  center: {
    position: "absolute",
    top: "50%",
    left: 0,
    marginTop: -16,
  },
  readout: {
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#ffe600",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  readoutText: {
    color: "#00ff00",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Courier",
  },
});
