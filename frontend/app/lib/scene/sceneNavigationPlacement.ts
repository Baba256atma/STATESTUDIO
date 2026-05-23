import type React from "react";

import type { WorkspaceLayoutContract } from "../ui/workspaceLayoutTypes";

const SCENE_INFO_HEIGHT: Record<string, number> = {
  compact: 36,
  normal: 44,
  expanded: 56,
};

const TIMELINE_TOP_STACK_HEIGHT: Record<string, number> = {
  compact: 44,
  normal: 52,
  expanded: 72,
};

/**
 * E2:21 — Top-center toolbar placement with HUD overlap avoidance.
 * Adapts when scene panels expand or dock to the top edge.
 */
export function resolveSceneNavigationToolbarPlacement(
  contract: WorkspaceLayoutContract
): React.CSSProperties {
  const inset = contract.breakpoint === "mobile" ? 8 : 12;
  let top = inset;

  const sceneInfo = contract.hud.sceneInfoHud;
  if (sceneInfo.visible) {
    const sceneInfoHeight = SCENE_INFO_HEIGHT[sceneInfo.sizeMode] ?? 44;
    const sceneInfoTop = typeof sceneInfo.top === "number" ? sceneInfo.top : inset;
    const sceneInfoCentered = Boolean(sceneInfo.transform?.includes("translateX(-50%)"));
    if (sceneInfoCentered) {
      top = Math.max(top, sceneInfoTop + sceneInfoHeight + 8);
    }
  }

  const timeline = contract.hud.timelineHud;
  if (timeline.visible && typeof timeline.top === "number" && timeline.bottom == null) {
    const timelineHeight = TIMELINE_TOP_STACK_HEIGHT[timeline.sizeMode] ?? 52;
    top = Math.max(top, timeline.top + timelineHeight + 8);
  }

  const quickActions = contract.hud.quickActionsDock;
  if (quickActions.visible && typeof quickActions.top === "number" && quickActions.bottom == null) {
    top = Math.max(top, quickActions.top + 44);
  }

  if (contract.timelineExpanded && timeline.visible && timeline.bottom != null) {
    // Keep toolbar clear of expanded bottom timeline on short viewports.
    top = Math.max(top, inset);
  }

  return {
    position: "absolute",
    top,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 6,
    pointerEvents: "none",
    maxWidth: contract.breakpoint === "mobile" ? "96vw" : "min(680px, 92vw)",
    transition: `top ${contract.transitionMs}ms ease, max-width ${contract.transitionMs}ms ease`,
  };
}
