/** Scene HUD Zone Contract — hard-locked layout regions for Type-C scene overlays. */

import type React from "react";

import { stableLayoutSignature } from "../layout/layoutThrottleAuditRuntime";
import { getExecutiveHudViewport } from "../layout/executiveHudHydrationRuntime";
import { EXECUTIVE_SCENE_HUD_GRID } from "./executiveSceneHudGrid";
import { resolveExecutiveTopHudSafeZone } from "./executiveTopHudSafeZone";
import {
  OBJECT_PANEL_TOP,
  resolveSceneHudEdgeInset,
  SCENE_PANEL_TOP,
  traceSceneHudInsets,
} from "./sceneHudInsetContract.ts";
import { resolveObjectPanelSafeZoneContract } from "../hud/objectPanelSafeZoneContract.ts";
import { resolveTimelineZoneContract, TIMELINE_Z_INDEX } from "../hud/timelineZoneContract.ts";
import {
  resolveTimelineDisplayHeight,
  timelineLayoutTransitionStyle,
  toTimelineDisplayState,
} from "../hud/timelineWidthContract.ts";
import {
  isTimelineBottomAnchorValid,
  resolveTimelineAnchorState,
  resolveTimelineBottomAnchoredTop,
  TIMELINE_BOTTOM_INSET_PX,
  traceTimelineBottomAnchor,
  traceTimelineBottomAnchorViolation,
} from "../hud/timelineBottomAnchorContract.ts";
import {
  resolveSceneHudTopAlignment,
  traceSceneHudTopAlign,
} from "../hud/sceneHudTopAlignmentContract.ts";
import {
  resolveScenePanelFixedWidth,
  resolveScenePanelZoneHeight,
  resolveScenePanelZoneMaxWidth,
  resolveScenePanelZoneWidth,
  SCENE_PANEL_MINIMIZED_HEIGHT,
  SCENE_PANEL_WIDTH,
  traceScenePanelLayout,
  toScenePanelHeightMode,
} from "./scenePanelWidthContract.ts";
import {
  OBJECT_PANEL_EXPANDED_WIDTH,
  OBJECT_PANEL_WIDTH,
  traceHudPanelDesign,
} from "../hud/hudPanelDesignContract.ts";
import { HUD_RUNTIME_FREEZE_V1 } from "../hud/hudRuntimeFreezeContract.ts";

export type SceneHudZoneId =
  | "scene-topbar-zone"
  | "scene-object-panel-zone"
  | "scene-timeline-zone"
  | "scene-panel-zone";

export const SCENE_HUD_ZONE_IDS = Object.freeze({
  topBar: "scene-topbar-zone" satisfies SceneHudZoneId,
  objectPanel: "scene-object-panel-zone" satisfies SceneHudZoneId,
  timeline: "scene-timeline-zone" satisfies SceneHudZoneId,
  scenePanel: "scene-panel-zone" satisfies SceneHudZoneId,
});

export type SceneHudZoneRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  maxWidth: string;
  maxHeight: string;
};

export type SceneHudZoneContract = {
  viewportWidth: number;
  viewportHeight: number;
  sceneWidth: number;
  sceneHeight: number;
  topBarZone: SceneHudZoneRect;
  objectPanelZone: SceneHudZoneRect;
  timelineZone: SceneHudZoneRect;
  scenePanelZone: SceneHudZoneRect;
  overlapDetected: boolean;
  mrpOverlapDetected: boolean;
  clamped: boolean;
  compactSidePanels: boolean;
  objectPanelRight: number;
  objectPanelWidth: number;
  mrpWidth: number;
};

export type SceneHudTimelineHeightMode = "collapsed" | "compact" | "expanded" | "full";

