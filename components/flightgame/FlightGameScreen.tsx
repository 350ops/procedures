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

  const isLandscape = layout.w > layout.h;
  const portraitPfdHeight = layout.h * (5 / 6);
  const portraitControlsHeight = layout.h / 6;

  const landscapeSideWidth = Math.max(layout.w * 0.15, 100);
  const landscapePfdWidth = layout.w - landscapeSideWidth * 2;

  const leverWidth = 100;
  const stickZone = Math.max(layout.w * 0.3, layout.h * 0.2);
  const s = stateRef.current;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden />
      <View style={styles.root} onLayout={onRootLayout}>
        {isLandscape ? (
          <View style={styles.landscapeRoot}>
            <View style={[styles.landscapeSide, { width: landscapeSideWidth }]}>
              <ThrustLever
                width={landscapeSideWidth}
                height={layout.h * 0.8}
                onChange={onThrustChange}
                initial={C.initThrust}
              />
            </View>
            <View style={[styles.pfdArea, { width: landscapePfdWidth, height: layout.h }]}>
              {layout.w > 0 && <PFD width={landscapePfdWidth} height={layout.h} data={pfdData} />}
            </View>
            <View style={[styles.landscapeSide, { width: landscapeSideWidth }]}>
              <Sidestick
                size={Math.min(landscapeSideWidth, layout.h * 0.8)}
                onChange={onStickChange}
              />
            </View>
          </View>
        ) : (
          <View style={styles.portraitRoot}>
            <View style={[styles.pfdArea, { height: portraitPfdHeight }]}>
              {layout.w > 0 && <PFD width={layout.w} height={portraitPfdHeight} data={pfdData} />}
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

        {/* Live Debug Navigation Display */}
        <View style={styles.navMap} pointerEvents="none">
          {/* Runway */}
          <View style={{
            position: "absolute",
            left: (defaultILS.thresholdX_m / 25000) * 200,
            top: 75 - (defaultILS.thresholdY_m / 25000) * 150,
            width: 8, height: 8, backgroundColor: "lime", borderRadius: 4, marginLeft: -4, marginTop: -4
          }} />
          {/* Aircraft */}
          <View style={{
            position: "absolute",
            left: (s.x / 25000) * 200,
            top: 75 - (s.y / 25000) * 150,
            width: 6, height: 6, backgroundColor: "red", borderRadius: 3, marginLeft: -3, marginTop: -3
          }} />
          {/* Heading Line */}
           <View style={{
            position: "absolute",
            left: (s.x / 25000) * 200,
            top: 75 - (s.y / 25000) * 150,
            width: 10, height: 10,
            transform: [
              { rotate: `${s.psi}rad` },
              { translateY: -10 }
            ],
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
            <View style={{ width: 2, height: 10, backgroundColor: "red" }} />
          </View>
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
    backgroundColor: "#000",
  },
  landscapeRoot: {
    flex: 1,
    flexDirection: "row",
  },
  landscapeSide: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
  },
  portraitRoot: {
    flex: 1,
    flexDirection: "column",
  },
  pfdArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  controlsLayer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  spacer: {
    flex: 1,
  },
  leverCol: {
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "rgba(255,255,255,0.1)",
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
    fontSize: 18,
    fontWeight: "bold",
  },
  navMap: {
    position: 'absolute',
    top: 20,
    left: '50%',
    marginLeft: -100,
    width: 200,
    height: 150,
    backgroundColor: 'rgba(0,20,0,0.8)',
    borderWidth: 1,
    borderColor: 'green',
    overflow: 'hidden',
  }
});
