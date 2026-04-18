import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  iasKt: number;
  width: number;
  height: number;
};

const PX_PER_KT = 4;
const MAJOR_EVERY = 10;
const LABEL_EVERY = 20;
const VISIBLE_KT = 60; // ± half-range rendered around current speed

export default function SpeedTape({ iasKt, width, height }: Props) {
  const ias = Math.max(0, iasKt);
  const ticks = useMemo(() => {
    const lo = Math.floor((ias - VISIBLE_KT) / MAJOR_EVERY) * MAJOR_EVERY;
    const hi = Math.ceil((ias + VISIBLE_KT) / MAJOR_EVERY) * MAJOR_EVERY;
    const out: number[] = [];
    for (let v = Math.max(0, lo); v <= hi; v += MAJOR_EVERY) out.push(v);
    return out;
  }, [ias]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <View style={styles.track}>
        {ticks.map((v) => {
          const offset = (v - ias) * PX_PER_KT;
          const isLabel = v % LABEL_EVERY === 0;
          return (
            <View
              key={v}
              style={[
                styles.tickRow,
                {
                  top: height / 2 - offset - 8,
                  opacity: v === 0 ? 0.4 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.tick,
                  { width: isLabel ? 10 : 6 },
                ]}
              />
              {isLabel && <Text style={styles.label}>{v}</Text>}
            </View>
          );
        })}
      </View>
      <View style={styles.center} pointerEvents="none">
        <View style={styles.readout}>
          <Text style={styles.readoutText}>{Math.round(ias)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
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
  },
  tick: {
    height: 2,
    backgroundColor: "#ffffff",
    marginLeft: 0,
  },
  label: {
    marginLeft: 4,
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Courier",
    fontWeight: "700",
  },
  center: {
    position: "absolute",
    top: "50%",
    right: 0,
    marginTop: -12,
  },
  readout: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#ffe600",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  readoutText: {
    color: "#ffe600",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: "Courier",
  },
});
