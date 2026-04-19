import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
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
import { computeILSAndBird, defaultILS } from "@/components/flightgame/physics/ils";
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
  
  // Note: ILS course is 90 degrees logic (Math.PI/2)
  const ilsData = computeILSAndBird(s, defaultILS, defaultILS.runwayCourseRad);

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
    ...ilsData,
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

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  const onReset = useCallback(() => {
    stateRef.current = initialState();
    thrustRef.current = C.initThrust;
    setPfdData(toPFDData(stateRef.current));
  }, []);

  const onRootLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ w: width, h: height });
  };

  const PAD = 10;
  const GAP = 10;
  const innerW = Math.max(0, layout.w - PAD * 2);
  const innerH = Math.max(0, layout.h - PAD * 2);

  const isLandscape = innerW > innerH;

  const portraitContentH = Math.max(0, innerH - GAP);
  const portraitPfdHeight = portraitContentH * (5 / 6);
  const portraitControlsHeight = portraitContentH / 6;

  const landscapeSideWidth = Math.max(innerW * 0.15, 100);
  const landscapePfdWidth = Math.max(
    0,
    innerW - landscapeSideWidth * 2 - GAP * 2
  );
  const landscapeHeight = innerH;

  const leverWidth = 100;
  const stickZone = Math.max(innerW * 0.3, innerH * 0.2);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden />
      <View style={styles.root} onLayout={onRootLayout}>
        {isLandscape ? (
          <View style={styles.landscapeRoot}>
            <View style={[styles.landscapeSide, { width: landscapeSideWidth, height: landscapeHeight }]}>
              <ThrustLever
                width={landscapeSideWidth}
                height={landscapeHeight * 0.8}
                onChange={onThrustChange}
                initial={C.initThrust}
              />
            </View>
            <View style={[styles.pfdArea, { width: landscapePfdWidth, height: landscapeHeight }]}>
              {landscapePfdWidth > 0 && (
                <PFD width={landscapePfdWidth} height={landscapeHeight} data={pfdData} />
              )}
            </View>
            <View style={[styles.landscapeSide, { width: landscapeSideWidth, height: landscapeHeight }]}>
              <Sidestick
                size={Math.min(landscapeSideWidth, landscapeHeight * 0.8)}
                onChange={onStickChange}
              />
            </View>
          </View>
        ) : (
          <View style={styles.portraitRoot}>
            <View style={[styles.pfdArea, { width: innerW, height: portraitPfdHeight }]}>
              {innerW > 0 && <PFD width={innerW} height={portraitPfdHeight} data={pfdData} />}
            </View>
            <View style={[styles.controlsLayer, { height: portraitControlsHeight }]}>
              <View style={[styles.leverCol, { width: leverWidth }]}>
                <ThrustLever
                  width={leverWidth}
                  height={portraitControlsHeight}
                  onChange={onThrustChange}
                  initial={C.initThrust}
                />
              </View>
              <View style={styles.spacer} />
              <View style={[styles.stickCol, { width: stickZone }]}>
                <Sidestick size={portraitControlsHeight} onChange={onStickChange} />
              </View>
            </View>
          </View>
        )}

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
    backgroundColor: "#05080c",
  },
  root: {
    flex: 1,
    backgroundColor: "#05080c",
    padding: 10,
  },
  landscapeRoot: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  landscapeSide: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(18,24,34,0.75)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(120,180,220,0.12)",
    shadowColor: "#4aa6ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
    overflow: "hidden",
  },
  portraitRoot: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  pfdArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#05080c",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(120,180,220,0.15)",
    shadowColor: "#4aa6ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 14,
    overflow: "hidden",
  },
  controlsLayer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "rgba(18,24,34,0.75)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(120,180,220,0.12)",
    shadowColor: "#4aa6ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
    overflow: "hidden",
  },
  spacer: {
    flex: 1,
  },
  leverCol: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(255,255,255,0.08)",
  },
  stickCol: {
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "rgba(255,255,255,0.08)",
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
    top: 16,
    right: 20,
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20,28,40,0.72)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(120,180,220,0.22)",
    shadowColor: "#4aa6ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  iconText: {
    color: "#e6f1ff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