export type SceneHudZoneContractContext = {
  viewportWidth?: number;
  viewportHeight?: number;
  /** Measured scene canvas host width — Object Panel anchors inside this region. */
  sceneWidth?: number;
  /** Measured scene canvas host height. */
  sceneHeight?: number;
  /** Main Right Panel reserved width for overlap diagnostics. */
  mainRightPanelWidth?: number;
  /** When false, MRP region is treated as absent for overlap diagnostics. */
  mainRightPanelVisible?: boolean;
  /** Scene panel zone content visibility — does not affect timeline geometry. */
  scenePanelVisible?: boolean;
  /** Timeline zone content visibility — does not depend on object selection. */
  timelineVisible?: boolean;
  topBarVisible?: boolean;
  /** Timeline height mode only — never tied to object selection. */
  timelineHeightMode?: SceneHudTimelineHeightMode;
  /** Object panel width mode only — does not resize or move timeline. */
  objectPanelExpanded?: boolean;
  /** Scene panel collapse — controls zone height only (header-only vs half-height). */
  scenePanelCollapsed?: boolean;
};

export const SCENE_HUD_ZONE_METRICS = Object.freeze({
  topBarHeight: 44,
  zoneGap: 8,
  scenePanelWidth: SCENE_PANEL_WIDTH,
  scenePanelCompactWidth: SCENE_PANEL_WIDTH,
  scenePanelTopInset: SCENE_PANEL_TOP,
  objectPanelCompactWidth: OBJECT_PANEL_WIDTH,
  objectPanelExpandedWidth: OBJECT_PANEL_EXPANDED_WIDTH,
  objectPanelRailWidth: 56,
  timelineTransportHeight: 52,
  timelineBodyHeight: 64,
  timelineCollapsedBodyHeight: 36,
  timelineExpandedBodyHeight: 220,
  chatInputClearance: 88,
  bottomHudPadding: 16,
  sidePanelMinViewport: 1024,
  mrpSafeGap: 16,
});

function resolveTimelineHeight(mode: SceneHudTimelineHeightMode): number {
  return resolveTimelineDisplayHeight(toTimelineDisplayState(mode));
}

/** Fixed side reservations — timeline never reacts to object selection toggles. */
const FIXED_OBJECT_PANEL_SLOT_WIDTH = SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth;

let lastZoneSignature: string | null = null;
let lastZoneContract: SceneHudZoneContract | null = null;
const loggedZoneSignatures = new Set<string>();
const loggedHudZoneSignatures = new Set<string>();
const loggedHudZoneBrakeSignatures = new Set<string>();
const loggedHudZoneBrakeDebounceSignatures = new Set<string>();

function zoneRect(
  top: number,
  left: number,
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number,
  maxWidth: string
): SceneHudZoneRect {
  const safeWidth = Math.max(0, width);
  const safeHeight = Math.max(0, height);
  return {
    top,
    left,
    right: Math.max(0, containerWidth - left - safeWidth),
    bottom: Math.max(0, containerHeight - top - safeHeight),
    width: safeWidth,
    height: safeHeight,
    maxWidth,
    maxHeight: `${Math.floor(safeHeight)}px`,
  };
}

function rectsOverlap(a: SceneHudZoneRect, b: SceneHudZoneRect): boolean {
  const aRight = a.left + a.width;
  const aBottom = a.top + a.height;
  const bRight = b.left + b.width;
  const bBottom = b.top + b.height;
  return a.left < bRight && aRight > b.left && a.top < bBottom && aBottom > b.top;
}

function resolveLayoutDimensions(context: SceneHudZoneContractContext): {
  viewportWidth: number;
  viewportHeight: number;
  layoutWidth: number;
  layoutHeight: number;
} {
  const vp = getExecutiveHudViewport();
  const viewportWidth = context.viewportWidth ?? vp.width;
  const viewportHeight = context.viewportHeight ?? vp.height;
  const layoutWidth = Math.max(
    320,
    context.sceneWidth && context.sceneWidth > 0 ? context.sceneWidth : viewportWidth
  );
  const layoutHeight = Math.max(
    320,
    context.sceneHeight && context.sceneHeight > 0 ? context.sceneHeight : viewportHeight
  );
  return { viewportWidth, viewportHeight, layoutWidth, layoutHeight };
}

