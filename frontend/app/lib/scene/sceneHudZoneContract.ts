/** Scene HUD Zone Contract — hard-locked layout regions for Type-C scene overlays. */

import type React from "react";

import { stableLayoutSignature } from "../layout/layoutThrottleAuditRuntime";
import { getExecutiveHudViewport } from "../layout/executiveHudHydrationRuntime";
import { EXECUTIVE_SCENE_HUD_GRID } from "./executiveSceneHudGrid";
import {
  resolveExecutiveSideInset,
  resolveExecutiveTopBaseline,
} from "./executiveTopAlignmentRuntime";
import { resolveExecutiveTopHudSafeZone } from "./executiveTopHudSafeZone";

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
};

export const SCENE_HUD_ZONE_METRICS = Object.freeze({
  topBarHeight: 44,
  zoneGap: 8,
  scenePanelWidth: 248,
  scenePanelCompactWidth: 56,
  objectPanelCompactWidth: 248,
  objectPanelExpandedWidth: 320,
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

const TIMELINE_BODY_HEIGHT_BY_MODE: Record<SceneHudTimelineHeightMode, number> = {
  collapsed: SCENE_HUD_ZONE_METRICS.timelineCollapsedBodyHeight,
  compact: SCENE_HUD_ZONE_METRICS.timelineBodyHeight,
  expanded: SCENE_HUD_ZONE_METRICS.timelineExpandedBodyHeight,
  full: SCENE_HUD_ZONE_METRICS.timelineExpandedBodyHeight,
};

/** Fixed side reservations — timeline never reacts to object selection toggles. */
const FIXED_SCENE_PANEL_SLOT_WIDTH = SCENE_HUD_ZONE_METRICS.scenePanelWidth;
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

function resolveTimelineHeight(mode: SceneHudTimelineHeightMode): number {
  return (
    SCENE_HUD_ZONE_METRICS.timelineTransportHeight + TIMELINE_BODY_HEIGHT_BY_MODE[mode]
  );
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

  const signature = stableLayoutSignature({
    layoutWidth,
    layoutHeight,
    viewportWidth,
    viewportHeight,
    scenePanelVisible: context.scenePanelVisible ?? true,
    timelineVisible: context.timelineVisible ?? true,
    topBarVisible: context.topBarVisible ?? true,
    timelineHeightMode,
    objectPanelExpanded: context.objectPanelExpanded ?? false,
    mrpWidth,
    mrpVisible,
  });

  if (lastZoneContract && lastZoneSignature === signature) {
    return lastZoneContract;
  }

  const topBaseline = resolveExecutiveTopBaseline(layoutWidth);
  const sideInset = resolveExecutiveSideInset(layoutWidth);
  const topSafeZone = resolveExecutiveTopHudSafeZone({
    viewportWidth: layoutWidth,
    sceneInfoVisible: true,
    objectInfoVisible: true,
  });

  const topBarHeight = SCENE_HUD_ZONE_METRICS.topBarHeight;
  const topBarTop = topBaseline;
  const centerLaneWidth = Math.max(
    180,
    topSafeZone.rightLaneStart - topSafeZone.leftLaneEnd
  );
  const topBarWidth = Math.min(480, centerLaneWidth);
  const topBarLeft = (layoutWidth - topBarWidth) / 2;

  const timelineHeight = resolveTimelineHeight(timelineHeightMode);
  const bottomOffset = Math.max(
    isMobile ? 72 : SCENE_HUD_ZONE_METRICS.chatInputClearance,
    timelineHeight + SCENE_HUD_ZONE_METRICS.bottomHudPadding
  );
  const timelineTop = layoutHeight - bottomOffset - timelineHeight;

  const sideTop = topBarTop + topBarHeight + SCENE_HUD_ZONE_METRICS.zoneGap;
  let sideMaxHeight = timelineTop - sideTop - SCENE_HUD_ZONE_METRICS.zoneGap;

  const objectPanelExpanded = context.objectPanelExpanded ?? false;
  let compactSidePanels = isNarrow;
  let clamped = false;

  if (sideMaxHeight < 120) {
    compactSidePanels = true;
    sideMaxHeight = Math.max(96, timelineTop - sideTop - SCENE_HUD_ZONE_METRICS.zoneGap);
    clamped = true;
  }

  const scenePanelWidth = compactSidePanels
    ? SCENE_HUD_ZONE_METRICS.scenePanelCompactWidth
    : FIXED_SCENE_PANEL_SLOT_WIDTH;
  const objectPanelWidth = objectPanelExpanded
    ? SCENE_HUD_ZONE_METRICS.objectPanelExpandedWidth
    : FIXED_OBJECT_PANEL_SLOT_WIDTH;

  const scenePanelLeft = sideInset;
  const objectPanelRight = sideInset;
  const objectPanelLeft = Math.max(
    scenePanelLeft + scenePanelWidth + SCENE_HUD_ZONE_METRICS.zoneGap,
    layoutWidth - objectPanelRight - objectPanelWidth
  );

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
    sideTop,
    scenePanelLeft,
    scenePanelWidth,
    sideMaxHeight,
    layoutWidth,
    layoutHeight,
    isMobile ? "min(220px, 46vw)" : `min(${scenePanelWidth}px, 28vw)`
  );

  const objectPanelZone = zoneRect(
    sideTop,
    objectPanelLeft,
    objectPanelWidth,
    sideMaxHeight,
    layoutWidth,
    layoutHeight,
    isMobile ? "min(280px, 58vw)" : `min(${objectPanelWidth}px, 32vw)`
  );

  const timelineHorizontalGap = SCENE_HUD_ZONE_METRICS.zoneGap * 3;
  const timelineReservedSideWidth =
    FIXED_SCENE_PANEL_SLOT_WIDTH + FIXED_OBJECT_PANEL_SLOT_WIDTH + timelineHorizontalGap;
  let timelineWidth = Math.max(
    240,
    layoutWidth - sideInset * 2 - timelineReservedSideWidth
  );
  if (timelineWidth > layoutWidth - sideInset * 2) {
    timelineWidth = layoutWidth - sideInset * 2;
    clamped = true;
  }
  const timelineLeft = (layoutWidth - timelineWidth) / 2;

  const timelineZone = zoneRect(
    timelineTop,
    timelineLeft,
    timelineWidth,
    timelineHeight,
    layoutWidth,
    layoutHeight,
    isMobile ? "calc(100% - 24px)" : `min(${Math.floor(timelineWidth)}px, 88%)`
  );

  let overlapDetected =
    rectsOverlap(topBarZone, objectPanelZone) ||
    rectsOverlap(topBarZone, scenePanelZone) ||
    rectsOverlap(timelineZone, objectPanelZone) ||
    rectsOverlap(timelineZone, scenePanelZone) ||
    rectsOverlap(objectPanelZone, scenePanelZone);

  const objectPanelOverflowsScene =
    objectPanelZone.left + objectPanelZone.width > layoutWidth - sideInset + 0.5 ||
    objectPanelZone.left < 0;
  const mrpOverlapDetected =
    mrpVisible &&
    (usingViewportFallback || objectPanelOverflowsScene);

  if (overlapDetected) {
    clamped = true;
    const reducedSideHeight = Math.max(96, timelineTop - sideTop - SCENE_HUD_ZONE_METRICS.zoneGap);
    if (reducedSideHeight < scenePanelZone.height) {
      scenePanelZone.height = reducedSideHeight;
      scenePanelZone.maxHeight = `${Math.floor(reducedSideHeight)}px`;
      objectPanelZone.height = reducedSideHeight;
      objectPanelZone.maxHeight = `${Math.floor(reducedSideHeight)}px`;
    }
    overlapDetected =
      rectsOverlap(topBarZone, objectPanelZone) ||
      rectsOverlap(topBarZone, scenePanelZone) ||
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
    objectPanelRight: objectPanelZone.right,
    objectPanelWidth: objectPanelZone.width,
    mrpWidth,
  };

  lastZoneSignature = signature;
  lastZoneContract = contract;
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
    bottom: isTimeline ? rect.bottom : undefined,
    left: isTopBar || isTimeline ? "50%" : isObjectPanel ? undefined : rect.left,
    right: isObjectPanel ? rect.right : undefined,
    transform: isTopBar || isTimeline ? "translateX(-50%)" : undefined,
    width: rect.width,
    maxWidth: rect.maxWidth,
    height: isTimeline || isTopBar || isScenePanel || isObjectPanel ? rect.height : undefined,
    maxHeight: rect.maxHeight,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: isTopBar ? 1600 : isObjectPanel ? 6 : isTimeline ? 4 : 5,
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
  overflow: "auto",
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
    globalThis.console?.warn?.("[Nexora][HUDZoneBrake]", payload);
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

export function resetSceneHudZoneContractForTests(): void {
  lastZoneSignature = null;
  lastZoneContract = null;
  loggedZoneSignatures.clear();
  loggedHudZoneSignatures.clear();
  loggedHudZoneBrakeSignatures.clear();
  loggedHudZoneBrakeDebounceSignatures.clear();
}
