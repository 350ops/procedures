import React, { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, View, Image } from "react-native";

export type SidestickValue = {
  x: number;
  y: number;
};

type Props = {
  size: number;
  onChange: (v: SidestickValue) => void;
};

const CENTERING_RETURN = true;

export default function Sidestick({ size, onChange }: Props) {
  const [value, setValue] = useState<SidestickValue>({ x: 0, y: 0 });

  const halfRef = useRef(size / 2);
  halfRef.current = size / 2;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const update = (dx: number, dy: number, released: boolean) => {
    if (released && CENTERING_RETURN) {
      const next = { x: 0, y: 0 };
      setValue(next);
      onChangeRef.current(next);
      return;
    }
    const half = Math.max(halfRef.current, 1);
    const x = Math.max(-1, Math.min(1, dx / half));
    const y = Math.max(-1, Math.min(1, dy / half));
    const next = { x, y };
    setValue(next);
    onChangeRef.current(next);
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: (_e, g) => update(g.dx, g.dy, false),
        onPanResponderMove: (_e, g) => update(g.dx, g.dy, false),
        onPanResponderRelease: (_e, g) => update(g.dx, g.dy, true),
        onPanResponderTerminate: (_e, g) => update(g.dx, g.dy, true),
      }),
    []
  );

  const knobOffset = size * 0.4;
  const knobX = value.x * knobOffset;
  const knobY = value.y * knobOffset;

  return (
    <View
      style={[styles.zone, { width: size, height: size }]}
      {...responder.panHandlers}
    >
      <View style={styles.ring} />
      <View style={styles.crossH} />
      <View style={styles.crossV} />
      <View
        style={[
          styles.knob,
          { transform: [{ translateX: knobX }, { translateY: knobY }] },
        ]}
      >
        <Image
          source={require("@/components/flightgame/controls/sidestick.png")}
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  ring: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  crossH: {
    position: "absolute",
    width: "80%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  crossV: {
    position: "absolute",
    height: "80%",
    width: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  knob: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