export function resolveSceneHudZoneContract(
  context: SceneHudZoneContractContext = {}
): SceneHudZoneContract {
  const { viewportWidth, viewportHeight, layoutWidth, layoutHeight } = resolveLayoutDimensions(context);
  const isMobile = layoutWidth < 768;
  const isNarrow = layoutWidth < SCENE_HUD_ZONE_METRICS.sidePanelMinViewport;
  const timelineHeightMode = context.timelineHeightMode ?? "compact";
  const mrpWidth = Math.max(0, context.mainRightPanelWidth ?? 0);
  const mrpVisible = context.mainRightPanelVisible !== false && mrpWidth > 0;
  const usingViewportFallback =
    !context.sceneWidth || context.sceneWidth <= 0 || context.sceneWidth >= viewportWidth - 1;
  const topBarVisible = context.topBarVisible ?? true;

  const signature = stableLayoutSignature({
    layoutWidth,
    layoutHeight,
    viewportWidth,
    viewportHeight,
    scenePanelVisible: context.scenePanelVisible ?? true,
    timelineVisible: context.timelineVisible ?? true,
    topBarVisible,
    timelineHeightMode,
    objectPanelExpanded: context.objectPanelExpanded ?? false,
    scenePanelCollapsed: context.scenePanelCollapsed ?? false,
    mrpWidth,
    mrpVisible,
  });

  if (lastZoneContract && lastZoneSignature === signature) {
    return lastZoneContract;
  }

  const sideInset = resolveSceneHudEdgeInset();
  const topSafeZone = resolveExecutiveTopHudSafeZone({
    viewportWidth: layoutWidth,
    sceneInfoVisible: true,
    objectInfoVisible: true,
  });

  const topAlignment = resolveSceneHudTopAlignment({ layoutWidth });
  const topBarHeight = SCENE_HUD_ZONE_METRICS.topBarHeight;
  const topBarTop = topAlignment.SCENE_MENU_BAR_TOP_Y;
  const sideTop = OBJECT_PANEL_TOP;
  const centerLaneWidth = Math.max(
    180,
    topSafeZone.rightLaneStart - topSafeZone.leftLaneEnd
  );
  const topBarWidth = Math.min(480, centerLaneWidth);
  const topBarLeft = (layoutWidth - topBarWidth) / 2;

  const timelineHeight = resolveTimelineHeight(timelineHeightMode);
  const timelineBottomInset = TIMELINE_BOTTOM_INSET_PX;
  const timelineTop = resolveTimelineBottomAnchoredTop({
    layoutHeight,
    timelineHeight,
    bottomInset: timelineBottomInset,
  });
  const anchorState = resolveTimelineAnchorState(timelineHeightMode);
  traceTimelineBottomAnchor({
    anchorState,
    layoutHeight,
    timelineHeight,
  });
  if (
    !isTimelineBottomAnchorValid({
      layoutHeight,
      timelineTop,
      timelineHeight,
      bottomInset: timelineBottomInset,
    })
  ) {
    traceTimelineBottomAnchorViolation("bottom_anchor_violation");
  }

  let sideMaxHeight = timelineTop - sideTop - SCENE_HUD_ZONE_METRICS.zoneGap;

  const objectPanelExpanded = context.objectPanelExpanded ?? false;
  let compactSidePanels = isNarrow;
  let clamped = false;

  if (sideMaxHeight < 120) {
    compactSidePanels = true;
    sideMaxHeight = Math.max(96, timelineTop - sideTop - SCENE_HUD_ZONE_METRICS.zoneGap);
    clamped = true;
  }

  const scenePanelCollapsed = context.scenePanelCollapsed ?? false;
  const scenePanelTop = SCENE_PANEL_TOP;
  const scenePanelWidth = resolveScenePanelFixedWidth();
  const scenePanelMaxWidth = resolveScenePanelZoneMaxWidth();
  const scenePanelHeight = resolveScenePanelZoneHeight({
    timelineTop,
    minimized: scenePanelCollapsed,
    zoneGap: SCENE_HUD_ZONE_METRICS.zoneGap,
  });
  traceScenePanelLayout({
    top: scenePanelTop,
    width: scenePanelWidth,
    heightMode: toScenePanelHeightMode(scenePanelCollapsed),
    bodyVisible: !scenePanelCollapsed,
  });
  const objectPanelWidth = objectPanelExpanded
    ? SCENE_HUD_ZONE_METRICS.objectPanelExpandedWidth
    : FIXED_OBJECT_PANEL_SLOT_WIDTH;

  const scenePanelLeft = sideInset;

  const objectPanelSafeZone = resolveObjectPanelSafeZoneContract({
    viewportWidth,
    layoutWidth,
    layoutHeight,
    sideInset,
    sideTop,
    sideMaxHeight,
    scenePanelLeft,
    scenePanelWidth,
    objectPanelWidthRequested: objectPanelWidth,
    mrpWidth,
    mrpVisible,
    usingViewportFallback,
    isMobile,
    objectPanelExpanded,
  });

  const objectPanelZone = objectPanelSafeZone.objectPanelZone;

  const topBarZone = zoneRect(
    topBarTop,
    topBarLeft,
    topBarWidth,
    topBarHeight,
    layoutWidth,
    layoutHeight,
    topSafeZone.toolbarMaxWidth
  );

  const scenePanelZone = zoneRect(
    scenePanelTop,
    scenePanelLeft,
    scenePanelWidth,
    scenePanelHeight,
    layoutWidth,
    layoutHeight,
    isMobile ? `min(${scenePanelWidth}px, 46vw)` : scenePanelMaxWidth
  );

  if (objectPanelSafeZone.clamped) {
    clamped = true;
  }

  const timelineSafeZone = resolveTimelineZoneContract({
    viewportWidth,
    layoutWidth,
    layoutHeight,
    sideInset,
    timelineTop,
    timelineHeight,
    timelineBottomOffset: timelineBottomInset,
    scenePanelLeft,
    scenePanelWidth,
    objectPanelLeft: objectPanelZone.left,
    objectPanelWidth: objectPanelZone.width,
    objectPanelBandWidth: FIXED_OBJECT_PANEL_SLOT_WIDTH,
    mrpWidth,
    mrpVisible,
    usingViewportFallback,
    isMobile,
  });

  const timelineZone = timelineSafeZone.timelineZone;

  if (timelineSafeZone.clamped) {
    clamped = true;
  }

  let overlapDetected =
    (topBarVisible && rectsOverlap(topBarZone, objectPanelZone)) ||
    (topBarVisible && rectsOverlap(topBarZone, scenePanelZone)) ||
    timelineSafeZone.overlapDetected ||
    rectsOverlap(timelineZone, objectPanelZone) ||
    rectsOverlap(timelineZone, scenePanelZone) ||
    rectsOverlap(objectPanelZone, scenePanelZone);

  const objectPanelOverflowsScene =
    objectPanelZone.left + objectPanelZone.width > layoutWidth - sideInset + 0.5 ||
    objectPanelZone.left < 0;
  const mrpOverlapDetected =
    objectPanelSafeZone.overlapDetected ||
    (mrpVisible && usingViewportFallback && objectPanelOverflowsScene);

  if (overlapDetected) {
    clamped = true;
    const reducedSideHeight = Math.max(96, timelineTop - sideTop - SCENE_HUD_ZONE_METRICS.zoneGap);
    if (reducedSideHeight < objectPanelZone.height) {
      objectPanelZone.height = reducedSideHeight;
      objectPanelZone.maxHeight = `${Math.floor(reducedSideHeight)}px`;
    }
    if (reducedSideHeight < scenePanelZone.height && scenePanelZone.height > SCENE_PANEL_MINIMIZED_HEIGHT) {
      scenePanelZone.height = Math.max(
        SCENE_PANEL_MINIMIZED_HEIGHT,
        Math.min(scenePanelZone.height, reducedSideHeight)
      );
      scenePanelZone.maxHeight = `${Math.floor(scenePanelZone.height)}px`;
    }
    overlapDetected =
      (topBarVisible && rectsOverlap(topBarZone, objectPanelZone)) ||
      (topBarVisible && rectsOverlap(topBarZone, scenePanelZone)) ||
      rectsOverlap(timelineZone, objectPanelZone) ||
      rectsOverlap(timelineZone, scenePanelZone);
  }

  const contract: SceneHudZoneContract = {
    viewportWidth,
    viewportHeight,
    sceneWidth: layoutWidth,
    sceneHeight: layoutHeight,
    topBarZone,
    objectPanelZone,
    timelineZone,
    scenePanelZone,
    overlapDetected,
    mrpOverlapDetected,
    clamped,
    compactSidePanels,
    objectPanelRight: objectPanelSafeZone.objectPanelRight,
    objectPanelWidth: objectPanelSafeZone.objectPanelWidth,
    mrpWidth,
  };

  lastZoneSignature = signature;
  lastZoneContract = contract;
  traceSceneHudTopAlign(contract);
  traceSceneHudInsets(contract);
  traceHudPanelDesign({
    scenePanelWidth: scenePanelZone.width,
    objectPanelWidth: objectPanelZone.width,
  });
  return contract;
}

