import React, { useCallback, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import Sidestick, {
  type SidestickValue,
} from "@/components/flightgame/controls/Sidestick";
import ThrustLever from "@/components/flightgame/controls/ThrustLever";
import PFD from "@/components/flightgame/pfd/PFD";

export default function FlightGameScreen() {
  const router = useRouter();
  const [layout, setLayout] = useState({ w: 0, h: 0 });
  const [stick, setStick] = useState<SidestickValue>({ x: 0, y: 0 });
  const [thrust, setThrust] = useState<number>(0);

  const stickRef = useRef(stick);
  const thrustRef = useRef(thrust);

  const onStickChange = useCallback((v: SidestickValue) => {
    stickRef.current = v;
    setStick(v);
  }, []);

  const onThrustChange = useCallback((t: number) => {
    thrustRef.current = t;
    setThrust(t);
  }, []);

  const onRootLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ w: width, h: height });
  };

  const leverWidth = 96;
  const stickZone = Math.min(layout.w * 0.45, layout.h * 0.55);
  const pfdW = Math.max(0, layout.w - leverWidth - stickZone - 24);
  const pfdH = layout.h;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden />
      <View style={styles.root} onLayout={onRootLayout}>
        <View style={[styles.leverCol, { width: leverWidth }]}>
          <ThrustLever
            width={leverWidth}
            height={layout.h}
            onChange={onThrustChange}
          />
          <Text style={styles.colLabel}>THR</Text>
        </View>

        <View style={styles.pfdCol}>
          {layout.w > 0 && (
            <PFD
              width={pfdW}
              height={pfdH}
              stickX={stick.x}
              stickY={stick.y}
              thrust={thrust}
            />
          )}
        </View>

        <View style={[styles.stickCol, { width: stickZone }]}>
          <Sidestick size={stickZone} onChange={onStickChange} />
          <Text style={styles.colLabel}>STICK</Text>
        </View>

        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  root: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#000",
  },
  leverCol: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(255,255,255,0.1)",
  },
  pfdCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  stickCol: {
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "rgba(255,255,255,0.1)",
  },
  colLabel: {
    position: "absolute",
    bottom: 8,
    color: "rgba(255,255,255,0.4)",
    fontSize: 10,
    letterSpacing: 2,
  },
  closeBtn: {
    position: "absolute",
    top: 8,
    right: 12,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
  },
});
