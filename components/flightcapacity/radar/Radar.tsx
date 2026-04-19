import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import type {
  Traffic,
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

  const ringOuter = (size / 2) - 2;
  const ringInner = ringOuter - 10;

  const ticks = useMemo(() => {
    const arr: {
      deg: number;
      isMajor: boolean;
      label: string | null;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      lx: number;
      ly: number;
    }[] = [];
    for (let i = 0; i < 360; i += 5) {
      const isMajor = i % 10 === 0;
      let label: string | null = null;
      if (i === 0) label = "N";
      else if (i === 90) label = "E";
      else if (i === 180) label = "S";
      else if (i === 270) label = "W";
      else if (isMajor) label = i.toString().padStart(3, "0");

      const rad = ((i - 90) * Math.PI) / 180;
      const tickLen = isMajor ? 16 : 8;
      const x1 = cx + Math.cos(rad) * ringInner;
      const y1 = cy + Math.sin(rad) * ringInner;
      const x2 = cx + Math.cos(rad) * (ringInner - tickLen);
      const y2 = cy + Math.sin(rad) * (ringInner - tickLen);
      const labelR = ringInner - tickLen - 12;
      const lx = cx + Math.cos(rad) * labelR;
      const ly = cy + Math.sin(rad) * labelR;
      arr.push({ deg: i, isMajor, label, x1, y1, x2, y2, lx, ly });
    }
    return arr;
  }, [cx, cy, ringInner]);

  const innerRingR = innerRingNM * nmToPx;
  const outerRingR = outerRingNM * nmToPx;

  const selectedVorObj = vors.find((v) => v.id === selectedVor) ?? null;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Outer white ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={ringOuter}
          stroke="#ffffff"
          strokeWidth={3}
          fill="#111111"
        />

        {/* Compass ticks */}
        {ticks.map((t) => (
          <Line
            key={`t-${t.deg}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="#ffffff"
            strokeWidth={t.isMajor ? 3 : 2}
          />
        ))}

        {/* Compass labels */}
        {ticks
          .filter((t) => t.label)
          .map((t) => (
            <SvgText
              key={`l-${t.deg}`}
              x={t.lx}
              y={t.ly}
              fill="#ffffff"
              fontSize={t.deg % 90 === 0 ? 18 : 13}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {t.label}
            </SvgText>
          ))}

        {/* Dashed range rings */}
        <Circle
          cx={cx}
          cy={cy}
          r={outerRingR}
          stroke="#ffffff"
          strokeWidth={3}
          strokeDasharray="8 6"
          fill="none"
          opacity={0.9}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={innerRingR}
          stroke="#ffffff"
          strokeWidth={3}
          strokeDasharray="8 6"
          fill="none"
          opacity={0.9}
        />

        {/* Route line to selected VOR */}
        {selectedVorObj && (
          <Line
            x1={cx}
            y1={cy}
            x2={cx + selectedVorObj.pos.x * nmToPx}
            y2={cy + selectedVorObj.pos.y * nmToPx}
            stroke="#d946ef"
            strokeWidth={2}
          />
        )}

        {/* VOR waypoints */}
        {vors.map((v) => {
          const px = cx + v.pos.x * nmToPx;
          const py = cy + v.pos.y * nmToPx;
          return (
            <G key={`vor-${v.id}`}>
              <Line
                x1={px - 10}
                y1={py}
                x2={px + 10}
                y2={py}
                stroke="#5b8de6"
                strokeWidth={3}
              />
              <Line
                x1={px}
                y1={py - 10}
                x2={px}
                y2={py + 10}
                stroke="#5b8de6"
                strokeWidth={3}
              />
              <SvgText
                x={px + 14}
                y={py - 6}
                fill="#ffffff"
                fontSize={10}
                fontWeight="600"
              >
                {v.id}
              </SvgText>
            </G>
          );
        })}

        {/* 5 NM label on inner ring */}
        <Rect
          x={cx - innerRingR - 30}
          y={cy - 8}
          width={30}
          height={16}
          fill="#111111"
        />
        <SvgText
          x={cx - innerRingR - 15}
          y={cy}
          fill="#ffffff"
          fontSize={12}
          fontWeight="700"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          5NM
        </SvgText>

        {/* Ownship — airplane glyph */}
        <G transform={`translate(${cx - 14}, ${cy - 14})`}>
          <Path
            d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"
            fill="#5b8de6"
            scale={1.2}
          />
        </G>
      </Svg>

      {/* Traffic touch targets (on top of SVG as absolute Views) */}
      {traffic
        .filter((t) => !t.resolved)
        .map((t) => {
          const dist = Math.hypot(t.pos.x, t.pos.y);
          if (dist > radarMaxNM) return null;
          const left = cx + t.pos.x * nmToPx - 22;
          const top = cy + t.pos.y * nmToPx - 22;
          const altTag = (t.relAlt >= 0 ? "+" : "") + t.relAlt;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.trafficHit, { left, top }]}
              onPress={() => onTrafficPress(t.id)}
              activeOpacity={0.6}
            >
              <View
                style={[styles.diamond, t.selected && styles.diamondSelected]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#556",
  },
  trafficHit: {
    position: "absolute",
    width: 44,
    alignItems: "center",
    paddingTop: 2,
  },
  diamond: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: "#5b8de6",
    backgroundColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  diamondSelected: {
    backgroundColor: "#30d158",
    borderColor: "#30d158",
  },
  trafficCallsign: {
    color: "#ffffff",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
  trafficCallsignSelected: {
    color: "#30d158",
  },
  trafficAlt: {
    color: "#ffffff",
    fontSize: 9,
  },
});
