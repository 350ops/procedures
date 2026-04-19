import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Line } from "react-native-svg";

const RED = "#ef4444";
const GREEN = "#22c55e";
const BLUE = "#5b8de6";
const WHITE = "#ffffff";
const YELLOW = "#facc15";

export default function HydPage() {
  return (
    <View style={styles.page}>
      {/* Camera icon top-right */}
      <View style={styles.camBox}>
        <Text style={styles.camGlyph}>◉</Text>
      </View>

      {/* Column headers */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { color: RED }]}>RED</Text>
        <Text style={[styles.headerCell, { color: BLUE }]}>BLUE</Text>
        <Text style={[styles.headerCell, { color: GREEN }]}>GREEN</Text>
        <Text style={[styles.headerCell, { color: WHITE }]}>WHITE</Text>
      </View>

      {/* PSI row */}
      <View style={styles.psiRow}>
        <View style={styles.psiCell}>
          <Text style={[styles.psiValue, { color: BLUE }]}>0</Text>
          <Text style={[styles.psiUnit, { color: BLUE }]}>PSI</Text>
        </View>
        <View style={styles.psiCell}>
          <Text style={[styles.psiValue, { color: RED }]}>0</Text>
          <Text style={[styles.psiUnit, { color: RED }]}>PSI</Text>
        </View>
        <View style={styles.psiCell}>
          <Text style={[styles.psiValue, { color: WHITE }]}>2500</Text>
          <Text style={[styles.psiUnit, { color: WHITE }]}>PSI</Text>
        </View>
        <View style={styles.psiCell}>
          <Text style={[styles.psiValue, { color: GREEN }]}>2500</Text>
          <Text style={[styles.psiUnit, { color: GREEN }]}>PSI</Text>
        </View>
      </View>

      {/* Schematic area */}
      <View style={styles.schematic}>
        {/* SVG lines */}
        <Svg
          style={StyleSheet.absoluteFill}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          {/* Vertical main lines (upper portion) */}
          <Line x1="10%" y1="0%" x2="10%" y2="45%" stroke={RED} strokeWidth={3} />
          <Line x1="35%" y1="0%" x2="35%" y2="55%" stroke={BLUE} strokeWidth={3} />
          <Line x1="60%" y1="0%" x2="60%" y2="55%" stroke={GREEN} strokeWidth={3} />
          <Line x1="85%" y1="0%" x2="85%" y2="45%" stroke={WHITE} strokeWidth={3} />

          {/* Horizontal cross feeds */}
          <Line x1="10%" y1="18%" x2="35%" y2="18%" stroke={RED} strokeWidth={3} />
          <Line x1="35%" y1="38%" x2="60%" y2="38%" stroke={RED} strokeWidth={3} />
          <Line x1="60%" y1="18%" x2="85%" y2="18%" stroke={GREEN} strokeWidth={3} />

          {/* Vertical lines (lower portion down to cylinders) */}
          <Line x1="10%" y1="45%" x2="10%" y2="75%" stroke={RED} strokeWidth={3} />
          <Line x1="35%" y1="55%" x2="35%" y2="75%" stroke={BLUE} strokeWidth={3} />
          <Line x1="60%" y1="55%" x2="60%" y2="75%" stroke={GREEN} strokeWidth={3} />
          <Line x1="85%" y1="45%" x2="85%" y2="75%" stroke={WHITE} strokeWidth={3} />
        </Svg>

        {/* LH X FEED valve */}
        <View style={[styles.valve, { left: "20%", top: "16%" }]}>
          <View style={styles.valveCircle}>
            <View style={styles.valveBar} />
          </View>
          <Text style={styles.valveLabel}>LH X FEED</Text>
        </View>

        {/* CE X FEED valve */}
        <View style={[styles.valve, { left: "46%", top: "36%" }]}>
          <View style={styles.valveCircle}>
            <View style={styles.valveBar} />
          </View>
          <Text style={[styles.valveLabel, { marginTop: 4 }]}>CE X FEED</Text>
        </View>

        {/* RH X FEED valve */}
        <View style={[styles.valve, { left: "72%", top: "16%" }]}>
          <View style={styles.valveCircle}>
            <View style={styles.valveBar} />
          </View>
          <Text style={styles.valveLabel}>RH X FEED</Text>
        </View>

        {/* RED LOW box 1 (with CB marker) */}
        <View style={[styles.pumpBox, { left: "10%", top: "45%" }]}>
          <View style={[styles.cbTag, { borderColor: RED }]}>
            <Text style={[styles.cbText, { color: RED }]}>CB 1{"\n"}ON</Text>
          </View>
          <View style={[styles.statusBox, { borderColor: RED }]}>
            <Text style={[styles.statusText, { color: RED }]}>LOW</Text>
          </View>
        </View>

        {/* BLUE LOW box */}
        <View style={[styles.pumpBox, { left: "35%", top: "55%" }]}>
          <View style={[styles.statusBox, { borderColor: BLUE }]}>
            <Text style={[styles.statusText, { color: BLUE }]}>LOW</Text>
          </View>
        </View>

        {/* GREEN HYD PUMP ON */}
        <View style={[styles.pumpBox, { left: "60%", top: "55%" }]}>
          <View style={[styles.statusBoxTall, { borderColor: GREEN }]}>
            <Text style={[styles.pumpText, { color: GREEN }]}>
              GREEN{"\n"}HYD{"\n"}PUMP{"\n"}ON
            </Text>
          </View>
        </View>

        {/* WHITE HYD PUMP ON */}
        <View style={[styles.pumpBox, { left: "85%", top: "45%" }]}>
          <View style={[styles.cbTag, { borderColor: WHITE }]}>
            <Text style={[styles.cbText, { color: WHITE }]}>CB 1{"\n"}ON</Text>
          </View>
          <View style={[styles.statusBoxTall, { borderColor: WHITE }]}>
            <Text style={[styles.pumpText, { color: WHITE }]}>
              WHITE{"\n"}HYD{"\n"}PUMP{"\n"}ON
            </Text>
          </View>
        </View>

        {/* Reservoir cylinders */}
        <View style={[styles.tankWrap, { left: "10%", top: "77%" }]}>
          <View style={[styles.tankFrame, { borderColor: RED }]} />
        </View>
        <View style={[styles.tankWrap, { left: "35%", top: "77%" }]}>
          <View style={[styles.tankFrame, { borderColor: BLUE }]} />
        </View>
        <View style={[styles.tankWrap, { left: "60%", top: "77%" }]}>
          <View style={[styles.tankFrame, { borderColor: GREEN }]}>
            <View style={[styles.tankFill, { backgroundColor: GREEN }]} />
          </View>
        </View>
        <View style={[styles.tankWrap, { left: "85%", top: "77%" }]}>
          <View style={[styles.tankFrame, { borderColor: WHITE }]}>
            <View style={[styles.tankFill, { backgroundColor: WHITE }]} />
          </View>
        </View>
      </View>

      {/* Checklist */}
      <View style={styles.checklistWrap}>
        <Text style={styles.checklistHeader}>CHECKLIST</Text>
        <View style={styles.checklistLines}>
          <Text style={styles.checklistLine}>LH X FEED ON</Text>
          <Text style={styles.checklistLine}>CE X FEED ON</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  camBox: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 44,
    height: 44,
    borderWidth: 3,
    borderColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  camGlyph: {
    color: BLUE,
    fontSize: 20,
  },
  headerRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 2,
  },
  psiRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  psiCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  psiValue: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Courier",
  },
  psiUnit: {
    fontSize: 11,
    fontWeight: "700",
  },
  schematic: {
    flex: 1,
    position: "relative",
    marginHorizontal: 4,
  },
  valve: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  valveCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: YELLOW,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  valveBar: {
    width: 3,
    height: 22,
    backgroundColor: YELLOW,
  },
  valveLabel: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    letterSpacing: 1,
  },
  pumpBox: {
    position: "absolute",
    width: 52,
    transform: [{ translateX: -26 }],
    alignItems: "center",
  },
  cbTag: {
    borderWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginBottom: 3,
    backgroundColor: "#000",
  },
  cbText: {
    fontSize: 8,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 10,
  },
  statusBox: {
    borderWidth: 2,
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBoxTall: {
    borderWidth: 2,
    backgroundColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 58,
  },
  pumpText: {
    fontSize: 8,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 10,
  },
  tankWrap: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -9 }],
  },
  tankFrame: {
    width: 18,
    height: 56,
    borderWidth: 2,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  tankFill: {
    width: "100%",
    height: "100%",
  },
  checklistWrap: {
    alignItems: "center",
    marginTop: 4,
  },
  checklistHeader: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "Courier",
  },
  checklistLines: {
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  checklistLine: {
    color: "#ffffff",
    fontSize: 11,
    fontFamily: "Courier",
    lineHeight: 15,
  },
});
