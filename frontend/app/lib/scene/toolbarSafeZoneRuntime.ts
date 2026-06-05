/** E2:56 / E2:57 — Toolbar safe zone with unified top baseline + horizontal lanes. */

import type React from "react";

import { emitHudLayoutZoneLog } from "../layout/hudLayoutLogGuard";
import {
  recordLayoutThrottleAudit,
  stableLayoutSignature,
} from "../layout/layoutThrottleAuditRuntime";
import { devLogThrottled } from "../runtime/diagnosticThrottle.ts";
import type { WorkspaceLayoutContract } from "../ui/workspaceLayoutTypes";
import { resolveExecutiveTopHudSafeZone } from "./executiveTopHudSafeZone";
import { resolveUnifiedTopRowPlacement } from "./executiveTopAlignmentRuntime";

export type ToolbarSafeZone = {
  top: number;
  left: number;
  right: number;
  maxWidth: string;
};

export type ToolbarSafeZoneContext = {
  contract: WorkspaceLayoutContract;
  objectInfoVisible: boolean;
  statusHudVisible: boolean;
};

let lastToolbarSafeZoneSignature: string | null = null;
let lastToolbarSafeZone: ToolbarSafeZone | null = null;

export function resolveToolbarSafeZone(context: ToolbarSafeZoneContext): ToolbarSafeZone {
  const { contract } = context;
  const viewportWidth =
    contract.breakpoint === "mobile" ? 390 : contract.breakpoint === "tablet" ? 820 : 1440;
  const contextSignature = stableLayoutSignature({
    viewportWidth,
    breakpoint: contract.breakpoint,
    sceneInfoVisible: contract.hud.sceneInfoHud.visible,
    objectInfoVisible: context.objectInfoVisible,
    statusHudVisible: context.statusHudVisible,
  });
  if (lastToolbarSafeZone && lastToolbarSafeZoneSignature === contextSignature) {
    recordLayoutThrottleAudit({
      area: "safeZone",
      source: "resolveToolbarSafeZone",
      previousSignature: lastToolbarSafeZoneSignature,
      nextSignature: contextSignature,
      prevented: true,
      detail: { reason: "toolbar safe-zone context unchanged" },
    });
    devLogThrottled({
      key: `toolbar-safe-zone:${contextSignature}`,
      label: "[NEXORA_SAFEZONE_STABILITY_REPORT]",
      scope: "sceneRenderSource",
      intervalMs: 15000,
      payload: {
        source: "resolveToolbarSafeZone",
        signature: contextSignature,
        recalculationPrevented: true,
      },
    });
    return lastToolbarSafeZone;
  }
  const safeZone = resolveExecutiveTopHudSafeZone({
    viewportWidth,
    sceneInfoVisible: contract.hud.sceneInfoHud.visible,
    objectInfoVisible: context.objectInfoVisible,
  });
  const placement = resolveUnifiedTopRowPlacement(viewportWidth);

  const zone = {
    top: safeZone.top,
    left: safeZone.leftLaneEnd,
    right: viewportWidth - safeZone.rightLaneStart,
    maxWidth: safeZone.toolbarMaxWidth,
  };

  logToolbarSafeZone({
    top: zone.top,
    left: zone.left,
    right: zone.right,
    maxWidth: zone.maxWidth,
    unifiedBaseline: placement.top,
  });

  recordLayoutThrottleAudit({
    area: "safeZone",
    source: "resolveToolbarSafeZone",
    previousSignature: lastToolbarSafeZoneSignature,
    nextSignature: contextSignature,
    prevented: false,
  });
  lastToolbarSafeZoneSignature = contextSignature;
  lastToolbarSafeZone = zone;
  return zone;
}

export function applyToolbarSafeZonePlacement(
  style: React.CSSProperties,
  context: ToolbarSafeZoneContext
): React.CSSProperties {
  const zone = resolveToolbarSafeZone(context);
  return {
    ...style,
    top: zone.top,
    maxWidth: zone.maxWidth,
  };
}

export function logToolbarSafeZone(payload: Record<string, unknown>): void {
  emitHudLayoutZoneLog("[Nexora][ToolbarSafeZone]", "ToolbarSafeZone", payload);
}

export function resetToolbarSafeZoneLogsForTests(): void {
  // guarded by hudLayoutLogGuard reset
  lastToolbarSafeZoneSignature = null;
  lastToolbarSafeZone = null;
}

/** @deprecated Use resolveToolbarSafeZone — kept for existing imports. */
export function resolveExecutiveToolbarSafeZone(contract: WorkspaceLayoutContract): {
  top: number;
  left: number;
  right: number;
  bottom: number;
} {
  const zone = resolveToolbarSafeZone({
    contract,
    objectInfoVisible: contract.hud.objectInfoHud.visible,
    statusHudVisible: contract.hud.executiveStatusHud.visible,
  });
  return {
    top: zone.top,
    left: zone.left,
    right: zone.right,
    bottom: 120,
  };
}

/** @deprecated Use applyToolbarSafeZonePlacement — kept for existing imports. */
export function applyExecutiveToolbarSafeZone(
  style: React.CSSProperties,
  contract: WorkspaceLayoutContract
): React.CSSProperties {
  return applyToolbarSafeZonePlacement(style, {
    contract,
    objectInfoVisible: contract.hud.objectInfoHud.visible,
    statusHudVisible: contract.hud.executiveStatusHud.visible,
  });
}

export const TOP_HUD_SAFE_MARGIN = 12;
export const LEFT_HUD_SAFE_MARGIN = 12;
export const RIGHT_HUD_SAFE_MARGIN = 12;
export const BOTTOM_HUD_SAFE_MARGIN = 120;

export function resetExecutiveToolbarSafeZoneLogsForTests(): void {
  // guarded by hudLayoutLogGuard reset
}