export function zoneRectForId(
  contract: SceneHudZoneContract,
  zoneId: SceneHudZoneId
): SceneHudZoneRect {
  switch (zoneId) {
    case SCENE_HUD_ZONE_IDS.topBar:
      return contract.topBarZone;
    case SCENE_HUD_ZONE_IDS.objectPanel:
      return contract.objectPanelZone;
    case SCENE_HUD_ZONE_IDS.timeline:
      return contract.timelineZone;
    case SCENE_HUD_ZONE_IDS.scenePanel:
      return contract.scenePanelZone;
    default:
      return contract.topBarZone;
  }
}

export function zoneShellStyle(
  contract: SceneHudZoneContract,
  zoneId: SceneHudZoneId
): React.CSSProperties {
  const rect = zoneRectForId(contract, zoneId);
  const isTopBar = zoneId === SCENE_HUD_ZONE_IDS.topBar;
  const isTimeline = zoneId === SCENE_HUD_ZONE_IDS.timeline;
  const isObjectPanel = zoneId === SCENE_HUD_ZONE_IDS.objectPanel;
  const isScenePanel = zoneId === SCENE_HUD_ZONE_IDS.scenePanel;

  return {
    position: "absolute",
    top: isTimeline ? undefined : rect.top,
    bottom: isTimeline ? TIMELINE_BOTTOM_INSET_PX : undefined,
    left: isTopBar ? "50%" : isObjectPanel ? undefined : rect.left,
    right: isObjectPanel || isTimeline ? rect.right : undefined,
    transform: isTopBar ? "translateX(-50%)" : undefined,
    width: rect.width,
    maxWidth: rect.maxWidth,
    height: isTimeline || isTopBar || isScenePanel || isObjectPanel ? rect.height : undefined,
    maxHeight: rect.maxHeight,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: isTopBar ? 1600 : isObjectPanel ? 6 : isTimeline ? TIMELINE_Z_INDEX : 5,
    ...(isTimeline ? timelineLayoutTransitionStyle() : null),
  };
}

