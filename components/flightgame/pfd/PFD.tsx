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
  locNorm?: number;
  gsNorm?: number;
  locValid?: boolean;
  gsValid?: boolean;
  fpaDeg?: number;
  birdTrackDeg?: number;
  ilsDmeNm?: number;
};

type Props = {
  width: number;
  height: number;
  data: PFDData;
};

const FMA_H = 68;
const HDG_H = 50;
const SPD_W = 64;
const ALT_W = 72;
const VSI_W = 28;

export default function PFD({ width, height, data }: Props) {
  const bodyH = Math.max(0, height - FMA_H);
  const adiH = Math.max(0, bodyH - HDG_H);
  const adiW = Math.max(0, width - SPD_W - ALT_W - VSI_W);

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={[styles.fmaRow, { height: FMA_H }]}>
        <View style={styles.fmaCol}>
          <Text style={[styles.fmaText, {color: '#00ff00'}]}>SPEED</Text>
          <Text style={[styles.fmaText, {color: '#00ffff'}]}>BTV</Text>
        </View>
        <View style={styles.fmaDivider} />
        <View style={styles.fmaCol}>
          <View style={styles.fmaBox}>
            <Text style={[styles.fmaText, {color: '#00ff00'}]}>G/S</Text>
          </View>
        </View>
        <View style={styles.fmaDivider} />
        <View style={styles.fmaCol}>
          <Text style={[styles.fmaText, {color: '#00ff00'}]}>LOC</Text>
        </View>
        <View style={styles.fmaDivider} />
        <View style={styles.fmaCol}>
          <Text style={[styles.fmaText, {color: '#ffffff'}]}>CAT3</Text>
          <Text style={[styles.fmaText, {color: '#ffffff'}]}>DUAL</Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.fmaText, {color: '#cccccc'}]}>BARO </Text>
            <Text style={[styles.fmaText, {color: '#00ffff'}]}>528</Text>
          </View>
        </View>
        <View style={styles.fmaDivider} />
        <View style={styles.fmaCol}>
          <Text style={[styles.fmaText, {color: '#ffffff'}]}>AP1+2</Text>
          <Text style={[styles.fmaText, {color: '#ffffff'}]}>1FD2</Text>
          <Text style={[styles.fmaText, {color: '#ffffff'}]}>A/THR</Text>
        </View>
      </View>

      <View style={[styles.body, { height: bodyH }]}>
        <SpeedTape iasKt={data.iasKt} width={SPD_W} height={bodyH} />
        <View style={{ width: adiW, height: bodyH }}>
          <AttitudeIndicator
            pitchDeg={data.pitchDeg}
            bankDeg={data.bankDeg}
            locNorm={data.locNorm}
            gsNorm={data.gsNorm}
            locValid={data.locValid}
            gsValid={data.gsValid}
            fpaDeg={data.fpaDeg}
            birdTrackDeg={data.birdTrackDeg}
            ilsDmeNm={data.ilsDmeNm}
            width={adiW}
            height={adiH}
          />
          <HeadingTape
            headingDeg={data.headingDeg}
            width={adiW}
            height={HDG_H}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    overflow: "hidden",
  },
  fmaRow: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 0,
  },
  fmaCol: {
    flex: 1,
    alignItems: "center",
    paddingTop: 4,
  },
  fmaDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 4,
  },
  fmaText: {
    fontSize: 16,
    fontFamily: "Courier",
    lineHeight: 20,
  },
  fmaBox: {
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingHorizontal: 4,
    paddingVertical: 1,
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
