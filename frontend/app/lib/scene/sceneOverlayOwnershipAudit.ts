/** E2:55 — Scene overlay audit: classify surfaces as KEEP, MERGE, or REMOVE. */

import { getExecutiveOverlayOwner } from "./executiveOverlayOwnershipRegistry";
import { isTemporarySceneOverlay, mayOverlayRemainPermanentlyVisible, type SceneOverlayId } from "./sceneOverlayPriority";

export type SceneOverlayAuditAction = "KEEP" | "MERGE" | "REMOVE";

export type SceneOverlayAuditEntry = {
  overlayId: SceneOverlayId;
  action: SceneOverlayAuditAction;
  owner: ReturnType<typeof getExecutiveOverlayOwner>;
  reason: string;
};

export type SceneOverlayGovernanceContext = {
  cleanPresentation: boolean;
  sceneInfoVisible: boolean;
  objectInfoVisible: boolean;
  timelineVisible: boolean;
  toolbarVisible: boolean;
  selectedObjectId: string | null;
  orientationElapsedSeconds: number;
  orientationWelcomeVisible: boolean;
  pipelineStatus: string;
  objectCount: number;
};

const BASE_AUDIT: SceneOverlayAuditEntry[] = [
  { overlayId: "sceneInfoHud", action: "KEEP", owner: "SCENE_INFO", reason: "Primary system surface." },
  { overlayId: "objectInfoHud", action: "KEEP", owner: "OBJECT_INFO", reason: "Primary object surface." },
  { overlayId: "timelineHud", action: "KEEP", owner: "TIMELINE", reason: "Primary history surface." },
  { overlayId: "executiveSceneToolbar", action: "KEEP", owner: "TOOLBAR", reason: "Primary navigation controls." },
  { overlayId: "scenarioOverlay", action: "KEEP", owner: "SCENARIO", reason: "Scenario visualization." },
  { overlayId: "dependencyOverlay", action: "KEEP", owner: "SCENARIO", reason: "Dependency visualization." },
  { overlayId: "propagationOverlay", action: "KEEP", owner: "SCENARIO", reason: "Impact path visualization." },
  { overlayId: "riskFlowOverlay", action: "KEEP", owner: "SCENARIO", reason: "Risk flow visualization." },
  {
    overlayId: "executiveStatusHud",
    action: "MERGE",
    owner: "SCENE_INFO",
    reason: "System health duplicates Scene Info in clean Type-C mode.",
  },
  {
    overlayId: "executiveOrientationPanel",
    action: "REMOVE",
    owner: "TRANSIENT",
    reason: "Monitoring headline duplicates Scene Info; overlaps top-left HUD.",
  },
  {
    overlayId: "executiveOrientationWelcome",
    action: "KEEP",
    owner: "TRANSIENT",
    reason: "First-visit welcome only; expires on dismiss.",
  },
  {
    overlayId: "pipelineStatusHud",
    action: "MERGE",
    owner: "SCENE_INFO",
    reason: "Pipeline status belongs with Scene Info unless processing/error.",
  },
  {
    overlayId: "executiveSceneOperationalStrip",
    action: "REMOVE",
    owner: "SCENE_INFO",
    reason: "Operational strip duplicates Scene Info and status surfaces.",
  },
  {
    overlayId: "objectInfoEmptyPlaceholder",
    action: "REMOVE",
    owner: "OBJECT_INFO",
    reason: "Empty-state card adds noise when no object is selected.",
  },
  {
    overlayId: "centerHelperCopy",
    action: "REMOVE",
    owner: "TRANSIENT",
    reason: "Center helper competes with canonical HUD surfaces.",
  },
  {
    overlayId: "gettingStartedHelper",
    action: "REMOVE",
    owner: "TRANSIENT",
    reason: "Getting-started copy duplicates orientation guidance.",
  },
  {
    overlayId: "typeCExecutiveSummaryCard",
    action: "MERGE",
    owner: "DECISION",
    reason: "Stage summary belongs in decision rail, not floating on scene.",
  },
  {
    overlayId: "analysisHandoffBanner",
    action: "KEEP",
    owner: "DECISION",
    reason: "Transient decision handoff; expires after purpose served.",
  },
  {
    overlayId: "quickActionsDock",
    action: "MERGE",
    owner: "AI_ASSISTANT",
    reason: "Quick actions belong in assistant rail when visible.",
  },
];

const logKeys = new Set<string>();