/** Overlay fill style when hosted inside a zone shell (no absolute drift). */
export const SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE: React.CSSProperties = Object.freeze({
  position: "relative",
  width: "100%",
  maxWidth: "100%",
  height: "100%",
  maxHeight: "100%",
  minHeight: 0,
  minWidth: 0,
  overflowY: "auto",
  overflowX: "hidden",
  pointerEvents: "auto",
});

function logHudZoneDiagnostics(contract: SceneHudZoneContract): void {
  if (process.env.NODE_ENV === "production") return;
  const payload = {
    objectPanelRight: contract.objectPanelRight,
    objectPanelWidth: contract.objectPanelWidth,
    mrpWidth: contract.mrpWidth,
    overlapDetected: contract.overlapDetected || contract.mrpOverlapDetected,
    sceneWidth: contract.sceneWidth,
    objectPanelLeft: contract.objectPanelZone.left,
  };
  const brakeSignature = stableLayoutSignature({
    objectPanelRight: payload.objectPanelRight,
    objectPanelWidth: payload.objectPanelWidth,
    mrpWidth: payload.mrpWidth,
    sceneWidth: payload.sceneWidth,
    overlapDetected: payload.overlapDetected,
  });
  const shouldLogBrake = payload.overlapDetected && !loggedHudZoneBrakeSignatures.has(brakeSignature);
  const verySmallWidth =
    contract.viewportWidth <
    HUD_RUNTIME_FREEZE_V1.frozenBehaviors.hudDebounceStrategy.verySmallWidthThresholdPx;
  const brakeIsDiagnosticOnly = verySmallWidth && contract.clamped;
  const debounceTraceSignature = `${brakeSignature}:${shouldLogBrake ? "logged" : "suppressed"}`;
  if (!loggedHudZoneBrakeDebounceSignatures.has(debounceTraceSignature)) {
    loggedHudZoneBrakeDebounceSignatures.add(debounceTraceSignature);
    globalThis.console?.debug?.("[NexoraHUDZoneDebounce]", {
      signature: brakeSignature,
      logged: shouldLogBrake,
    });
  }
  const signature = stableLayoutSignature(payload);
  if (!loggedHudZoneSignatures.has(signature)) {
    loggedHudZoneSignatures.add(signature);
    globalThis.console?.debug?.("[Nexora][HUDZone]", payload);
  }
  if (shouldLogBrake) {
    loggedHudZoneBrakeSignatures.add(brakeSignature);
    if (brakeIsDiagnosticOnly) {
      globalThis.console?.debug?.("[Nexora][HUDZoneBrake]", {
        ...payload,
        diagnosticOnly: true,
        reason: "very_small_width_clamped_layout",
      });
    } else {
      globalThis.console?.warn?.("[Nexora][HUDZoneBrake]", payload);
    }
  }
}

