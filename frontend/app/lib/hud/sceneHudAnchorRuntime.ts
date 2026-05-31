import type React from "react";

import {
  hudAnchorStyle,
  type ExecutiveAnchorZone,
  type HudPanelId,
  type HudViewportOffsets,
} from "./hudAnchoringRuntime";
import { resolveHudAdaptiveCollapse } from "./hudAdaptiveCollapseRuntime";
import { enforceCanonicalAnchor, hudZoneToDockZone } from "../scene/executiveHudLayoutGovernance";
import { resolveSceneHudPanelStyle, type SceneHudLayoutContext } from "../scene/sceneHudCollisionRuntime";
import { getSceneHudRegistration, type SceneHudPanelId as RegistrySceneHudPanelId } from "../scene/sceneHudRegistry";
import { resolveTimelineSafeZone } from "../scene/timelineSafeZoneRuntime";
import {
  isTopRowHudPanel,
  resolveExecutiveSideInset,
  resolveExecutiveTopBaseline,
} from "../scene/executiveTopAlignmentRuntime";
import { resolveExecutiveTopHudSafeZone } from "../scene/executiveTopHudSafeZone";
import {
  registerGovernedPanel,
  setPreferredPanelAnchor,
  type GovernedPanelId,
} from "../workspace/panelGovernanceRuntime";
import { getExecutiveHudViewport } from "../layout/executiveHudHydrationRuntime";

export type SceneHudAnchor =
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "BOTTOM_CENTER"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "CENTER_FLOATING";

export type SceneHudPanelIdLegacy = "sceneInfoHud" | "objectInfoHud" | "timelineHud" | "quickActionsDock" | "executiveStatusHud";

export type SceneHudRegistration = {
  panelId: SceneHudPanelIdLegacy;
  anchor: SceneHudAnchor;
  priority: number;
  visibility: boolean;
  collapsed: boolean;
  preferredAnchor: SceneHudAnchor;
};

const LEGACY_TO_REGISTRY: Record<SceneHudPanelIdLegacy, RegistrySceneHudPanelId> = {
  sceneInfoHud: "sceneInfoHud",
  objectInfoHud: "objectInfoHud",
  timelineHud: "timelineHud",
  quickActionsDock: "quickActionsDock",
  executiveStatusHud: "executiveStatusHud",
};

const SCENE_HUD_DEFAULT_ANCHORS: Readonly<Record<SceneHudPanelIdLegacy, SceneHudAnchor>> = Object.freeze({
  sceneInfoHud: "TOP_LEFT",
  objectInfoHud: "TOP_RIGHT",
  timelineHud: "BOTTOM_CENTER",
  quickActionsDock: "BOTTOM_CENTER",
  executiveStatusHud: "TOP_RIGHT",
});

const logKeys = new Set<string>();

