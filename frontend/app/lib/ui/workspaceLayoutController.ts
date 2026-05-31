import type React from "react";

import { hudAnchorStyle, type ExecutiveAnchorZone, type HudPanelId } from "../hud/hudAnchoringRuntime";
import { getTimelineVisibleRegion } from "../hud/timelineVisibleRegionRuntime";
import { resolveExecutiveRightRailWidth } from "../layout/executiveRightRailLayoutRuntime";
import { getExecutiveHudViewportHeight } from "../layout/executiveHudHydrationRuntime";
import { normalizeHudLayoutNumber } from "../layout/hudLayoutSignature";
import {
  EXECUTIVE_SCENE_ZONE_PADDING_PX,
  resolveExecutiveWorkspaceBreakpoint,
  type ExecutiveWorkspaceBreakpoint,
} from "./executiveWorkspaceLayout";
import { resolveExecutiveTopBaseline, resolveExecutiveSideInset } from "../scene/executiveTopAlignmentRuntime";
import {
  logWorkspaceLayoutPanelRepositioned,
  logWorkspaceLayoutPanelResized,
  logWorkspaceResponsiveLayoutApplied,
} from "./workspaceLayoutInstrumentation";
import type {
  PanelSizeMode,
  WorkspaceHudPlacement,
  WorkspaceLayoutContract,
  WorkspaceLayoutPreset,
  WorkspacePanelId,
  WorkspaceRightRailStack,
} from "./workspaceLayoutTypes";

const LAYOUT_TRANSITION_MS = 180;

function resolvePanelSizeMode(preset: WorkspaceLayoutPreset, panel: WorkspacePanelId): PanelSizeMode {
  if (preset === "executive") return "normal";
  if (preset === "analysis") {
    if (panel === "objectInfoHud" || panel === "scenarioSuggestions") return "expanded";
    if (panel === "timelineHud") return "normal";
    return "normal";
  }
  if (panel === "scenarioComparison" || panel === "scenarioSuggestions") return "expanded";
  if (panel === "timelineHud") return "normal";
  if (panel === "sceneInfoHud" || panel === "objectInfoHud") return "compact";
  return "normal";
}

function resolveRightRailStack(preset: WorkspaceLayoutPreset): WorkspaceRightRailStack {
  if (preset === "analysis") {
    return {
      assistantFlex: 0.32,
      scenarioFlex: 0.34,
      comparisonFlex: 0.34,
      assistantMaxHeight: "38%",
      scenarioMaxHeight: "32%",
    };
  }
  if (preset === "simulation") {
    return {
      assistantFlex: 0.22,
      scenarioFlex: 0.38,
      comparisonFlex: 0.4,
      assistantMaxHeight: "28%",
      scenarioMaxHeight: "36%",
    };
  }
  return {
    assistantFlex: 0.36,
    scenarioFlex: 0.28,
    comparisonFlex: 0.36,
    assistantMaxHeight: "40%",
    scenarioMaxHeight: "30%",
  };
}

