/** E2:57 — Executive scene HUD grid: shared anchors and spacing metrics. */

import { emitHudLayoutZoneLog } from "../layout/hudLayoutLogGuard";

export type ExecutiveHudGridAnchor = "LEFT_TOP" | "TOP_CENTER" | "RIGHT_TOP";

export const EXECUTIVE_SCENE_HUD_GRID = Object.freeze({
  topMargin: 12,
  safeMargin: 12,
  panelSpacing: 8,
  mobileTopMargin: 8,
  mobileSafeMargin: 8,
});

export const TOP_ROW_GRID_ANCHORS: readonly ExecutiveHudGridAnchor[] = Object.freeze([
  "LEFT_TOP",
  "TOP_CENTER",
  "RIGHT_TOP",
]);

export type ExecutiveHudGridMetrics = {
  topMargin: number;
  safeMargin: number;
  panelSpacing: number;
};

export function resolveExecutiveHudGridMetrics(viewportWidth: number): ExecutiveHudGridMetrics {
  const mobile = viewportWidth < 768;
  return {
    topMargin: mobile ? EXECUTIVE_SCENE_HUD_GRID.mobileTopMargin : EXECUTIVE_SCENE_HUD_GRID.topMargin,
    safeMargin: mobile ? EXECUTIVE_SCENE_HUD_GRID.mobileSafeMargin : EXECUTIVE_SCENE_HUD_GRID.safeMargin,
    panelSpacing: EXECUTIVE_SCENE_HUD_GRID.panelSpacing,
  };
}

export function logHudGrid(payload: Record<string, unknown>): void {
  emitHudLayoutZoneLog("[Nexora][HudGrid]", "HudGrid", payload);
}

export function resetExecutiveSceneHudGridLogsForTests(): void {
  // guarded by hudLayoutLogGuard reset
}
