/**
 * A350 Flight Crew Task Sharing Data
 * Source: FCOM Normal Procedures - Task Sharing (PRO-NOR-TSK)
 * QTR A350 Fleet, 07 DEC 23
 *
 * Role labels:
 *   CM1 = Commander (left seat)
 *   CM2 = Co-pilot (right seat)
 *   PF  = Pilot Flying
 *   PM  = Pilot Monitoring
 *   BOTH = shared action
 */

export type CrewRole = "CM1" | "CM2" | "PF" | "PM" | "BOTH";
export type RoleLabeling = "CM1_CM2" | "PF_PM";

export interface TaskItem {
  id: string;
  action: string;
  value: string;
  role: CrewRole;
  condition?: string;
}

export interface TaskSection {
  id: string;
  title: string;
  roleLabeling: RoleLabeling;
  items: TaskItem[];
}

export interface FlightPhase {
  id: string;
  name: string;
  icon: string; // SF Symbol name
  sections: TaskSection[];
}

export const flightPhases: FlightPhase[] = [
  // ─────────────────────────────────────────
  // SAFETY EXTERIOR INSPECTION
  // ─────────────────────────────────────────
  {
    id: "safety-exterior-inspection",
    name: "Safety Exterior Inspection",
    icon: "eye.fill",
    sections: [
      {
        id: "sei-main",
        title: "Safety Exterior Inspection",
        roleLabeling: "CM1_CM2",
        items: [
          { id: "sei-1", action: "WHEEL CHOCKS", value: "CHECK", role: "CM2" },
          {
            id: "sei-2",
            action: "L/G DOORS",
            value: "CHECK POSITION",
            role: "CM2",
          },
          { id: "sei-3", action: "APU AREA", value: "CHECK", role: "CM2" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // PRELIMINARY COCKPIT PREPARATION
  // ─────────────────────────────────────────
  {
    id: "prelim-cockpit-prep",
    name: "Preliminary Cockpit Preparation",
    icon: "checklist",
    sections: [
      {
        id: "pcp-aircraft-setup",
        title: "Aircraft Setup",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-1",
            action: "ENG 1, 2 MASTER LEVERS",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "pcp-2",
            action: "ENG START selector",
            value: "NORM",
            role: "CM2",
          },
          { id: "pcp-3", action: "L/G lever", value: "DOWN", role: "CM2" },
          {
            id: "pcp-4",
            action: "Both WIPER selectors",
            value: "OFF",
            role: "CM2",
          },
        ],
      },
      {
        id: "pcp-batteries",
        title: "Batteries / External Power",
        roleLabeling: "CM1_CM2",
        items: [
          { id: "pcp-5", action: "All BAT", value: "CHECK", role: "CM2" },
          { id: "pcp-6", action: "EXT PB", value: "AUTO", role: "CM2" },
        ],
      },
      {
        id: "pcp-adirs",
        title: "ADIRS",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-7",
            action: "All IR MODE selectors",
            value: "OFF then NAV",
            role: "CM1",
          },
        ],
      },
      {
        id: "pcp-lights",
        title: "Cockpit Lights",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-8",
            action: "COCKPIT LIGHTS",
            value: "AS RQRD",
            role: "BOTH",
          },
        ],
      },
      {
        id: "pcp-pa",
        title: "PA Check",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-9",
            action: "PA CHECK",
            value: "PERFORM",
            role: "CM1",
          },
        ],
      },
      {
        id: "pcp-ois",
        title: "OIS Initialization",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-10",
            action: "ALL EFB LAPTOPS",
            value: "START",
            role: "BOTH",
          },
          {
            id: "pcp-11",
            action: "ACFT STATUS (FMS DATA/STATUS page)",
            value: "CHECK",
            role: "CM1",
          },
          {
            id: "pcp-12",
            action: "FMS INIT / F-PLN",
            value: "INSERT / REQUEST",
            role: "CM1",
          },
          {
            id: "pcp-13",
            action: "EFB FLT OPS STS page",
            value: "CHECK",
            role: "BOTH",
          },
          {
            id: "pcp-14",
            action: "NAV CHARTS",
            value: "START / CHECK VALIDITY DATE",
            role: "BOTH",
          },
          {
            id: "pcp-15",
            action: "OPS LIBRARY",
            value: "START",
            role: "BOTH",
          },
          {
            id: "pcp-16",
            action: "REQUIRED APPLICATIONS",
            value: "LAUNCH",
            role: "BOTH",
          },
        ],
      },
      {
        id: "pcp-anf",
        title: "ANF",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-17",
            action: "ANF DATABASE",
            value: "CHECK",
            role: "CM1",
          },
        ],
      },
      {
        id: "pcp-acceptance",
        title: "Aircraft Acceptance",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-18",
            action: "RCL ALL pb",
            value: "PRESS 3 s",
            role: "CM1",
          },
          {
            id: "pcp-19",
            action: "DISPCH pb",
            value: "PRESS",
            role: "CM1",
          },
          {
            id: "pcp-20",
            action: "LOGBOOK AND MEL/CDL ITEMS",
            value: "CHECK",
            role: "BOTH",
          },
          {
            id: "pcp-21",
            action: "AIRCRAFT CONFIGURATION SUMMARY",
            value: "CHECK",
            role: "BOTH",
          },
          { id: "pcp-22", action: "OEB", value: "CHECK", role: "BOTH" },
          {
            id: "pcp-23",
            action: "AIRCRAFT ACCEPTANCE",
            value: "PERFORM",
            role: "CM1",
          },
        ],
      },
      {
        id: "pcp-fire-apu",
        title: "Fire Test / APU Start",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-24",
            action: "RMP 1 and 2",
            value: "CHECK ON/SET",
            role: "CM2",
          },
          {
            id: "pcp-25",
            action: "FIRE TEST",
            value: "PERFORM",
            role: "CM2",
          },
          { id: "pcp-26", action: "APU", value: "START", role: "CM2" },
          {
            id: "pcp-27",
            action: "AIR panel (when APU AVAIL)",
            value: "SET",
            role: "CM2",
          },
          {
            id: "pcp-28",
            action: "EXT pb",
            value: "AS RQRD",
            role: "CM2",
          },
        ],
      },
      {
        id: "pcp-ois-prep",
        title: "OIS Preparation",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pcp-29",
            action: "AIRFIELD DATA",
            value: "OBTAIN",
            role: "BOTH",
          },
          {
            id: "pcp-30",
            action: "MEL/CDL ITEMS",
            value: "CHECK ACTIVATED",
            role: "BOTH",
          },
          {
            id: "pcp-31",
            action: "NAV CHARTS CLIPBOARD",
            value: "PREPARE",
            role: "BOTH",
          },
          {
            id: "pcp-32",
            action: "OIS PRELIM T.O PERF DATA",
            value: "COMPUTE",
            role: "BOTH",
          },
          {
            id: "pcp-33",
            action: "OIS PRELIM T.O PERF DATA",
            value: "CROSSCHECK",
            role: "BOTH",
          },
          {
            id: "pcp-34",
            action: "FINAL FUEL MESSAGE",
            value: "SEND",
            role: "CM1",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // BEFORE WALKAROUND
  // ─────────────────────────────────────────
  {
    id: "before-walkaround",
    name: "Before Walkaround",
    icon: "figure.walk",
    sections: [
      {
        id: "bw-main",
        title: "Before Walkaround",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "bw-1",
            action: "ECAM OXY PRESS / RAIN RPLNT / HYD QTY / ENG OIL QTY",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "bw-2",
            action: "FLAPS",
            value: "CHECK POSITION",
            role: "PM",
          },
          {
            id: "bw-3",
            action: "SPEED BRAKES",
            value: "CHECK RETRACTED/DISARMED",
            role: "PM",
          },
          {
            id: "bw-4",
            action: "ACCU PRESS",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "bw-5",
            action: "PARK BRK handle",
            value: "ON",
            role: "PM",
          },
          {
            id: "bw-6",
            action: "PARK BRK indication",
            value: "CHECK DISPLAYED",
            role: "PM",
          },
          {
            id: "bw-7",
            action: "EMER EQPT",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "bw-8",
            action: "GEAR PINS and COVERS",
            value: "CHECK ONBOARD and STOWED",
            role: "PM",
          },
          {
            id: "bw-9",
            action: "AIRCRAFT LIBRARY",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "bw-10",
            action: "COCKPIT SECURITY CHECK",
            value: "PERFORM",
            role: "PM",
          },
          {
            id: "bw-11",
            action: "COCKPIT DOOR",
            value: "CLOSE",
            role: "PM",
          },
          {
            id: "bw-12",
            action: "EMERGENCY ACCESS",
            value: "ENTER CODE",
            role: "PM",
          },
          {
            id: "bw-13",
            action: "COCKPIT DOOR sw",
            value: "UNLOCK",
            role: "PM",
          },
          {
            id: "bw-14",
            action: "EXTERIOR WALKAROUND",
            value: "PERFORM",
            role: "PM",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // COCKPIT PREPARATION
  // ─────────────────────────────────────────
  {
    id: "cockpit-prep",
    name: "Cockpit Preparation",
    icon: "airplane",
    sections: [
      {
        id: "cp-overhead",
        title: "Overhead Panel",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-1",
            action: "All white lights (except MAINTENANCE panel)",
            value: "OFF",
            role: "PF",
          },
          {
            id: "cp-2",
            action: "CAPT/CAPT & PURS sw",
            value: "CAPT position",
            role: "PF",
          },
          {
            id: "cp-3",
            action: "RCDR GND CTL pb",
            value: "ON",
            role: "PF",
          },
          {
            id: "cp-4",
            action: "ELT",
            value: "ARMED",
            role: "PF",
          },
          {
            id: "cp-5",
            action: "All IR MODE selectors",
            value: "OFF then NAV",
            role: "PF",
          },
          {
            id: "cp-6",
            action: "CKPT EQPT POWER SUPPLY buttons (left side)",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "cp-7",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PF",
          },
          {
            id: "cp-8",
            action: "SIGNS panel",
            value: "SET",
            role: "PF",
          },
          {
            id: "cp-9",
            action: "PROBE & WINDOW HEAT pb-sw",
            value: "AUTO",
            role: "PF",
          },
          {
            id: "cp-10",
            action: "AIR panel",
            value: "CHECK/SET",
            role: "PF",
          },
          {
            id: "cp-11",
            action: "MAINTENANCE panel",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "cp-12",
            action: "CARGO AIR COND panel",
            value: "AS RQRD",
            role: "PF",
          },
          {
            id: "cp-13",
            action: "CVR TEST pb",
            value: "PRESS",
            role: "PF",
          },
          {
            id: "cp-14",
            action: "CKPT EQPT POWER SUPPLY buttons (right side)",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "cp-15",
            action: "RESET buttons (right side)",
            value: "CHECK",
            role: "PF",
          },
        ],
      },
      {
        id: "cp-ctr-panel",
        title: "Center Instrument Panel",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-16",
            action: "AIR DATA selector",
            value: "AUTO",
            role: "PF",
          },
          {
            id: "cp-17",
            action: "FMS selector",
            value: "NORM",
            role: "PF",
          },
          { id: "cp-18", action: "ISIS", value: "CHECK", role: "PF" },
          {
            id: "cp-19",
            action: "ANTI SKID sw",
            value: "ON",
            role: "PF",
          },
        ],
      },
      {
        id: "cp-pedestal",
        title: "Pedestal",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-20",
            action: "RMP 1",
            value: "CHECK ON/SET",
            role: "PF",
          },
          {
            id: "cp-21",
            action: "ACCU PRESS",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "cp-22",
            action: "PARK BRK handle",
            value: "ON",
            role: "PF",
          },
          {
            id: "cp-23",
            action: "L/G GRVTY EXTN sw",
            value: "OFF",
            role: "PF",
          },
          {
            id: "cp-24",
            action: "THRUST LEVERS",
            value: "IDLE",
            role: "PF",
          },
          {
            id: "cp-25",
            action: "THRUST REVERSER LEVERS",
            value: "STOWED",
            role: "PF",
          },
          {
            id: "cp-26",
            action: "ENG 1, 2 MASTER LEVERS",
            value: "OFF",
            role: "PF",
          },
          {
            id: "cp-27",
            action: "ENG START selector",
            value: "NORM",
            role: "PF",
          },
          {
            id: "cp-28",
            action: "CKPT DOOR sw",
            value: "NORM",
            role: "PF",
          },
          {
            id: "cp-29",
            action: "RMP 2",
            value: "CHECK ON/SET",
            role: "PF",
          },
          {
            id: "cp-30",
            action: "STBY RAD NAV key",
            value: "CHECK OFF",
            role: "PF",
          },
          {
            id: "cp-31",
            action: "RMP 3",
            value: "CHECK ON/SET",
            role: "PF",
          },
        ],
      },
      {
        id: "cp-fms",
        title: "FMS Preparation",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-32",
            action: "MSG RECORD (MFD ATC COM)",
            value: "CHECK NO STORED MSG",
            role: "PF",
          },
          {
            id: "cp-33",
            action: "XPDR (MFD SURV)",
            value: "STBY",
            role: "PF",
          },
          {
            id: "cp-34",
            action: "FMS",
            value: "PREPARE",
            role: "PF",
          },
          {
            id: "cp-35",
            action: "ACTIVE F-PLN",
            value: "CHECK/COMPLETE",
            role: "PF",
          },
          {
            id: "cp-36",
            action: "ROUTE SUMMARY",
            value: "CHECK versus ATC F-PLN",
            role: "PF",
          },
          {
            id: "cp-37",
            action: "FMS PREPARATION",
            value: "CROSSCHECK",
            role: "PM",
          },
        ],
      },
      {
        id: "cp-glareshield",
        title: "Glareshield",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-38",
            action: "LOUDSPEAKER knob",
            value: "SET",
            role: "BOTH",
          },
          {
            id: "cp-39",
            action: "BAROMETRIC REFERENCE",
            value: "SET/CROSSCHECK",
            role: "BOTH",
          },
          {
            id: "cp-40",
            action: "EFIS CP",
            value: "SET",
            role: "BOTH",
          },
          {
            id: "cp-41",
            action: "AFS CP",
            value: "CHECK/SET",
            role: "PF",
          },
          {
            id: "cp-42",
            action: "AFS CP",
            value: "CROSSCHECK",
            role: "PM",
          },
        ],
      },
      {
        id: "cp-consoles",
        title: "Lateral Console and Instrument Panels",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-43",
            action: "OXYGEN MASK",
            value: "TEST",
            role: "BOTH",
          },
          {
            id: "cp-44",
            action: "PFD-ND",
            value: "CHECK",
            role: "BOTH",
          },
        ],
      },
      {
        id: "cp-fob",
        title: "Fuel On Board",
        roleLabeling: "PF_PM",
        items: [
          { id: "cp-45", action: "FOB", value: "CHECK", role: "BOTH" },
        ],
      },
      {
        id: "cp-atc",
        title: "ATC",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-46",
            action: "ATC CLEARANCE",
            value: "OBTAIN and SET",
            role: "PM",
          },
        ],
      },
      {
        id: "cp-briefing",
        title: "Departure Briefing",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-47",
            action: "DEPARTURE BRIEFING",
            value: "PERFORM",
            role: "PF",
          },
        ],
      },
      {
        id: "cp-cl",
        title: "Cockpit Preparation Checklist",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cp-48",
            action: "COCKPIT PREPARATION C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // BEFORE PUSHBACK OR START
  // ─────────────────────────────────────────
  {
    id: "before-start",
    name: "Before Pushback or Start",
    icon: "arrow.backward.circle",
    sections: [
      {
        id: "bs-clearance",
        title: "Before Start Clearance",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "bs-1",
            action: "FINAL LOADSHEET",
            value: "INSERT IN FMS / CROSSCHECK",
            role: "BOTH",
          },
          {
            id: "bs-2",
            action: "LS Acceptance",
            value: "PERFORM",
            role: "CM1",
          },
          {
            id: "bs-3",
            action: "OFP Filing",
            value: "PERFORM",
            role: "CM2",
          },
          {
            id: "bs-4",
            action: "OIS FINAL T.O PERF DATA",
            value: "XCHECK WITH AVNCS",
            role: "BOTH",
          },
          {
            id: "bs-5",
            action: "SEATING POSITION",
            value: "ADJUST",
            role: "BOTH",
          },
          {
            id: "bs-6",
            action: "AIR CONDITIONING UNITS",
            value: "CHECK DISCONNECTED",
            role: "CM2",
          },
          {
            id: "bs-7",
            action: "EXT PWR",
            value: "CHECK AVAIL",
            role: "CM2",
          },
          {
            id: "bs-8",
            action: "EXT PWR DISCONNECTION",
            value: "REQUEST",
            role: "CM2",
          },
        ],
      },
      {
        id: "bs-at-start",
        title: "At Start Clearance",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "bs-9",
            action: "GROUND CLEARANCE",
            value: "OBTAIN",
            role: "CM1",
          },
          {
            id: "bs-10",
            action: "DOORS",
            value: "CHECK CLOSED",
            role: "BOTH",
          },
          {
            id: "bs-11",
            action: "PA TO CABIN",
            value: "PERFORM",
            role: "CM1",
          },
          {
            id: "bs-12",
            action: "SLIDES",
            value: "CHECK ARMED",
            role: "BOTH",
          },
          {
            id: "bs-13",
            action: "ATC CLEARANCE",
            value: "OBTAIN",
            role: "CM2",
          },
          {
            id: "bs-14",
            action: "BEACON sw",
            value: "ON",
            role: "CM1",
          },
          {
            id: "bs-15",
            action: "TAXI VIDEO",
            value: "AS RQRD",
            role: "BOTH",
          },
          {
            id: "bs-16",
            action: "SURV DEFAULT SETTINGS",
            value: "SELECT",
            role: "BOTH",
          },
          {
            id: "bs-17",
            action: "THRUST LEVERS",
            value: "IDLE",
            role: "CM1",
          },
          {
            id: "bs-18",
            action: "ACCU PRESS",
            value: "CHECK",
            role: "CM1",
          },
          {
            id: "bs-19",
            action: "BEFORE START C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // ENGINE START
  // ─────────────────────────────────────────
  {
    id: "engine-start",
    name: "Engine Start",
    icon: "engine.combustion.fill",
    sections: [
      {
        id: "es-main",
        title: "Engine Start",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "es-1",
            action: "THRUST LEVERS",
            value: "IDLE",
            role: "CM1",
          },
          {
            id: "es-2",
            action: "ENG START selector",
            value: "IGN START",
            role: "CM1",
          },
          {
            id: "es-3",
            action: "ENGINE 1 START",
            value: "ANNOUNCE",
            role: "CM1",
          },
          {
            id: "es-4",
            action: "ENG 1 MASTER lever",
            value: "ON",
            role: "CM1",
          },
          {
            id: "es-5",
            action: "ENG IDLE PARAMETERS",
            value: "CHECK",
            role: "CM1",
          },
          {
            id: "es-6",
            action: "REPEAT START SEQUENCE FOR ENG 2",
            value: "",
            role: "CM1",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // AFTER START
  // ─────────────────────────────────────────
  {
    id: "after-start",
    name: "After Start",
    icon: "checkmark.engine.combustion",
    sections: [
      {
        id: "as-main",
        title: "After Start",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "as-1",
            action: "ENG START selector",
            value: "NORM",
            role: "CM1",
          },
          {
            id: "as-2",
            action: "APU BLEED pb-sw",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "as-3",
            action: "GND SPLRS",
            value: "ARM",
            role: "CM2",
          },
          {
            id: "as-4",
            action: "ENG 1 and 2 ANTI ICE pb-sw",
            value: "AS RQRD",
            role: "CM1",
          },
          {
            id: "as-5",
            action: "RUDDER TRIM",
            value: "CHECK NEUTRAL",
            role: "CM2",
          },
          {
            id: "as-6",
            action: "WING ANTI ICE pb-sw",
            value: "AS RQRD",
            role: "CM1",
          },
          {
            id: "as-7",
            action: "FLAPS",
            value: "SET",
            role: "CM2",
          },
          {
            id: "as-8",
            action: "APU MASTER SW pb-sw (if APU not required)",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "as-9",
            action: "PITCH TRIM",
            value: "CHECK",
            role: "CM2",
          },
          {
            id: "as-10",
            action: "ECAM STATUS",
            value: "CHECK",
            role: "BOTH",
          },
          {
            id: "as-11",
            action: "N/W STEER DISC MEMO",
            value: "CHECK NOT DISPLAYED",
            role: "CM1",
          },
          {
            id: "as-12",
            action: "CLEAR TO DISCONNECT",
            value: "ANNOUNCE",
            role: "CM1",
          },
          {
            id: "as-13",
            action: "FLIGHT CONTROLS",
            value: "CHECK",
            role: "BOTH",
          },
          {
            id: "as-14",
            action: "AFTER START C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // TAXI
  // ─────────────────────────────────────────
  {
    id: "taxi",
    name: "Taxi",
    icon: "road.lanes",
    sections: [
      {
        id: "taxi-main",
        title: "Taxi",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "tx-1",
            action: "TAXI pb on EFIS CP",
            value: "AS RQRD",
            role: "BOTH",
          },
          {
            id: "tx-2",
            action: "TAXI CLEARANCE",
            value: "OBTAIN and CONFIRM",
            role: "BOTH",
          },
          {
            id: "tx-3",
            action: "ND RANGE selector",
            value: "ZOOM, AS APPROPRIATE",
            role: "BOTH",
          },
          {
            id: "tx-4",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PF",
          },
          {
            id: "tx-5",
            action: "PARK BRK handle",
            value: "OFF",
            role: "PF",
          },
          {
            id: "tx-6",
            action: "BRAKES",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "tx-7",
            action: "BRAKE FAN pb",
            value: "AS RQRD",
            role: "PM",
          },
          {
            id: "tx-8",
            action: "ATC CLEARANCE",
            value: "CONFIRM",
            role: "PM",
          },
          {
            id: "tx-9",
            action: "F-PLN/SPD",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "tx-10",
            action: "FMS ACTIVE/PERF page",
            value: "SET",
            role: "PF",
          },
          {
            id: "tx-11",
            action: "FMS ACTIVE/F-PLN page",
            value: "SET",
            role: "PM",
          },
          {
            id: "tx-12",
            action: "AFS CP",
            value: "SET",
            role: "PM",
          },
          {
            id: "tx-13",
            action: "FD",
            value: "CHECK ON",
            role: "PM",
          },
          {
            id: "tx-14",
            action: "PFD/ND",
            value: "CHECK",
            role: "BOTH",
          },
          {
            id: "tx-15",
            action: "DEPARTURE BRIEFING",
            value: "CONFIRM",
            role: "PF",
          },
          {
            id: "tx-16",
            action: "EFIS CP",
            value: "AS RQRD",
            role: "BOTH",
          },
          {
            id: "tx-17",
            action: "A/BRK pb",
            value: "ARM",
            role: "PM",
          },
          {
            id: "tx-18",
            action: "SQUAWK",
            value: "CONFIRM/SET",
            role: "PM",
          },
          {
            id: "tx-19",
            action: "T.O CONFIG pb",
            value: "TEST",
            role: "PM",
          },
          {
            id: "tx-20",
            action: "T.O MEMO",
            value: "CHECK NO BLUE",
            role: "PM",
          },
          {
            id: "tx-21",
            action: "TAXI C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // BEFORE TAKEOFF
  // ─────────────────────────────────────────
  {
    id: "before-takeoff",
    name: "Before Takeoff",
    icon: "arrow.up.right",
    sections: [
      {
        id: "bto-main",
        title: "Before Takeoff",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "bto-1",
            action: "TAKEOFF REVIEW",
            value: "PERFORM",
            role: "PM",
          },
          {
            id: "bto-2",
            action: "TAKEOFF REVIEW",
            value: "CONFIRM",
            role: "PF",
          },
          {
            id: "bto-3",
            action: "CABIN REPORT",
            value: "RECEIVE",
            role: "BOTH",
          },
          {
            id: "bto-4",
            action: "LINE-UP CLEARANCE",
            value: "OBTAIN",
            role: "PM",
          },
          {
            id: "bto-5",
            action: "EFIS CP",
            value: "SET",
            role: "BOTH",
          },
          {
            id: "bto-6",
            action: "TA pb",
            value: "TA ONLY or TA/RA",
            role: "PM",
          },
          {
            id: "bto-7",
            action: "TAKEOFF RUNWAY",
            value: "CONFIRM",
            role: "BOTH",
          },
          {
            id: "bto-8",
            action: "APPROACH PATH",
            value: "CLEARED OF TRAFFIC",
            role: "BOTH",
          },
          {
            id: "bto-9",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PF",
          },
          {
            id: "bto-10",
            action: "CABIN CREW",
            value: "ADVISE",
            role: "PM",
          },
          {
            id: "bto-11",
            action: "SLIDING TABLE",
            value: "STOW",
            role: "BOTH",
          },
          {
            id: "bto-12",
            action: "PACK 1 and 2",
            value: "AS RQRD",
            role: "PM",
          },
          {
            id: "bto-13",
            action: "LINE-UP CHECKLIST",
            value: "COMPLETE",
            role: "BOTH",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // TAKEOFF
  // ─────────────────────────────────────────
  {
    id: "takeoff",
    name: "Takeoff",
    icon: "airplane.departure",
    sections: [
      {
        id: "to-main",
        title: "Takeoff",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "to-1",
            action: "TAKEOFF CLEARANCE",
            value: "OBTAIN",
            role: "PM",
          },
          {
            id: "to-2",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PF",
          },
          {
            id: "to-3",
            action: "TAKEOFF",
            value: "ANNOUNCE",
            role: "PF",
          },
          {
            id: "to-4",
            action: "THR",
            value: "25 %",
            role: "PF",
          },
          {
            id: "to-5",
            action: "BRAKES",
            value: "RELEASE",
            role: "PF",
          },
          {
            id: "to-6",
            action: "THRUST LEVERS",
            value: "FLX or TOGA",
            role: "PF",
          },
          {
            id: "to-7",
            action: "CHRONO",
            value: "START",
            role: "PM",
          },
          {
            id: "to-8",
            action: "DIRECTIONAL CONTROL",
            value: "USE RUDDER",
            role: "PF",
          },
          {
            id: "to-9",
            action: "PFD/ND",
            value: "MONITOR",
            role: "PM",
          },
          {
            id: "to-10",
            action: "TAKEOFF THRUST (below 80 kt)",
            value: "CHECK",
            role: "PF",
            condition: "Below 80 kt",
          },
          {
            id: "to-11",
            action: "THRUST SET (below 80 kt)",
            value: "ANNOUNCE",
            role: "PF",
            condition: "Below 80 kt",
          },
          {
            id: "to-12",
            action: "100 kt",
            value: "CROSSCHECK",
            role: "PF",
            condition: "At 100 kt",
          },
          {
            id: "to-13",
            action: "ONE HUNDRED KNOTS",
            value: "ANNOUNCE",
            role: "PM",
            condition: "At 100 kt",
          },
          {
            id: "to-14",
            action: "V1",
            value: "MONITOR or ANNOUNCE",
            role: "PF",
            condition: "At V1",
          },
          {
            id: "to-15",
            action: "ROTATION",
            value: "PERFORM",
            role: "PF",
            condition: "At VR",
          },
          {
            id: "to-16",
            action: "ROTATION",
            value: "ORDER",
            role: "PM",
            condition: "At VR",
          },
          {
            id: "to-17",
            action: "POSITIVE CLIMB",
            value: "ANNOUNCE",
            role: "PF",
            condition: "When positive climb",
          },
          {
            id: "to-18",
            action: "L/G UP",
            value: "ORDER",
            role: "PF",
            condition: "When positive climb",
          },
          {
            id: "to-19",
            action: "L/G lever",
            value: "SELECT UP",
            role: "PM",
            condition: "When positive climb",
          },
          {
            id: "to-20",
            action: "AP",
            value: "AS RQRD",
            role: "PF",
            condition: "When positive climb",
          },
          {
            id: "to-21",
            action: "THRUST LEVERS",
            value: "CL",
            role: "PF",
            condition: "At thrust reduction altitude",
          },
          {
            id: "to-22",
            action: "PACKS 1 and 2 (if applicable)",
            value: "ON",
            role: "PM",
            condition: "At thrust reduction altitude",
          },
          {
            id: "to-23",
            action: "FLAPS 1",
            value: "ORDER",
            role: "PF",
            condition: "At F speed",
          },
          {
            id: "to-24",
            action: "FLAPS 1",
            value: "SELECT",
            role: "PM",
            condition: "At F speed",
          },
          {
            id: "to-25",
            action: "FLAPS ZERO",
            value: "ORDER",
            role: "PF",
            condition: "At S speed",
          },
          {
            id: "to-26",
            action: "FLAPS ZERO",
            value: "SELECT",
            role: "PM",
            condition: "At S speed",
          },
          {
            id: "to-27",
            action: "GND SPLRS",
            value: "DISARM",
            role: "PM",
            condition: "At S speed",
          },
          {
            id: "to-28",
            action: "L/G",
            value: "CHECK UP",
            role: "PM",
            condition: "At S speed",
          },
          {
            id: "to-29",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PM",
            condition: "At S speed",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // CLIMB
  // ─────────────────────────────────────────
  {
    id: "climb",
    name: "Climb",
    icon: "arrow.up.forward",
    sections: [
      {
        id: "clb-main",
        title: "Climb",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "clb-1",
            action: "BAROMETRIC REFERENCE",
            value: "SET STD/CROSSCHECK",
            role: "BOTH",
            condition:
              "When approaching transition altitude, cleared for a FL",
          },
          {
            id: "clb-2",
            action: "ANTI ICE pb-sw",
            value: "AS RQRD",
            role: "PM",
          },
          {
            id: "clb-3",
            action: "LDG sw",
            value: "OFF",
            role: "PM",
            condition: "At 10 000 ft",
          },
          {
            id: "clb-4",
            action: "EFIS OPTIONS",
            value: "AS RQRD",
            role: "BOTH",
            condition: "At 10 000 ft",
          },
          {
            id: "clb-5",
            action: "ECAM MEMO",
            value: "REVIEW",
            role: "PM",
            condition: "At 10 000 ft",
          },
          {
            id: "clb-6",
            action: "NAVAIDS",
            value: "CLEAR",
            role: "PM",
            condition: "At 10 000 ft",
          },
          {
            id: "clb-7",
            action: "OPT FL / REC MAX FL",
            value: "CHECK",
            role: "PM",
            condition: "At 10 000 ft",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // CRUISE
  // ─────────────────────────────────────────
  {
    id: "cruise",
    name: "Cruise",
    icon: "arrow.right",
    sections: [
      {
        id: "cru-main",
        title: "Cruise",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "cru-1",
            action: "ECAM MEMO/SD PAGES",
            value: "REVIEW",
            role: "BOTH",
          },
          {
            id: "cru-2",
            action: "FLIGHT PROGRESS",
            value: "CHECK",
            role: "BOTH",
          },
          {
            id: "cru-3",
            action: "STEP FLIGHT LEVEL",
            value: "AS APPROPRIATE",
            role: "BOTH",
          },
          {
            id: "cru-4",
            action: "NAVIGATION ACCURACY (if NAV PRIMARY LOST)",
            value: "MONITOR",
            role: "BOTH",
            condition: "If NAV PRIMARY LOST",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // DESCENT PREPARATION
  // ─────────────────────────────────────────
  {
    id: "descent-prep",
    name: "Descent Preparation",
    icon: "arrow.down.forward",
    sections: [
      {
        id: "dp-main",
        title: "Descent Preparation",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "dp-1",
            action: "WEATHER AND LANDING INFORMATION",
            value: "OBTAIN",
            role: "PM",
          },
          {
            id: "dp-2",
            action: "NAV CHARTS CLIPBOARD",
            value: "PREPARE",
            role: "BOTH",
          },
          {
            id: "dp-3",
            action: "WIND",
            value: "CHECK UPDATE",
            role: "PF",
          },
          {
            id: "dp-4",
            action: "BAROMETRIC REFERENCE",
            value: "PRESET",
            role: "BOTH",
          },
          {
            id: "dp-5",
            action: "STATUS page / STATUS MORE page",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "dp-6",
            action: "SYNCHRO ECAM button",
            value: "CLICK",
            role: "BOTH",
          },
          {
            id: "dp-7",
            action: "LANDING CONDITIONS",
            value: "CONFIRM",
            role: "BOTH",
          },
          {
            id: "dp-8",
            action: "FMS",
            value: "PREPARE",
            role: "PF",
          },
          {
            id: "dp-9",
            action: "FMS",
            value: "CROSSCHECK",
            role: "PM",
          },
          {
            id: "dp-10",
            action: "LDG ELEVN",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "dp-11",
            action: "RWY COND/BRAKING ACTION",
            value: "SELECT",
            role: "PF",
          },
          {
            id: "dp-12",
            action: "ARRIVAL BRIEFING",
            value: "PERFORM",
            role: "PF",
          },
          {
            id: "dp-13",
            action: "ANTI ICE pb-sw",
            value: "AS RQRD",
            role: "PM",
          },
          {
            id: "dp-14",
            action: "DESCENT CLEARANCE",
            value: "OBTAIN",
            role: "PM",
          },
          {
            id: "dp-15",
            action: "CLEARED ALTITUDE ON AFS CP",
            value: "SET",
            role: "PF",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // DESCENT
  // ─────────────────────────────────────────
  {
    id: "descent",
    name: "Descent",
    icon: "arrow.down.right",
    sections: [
      {
        id: "des-main",
        title: "Descent",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "des-1",
            action: "DESCENT",
            value: "INITIATE",
            role: "PF",
          },
          {
            id: "des-2",
            action: "DESCENT",
            value: "MONITOR/ADJUST",
            role: "PF",
          },
          {
            id: "des-3",
            action: "EFIS OPTIONS",
            value: "AS RQRD",
            role: "BOTH",
          },
          {
            id: "des-4",
            action: "BAROMETRIC REFERENCE",
            value: "SET/CROSSCHECK",
            role: "BOTH",
            condition: "When approaching transition level",
          },
          {
            id: "des-5",
            action: "APPROACH C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
          {
            id: "des-6",
            action: "LDG sw",
            value: "ON",
            role: "PM",
            condition: "At 10 000 ft AAL",
          },
          {
            id: "des-7",
            action: "CSTR pb on EFIS CP",
            value: "ON",
            role: "BOTH",
            condition: "At 10 000 ft AAL",
          },
          {
            id: "des-8",
            action: "LS pb",
            value: "AS RQRD",
            role: "BOTH",
            condition: "At 10 000 ft AAL",
          },
          {
            id: "des-9",
            action: "NAVAIDS",
            value: "AS RQRD/CHECK",
            role: "PF",
            condition: "At 10 000 ft AAL",
          },
          {
            id: "des-10",
            action: "LANDING REVIEW",
            value: "PERFORM",
            role: "PM",
          },
          {
            id: "des-11",
            action: "LANDING REVIEW",
            value: "CONFIRM",
            role: "PF",
          },
          {
            id: "des-12",
            action: "PA TO CABIN",
            value: "PERFORM",
            role: "PM",
          },
          {
            id: "des-13",
            action: "CABIN REPORT",
            value: "OBTAIN",
            role: "PM",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // APPROACH
  // ─────────────────────────────────────────
  {
    id: "approach",
    name: "Approach",
    icon: "airplane.arrival",
    sections: [
      {
        id: "app-config",
        title: "Aircraft Configuration for Approach",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "app-1",
            action: "F-PLN SEQUENCING",
            value: "ADJUST",
            role: "PF",
          },
          {
            id: "app-2",
            action: "APPROACH PHASE",
            value: "CHECK/ACTIVATE",
            role: "PF",
          },
          {
            id: "app-3",
            action: "MANAGED SPEED",
            value: "CHECK",
            role: "PF",
          },
          {
            id: "app-4",
            action: "FLIGHT PATH",
            value: "MONITOR",
            role: "PF",
          },
          {
            id: "app-5",
            action: "NAV ACCURACY",
            value: "MONITOR",
            role: "PM",
          },
          {
            id: "app-6",
            action: "SPEED BRAKES lever",
            value: "AS RQRD",
            role: "PF",
          },
          {
            id: "app-7",
            action: "FLAPS 1",
            value: "ORDER",
            role: "PF",
            condition: "At FLAPS 1 pseudo waypoint",
          },
          {
            id: "app-8",
            action: "FLAPS 1",
            value: "SELECT",
            role: "PM",
            condition: "At FLAPS 1 pseudo waypoint",
          },
          {
            id: "app-9",
            action: "TA pb",
            value: "TA ONLY or TA/RA",
            role: "PM",
          },
          {
            id: "app-10",
            action: "FLAPS 2",
            value: "ORDER",
            role: "PF",
            condition: "At FLAPS 2 pseudo waypoint",
          },
          {
            id: "app-11",
            action: "FLAPS 2",
            value: "SELECT",
            role: "PM",
            condition: "At FLAPS 2 pseudo waypoint",
          },
          {
            id: "app-12",
            action: "L/G DOWN",
            value: "ORDER",
            role: "PF",
            condition: "When Flaps 2",
          },
          {
            id: "app-13",
            action: "L/G lever",
            value: "SELECT DOWN",
            role: "PM",
            condition: "When Flaps 2",
          },
          {
            id: "app-14",
            action: "RWY COND/BRAKING ACTION",
            value: "CONFIRM",
            role: "PM",
          },
          {
            id: "app-15",
            action: "AUTO BRAKE",
            value: "CONFIRM",
            role: "PM",
          },
          {
            id: "app-16",
            action: "GND SPLRS",
            value: "ARM",
            role: "PM",
          },
          {
            id: "app-17",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PM",
          },
          {
            id: "app-18",
            action: "FLAPS 3",
            value: "ORDER",
            role: "PF",
            condition: "When L/G down",
          },
          {
            id: "app-19",
            action: "FLAPS 3",
            value: "SELECT",
            role: "PM",
            condition: "When L/G down",
          },
          {
            id: "app-20",
            action: "L/G DOWNLOCK INDICATION ON PFD",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "app-21",
            action: "FLAPS FULL",
            value: "ORDER",
            role: "PF",
            condition: "When FLAPS 3",
          },
          {
            id: "app-22",
            action: "FLAPS FULL",
            value: "SELECT",
            role: "PM",
            condition: "When FLAPS 3",
          },
          {
            id: "app-23",
            action: "A/THR",
            value: "CHECK IN SPEED MODE OR OFF",
            role: "PM",
          },
          {
            id: "app-24",
            action: "SLIDING TABLE",
            value: "STOW",
            role: "BOTH",
          },
          {
            id: "app-25",
            action: "LDG MEMO",
            value: "CHECK NO BLUE",
            role: "PM",
          },
          {
            id: "app-26",
            action: "CABIN CREW",
            value: "ADVISE",
            role: "PM",
          },
          {
            id: "app-27",
            action: "LANDING C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
          {
            id: "app-28",
            action: "FLIGHT PARAMETERS",
            value: "MONITOR",
            role: "PM",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // MANUAL LANDING
  // ─────────────────────────────────────────
  {
    id: "manual-landing",
    name: "Manual Landing",
    icon: "arrow.down.to.line",
    sections: [
      {
        id: "ml-main",
        title: "Manual Landing",
        roleLabeling: "PF_PM",
        items: [
          { id: "ml-1", action: "AP", value: "OFF", role: "PF" },
          {
            id: "ml-2",
            action: "FLARE",
            value: "PERFORM",
            role: "PF",
            condition: "Around 40 ft RA",
          },
          {
            id: "ml-3",
            action: "ATTITUDE",
            value: "MONITOR",
            role: "PM",
            condition: "Around 40 ft RA",
          },
          {
            id: "ml-4",
            action: "THRUST LEVERS",
            value: "IDLE",
            role: "PF",
            condition: "Around 40 ft RA",
          },
          {
            id: "ml-5",
            action: "DEROTATION",
            value: "INITIATE",
            role: "PF",
            condition: "At touchdown",
          },
          {
            id: "ml-6",
            action: "ALL REVERSER LEVERS",
            value: "REV MAX or REV IDLE",
            role: "PF",
            condition: "At touchdown",
          },
          {
            id: "ml-7",
            action: "DIRECTIONAL CONTROL",
            value: "ENSURE",
            role: "PF",
            condition: "At touchdown",
          },
          {
            id: "ml-8",
            action: "GND SPLRS",
            value: "CHECK/ANNOUNCE",
            role: "PM",
            condition: "At touchdown",
          },
          {
            id: "ml-9",
            action: "REVERSERS",
            value: "CHECK/ANNOUNCE",
            role: "PM",
            condition: "At touchdown",
          },
          {
            id: "ml-10",
            action: "AUTO BRK",
            value: "CHECK/ANNOUNCE",
            role: "PM",
            condition: "At touchdown (if autobrake selected)",
          },
          {
            id: "ml-11",
            action: "DECELERATION",
            value: "CHECK/ANNOUNCE",
            role: "PM",
            condition: "At touchdown",
          },
          {
            id: "ml-12",
            action: "SEVENTY KNOTS",
            value: "ANNOUNCE",
            role: "PM",
            condition: "At 70 kt",
          },
          {
            id: "ml-13",
            action: "ALL REVERSER LEVERS",
            value: "IDLE",
            role: "PF",
            condition: "At 70 kt",
          },
          {
            id: "ml-14",
            action: "ALL REVERSER LEVERS",
            value: "STOW",
            role: "PF",
            condition: "At taxi speed",
          },
          {
            id: "ml-15",
            action: "AUTO BRK",
            value: "DISARM",
            role: "PF",
            condition: "At taxi speed",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // GO AROUND
  // ─────────────────────────────────────────
  {
    id: "go-around",
    name: "Go Around",
    icon: "arrow.uturn.up",
    sections: [
      {
        id: "ga-main",
        title: "Go Around",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "ga-1",
            action: "THRUST LEVERS",
            value: "TOGA THEN FLX/MCT",
            role: "PF",
          },
          {
            id: "ga-2",
            action: "ROTATION",
            value: "PERFORM",
            role: "PF",
          },
          {
            id: "ga-3",
            action: "GO-AROUND",
            value: "ANNOUNCE",
            role: "PF",
          },
          {
            id: "ga-4",
            action: "FLIGHT PARAMETERS",
            value: "MONITOR",
            role: "PM",
          },
          {
            id: "ga-5",
            action: "FLAPS",
            value: "RETRACT ONE STEP",
            role: "PM",
          },
          {
            id: "ga-6",
            action: "FMA",
            value: "CHECK/ANNOUNCE",
            role: "PF",
          },
          {
            id: "ga-7",
            action: "POSITIVE CLIMB",
            value: "ANNOUNCE",
            role: "PM",
          },
          {
            id: "ga-8",
            action: "L/G UP",
            value: "ORDER",
            role: "PF",
          },
          {
            id: "ga-9",
            action: "L/G",
            value: "UP",
            role: "PM",
          },
          {
            id: "ga-10",
            action: "NAV or HDG",
            value: "AS RQRD",
            role: "PF",
          },
          {
            id: "ga-11",
            action: "GO AROUND ALTITUDE",
            value: "CHECK",
            role: "PM",
          },
          {
            id: "ga-12",
            action: "THRUST LEVERS",
            value: "CL",
            role: "PF",
            condition: "At go-around thrust reduction altitude",
          },
          {
            id: "ga-13",
            action: "FLAPS",
            value: "ORDER RETRACTION ON SCHEDULE",
            role: "PF",
            condition: "At go-around acceleration altitude",
          },
          {
            id: "ga-14",
            action: "FLAPS",
            value: "RETRACT",
            role: "PM",
            condition: "At go-around acceleration altitude",
          },
          {
            id: "ga-15",
            action: "GND SPLRS",
            value: "DISARM",
            role: "PF",
            condition: "At go-around acceleration altitude",
          },
          {
            id: "ga-16",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PF",
            condition: "At go-around acceleration altitude",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // AFTER LANDING
  // ─────────────────────────────────────────
  {
    id: "after-landing",
    name: "After Landing",
    icon: "arrow.down",
    sections: [
      {
        id: "al-main",
        title: "After Landing",
        roleLabeling: "PF_PM",
        items: [
          {
            id: "al-1",
            action: "TAXI CLEARANCE",
            value: "OBTAIN & CONFIRM",
            role: "BOTH",
          },
          {
            id: "al-2",
            action: "GND SPLRS",
            value: "DISARM",
            role: "PF",
            condition: "When runway is vacated",
          },
          {
            id: "al-3",
            action: "FLAPS",
            value: "RETRACT",
            role: "PM",
            condition: "When runway is vacated",
          },
          {
            id: "al-4",
            action: "EXTERIOR LIGHTS",
            value: "SET",
            role: "PF",
          },
          {
            id: "al-5",
            action: "APU",
            value: "START",
            role: "PM",
          },
          {
            id: "al-6",
            action: "ANTI ICE",
            value: "AS RQRD",
            role: "PM",
          },
          {
            id: "al-7",
            action: "ND RANGE selector",
            value: "ZOOM, AS APPROPRIATE",
            role: "BOTH",
          },
          {
            id: "al-8",
            action: "TAXI pb on EFIS CP",
            value: "AS RQRD",
            role: "BOTH",
          },
          {
            id: "al-9",
            action: "WX pb",
            value: "CHECK OFF",
            role: "BOTH",
          },
          {
            id: "al-10",
            action: "BRAKE TEMPERATURE",
            value: "MONITOR",
            role: "PM",
          },
          {
            id: "al-11",
            action: "BRAKE FAN pb",
            value: "AS RQRD",
            role: "PM",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // PARKING
  // ─────────────────────────────────────────
  {
    id: "parking",
    name: "Parking",
    icon: "parkingsign",
    sections: [
      {
        id: "pk-main",
        title: "Parking",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "pk-1",
            action: "ACCU PRESS",
            value: "CHECK",
            role: "CM1",
          },
          {
            id: "pk-2",
            action: "ANTI ICE",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "pk-3",
            action: "PARK BRK handle",
            value: "ON",
            role: "CM1",
          },
          {
            id: "pk-4",
            action: "APU BLEED pb-sw",
            value: "ON",
            role: "CM2",
          },
          {
            id: "pk-5",
            action: "PARK BRK indication",
            value: "CHECK DISPLAYED",
            role: "BOTH",
          },
          {
            id: "pk-6",
            action: "ENG 1, 2 MASTER LEVERS",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "pk-7",
            action: "WING sw",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "pk-8",
            action: "BEACON sw",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "pk-9",
            action: "OTHER EXTERIOR LIGHTS",
            value: "AS RQRD",
            role: "CM1",
          },
          {
            id: "pk-10",
            action: "FUEL PUMPS",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "pk-11",
            action: "PA TO CABIN",
            value: "PERFORM",
            role: "CM1",
          },
          {
            id: "pk-12",
            action: "SLIDES",
            value: "CHECK DISARMED",
            role: "CM1",
          },
          {
            id: "pk-13",
            action: "SEAT BELTS sw",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "pk-14",
            action: "PARKING C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
          {
            id: "pk-15",
            action: "XPDR",
            value: "STBY",
            role: "CM2",
          },
          {
            id: "pk-16",
            action: "IRS PERFORMANCE",
            value: "CHECK",
            role: "CM2",
          },
          {
            id: "pk-17",
            action: "GROUND CONTACT",
            value: "ESTABLISH",
            role: "CM1",
          },
          {
            id: "pk-18",
            action: "FUEL QUANTITY",
            value: "CHECK",
            role: "CM2",
          },
          {
            id: "pk-19",
            action: "CHOCKS (when in position)",
            value: "CONFIRM IN POSITION",
            role: "BOTH",
          },
          {
            id: "pk-20",
            action: "PARK BRK handle (after chocks)",
            value: "OFF",
            role: "BOTH",
          },
          {
            id: "pk-21",
            action: "LOGBOOK",
            value: "COMPLETE",
            role: "CM1",
          },
          {
            id: "pk-22",
            action: "CLOSE FLIGHT button",
            value: "CLICK",
            role: "BOTH",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // SECURING THE AIRCRAFT
  // ─────────────────────────────────────────
  {
    id: "securing",
    name: "Securing the Aircraft",
    icon: "lock.fill",
    sections: [
      {
        id: "sec-main",
        title: "Securing the Aircraft",
        roleLabeling: "CM1_CM2",
        items: [
          {
            id: "sec-1",
            action: "PARK BRK handle",
            value: "ON",
            role: "CM1",
          },
          {
            id: "sec-2",
            action: "OXYGEN CREW SUPPLY pb-sw",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "sec-3",
            action: "PARK BRK indication",
            value: "CHECK DISPLAYED",
            role: "CM1",
          },
          {
            id: "sec-4",
            action: "EXTERIOR LIGHTS",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "sec-5",
            action: "All IR MODE selectors",
            value: "OFF",
            role: "CM1",
          },
          {
            id: "sec-6",
            action: "GND SVCE CTL sw",
            value: "AS RQRD",
            role: "CM2",
          },
          {
            id: "sec-7",
            action: "APU BLEED pb-sw",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "sec-8",
            action: "EXT pb",
            value: "AS RQRD",
            role: "CM2",
          },
          {
            id: "sec-9",
            action: "APU MASTER SW pb-sw",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "sec-10",
            action: "EMER EXIT LT sw",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "sec-11",
            action: "SIGNS sw",
            value: "OFF",
            role: "CM2",
          },
          {
            id: "sec-12",
            action: "ALL EFB LAPTOPS",
            value: "SWITCH OFF",
            role: "BOTH",
          },
          {
            id: "sec-13",
            action: "SECURING THE AIRCRAFT C/L",
            value: "COMPLETE",
            role: "BOTH",
          },
          {
            id: "sec-14",
            action: "ALL BAT pb-sw",
            value: "OFF",
            role: "CM2",
          },
        ],
      },
    ],
  },
];

// Helper to get all items across all phases for quiz mode
export function getAllTaskItems(): (TaskItem & {
  phaseName: string;
  sectionTitle: string;
  roleLabeling: RoleLabeling;
})[] {
  const items: (TaskItem & {
    phaseName: string;
    sectionTitle: string;
    roleLabeling: RoleLabeling;
  })[] = [];
  for (const phase of flightPhases) {
    for (const section of phase.sections) {
      for (const item of section.items) {
        if (item.role !== "BOTH") {
          items.push({
            ...item,
            phaseName: phase.name,
            sectionTitle: section.title,
            roleLabeling: section.roleLabeling,
          });
        }
      }
    }
  }
  return items;
}

// Helper to count items per phase
export function getPhaseStats(phase: FlightPhase) {
  let total = 0;
  let cm1OrPf = 0;
  let cm2OrPm = 0;
  let both = 0;
  for (const section of phase.sections) {
    for (const item of section.items) {
      total++;
      if (item.role === "CM1" || item.role === "PF") cm1OrPf++;
      else if (item.role === "CM2" || item.role === "PM") cm2OrPm++;
      else both++;
    }
  }
  return { total, cm1OrPf, cm2OrPm, both };
}
