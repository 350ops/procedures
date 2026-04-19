import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

import * as engine from "./engine/engine";
import { DEFAULT_CONFIG } from "./engine/config";
import type {
  EcamPage,
  EngineEvent,
  EngineState,
} from "./engine/types";
import { play as playAudio } from "./audio/audio";
import Radar from "./radar/Radar";
import ControlPanel from "./controls/ControlPanel";
import EcamPanel from "./ecam/EcamPanel";
import ScoreSummary from "./ScoreSummary";

export default function FlightCapacityScreen() {
  const router = useRouter();
  const cfg = DEFAULT_CONFIG;

  const [state, setState] = useState<EngineState>(() =>
    engine.initialState(cfg)
  );
  const lastTrafficSpawn = useRef(0);
  const lastEcamSpawn = useRef(0);
  const lastTickMs = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [layout, setLayout] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ w: width, h: height });
  };

  const handleEvents = useCallback((events: EngineEvent[]) => {
    for (const ev of events) {
      if (ev.type === "traffic_callout") playAudio("traffic_traffic");
      else if (ev.type === "master_warning") playAudio("master_warning");
      else if (ev.type === "master_caution") playAudio("master_caution");
    }
  }, []);

  const loop = useCallback(
    (now: number) => {
      if (lastTickMs.current == null) lastTickMs.current = now;
      const dtSec = Math.min(0.2, (now - lastTickMs.current) / 1000);
      lastTickMs.current = now;
      setState((prev) => {
        if (!prev.running || prev.finished) return prev;
        const ticked = engine.tick(prev, dtSec, cfg);
        if (ticked.events.length) handleEvents(ticked.events);
        const spawnT = engine.maybeSpawnTraffic(
          ticked.state,
          lastTrafficSpawn.current,
          cfg
        );
        lastTrafficSpawn.current = spawnT.lastSpawnSec;
        const spawnE = engine.maybeSpawnEcam(
          spawnT.state,
          lastEcamSpawn.current,
          cfg
        );
        lastEcamSpawn.current = spawnE.lastSpawnSec;
        if (spawnE.event?.type === "ecam_appear") {
          handleEvents([
            spawnE.event.severity === "warning"
              ? { type: "master_warning" }
              : { type: "master_caution" },
          ]);
        }
        return spawnE.state;
      });
      rafRef.current = requestAnimationFrame(loop);
    },
    [cfg, handleEvents]
  );

  useEffect(() => {
    if (state.running && !state.finished) {
      rafRef.current = requestAnimationFrame(loop);
      return () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTickMs.current = null;
      };
    }
    return undefined;
  }, [state.running, state.finished, loop]);

  const onStart = () => {
    lastTrafficSpawn.current = -cfg.trafficSpawnIntervalSec + 2;
    lastEcamSpawn.current = -cfg.ecamSpawnIntervalSec + 18;
    setState((s) => engine.start(s));
  };
  const onRestart = () => {
    lastTrafficSpawn.current = 0;
    lastEcamSpawn.current = 0;
    lastTickMs.current = null;
    setState(engine.initialState(cfg));
  };

  const pendingEvent = useMemo(
    () => state.ecam.find((e) => !e.cleared) ?? null,
    [state.ecam]
  );

  const onTrafficPress = (id: string) =>
    setState((s) => engine.selectTraffic(s, id, cfg));
  const onAdjustRadio = (d: number) =>
    setState((s) => engine.adjustRadio(s, d));
  const onAdjustAltitude = (d: number) =>
    setState((s) => engine.adjustAltitude(s, d));
  const onVerifyRadio = () =>
    setState((s) => engine.verifyRadioFreq(s).state);
  const onVerifyAltitude = () =>
    setState((s) => engine.verifyAltitude(s).state);
  const onSelectVor = (id: string | null) =>
    setState((s) => engine.setVorStation(s, id));
  const onSelectPage = (p: EcamPage) =>
    setState((s) => engine.setEcamPage(s, p));
  const onClear = () => setState((s) => engine.clearEcam(s).state);
  const onTakeSnapshot = () => setState((s) => engine.takeSnapshot(s));
  const onPressMasterCaution = () =>
    setState((s) => engine.acknowledgeMaster(s));
  const onPressMasterWarning = () =>
    setState((s) => engine.acknowledgeMaster(s));

  const clock = formatClock(cfg.durationSec - state.elapsedSec);

  if (state.finished) {
    return (
      <ScoreSummary
        score={state.score}
        onRestart={onRestart}
        onExit={() => router.back()}
      />
    );
  }

  const isPortrait = layout.w > 0 && layout.h > layout.w;
  const radarColW = Math.floor(layout.w * 0.45);
  const controlsColW = Math.floor(layout.w * 0.20);
  const ecamColW = Math.max(0, layout.w - radarColW - controlsColW);
  const radarSize = Math.min(radarColW - 16, layout.h - 16);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden />
      <View style={styles.root} onLayout={onLayout}>
        {!isPortrait && layout.w > 0 && (
          <>
            <View
              style={[styles.col, styles.radarCol, { width: radarColW }]}
            >
              <Radar
                size={radarSize}
                traffic={state.traffic}
                vors={state.vors}
                selectedVor={state.verify.vorStation}
                radarMaxNM={cfg.radarMaxNM}
                innerRingNM={cfg.innerRingNM}
                outerRingNM={cfg.outerRingNM}
                onTrafficPress={onTrafficPress}
              />
            </View>
            <View style={[styles.col, styles.controlsCol, { width: controlsColW }]}>
              <ControlPanel
                radioFreq={state.verify.radioFreq}
                altitude={state.verify.altitude}
                vorOptions={state.vors}
                vorSelected={state.verify.vorStation}
                onAdjustRadio={onAdjustRadio}
                onAdjustAltitude={onAdjustAltitude}
                onVerifyRadio={onVerifyRadio}
                onVerifyAltitude={onVerifyAltitude}
                onSelectVor={onSelectVor}
              />
            </View>
            <View style={[styles.col, { width: ecamColW }]}>
              <EcamPanel
                clock={clock}
                masterCaution={state.masterCaution}
                masterWarning={state.masterWarning}
                activePage={state.activeEcamPage}
                pendingEvent={pendingEvent}
                onPressMasterCaution={onPressMasterCaution}
                onPressMasterWarning={onPressMasterWarning}
                onSelectPage={onSelectPage}
                onClear={onClear}
                onTakeSnapshot={onTakeSnapshot}
              />
            </View>
          </>
        )}

        {isPortrait && (
          <View style={styles.rotateWrap}>
            <Text style={styles.rotateGlyph}>⟳</Text>
            <Text style={styles.rotateTitle}>Rotate your device</Text>
            <Text style={styles.rotateSub}>
              The Flight Capacity Test runs in landscape.
            </Text>
          </View>
        )}

        {!isPortrait && !state.running && !state.finished && (
          <View style={styles.startOverlay}>
            <Text style={styles.startTitle}>Flight Capacity Test</Text>
            <Text style={styles.startSub}>
              Target freq {state.target.radioFreq.toFixed(2)} · Target alt{" "}
              {state.target.altitude} · Track VOR {state.target.vorStation}
            </Text>
            <Text style={styles.startHint}>
              Select threat traffic entering 10 NM (±1000 ft), deselect before
              10 NM exit. Acknowledge ECAMs, take snapshots when asked.
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={onStart}>
              <Text style={styles.startBtnText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}

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

function formatClock(secs: number) {
  const s = Math.max(0, Math.round(secs));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#8d9ab3",
  },
  root: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#8d9ab3",
  },
  col: {
    backgroundColor: "transparent",
  },
  radarCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 4,
  },
  controlsCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  rotateWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#000",
    paddingHorizontal: 32,
  },
  rotateGlyph: {
    color: "#5eb8ff",
    fontSize: 52,
  },
  rotateTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  rotateSub: {
    color: "#c7c7cc",
    fontSize: 14,
    textAlign: "center",
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
    zIndex: 20,
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 14,
  },
  startTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  startSub: {
    color: "#5eb8ff",
    fontSize: 15,
    textAlign: "center",
  },
  startHint: {
    color: "#c7c7cc",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  startBtn: {
    backgroundColor: "#30d158",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
