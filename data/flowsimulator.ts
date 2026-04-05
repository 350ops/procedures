/**
 * A350 Flow Simulator Data
 * Source: A350 Tutorials PDF (417 slides)
 *
 * Topics are organized by training module with page ranges
 * mapping to the bundled PDF asset.
 */

export interface FlowTopic {
  id: string;
  name: string;
  icon: string; // SF Symbol name
  startPage: number;
  endPage: number;
  description: string;
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface FlowStep {
  id: string;
  order: number;
  action: string;
  detail: string;
}

export const flowTopics: FlowTopic[] = [
  {
    id: "cockpit-overview",
    name: "Cockpit Overview",
    icon: "airplane",
    startPage: 1,
    endPage: 25,
    description: "Cockpit layout, panels, and controls",
  },
  {
    id: "ecam",
    name: "ECAM System",
    icon: "display",
    startPage: 26,
    endPage: 55,
    description: "Electronic Centralized Aircraft Monitor",
  },
  {
    id: "fcu",
    name: "FCU & Autopilot",
    icon: "dial.medium",
    startPage: 56,
    endPage: 80,
    description: "Flight Control Unit and autopilot modes",
  },
  {
    id: "fms",
    name: "FMS & Navigation",
    icon: "map.fill",
    startPage: 81,
    endPage: 120,
    description: "Flight Management System, MCDU, route planning",
  },
  {
    id: "preflight-flows",
    name: "Preflight Flows",
    icon: "checklist",
    startPage: 121,
    endPage: 155,
    description: "Cockpit preparation, walkaround, before start",
  },
  {
    id: "engine-start",
    name: "Engine Start & Taxi",
    icon: "engine.combustion.fill",
    startPage: 156,
    endPage: 180,
    description: "Engine start sequence, after start, taxi flows",
  },
  {
    id: "takeoff-climb",
    name: "Takeoff & Climb",
    icon: "airplane.departure",
    startPage: 181,
    endPage: 215,
    description: "Before takeoff, takeoff, initial climb flows",
  },
  {
    id: "cruise",
    name: "Cruise",
    icon: "cloud.fill",
    startPage: 216,
    endPage: 240,
    description: "Cruise operations, step climb, fuel management",
  },
  {
    id: "descent-approach",
    name: "Descent & Approach",
    icon: "airplane.arrival",
    startPage: 241,
    endPage: 285,
    description: "Descent prep, approach briefing, approach flows",
  },
  {
    id: "landing-parking",
    name: "Landing & Parking",
    icon: "parkingsign",
    startPage: 286,
    endPage: 320,
    description: "Landing, go-around, after landing, parking flows",
  },
  {
    id: "abnormal-ops",
    name: "Abnormal Operations",
    icon: "exclamationmark.triangle.fill",
    startPage: 321,
    endPage: 370,
    description: "ECAM actions, emergency procedures, diversions",
  },
  {
    id: "systems-review",
    name: "Systems Review",
    icon: "gearshape.2.fill",
    startPage: 371,
    endPage: 417,
    description: "Hydraulics, electrics, pneumatics, fuel systems",
  },
];

/** Get a topic by its ID */
export function getTopicById(id: string): FlowTopic | undefined {
  return flowTopics.find((t) => t.id === id);
}

/** Get total page count for a topic */
export function getTopicPageCount(topic: FlowTopic): number {
  return topic.endPage - topic.startPage + 1;
}

/**
 * Parse raw extracted text into flow steps.
 * Heuristic: lines that look like procedure steps
 * (e.g., "ACTION ........ VALUE" or "- STEP DESCRIPTION")
 */
export function parseFlowSteps(text: string): FlowStep[] {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const steps: FlowStep[] = [];
  let order = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip very short lines (likely headers or page numbers)
    if (trimmed.length < 3) continue;

    // Match dot-leader patterns: "ACTION ..... VALUE"
    const dotLeader = trimmed.match(/^(.+?)\s*\.{3,}\s*(.+)$/);
    if (dotLeader) {
      order++;
      steps.push({
        id: `step-${order}`,
        order,
        action: dotLeader[1].trim(),
        detail: dotLeader[2].trim(),
      });
      continue;
    }

    // Match dash/bullet patterns: "- ACTION" or "• ACTION"
    const bullet = trimmed.match(/^[-•●▸]\s+(.+)$/);
    if (bullet) {
      order++;
      steps.push({
        id: `step-${order}`,
        order,
        action: bullet[1].trim(),
        detail: "",
      });
      continue;
    }

    // Match numbered patterns: "1. ACTION" or "1) ACTION"
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      order++;
      steps.push({
        id: `step-${order}`,
        order,
        action: numbered[1].trim(),
        detail: "",
      });
      continue;
    }

    // Everything else becomes a general text step
    order++;
    steps.push({
      id: `step-${order}`,
      order,
      action: trimmed,
      detail: "",
    });
  }

  return steps;
}
