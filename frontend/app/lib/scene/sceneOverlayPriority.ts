/** E2:55 — Scene overlay priority tiers. Only Critical + Important may stay permanently visible. */

export type SceneOverlayPriority = "Critical" | "Important" | "Contextual" | "Temporary";

export type SceneOverlayId =
  | "sceneInfoHud"
  | "objectInfoHud"
  | "timelineHud"
  | "executiveSceneToolbar"
  | "executiveStatusHud"
  | "executiveOrientationPanel"
  | "executiveOrientationWelcome"
  | "pipelineStatusHud"
  | "executiveSceneOperationalStrip"
  | "quickActionsDock"
  | "typeCExecutiveSummaryCard"
  | "scenarioOverlay"
  | "propagationOverlay"
  | "riskFlowOverlay"
  | "dependencyOverlay"
  | "analysisHandoffBanner"
  | "centerHelperCopy"
  | "gettingStartedHelper"
  | "objectInfoEmptyPlaceholder";

const OVERLAY_PRIORITY: Record<SceneOverlayId, SceneOverlayPriority> = {
  sceneInfoHud: "Important",
  objectInfoHud: "Important",
  timelineHud: "Important",
  executiveSceneToolbar: "Important",
  executiveStatusHud: "Contextual",
  executiveOrientationPanel: "Temporary",
  executiveOrientationWelcome: "Temporary",
  pipelineStatusHud: "Critical",
  executiveSceneOperationalStrip: "Contextual",
  quickActionsDock: "Contextual",
  typeCExecutiveSummaryCard: "Contextual",
  scenarioOverlay: "Important",
  propagationOverlay: "Important",
  riskFlowOverlay: "Important",
  dependencyOverlay: "Contextual",
  analysisHandoffBanner: "Temporary",
  centerHelperCopy: "Temporary",
  gettingStartedHelper: "Temporary",
  objectInfoEmptyPlaceholder: "Temporary",
};

const PERMANENT_PRIORITIES: readonly SceneOverlayPriority[] = ["Critical", "Important"];

export function resolveSceneOverlayPriority(overlayId: SceneOverlayId): SceneOverlayPriority {
  return OVERLAY_PRIORITY[overlayId];
}

export function mayOverlayRemainPermanentlyVisible(overlayId: SceneOverlayId): boolean {
  return PERMANENT_PRIORITIES.includes(resolveSceneOverlayPriority(overlayId));
}

export function isTemporarySceneOverlay(overlayId: SceneOverlayId): boolean {
  return resolveSceneOverlayPriority(overlayId) === "Temporary";
}