function resolveHudPlacements(
  preset: WorkspaceLayoutPreset,
  breakpoint: ExecutiveWorkspaceBreakpoint,
  viewportWidth: number
): WorkspaceLayoutContract["hud"] {
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const timelineExpanded = false;
  const timelineRegion = getTimelineVisibleRegion({
    viewportWidth,
    viewportHeight: getExecutiveHudViewportHeight(),
  });
  const timelineBottom = isMobile ? timelineRegion.bottomOffset : timelineRegion.bottomOffset;
  const timelineMaxWidth = isMobile
      ? "96vw"
      : isTablet
        ? "min(860px, 92vw)"
        : timelineRegion.maxWidth;

  const sceneInfoTop = resolveExecutiveTopBaseline(viewportWidth);
  const sceneInfoLeft = resolveExecutiveSideInset(viewportWidth);

  const objectVisible = preset !== "simulation" || !isMobile;
  const objectTop = sceneInfoTop;
  const objectRight = sceneInfoLeft;

  const quickBottom = timelineExpanded
    ? isMobile
      ? 118
      : isTablet
        ? 126
        : 132
    : isMobile
      ? 52
      : 14;

  return {
    sceneInfoHud: {
      visible: true,
      anchor: "top-left",
      top: sceneInfoTop,
      left: sceneInfoLeft,
      zIndex: 5,
      sizeMode: resolvePanelSizeMode(preset, "sceneInfoHud"),
      maxWidth: preset === "simulation" ? "min(220px, 44vw)" : undefined,
    },
    objectInfoHud: {
      visible: objectVisible,
      anchor: "top-right",
      top: objectTop,
      right: objectRight,
      zIndex: 5,
      sizeMode: resolvePanelSizeMode(preset, "objectInfoHud"),
      maxWidth: isMobile ? "min(280px, 58vw)" : "min(320px, 32vw)",
    },
    timelineHud: {
      visible: true,
      anchor: "bottom-center",
      bottom: timelineBottom,
      transform: "translateX(-50%)",
      left: "50%",
      zIndex: 4,
      maxWidth: timelineMaxWidth,
      sizeMode: resolvePanelSizeMode(preset, "timelineHud"),
    },
    quickActionsDock: {
      visible: true,
      anchor: "bottom-center",
      bottom: quickBottom,
      transform: "translateX(-50%)",
      left: "50%",
      zIndex: 5,
      maxWidth: "96vw",
      sizeMode: resolvePanelSizeMode(preset, "quickActionsDock"),
    },
    executiveStatusHud: {
      visible: true,
      anchor: "top-right",
      top: isMobile ? 8 : 12,
      right: isMobile ? 8 : 12,
      zIndex: 6,
      sizeMode: resolvePanelSizeMode(preset, "executiveStatusHud"),
      maxWidth: isMobile ? "min(240px, 58vw)" : "min(280px, 34vw)",
    },
  };
}

export function resolveWorkspaceLayoutContract(
  preset: WorkspaceLayoutPreset,
  viewportWidth: number
): WorkspaceLayoutContract {
  const breakpoint = resolveExecutiveWorkspaceBreakpoint(viewportWidth);
  const hud = resolveHudPlacements(preset, breakpoint, viewportWidth);
  const rightRailStack = resolveRightRailStack(preset);

  return {
    preset,
    breakpoint,
    panelSizeMode: preset === "executive" ? "normal" : preset === "analysis" ? "expanded" : "compact",
    transitionMs: LAYOUT_TRANSITION_MS,
    rightRailWidthPx: resolveExecutiveRightRailWidth(preset, viewportWidth),
    scenePaddingPx: EXECUTIVE_SCENE_ZONE_PADDING_PX,
    timelineExpanded: false,
    sceneFocus: preset === "simulation" ? "simulation" : preset === "analysis" ? "analysis" : "balanced",
    rightRailStack,
    hud,
  };
}

export function workspaceHudPlacementStyle(
  panelId: keyof WorkspaceLayoutContract["hud"],
  placement: WorkspaceHudPlacement,
  transitionMs: number
): React.CSSProperties;
export function workspaceHudPlacementStyle(
  placement: WorkspaceHudPlacement,
  transitionMs: number
): React.CSSProperties;
export function workspaceHudPlacementStyle(
  panelOrPlacement: keyof WorkspaceLayoutContract["hud"] | WorkspaceHudPlacement,
  placementOrTransitionMs: WorkspaceHudPlacement | number,
  maybeTransitionMs?: number
): React.CSSProperties {
  const panelId =
    typeof panelOrPlacement === "string"
      ? panelOrPlacement
      : ("sceneInfoHud" as keyof WorkspaceLayoutContract["hud"]);
  const placement =
    typeof panelOrPlacement === "string"
      ? (placementOrTransitionMs as WorkspaceHudPlacement)
      : panelOrPlacement;
  const transitionMs =
    typeof panelOrPlacement === "string"
      ? (maybeTransitionMs ?? 0)
      : (placementOrTransitionMs as number);
  return hudAnchorStyle(panelId as HudPanelId, {
    dockZone: placement.anchor as ExecutiveAnchorZone,
    anchorPosition: {
      top: placement.top,
      left: placement.left,
      right: placement.right,
      bottom: placement.bottom,
      transform: placement.transform,
    },
    visible: placement.visible,
    collapsedState: placement.sizeMode === "compact",
    reservedSpace: reservationForHudPanel(panelId, placement),
    maxWidth: placement.maxWidth,
    zIndex: placement.zIndex,
    transitionMs,
    estimatedWidth: estimatedHudWidth(panelId, placement),
    estimatedHeight: estimatedHudHeight(panelId, placement),
  });
}