export function logSceneHudZoneContract(contract: SceneHudZoneContract): void {
  if (process.env.NODE_ENV === "production") return;
  logHudZoneDiagnostics(contract);
  const signature = stableLayoutSignature({
    viewportWidth: contract.viewportWidth,
    viewportHeight: contract.viewportHeight,
    sceneWidth: contract.sceneWidth,
    topBar: contract.topBarZone,
    objectPanel: contract.objectPanelZone,
    timeline: contract.timelineZone,
    scenePanel: contract.scenePanelZone,
    overlapDetected: contract.overlapDetected,
    mrpOverlapDetected: contract.mrpOverlapDetected,
    clamped: contract.clamped,
    compactSidePanels: contract.compactSidePanels,
  });
  if (loggedZoneSignatures.has(signature)) return;
  loggedZoneSignatures.add(signature);
  globalThis.console?.debug?.("[Nexora][SceneHudZoneContract]", {
    viewportWidth: contract.viewportWidth,
    viewportHeight: contract.viewportHeight,
    sceneWidth: contract.sceneWidth,
    sceneHeight: contract.sceneHeight,
    topbar: contract.topBarZone,
    objectPanel: contract.objectPanelZone,
    timeline: contract.timelineZone,
    scenePanel: contract.scenePanelZone,
    overlapDetected: contract.overlapDetected,
    mrpOverlapDetected: contract.mrpOverlapDetected,
    clamped: contract.clamped,
    compactSidePanels: contract.compactSidePanels,
    grid: EXECUTIVE_SCENE_HUD_GRID,
  });
}

import { resetSceneHudInsetContractForTests } from "./sceneHudInsetContract.ts";

export function resetSceneHudZoneContractForTests(): void {
  lastZoneSignature = null;
  lastZoneContract = null;
  loggedZoneSignatures.clear();
  loggedHudZoneSignatures.clear();
  loggedHudZoneBrakeSignatures.clear();
  loggedHudZoneBrakeDebounceSignatures.clear();
  resetSceneHudInsetContractForTests();
}