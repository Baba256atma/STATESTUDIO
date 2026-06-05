/** E2:57 — Shared safe zone for the executive top HUD command row. */

import { emitHudLayoutZoneLog } from "../layout/hudLayoutLogGuard";
import {
  recordLayoutThrottleAudit,
  stableLayoutSignature,
} from "../layout/layoutThrottleAuditRuntime";
import { devLogThrottled } from "../runtime/diagnosticThrottle.ts";
import { getSceneHudRegistration } from "./sceneHudRegistry";
import {
  resolveExecutiveSideInset,
  resolveExecutiveTopBaseline,
  resolveUnifiedTopRowPlacement,
} from "./executiveTopAlignmentRuntime";
import { EXECUTIVE_SCENE_HUD_GRID } from "./executiveSceneHudGrid";

export type ExecutiveTopHudSafeZone = {
  top: number;
  leftInset: number;
  rightInset: number;
  leftLaneEnd: number;
  rightLaneStart: number;
  toolbarMaxWidth: string;
  sceneInfoMaxWidth: string;
  objectInfoMaxWidth: string;
};

export type ExecutiveTopHudSafeZoneContext = {
  viewportWidth: number;
  sceneInfoVisible: boolean;
  objectInfoVisible: boolean;
  sceneInfoWidth?: number;
  objectInfoWidth?: number;
};

let lastTopSafeZoneSignature: string | null = null;
let lastTopSafeZone: ExecutiveTopHudSafeZone | null = null;

export function resolveExecutiveTopHudSafeZone(context: ExecutiveTopHudSafeZoneContext): ExecutiveTopHudSafeZone {
  const contextSignature = stableLayoutSignature({
    viewportWidth: context.viewportWidth,
    sceneInfoVisible: context.sceneInfoVisible,
    objectInfoVisible: context.objectInfoVisible,
    sceneInfoWidth: context.sceneInfoWidth ?? null,
    objectInfoWidth: context.objectInfoWidth ?? null,
  });
  if (lastTopSafeZone && lastTopSafeZoneSignature === contextSignature) {
    recordLayoutThrottleAudit({
      area: "safeZone",
      source: "resolveExecutiveTopHudSafeZone",
      previousSignature: lastTopSafeZoneSignature,
      nextSignature: contextSignature,
      prevented: true,
      detail: { reason: "safe-zone context unchanged" },
    });
    devLogThrottled({
      key: `top-safe-zone:${contextSignature}`,
      label: "[NEXORA_SAFEZONE_STABILITY_REPORT]",
      scope: "sceneRenderSource",
      intervalMs: 15000,
      payload: {
        source: "resolveExecutiveTopHudSafeZone",
        signature: contextSignature,
        recalculationPrevented: true,
      },
    });
    return lastTopSafeZone;
  }
  const { viewportWidth: vpW } = context;
  const placement = resolveUnifiedTopRowPlacement(vpW);
  const sceneEntry = getSceneHudRegistration("sceneInfoHud");
  const objectEntry = getSceneHudRegistration("objectInfoHud");
  const toolbarEntry = getSceneHudRegistration("executiveSceneToolbar");

  const sceneWidth = context.sceneInfoVisible
    ? Math.min(context.sceneInfoWidth ?? sceneEntry.estimatedWidth, vpW * 0.34)
    : 0;
  const objectWidth = context.objectInfoVisible
    ? Math.min(context.objectInfoWidth ?? objectEntry.estimatedWidth, vpW * 0.36)
    : 0;

  const leftLaneEnd = placement.leftInset + sceneWidth + (sceneWidth > 0 ? EXECUTIVE_SCENE_HUD_GRID.panelSpacing : 0);
  const rightLaneStart = vpW - placement.rightInset - objectWidth - (objectWidth > 0 ? EXECUTIVE_SCENE_HUD_GRID.panelSpacing : 0);
  const centerAvailable = Math.max(120, rightLaneStart - leftLaneEnd);

  const zone: ExecutiveTopHudSafeZone = {
    top: placement.top,
    leftInset: placement.leftInset,
    rightInset: placement.rightInset,
    leftLaneEnd,
    rightLaneStart,
    toolbarMaxWidth:
      vpW < 768
        ? "92vw"
        : `min(${toolbarEntry.estimatedWidth}px, ${Math.floor(centerAvailable)}px)`,
    sceneInfoMaxWidth: vpW < 768 ? "min(200px, 46vw)" : `min(${sceneEntry.estimatedWidth}px, 34vw)`,
    objectInfoMaxWidth: vpW < 768 ? "min(280px, 58vw)" : `min(${objectEntry.estimatedWidth}px, 32vw)`,
  };

  logSafeZone({
    top: zone.top,
    leftLaneEnd: zone.leftLaneEnd,
    rightLaneStart: zone.rightLaneStart,
    centerAvailable,
    viewportWidth: vpW,
  });

  recordLayoutThrottleAudit({
    area: "safeZone",
    source: "resolveExecutiveTopHudSafeZone",
    previousSignature: lastTopSafeZoneSignature,
    nextSignature: contextSignature,
    prevented: false,
  });
  lastTopSafeZoneSignature = contextSignature;
  lastTopSafeZone = zone;
  return zone;
}

export function topHudPanelsOverlap(context: ExecutiveTopHudSafeZoneContext): boolean {
  const zone = resolveExecutiveTopHudSafeZone(context);
  return zone.leftLaneEnd >= zone.rightLaneStart;
}

export function logSafeZone(payload: Record<string, unknown>): void {
  const viewportWidth = typeof payload.viewportWidth === "number" ? payload.viewportWidth : 1440;
  emitHudLayoutZoneLog("[Nexora][SafeZone]", "SafeZone", payload, viewportWidth);
}

export function resetExecutiveTopHudSafeZoneLogsForTests(): void {
  // guarded by hudLayoutLogGuard reset
  lastTopSafeZoneSignature = null;
  lastTopSafeZone = null;
}

/** Convenience for layout modules that only need the shared top value. */
export function resolveSharedTopHudBaseline(viewportWidth?: number): number {
  return resolveExecutiveTopBaseline(viewportWidth);
}

export function resolveSharedSideInset(viewportWidth?: number): number {
  return resolveExecutiveSideInset(viewportWidth);
}
