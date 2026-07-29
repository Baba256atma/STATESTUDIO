/**
 * E2:56 — Canonical executive HUD zones (one anchor per surface).
 *
 * AD-SCENE-01 (Accepted 2026-07-28) narrowly supersedes E2:56 for
 * `executiveSceneToolbar.zone` only → `TOP_CENTER`. All other E2:56 fields
 * and HUD components remain authoritative under E2:56.
 */

import type { SceneHudPanelId } from "./sceneHudRegistry";

export type ExecutiveHudZone =
  | "LEFT_TOP"
  | "TOP_CENTER"
  | "RIGHT_TOP"
  | "LEFT_BOTTOM"
  | "BOTTOM_CENTER"
  | "RIGHT_BOTTOM";

/** AD-SCENE-01 decision id for toolbar-zone authority traceability. */
export const AD_SCENE_01_DECISION_ID = "AD-SCENE-01" as const;

export const CANONICAL_HUD_ANCHORS: Readonly<Record<SceneHudPanelId, ExecutiveHudZone>> = Object.freeze({
  sceneInfoHud: "LEFT_TOP",
  // AD-SCENE-01: toolbar participates in E2:21/E2:57 unified top-row (TOP_CENTER).
  executiveSceneToolbar: "TOP_CENTER",
  objectInfoHud: "RIGHT_TOP",
  executiveStatusHud: "RIGHT_TOP",
  timelineHud: "BOTTOM_CENTER",
  quickActionsDock: "BOTTOM_CENTER",
  objectInfoEmptyPlaceholder: "RIGHT_TOP",
  pipelineStatusOverlay: "LEFT_TOP",
  orientationPanel: "LEFT_TOP",
  scenarioOverlay: "BOTTOM_CENTER",
});

const logKeys = new Set<string>();

export function getCanonicalHudZone(panelId: SceneHudPanelId): ExecutiveHudZone {
  return CANONICAL_HUD_ANCHORS[panelId];
}

export function enforceCanonicalAnchor(
  panelId: SceneHudPanelId,
  requestedZone?: ExecutiveHudZone
): ExecutiveHudZone {
  const canonical = getCanonicalHudZone(panelId);
  if (requestedZone && requestedZone !== canonical) {
    logHudAnchor({
      panelId,
      requestedZone,
      enforcedZone: canonical,
      overridden: true,
    });
  } else {
    logHudAnchor({ panelId, enforcedZone: canonical, overridden: false });
  }
  return canonical;
}

export function hudZoneToDockZone(
  zone: ExecutiveHudZone
): "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" {
  if (zone === "LEFT_TOP") return "top-left";
  if (zone === "TOP_CENTER") return "top-center";
  if (zone === "RIGHT_TOP") return "top-right";
  if (zone === "LEFT_BOTTOM") return "bottom-left";
  if (zone === "BOTTOM_CENTER") return "bottom-center";
  return "bottom-right";
}

export function logHudAnchor(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][HudAnchor]", payload);
}

export function resetExecutiveHudLayoutGovernanceLogsForTests(): void {
  logKeys.clear();
}
