import React, { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

type Props = {
  width: number;
  height: number;
  onChange: (t: number) => void;
  initial?: number;
};

export default function ThrustLever({
  width,
  height,
  onChange,
  initial = 0,
}: Props) {
  const [thrust, setThrust] = useState<number>(initial);
  const startRef = useRef<number>(initial);
  const heightRef = useRef(height);
  heightRef.current = height;

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startRef.current = thrust;
        },
        onPanResponderMove: (_e, g) => {
          const delta = -g.dy / heightRef.current;
          const next = Math.max(0, Math.min(1, startRef.current + delta));
          setThrust(next);
          onChange(next);
        },
      }),
    [thrust, onChange]
  );

  const leverY = (1 - thrust) * (height - 56);

  return (
    <View
      style={[styles.zone, { width, height }]}
      {...responder.panHandlers}
    >
      <View style={styles.track} />
      {[0.25, 0.5, 0.75].map((p) => (
        <View
          key={p}
          style={[styles.detent, { top: (1 - p) * (height - 56) + 24 }]}
        />
      ))}
      <View style={[styles.lever, { top: leverY }]}>
        <View style={styles.leverHandle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 12,
  },
  track: {
    position: "absolute",
    top: 24,
    bottom: 24,
    width: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  detent: {
    position: "absolute",
    width: 24,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  lever: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 56,
  },
  leverHandle: {
    width: 54,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#ffb300",
    borderWidth: 2,
    borderColor: "#3d2a00",
  },
});
