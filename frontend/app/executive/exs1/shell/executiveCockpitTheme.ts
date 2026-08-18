/**
 * Sprint 2 — Executive Cockpit visual tokens.
 * Premium · Minimal · Dark-first · Porsche-inspired.
 * Backward-compatible surface for EXS-1 → EXS-7.
 */

/** Motion — 200–250ms, purposeful only */
export const motion = {
  fast: "200ms",
  base: "240ms",
  calm: "250ms",
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  reduceMotion: "0ms",
} as const;

/** Typography hierarchy */
export const typeScale = {
  executiveTitle: {
    size: "1.05rem",
    weight: 600,
    tracking: "0.02em",
    lineHeight: 1.25,
  },
  sectionTitle: {
    size: "0.72rem",
    weight: 550,
    tracking: "0.14em",
    lineHeight: 1.3,
  },
  cardTitle: {
    size: "0.84rem",
    weight: 600,
    tracking: "0.02em",
    lineHeight: 1.35,
  },
  body: {
    size: "0.82rem",
    weight: 400,
    tracking: "0.01em",
    lineHeight: 1.5,
  },
  caption: {
    size: "0.62rem",
    weight: 500,
    tracking: "0.12em",
    lineHeight: 1.35,
  },
  status: {
    size: "0.58rem",
    weight: 550,
    tracking: "0.14em",
    lineHeight: 1.3,
  },
} as const;

/** Elevation scale — one shadow system */
export const elevation = {
  flat: "none",
  raised: "0 6px 16px rgba(0, 0, 0, 0.28)",
  panel: "0 10px 28px rgba(0, 0, 0, 0.32)",
  floating: "0 22px 56px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(148,163,184,0.08)",
  focus: "0 0 0 1px rgba(56, 189, 248, 0.45), 0 0 22px rgba(56, 189, 248, 0.22)",
  asset: "0 10px 26px rgba(0, 0, 0, 0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
  assetFocus:
    "0 0 0 1px rgba(56, 189, 248, 0.5), 0 14px 32px rgba(0, 0, 0, 0.4), 0 0 28px rgba(56, 189, 248, 0.2)",
} as const;

/** Corner radius */
export const radius = {
  sm: "0.35rem",
  md: "0.5rem",
  lg: "0.65rem",
  xl: "0.85rem",
  pill: "999px",
} as const;

/** Director visual language — one identity per state */
export const directorLanguage = {
  selection: "#38bdf8",
  focus: "#7dd3fc",
  alert: "#f87171",
  health: "#4ade80",
  decision: "#1570EF",
  execution: "#12B76A",
  monitoring: "#039855",
  scenario: "#A78BFA",
  impact: "#FDB022",
} as const;

export const cockpit = {
  bg: "#070a10",
  graphite: "#141925",
  charcoal: "#0f131c",
  navy: "#0b1220",
  panel: "rgba(16, 20, 30, 0.94)",
  panelSoft: "rgba(22, 28, 40, 0.78)",
  glass: "rgba(12, 16, 24, 0.72)",
  border: "rgba(148, 163, 184, 0.1)",
  borderStrong: "rgba(56, 189, 248, 0.38)",
  text: "#e8eef6",
  textSoft: "#c5d0de",
  muted: "#8b97a8",
  lowMuted: "#5c6778",
  accent: "#38bdf8",
  accentSoft: "rgba(56, 189, 248, 0.12)",
  accentGlow: "rgba(56, 189, 248, 0.26)",
  risk: "#f87171",
  success: "#4ade80",
  warning: "#fbbf24",
  stageBg:
    "radial-gradient(125% 110% at 50% 28%, #152033 0%, #0a0f18 52%, #06080d 100%)",
  dayBg: "#e8edf4",
  dayPanel: "rgba(255, 255, 255, 0.94)",
  dayText: "#0f172a",
  dayMuted: "#475569",
  /** Fixed geometry */
  navWidth: "3.5rem",
  /** Sprint 6.5 — Advisor Co-Pilot panel */
  advisorWidth: "360px",
  advisorMin: 320,
  advisorMax: 520,
  advisorCollapsedWidth: 52,
  drawerMin: 220,
  drawerMax: 420,
  drawerDefault: 280,
  contextHeight: "2.75rem",
  contextCompactHeight: "2.45rem",
  timelineHeight: "5.4rem",
  timelineCollapsedHeight: "1.85rem",
  statusHeight: "2rem",
  visuallyHidden: {
    position: "absolute" as const,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap" as const,
    border: 0,
  },
  /** Motion */
  drawerMs: motion.calm,
  modeMs: motion.base,
  timelineMs: motion.base,
  transition: `border-color ${motion.base} ${motion.easing}, box-shadow ${motion.base} ${motion.easing}, background ${motion.base} ${motion.easing}, opacity ${motion.fast} ${motion.easing}, transform ${motion.calm} ${motion.easing}, color ${motion.base} ${motion.easing}, width ${motion.calm} ${motion.easing}`,
  /** Sprint 2 systems */
  motion,
  type: typeScale,
  elevation,
  radius,
  director: directorLanguage,
  space: {
    xs: "0.25rem",
    sm: "0.45rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.35rem",
  },
} as const;
