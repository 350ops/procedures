import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type {
  Traffic,
  Vec,
  VorStation,
} from "@/components/flightcapacity/engine/types";

type Props = {
  size: number;
  traffic: Traffic[];
  vors: VorStation[];
  selectedVor: string | null;
  radarMaxNM: number;
  innerRingNM: number;
  outerRingNM: number;
  onTrafficPress: (id: string) => void;
};

export default function Radar({
  size,
  traffic,
  vors,
  selectedVor,
  radarMaxNM,
  innerRingNM,
  outerRingNM,
  onTrafficPress,
}: Props) {
  const nmToPx = size / 2 / radarMaxNM;
  const cx = size / 2;
  const cy = size / 2;

  const project = (p: Vec) => ({
    left: cx + p.x * nmToPx,
    top: cy + p.y * nmToPx,
  });

  const headingTicks = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const outer = cx - 2;
        const tickLen = deg % 30 === 0 ? 14 : 7;
        const x1 = cx + Math.cos(rad) * outer;
        const y1 = cy + Math.sin(rad) * outer;
        const x2 = cx + Math.cos(rad) * (outer - tickLen);
        const y2 = cy + Math.sin(rad) * (outer - tickLen);
        const labelR = outer - tickLen - 10;
        const lx = cx + Math.cos(rad) * labelR;
        const ly = cy + Math.sin(rad) * labelR;
        const label =
          deg === 0
            ? "N"
            : deg === 90
              ? "E"
              : deg === 180
                ? "S"
                : deg === 270
                  ? "W"
                  : deg.toString().padStart(3, "0").replace(/^0/, "");
        return { deg, x1, y1, x2, y2, lx, ly, label };
      }),
    [cx, cy]
  );

  const selectedVorObj = vors.find((v) => v.id === selectedVor) ?? null;
  const routeLineStyle = selectedVorObj
    ? ((): any => {
        const p = project(selectedVorObj.pos);
        const dx = p.left - cx;
        const dy = p.top - cy;
        const len = Math.hypot(dx, dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return {
          position: "absolute",
          left: cx,
          top: cy,
          width: len,
          height: 2,
          backgroundColor: "#d946ef",
          transform: [{ translateY: -1 }, { rotate: `${angle}deg` }],
          transformOrigin: "0% 50%",
        };
      })()
    : null;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={[styles.face, { borderRadius: size / 2 }]}>
        {headingTicks.map((t) => (
          <View
            key={t.deg}
            style={{
              position: "absolute",
              left: Math.min(t.x1, t.x2),
              top: Math.min(t.y1, t.y2),
              width: Math.max(2, Math.abs(t.x2 - t.x1)),
              height: Math.max(2, Math.abs(t.y2 - t.y1)),
              backgroundColor: "#ffffff",
            }}
          />
        ))}
        {headingTicks
          .filter((t) => t.deg % 30 === 0)
          .map((t) => (
            <Text
              key={`lbl-${t.deg}`}
              style={[
                styles.tickLabel,
                { left: t.lx - 14, top: t.ly - 8 },
              ]}
            >
              {t.label}
            </Text>
          ))}

        <Ring
          cx={cx}
          cy={cy}
          radius={outerRingNM * nmToPx}
          dashed
        />
        <Ring
          cx={cx}
          cy={cy}
          radius={innerRingNM * nmToPx}
          dashed
        />

        <Text
          style={[
            styles.ringLabel,
            { left: cx - outerRingNM * nmToPx - 26, top: cy - 8 },
          ]}
        >
          5NM
        </Text>

        {routeLineStyle && <View style={routeLineStyle} />}

        {vors.map((v) => {
          const p = project(v.pos);
          return (
            <View
              key={v.id}
              style={[styles.vor, { left: p.left - 16, top: p.top - 16 }]}
              pointerEvents="none"
            >
              <Text style={styles.vorLabel}>{v.id}</Text>
              <Text style={styles.vorCross}>+</Text>
            </View>
          );
        })}

        {traffic
          .filter((t) => !t.resolved)
          .map((t) => {
            const p = project(t.pos);
            const dist = Math.hypot(t.pos.x, t.pos.y);
            const visible = dist <= radarMaxNM;
            if (!visible) return null;
            const altTag =
              (t.relAlt >= 0 ? "+" : "") + t.relAlt + "ft";
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.trafficHit,
                  { left: p.left - 22, top: p.top - 22 },
                ]}
                onPress={() => onTrafficPress(t.id)}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.diamond,
                    t.selected && styles.diamondSelected,
                  ]}
                />
                <Text
                  style={[
                    styles.trafficCallsign,
                    t.selected && styles.trafficCallsignSelected,
                  ]}
                >
                  {t.callsign}
                </Text>
                <Text style={styles.trafficAlt}>{altTag}</Text>
              </TouchableOpacity>
            );
          })}

        <View
          style={[styles.ownship, { left: cx - 12, top: cy - 12 }]}
          pointerEvents="none"
        >
          <Text style={styles.ownshipGlyph}>✈</Text>
        </View>
      </View>
    </View>
  );
}

function Ring({
  cx,
  cy,
  radius,
  dashed,
}: {
  cx: number;
  cy: number;
  radius: number;
  dashed?: boolean;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: cx - radius,
        top: cy - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        borderWidth: 2,
        borderColor: "#ffffff",
        borderStyle: dashed ? "dashed" : "solid",
        opacity: 0.75,
      }}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  face: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  tickLabel: {
    position: "absolute",
    color: "#ffffff",
    fontSize: 10,
    width: 28,
    textAlign: "center",
  },
  ringLabel: {
    position: "absolute",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },
  ownship: {
    position: "absolute",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ownshipGlyph: {
    color: "#5eb8ff",
    fontSize: 20,
  },
  vor: {
    position: "absolute",
    width: 32,
    alignItems: "center",
  },
  vorLabel: {
    color: "#5eb8ff",
    fontSize: 10,
    fontWeight: "600",
  },
  vorCross: {
    color: "#5eb8ff",
    fontSize: 20,
    lineHeight: 20,
  },
  trafficHit: {
    position: "absolute",
    width: 44,
    alignItems: "center",
    paddingTop: 2,
  },
  diamond: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: "#5eb8ff",
    backgroundColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  diamondSelected: {
    backgroundColor: "#30d158",
    borderColor: "#30d158",
  },
  trafficCallsign: {
    color: "#5eb8ff",
    fontSize: 9,
    marginTop: 2,
    fontWeight: "600",
  },
  trafficCallsignSelected: {
    color: "#30d158",
  },
  trafficAlt: {
    color: "#ffffff",
    fontSize: 8,
    marginTop: 1,
  },
});