function reservationForHudPanel(
  panelId: keyof WorkspaceLayoutContract["hud"],
  placement: WorkspaceHudPlacement
) {
  if (!placement.visible) return undefined;
  if (panelId === "sceneInfoHud") return { left: 260, top: 140 };
  if (panelId === "objectInfoHud") return { right: 320, top: 240 };
  if (panelId === "timelineHud") return { bottom: placement.sizeMode === "expanded" ? 180 : 120 };
  if (panelId === "quickActionsDock") return { bottom: 64 };
  if (panelId === "executiveStatusHud") return { right: 280, top: 110 };
  return undefined;
}

function estimatedHudWidth(
  panelId: keyof WorkspaceLayoutContract["hud"],
  placement: WorkspaceHudPlacement
): number {
  if (panelId === "timelineHud") return placement.sizeMode === "expanded" ? 920 : 760;
  if (panelId === "executiveStatusHud") return 280;
  if (panelId === "sceneInfoHud") return placement.sizeMode === "compact" ? 220 : 260;
  if (panelId === "objectInfoHud") return placement.sizeMode === "compact" ? 260 : 320;
  return 360;
}

function estimatedHudHeight(
  panelId: keyof WorkspaceLayoutContract["hud"],
  placement: WorkspaceHudPlacement
): number {
  if (panelId === "timelineHud") return placement.sizeMode === "expanded" ? 180 : 120;
  if (panelId === "objectInfoHud") return placement.sizeMode === "expanded" ? 420 : 300;
  if (panelId === "sceneInfoHud") return 180;
  if (panelId === "executiveStatusHud") return 120;
  return 80;
}

export function buildWorkspaceLayoutSignature(contract: WorkspaceLayoutContract): string {
  const hudSignature = (Object.keys(contract.hud) as Array<keyof WorkspaceLayoutContract["hud"]>)
    .sort()
    .map((panelId) => {
      const placement = contract.hud[panelId];
      return [
        panelId,
        placement.anchor,
        normalizeHudLayoutNumber(placement.top),
        normalizeHudLayoutNumber(placement.left),
        normalizeHudLayoutNumber(placement.right),
        normalizeHudLayoutNumber(placement.bottom),
        placement.sizeMode,
        placement.visible ? 1 : 0,
        placement.maxWidth ?? "",
        placement.zIndex ?? "",
      ].join(":");
    })
    .join("|");

  return [
    contract.preset,
    contract.breakpoint,
    contract.rightRailWidthPx,
    contract.timelineExpanded,
    hudSignature,
  ].join("::");
}

let lastResponsiveSignature: string | null = null;
let lastPanelPlacementSignature: Partial<Record<WorkspacePanelId, string>> = {};

export function traceWorkspaceLayoutContract(contract: WorkspaceLayoutContract): void {
  const signature = buildWorkspaceLayoutSignature(contract);
  if (lastResponsiveSignature !== signature) {
    lastResponsiveSignature = signature;
    logWorkspaceResponsiveLayoutApplied({
      preset: contract.preset,
      breakpoint: contract.breakpoint,
      rightRailWidthPx: contract.rightRailWidthPx,
    });
  }

  (Object.keys(contract.hud) as Array<keyof WorkspaceLayoutContract["hud"]>).forEach((panelKey) => {
    const panel = contract.hud[panelKey];
    const panelSig = [
      panelKey,
      panel.anchor,
      normalizeHudLayoutNumber(panel.top),
      normalizeHudLayoutNumber(panel.left),
      normalizeHudLayoutNumber(panel.right),
      normalizeHudLayoutNumber(panel.bottom),
      panel.sizeMode,
      panel.visible ? 1 : 0,
    ].join(":");
    if (lastPanelPlacementSignature[panelKey] !== panelSig) {
      lastPanelPlacementSignature[panelKey] = panelSig;
      logWorkspaceLayoutPanelRepositioned({ panel: panelKey, preset: contract.preset, anchor: panel.anchor });
      logWorkspaceLayoutPanelResized({ panel: panelKey, sizeMode: panel.sizeMode });
    }
  });
}

/** Test-only reset for layout trace dedupe. */
export function resetWorkspaceLayoutTraceStateForTests(): void {
  lastResponsiveSignature = null;
  lastPanelPlacementSignature = {};
}
