import type { SceneThemeId } from "../theme/sceneThemeTypes";
import { resolveSceneThemeTokens } from "../theme/sceneThemeTokens";

export type OverlayThemeTokens = {
  propagationColor: string;
  propagationGlow: string;
  riskFlowColor: string;
  riskFlowGlow: string;
  scenarioColor: string;
  scenarioGlow: string;
  dependencyColor: string;
  dependencyGlow: string;
  baseOpacity: number;
  pulseOpacity: number;
};

/** E2:23 — Overlay styling derived from E2:20 scene theme tokens (no hardcoded palette). */
export function resolveOverlayThemeTokens(themeId: SceneThemeId = "night"): OverlayThemeTokens {
  const tokens = resolveSceneThemeTokens(themeId);
  const baseOpacity = tokens.overlayOpacity * 0.55;
  const pulseOpacity = tokens.overlayOpacity * 0.72;

  return {
    propagationColor: tokens.timelineConnector,
    propagationGlow: tokens.accent,
    riskFlowColor: tokens.danger,
    riskFlowGlow: tokens.warning,
    scenarioColor: tokens.accent,
    scenarioGlow: tokens.timeline,
    dependencyColor: tokens.controlBorder,
    dependencyGlow: tokens.textSecondary,
    baseOpacity,
    pulseOpacity,
  };
}
