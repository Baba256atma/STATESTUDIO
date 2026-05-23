import type React from "react";

import {
  EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX,
  EXECUTIVE_SCENE_ZONE_PADDING_PX,
  resolveExecutiveWorkspaceBreakpoint,
  type ExecutiveWorkspaceBreakpoint,
} from "./executiveWorkspaceLayout";
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
    if (panel === "timelineHud" || panel === "objectInfoHud" || panel === "scenarioSuggestions") return "expanded";
    return "normal";
  }
  if (panel === "timelineHud" || panel === "scenarioComparison" || panel === "scenarioSuggestions") return "expanded";
  if (panel === "sceneInfoHud" || panel === "objectInfoHud") return "compact";
  return "normal";
}

function resolveRightRailWidth(preset: WorkspaceLayoutPreset, breakpoint: ExecutiveWorkspaceBreakpoint): number {
  const base = EXECUTIVE_RIGHT_ASSISTANT_WIDTH_PX;
  if (breakpoint === "mobile") return Math.min(base, 320);
  if (breakpoint === "tablet") return Math.min(base + 20, 380);
  if (preset === "analysis") return base + 48;
  if (preset === "simulation") return base + 64;
  return base;
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
  breakpoint: ExecutiveWorkspaceBreakpoint
): WorkspaceLayoutContract["hud"] {
  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const timelineExpanded = preset !== "executive";
  const timelineBottom = timelineExpanded ? (isMobile ? 10 : 12) : isMobile ? 10 : 14;
  const timelineMaxWidth = timelineExpanded
    ? isMobile
      ? "98vw"
      : isTablet
        ? "94vw"
        : "min(920px, 92vw)"
    : isMobile
      ? "96vw"
      : "min(760px, 90vw)";

  const sceneInfoTop = isMobile ? 8 : 12;
  const sceneInfoLeft = isMobile ? 8 : 12;

  const objectVisible = preset !== "simulation" || !isMobile;
  const objectBottom = preset === "analysis" ? (isMobile ? 88 : 96) : isMobile ? 12 : 16;
  const objectRight = isMobile ? 8 : preset === "analysis" ? 12 : 16;

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
      anchor: preset === "analysis" && !isMobile ? "top-left" : "bottom-right",
      top: preset === "analysis" && !isMobile ? sceneInfoTop + 168 : undefined,
      left: preset === "analysis" && !isMobile ? sceneInfoLeft : undefined,
      bottom: preset === "analysis" && !isMobile ? undefined : objectBottom,
      right: preset === "analysis" && !isMobile ? undefined : objectRight,
      zIndex: 5,
      sizeMode: resolvePanelSizeMode(preset, "objectInfoHud"),
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
  const hud = resolveHudPlacements(preset, breakpoint);
  const rightRailStack = resolveRightRailStack(preset);

  return {
    preset,
    breakpoint,
    panelSizeMode: preset === "executive" ? "normal" : preset === "analysis" ? "expanded" : "compact",
    transitionMs: LAYOUT_TRANSITION_MS,
    rightRailWidthPx: resolveRightRailWidth(preset, breakpoint),
    scenePaddingPx: EXECUTIVE_SCENE_ZONE_PADDING_PX,
    timelineExpanded: preset !== "executive",
    sceneFocus: preset === "simulation" ? "simulation" : preset === "analysis" ? "analysis" : "balanced",
    rightRailStack,
    hud,
  };
}

export function workspaceHudPlacementStyle(
  placement: WorkspaceHudPlacement,
  transitionMs: number
): React.CSSProperties {
  return {
    position: "absolute",
    top: placement.top,
    left: placement.left,
    right: placement.right,
    bottom: placement.bottom,
    transform: placement.transform,
    maxWidth: placement.maxWidth,
    zIndex: placement.zIndex,
    pointerEvents: "none",
    opacity: placement.visible ? 1 : 0,
    transition: `top ${transitionMs}ms ease, bottom ${transitionMs}ms ease, left ${transitionMs}ms ease, right ${transitionMs}ms ease, transform ${transitionMs}ms ease, opacity ${transitionMs}ms ease, max-width ${transitionMs}ms ease`,
  };
}

export function buildWorkspaceLayoutSignature(contract: WorkspaceLayoutContract): string {
  return [
    contract.preset,
    contract.breakpoint,
    contract.rightRailWidthPx,
    contract.timelineExpanded,
    contract.hud.sceneInfoHud.sizeMode,
    contract.hud.timelineHud.maxWidth ?? "",
  ].join("|");
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
    const panelSig = `${panelKey}:${panel.anchor}:${panel.top ?? ""}:${panel.bottom ?? ""}:${panel.sizeMode}:${panel.visible}`;
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
