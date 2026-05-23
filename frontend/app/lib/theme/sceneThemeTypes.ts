/** E2:20 — Canonical scene-native visual theme identifiers. */
export type SceneThemeId = "day" | "night";

/** Reserved for future executive theme packs (not implemented in E2:20). */
export type SceneThemeIdFuture = SceneThemeId | "twilight" | "briefing";

export interface SceneThemeTokens {
  id: SceneThemeId;
  panelBackground: string;
  panelBorder: string;
  panelShadow: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  warning: string;
  danger: string;
  success: string;
  timeline: string;
  buttonBackground: string;
  buttonBorder: string;
  buttonText: string;
  overlayOpacity: number;
  hudGlowIntensity: number;
  hudGlow: string;
  headerBackground: string;
  controlBackground: string;
  controlBorder: string;
  label: string;
  chipBackground: string;
  chipBorder: string;
  messageSurface: string;
  inputSurface: string;
  timelineTrack: string;
  timelineMarker: string;
  timelineConnector: string;
}

export function isSceneThemeId(value: unknown): value is SceneThemeId {
  return value === "day" || value === "night";
}

// E2:20 Executive Workspace Profiles
// E3 Scene Object Catalog
// E3 Scene Control System
// D8 Personalized Strategic Workspace
// D10 Production Preference Management
