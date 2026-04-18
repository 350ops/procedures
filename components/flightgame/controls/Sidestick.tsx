import React, { useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from "react-native";

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

  const update = (gesture: PanResponderGestureState, released: boolean) => {
    const half = halfRef.current;
    if (released && CENTERING_RETURN) {
      const next = { x: 0, y: 0 };
      setValue(next);
      onChange(next);
      return;
    }
    const x = Math.max(-1, Math.min(1, gesture.dx / half));
    const y = Math.max(-1, Math.min(1, gesture.dy / half));
    const next = { x, y };
    setValue(next);
    onChange(next);
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (_e: GestureResponderEvent, g) => update(g, false),
        onPanResponderMove: (_e, g) => update(g, false),
        onPanResponderRelease: (_e, g) => update(g, true),
        onPanResponderTerminate: (_e, g) => update(g, true),
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  zone: {
    alignItems: "center",
    justifyContent: "center",
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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00e676",
    borderWidth: 2,
    borderColor: "#003d1f",
  },
});
