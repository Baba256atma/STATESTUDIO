export type ThemeName = "day" | "night" | "stars";

export type DesignTokens = {
  colors: {
    surface: string;
    surfaceMuted: string;
    textPrimary: string;
    textMuted: string;
    accent: string;
    operational: string;
    pressure: string;
    strategic: string;
    relationNeutral: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  opacity: {
    muted: number;
    subtle: number;
    normal: number;
    strong: number;
  };
  elevation: {
    panel: string;
    focus: string;
  };
  typography: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
};

export type InteractionTokens = {
  hoverIntensity: number;
  hoverOpacityBoost: number;
  selectionGlow: number;
  focusGlow: number;
  dragOpacity: number;
  sceneObjectEmphasis: number;
};

export type MotionTokens = {
  fastMs: number;
  normalMs: number;
  slowMs: number;
  panelTransitionMs: number;
  hoverTransitionMs: number;
  objectEmphasisLerp: number;
  cameraSmoothing: number;
  sceneIdleSway: number;
  relationPulseHz: number;
};

export type ThemeTokens = {
  theme: ThemeName;
  design: DesignTokens;
  interaction: InteractionTokens;
  motion: MotionTokens;
};

const BASE_DESIGN: Omit<DesignTokens, "colors"> = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16 },
  radius: { sm: 6, md: 10, lg: 14, pill: 999 },
  opacity: { muted: 0.18, subtle: 0.32, normal: 0.64, strong: 0.9 },
  elevation: {
    panel: "0 10px 30px rgba(0,0,0,0.22)",
    focus: "0 0 0 2px rgba(255,255,255,0.18)",
  },
  typography: { xs: 11, sm: 12, md: 14, lg: 16 },
};

const THEME_COLORS: Record<ThemeName, DesignTokens["colors"]> = {
  day: {
    surface: "#f8fafc",
    surfaceMuted: "#eef2f7",
    textPrimary: "#0f172a",
    textMuted: "#475569",
    accent: "#0ea5e9",
    operational: "#38bdf8",
    pressure: "#dc2626",
    strategic: "#0ea5e9",
    relationNeutral: "#64748b",
  },
  night: {
    surface: "#0b1020",
    surfaceMuted: "#11182c",
    textPrimary: "#e2e8f0",
    textMuted: "#94a3b8",
    accent: "#38bdf8",
    operational: "#60a5fa",
    pressure: "#f97316",
    strategic: "#22d3ee",
    relationNeutral: "#95a5a6",
  },
  stars: {
    surface: "#050814",
    surfaceMuted: "#0b1020",
    textPrimary: "#e2e8f0",
    textMuted: "#94a3b8",
    accent: "#60a5fa",
    operational: "#60a5fa",
    pressure: "#f97316",
    strategic: "#22d3ee",
    relationNeutral: "#95a5a6",
  },
};

const BASE_INTERACTION: InteractionTokens = {
  hoverIntensity: 0.22,
  hoverOpacityBoost: 0.04,
  selectionGlow: 0.62,
  focusGlow: 0.52,
  dragOpacity: 0.85,
  sceneObjectEmphasis: 1,
};

const BASE_MOTION: MotionTokens = {
  fastMs: 120,
  normalMs: 220,
  slowMs: 360,
  panelTransitionMs: 220,
  hoverTransitionMs: 140,
  objectEmphasisLerp: 12,
  cameraSmoothing: 0.08,
  sceneIdleSway: 1,
  relationPulseHz: 3,
};

function modeInteractionAdjust(modeId?: string): Partial<InteractionTokens> {
  const mode = String(modeId || "").trim().toLowerCase();
  if (mode === "executive") return { hoverIntensity: 0.16, sceneObjectEmphasis: 0.92 };
  if (mode === "demo") return { hoverIntensity: 0.2, sceneObjectEmphasis: 1.04 };
  if (mode === "analyst") return { hoverIntensity: 0.26, sceneObjectEmphasis: 1.08 };
  if (mode === "manager") return { hoverIntensity: 0.2, sceneObjectEmphasis: 1.0 };
  if (mode === "scanner") return { hoverIntensity: 0.18, sceneObjectEmphasis: 0.98 };
  return {};
}

function modeMotionAdjust(modeId?: string): Partial<MotionTokens> {
  const mode = String(modeId || "").trim().toLowerCase();
  if (mode === "executive") return { relationPulseHz: 2.2, sceneIdleSway: 0.82 };
  if (mode === "demo") return { relationPulseHz: 2.8, sceneIdleSway: 0.9 };
  if (mode === "analyst") return { relationPulseHz: 3.3, sceneIdleSway: 1.08 };
  return {};
}

export function getThemeTokens(theme: ThemeName = "night", modeId?: string): ThemeTokens {
  const interaction = { ...BASE_INTERACTION, ...modeInteractionAdjust(modeId) };
  const motion = { ...BASE_MOTION, ...modeMotionAdjust(modeId) };
  return {
    theme,
    design: {
      ...BASE_DESIGN,
      colors: THEME_COLORS[theme],
    },
    interaction,
    motion,
  };
}