export function auditSceneOverlaySurfaces(context: SceneOverlayGovernanceContext): SceneOverlayAuditEntry[] {
  return BASE_AUDIT.map((entry) => {
    if (entry.overlayId === "executiveOrientationPanel" && context.cleanPresentation && context.sceneInfoVisible) {
      return { ...entry, action: "REMOVE" as const, reason: "Scene Info owns system monitoring in Type-C." };
    }
    if (entry.overlayId === "executiveStatusHud" && context.cleanPresentation && context.sceneInfoVisible) {
      return { ...entry, action: "REMOVE" as const, reason: "Scene Info owns system health metrics." };
    }
    if (entry.overlayId === "pipelineStatusHud" && context.sceneInfoVisible && context.pipelineStatus === "ready") {
      return { ...entry, action: "REMOVE" as const, reason: "Ready pipeline state is owned by Scene Info." };
    }
    if (entry.overlayId === "objectInfoEmptyPlaceholder" && !context.selectedObjectId) {
      return { ...entry, action: "REMOVE" as const, reason: "No invisible empty-state panel when nothing selected." };
    }
    return entry;
  });
}

export function shouldRenderSceneOverlay(
  overlayId: SceneOverlayId,
  context: SceneOverlayGovernanceContext
): boolean {
  const audit = auditSceneOverlaySurfaces(context).find((entry) => entry.overlayId === overlayId);
  if (!audit) return true;
  if (audit.action === "REMOVE") return false;

  if (isTemporarySceneOverlay(overlayId)) {
    if (overlayId === "executiveOrientationPanel") {
      return (
        context.orientationElapsedSeconds < 35 &&
        !context.orientationWelcomeVisible &&
        !context.cleanPresentation
      );
    }
    if (overlayId === "executiveOrientationWelcome") {
      return context.orientationWelcomeVisible;
    }
    if (overlayId === "objectInfoEmptyPlaceholder") {
      return Boolean(context.selectedObjectId);
    }
    if (overlayId === "analysisHandoffBanner") {
      return false;
    }
    return context.orientationElapsedSeconds < 60;
  }

  if (overlayId === "executiveStatusHud") {
    if (context.cleanPresentation && context.sceneInfoVisible) return false;
    return true;
  }

  if (overlayId === "pipelineStatusHud") {
    const active = context.pipelineStatus === "processing" || context.pipelineStatus === "error";
    if (!active) return false;
    if (context.sceneInfoVisible && context.pipelineStatus !== "error") {
      return context.pipelineStatus === "processing";
    }
    return true;
  }

  if (overlayId === "executiveSceneOperationalStrip" || overlayId === "centerHelperCopy" || overlayId === "gettingStartedHelper") {
    return !context.cleanPresentation;
  }

  if (overlayId === "typeCExecutiveSummaryCard") {
    return !context.cleanPresentation;
  }

  if (overlayId === "objectInfoHud") {
    if (!context.objectInfoVisible) return false;
    if (!context.selectedObjectId && context.cleanPresentation) return false;
    return true;
  }

  if (!mayOverlayRemainPermanentlyVisible(overlayId) && context.cleanPresentation) {
    return audit.action === "KEEP";
  }

  return audit.action === "KEEP" || audit.action === "MERGE";
}

export function overlapsReservedHudZone(
  overlayId: SceneOverlayId,
  zone: "top-left" | "top-right" | "bottom-center" | "toolbar"
): boolean {
  if (zone === "top-left") {
    return (
      overlayId === "executiveOrientationPanel" ||
      overlayId === "pipelineStatusHud" ||
      overlayId === "executiveSceneOperationalStrip"
    );
  }
  if (zone === "top-right") {
    return overlayId === "executiveStatusHud";
  }
  if (zone === "bottom-center") {
    return overlayId === "quickActionsDock";
  }
  if (zone === "toolbar") {
    return overlayId === "executiveSceneToolbar";
  }
  return false;
}

export function logSceneOverlayAudit(context: SceneOverlayGovernanceContext): void {
  if (process.env.NODE_ENV === "production") return;
  const payload = {
    audit: auditSceneOverlaySurfaces(context),
    visible: BASE_AUDIT.filter((entry) => shouldRenderSceneOverlay(entry.overlayId, context)).map(
      (entry) => entry.overlayId
    ),
  };
  const key = JSON.stringify(payload.visible);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][SceneOverlayAudit]", payload);
}

export function resetSceneOverlayAuditLogsForTests(): void {
  logKeys.clear();
}
