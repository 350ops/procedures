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
import PFD, { type PFDData } from "@/components/flightgame/pfd/PFD";
import { useGameLoop } from "@/components/flightgame/useGameLoop";
import { isa, tasToCas } from "@/components/flightgame/physics/atmosphere";
import {
  initialState,
  isStalled,
  step,
} from "@/components/flightgame/physics/integrator";
import type { AircraftState } from "@/components/flightgame/physics/state";
import {
  C,
  M_TO_FT,
  MS_TO_FPM,
  MS_TO_KT,
  R2D,
} from "@/components/flightgame/physics/state";

const HUD_EVERY_N_FRAMES = 6; // ~10 Hz UI refresh on a 60 Hz physics loop

function toPFDData(s: AircraftState): PFDData {
  const altM = -s.z;
  const { rho } = isa(altM);
  const vCAS = tasToCas(s.vTAS, rho);
  const vsMs = s.vTAS * Math.sin(s.gamma);
  return {
    iasKt: vCAS * MS_TO_KT,
    altFt: altM * M_TO_FT,
    vsFpm: vsMs * MS_TO_FPM,
    headingDeg: s.psi * R2D,
    pitchDeg: s.theta * R2D,
    bankDeg: s.phi * R2D,
    thrustPct: s.thrustPct * 100,
    stalled: isStalled(s),
    onGround: altM <= 0.5,
  };
}

export default function FlightGameScreen() {
  const router = useRouter();
  const [layout, setLayout] = useState({ w: 0, h: 0 });

  const stickRef = useRef<SidestickValue>({ x: 0, y: 0 });
  const thrustRef = useRef<number>(C.initThrust);
  const stateRef = useRef<AircraftState>(initialState());
  const frameCountRef = useRef(0);

  const [pfdData, setPfdData] = useState<PFDData>(() =>
    toPFDData(stateRef.current)
  );

  const onStickChange = useCallback((v: SidestickValue) => {
    stickRef.current = v;
  }, []);

  const onThrustChange = useCallback((t: number) => {
    thrustRef.current = t;
  }, []);

  useGameLoop(
    useCallback((dt: number) => {
      stateRef.current = step(
        stateRef.current,
        {
          stickX: stickRef.current.x,
          stickY: stickRef.current.y,
          thrust: thrustRef.current,
        },
        dt
      );
      frameCountRef.current = (frameCountRef.current + 1) % HUD_EVERY_N_FRAMES;
      if (frameCountRef.current === 0) {
        setPfdData(toPFDData(stateRef.current));
      }
    }, [])
  );

  const onReset = useCallback(() => {
    stateRef.current = initialState();
    thrustRef.current = C.initThrust;
    setPfdData(toPFDData(stateRef.current));
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
            initial={C.initThrust}
          />
          <Text style={styles.colLabel}>THR</Text>
        </View>

        <View style={styles.pfdCol}>
          {layout.w > 0 && <PFD width={pfdW} height={pfdH} data={pfdData} />}
        </View>

        <View style={[styles.stickCol, { width: stickZone }]}>
          <Sidestick size={stickZone} onChange={onStickChange} />
          <Text style={styles.colLabel}>STICK</Text>
        </View>

        <View style={styles.topRightCol}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onReset}
            hitSlop={12}
          >
            <Text style={styles.iconText}>⟲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
            hitSlop={12}
          >
            <Text style={styles.iconText}>✕</Text>
          </TouchableOpacity>
        </View>
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
  topRightCol: {
    position: "absolute",
    top: 8,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
  },
  iconText: {
    color: "#fff",
    fontSize: 14,
  },
});
