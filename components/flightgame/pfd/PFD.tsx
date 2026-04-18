import React from "react";
import { StyleSheet, Text, View } from "react-native";

import AltitudeTape from "./AltitudeTape";
import AttitudeIndicator from "./AttitudeIndicator";
import HeadingTape from "./HeadingTape";
import SpeedTape from "./SpeedTape";
import VSI from "./VSI";

export type PFDData = {
  iasKt: number;
  altFt: number;
  vsFpm: number;
  headingDeg: number;
  pitchDeg: number;
  bankDeg: number;
  thrustPct: number;
  stalled: boolean;
  onGround: boolean;
};

type Props = {
  width: number;
  height: number;
  data: PFDData;
};

const FMA_H = 28;
const HDG_H = 44;
const SPD_W = 64;
const ALT_W = 72;
const VSI_W = 28;

export default function PFD({ width, height, data }: Props) {
  const bodyH = Math.max(0, height - FMA_H - HDG_H);
  const adiW = Math.max(0, width - SPD_W - ALT_W - VSI_W);

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={[styles.fmaRow, { height: FMA_H }]}>
        <Text style={styles.fmaCell}>SPEED</Text>
        <Text style={styles.fmaCell}>APP-DES</Text>
        <Text style={styles.fmaCell}>NAV</Text>
        <Text style={styles.fmaMin}>
          THR {Math.round(data.thrustPct)}%
        </Text>
      </View>

      <View style={[styles.body, { height: bodyH }]}>
        <SpeedTape iasKt={data.iasKt} width={SPD_W} height={bodyH} />
        <View style={{ width: adiW, height: bodyH }}>
          <AttitudeIndicator
            pitchDeg={data.pitchDeg}
            bankDeg={data.bankDeg}
            width={adiW}
            height={bodyH}
          />
          {data.stalled && (
            <View style={styles.stallBanner}>
              <Text style={styles.stallText}>STALL</Text>
            </View>
          )}
          {data.onGround && (
            <View style={styles.groundBanner}>
              <Text style={styles.groundText}>GROUND</Text>
            </View>
          )}
        </View>
        <AltitudeTape altFt={data.altFt} width={ALT_W} height={bodyH} />
        <VSI vsFpm={data.vsFpm} width={VSI_W} height={bodyH} />
      </View>

      <HeadingTape
        headingDeg={data.headingDeg}
        width={width}
        height={HDG_H}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#ffe600",
    overflow: "hidden",
  },
  fmaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,230,0,0.4)",
    gap: 8,
  },
  fmaCell: {
    flex: 1,
    textAlign: "center",
    color: "#00e676",
    fontSize: 12,
    fontWeight: "700",
  },
  fmaMin: {
    color: "#00e5ff",
    fontSize: 12,
    fontWeight: "700",
  },
  body: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  stallBanner: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#ff1744",
    backgroundColor: "rgba(0,0,0,0.5)",
    left: "50%",
    marginLeft: -40,
    width: 80,
    alignItems: "center",
  },
  stallText: {
    color: "#ff1744",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  groundBanner: {
    position: "absolute",
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: "#ffb300",
    backgroundColor: "rgba(0,0,0,0.5)",
    left: "50%",
    marginLeft: -50,
    width: 100,
    alignItems: "center",
  },
  groundText: {
    color: "#ffb300",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
