// iOS dark-mode design tokens — matches Apple's Quiz Mode design.
export const iOS = {
  bg: "#000000",
  bgSecondary: "#1C1C1E",
  bgTertiary: "#2C2C2E",
  fill1: "rgba(120,120,128,0.36)",
  fill2: "rgba(120,120,128,0.32)",
  fill3: "rgba(118,118,128,0.24)",
  fill4: "rgba(118,118,128,0.18)",
  separator: "rgba(84,84,88,0.65)",
  opaqueSep: "#38383A",
  label: "#FFFFFF",
  label2: "rgba(235,235,245,0.6)",
  label3: "rgba(235,235,245,0.3)",
  label4: "rgba(235,235,245,0.18)",
  blue: "#0A84FF",
  blueDeep: "#0066D6",
  green: "#30D158",
  red: "#FF453A",
  orange: "#FF9F0A",
  yellow: "#FFD60A",
  purple: "#BF5AF2",
} as const;

export type PhaseProgress = {
  best: number; // 0..1
  attempts: number;
  lastPct: number; // 0..100
  updatedAt: number;
};