function log(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

function toExecutiveAnchorZone(anchor: SceneHudAnchor): ExecutiveAnchorZone {
  if (anchor === "TOP_LEFT") return "top-left";
  if (anchor === "TOP_RIGHT") return "top-right";
  if (anchor === "BOTTOM_LEFT") return "bottom-left";
  if (anchor === "BOTTOM_RIGHT") return "bottom-right";
  if (anchor === "CENTER_FLOATING") return "top-center";
  return "bottom-center";
}

function viewport() {
  return getExecutiveHudViewport();
}

function offsetsForPanel(panelId: SceneHudPanelIdLegacy): Partial<HudViewportOffsets> {
  const vp = viewport();
  const top = resolveExecutiveTopBaseline(vp.width);
  const side = resolveExecutiveSideInset(vp.width);
  if (panelId === "timelineHud") {
    const zone = resolveTimelineSafeZone({
      viewportWidth: vp.width,
      viewportHeight: vp.height,
      timelineVisible: true,
      quickActionsVisible: false,
      timelineExpanded: false,
    });
    return { bottom: zone.bottomOffset };
  }
  if (panelId === "executiveStatusHud") {
    return { top, right: side };
  }
  return { top, right: side, left: side, bottom: side };
}

function estimateForPanel(panelId: SceneHudPanelIdLegacy) {
  const registryId = LEGACY_TO_REGISTRY[panelId];
  const entry = getSceneHudRegistration(registryId);
  return { width: entry.estimatedWidth, height: entry.estimatedHeight };
}

export type SceneHudPanelId = SceneHudPanelIdLegacy;

export function registerSceneHudPanel(input: {
  panelId: SceneHudPanelIdLegacy;
  anchor?: SceneHudAnchor;
  priority?: number;
  visibility?: boolean;
  collapsed?: boolean;
  title?: string;
}): SceneHudRegistration {
  const registryId = LEGACY_TO_REGISTRY[input.panelId];
  const entry = getSceneHudRegistration(registryId);
  const fallbackAnchor = input.anchor ?? SCENE_HUD_DEFAULT_ANCHORS[input.panelId];
  const canonicalZone = enforceCanonicalAnchor(registryId);
  const anchor = fallbackAnchor;
  const priority = input.priority ?? entry.priority;
  const visibility = input.visibility ?? true;
  const collapsed = input.collapsed ?? false;
  const zone = hudZoneToDockZone(canonicalZone);

  registerGovernedPanel({
    panelId: input.panelId as GovernedPanelId,
    visible: visibility,
    collapsed,
    anchorZone: zone,
    preferredAnchor: zone,
    priority,
    title: input.title ?? input.panelId,
  });
  const registration = {
    panelId: input.panelId,
    anchor,
    priority,
    visibility,
    collapsed,
    preferredAnchor: anchor,
  };
  log("[Nexora][HudAnchor]", registration);
  log("[Nexora][HudDock]", {
    panelId: input.panelId,
    anchor,
    dockZone: zone,
    priority,
  });
  return registration;
}

export function persistSceneHudAnchorPreference(panelId: SceneHudPanelIdLegacy, anchor: SceneHudAnchor): void {
  setPreferredPanelAnchor(panelId as GovernedPanelId, toExecutiveAnchorZone(anchor));
}

export function sceneHudDockStyle(input: {
  panelId: SceneHudPanelIdLegacy;
  anchor?: SceneHudAnchor;
  visible?: boolean;
  collapsed?: boolean;
  maxWidth?: string;
  zIndex?: number;
  transitionMs?: number;
  visiblePanelCount?: number;
}): React.CSSProperties {
  const registration = registerSceneHudPanel({
    panelId: input.panelId,
    anchor: input.anchor,
    visibility: input.visible,
    collapsed: input.collapsed,
  });
  const registryId = LEGACY_TO_REGISTRY[input.panelId];
  const entry = getSceneHudRegistration(registryId);
  const estimates = estimateForPanel(input.panelId);
  const vp = viewport();
  const timelineZone = resolveTimelineSafeZone({
    viewportWidth: vp.width,
    viewportHeight: vp.height,
    timelineVisible: input.panelId === "timelineHud",
    quickActionsVisible: input.panelId === "quickActionsDock",
    timelineExpanded: false,
  });
  const zone = toExecutiveAnchorZone(registration.anchor);
  const adaptive = resolveHudAdaptiveCollapse({
    panelId: input.panelId,
    priority: registration.priority,
    visiblePanelCount: input.visiblePanelCount,
  });
  const positionStyle = hudAnchorStyle(input.panelId as HudPanelId, {
    dockZone: zone,
    viewportOffsets: offsetsForPanel(input.panelId),
    visible: input.visible,
    collapsedState: registration.collapsed || adaptive.shouldCollapse,
    reservedSpace:
      input.panelId === "timelineHud"
        ? { bottom: estimates.height + timelineZone.bottomOffset }
        : zone === "top-left"
          ? { top: estimates.height, left: estimates.width }
          : zone === "top-right"
            ? { top: estimates.height, right: estimates.width }
            : undefined,
    maxWidth: input.maxWidth ?? (input.panelId === "timelineHud" ? timelineZone.maxWidth : undefined),
    zIndex: input.zIndex ?? entry.layer,
    transitionMs: input.transitionMs,
    estimatedWidth: estimates.width,
    estimatedHeight: estimates.height,
  });

  const layoutContext: SceneHudLayoutContext = {
    viewportWidth: vp.width,
    viewportHeight: vp.height,
    inset: resolveExecutiveSideInset(vp.width),
    toolbarTop: resolveExecutiveTopBaseline(vp.width),
    timelineBottomOffset: timelineZone.bottomOffset,
    visiblePanels: {
      sceneInfoHud: Boolean(input.visible && input.panelId === "sceneInfoHud"),
      objectInfoHud: Boolean(input.visible && input.panelId === "objectInfoHud"),
      executiveStatusHud: Boolean(input.visible && input.panelId === "executiveStatusHud"),
      timelineHud: Boolean(input.visible && input.panelId === "timelineHud"),
      executiveSceneToolbar: true,
    },
  };

  const topSafeZone = resolveExecutiveTopHudSafeZone({
    viewportWidth: vp.width,
    sceneInfoVisible: layoutContext.visiblePanels.sceneInfoHud ?? false,
    objectInfoVisible: layoutContext.visiblePanels.objectInfoHud ?? false,
  });

  const collisionPatch = resolveSceneHudPanelStyle(registryId, layoutContext);
  const unifiedTop = resolveExecutiveTopBaseline(vp.width);
  const isTopRow = isTopRowHudPanel(registryId);

  const stackedTop =
    input.panelId === "executiveStatusHud" && layoutContext.visiblePanels.objectInfoHud
      ? unifiedTop + estimateForPanel("objectInfoHud").height + 8
      : undefined;

  const sanitizedCollision =
    isTopRow && collisionPatch?.transform
      ? { ...collisionPatch, transform: undefined }
      : collisionPatch;

  const topRowMaxWidth =
    registryId === "sceneInfoHud"
      ? topSafeZone.sceneInfoMaxWidth
      : registryId === "objectInfoHud"
        ? topSafeZone.objectInfoMaxWidth
        : undefined;

  return {
    ...positionStyle,
    top: isTopRow ? unifiedTop : stackedTop ?? positionStyle.top,
    ...(topRowMaxWidth ? { maxWidth: topRowMaxWidth } : null),
    ...sanitizedCollision,
  };
}

export function resetSceneHudAnchorRuntimeForTests(): void {
  logKeys.clear();
}
