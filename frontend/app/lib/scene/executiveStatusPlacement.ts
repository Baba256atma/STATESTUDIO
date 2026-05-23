import type React from "react";

import type { WorkspaceLayoutContract } from "../ui/workspaceLayoutTypes";

const STATUS_HUD_HEIGHT: Record<string, number> = {
  compact: 112,
  normal: 148,
  expanded: 184,
};

const OBJECT_INFO_TOP_RIGHT_HEIGHT: Record<string, number> = {
  compact: 120,
  normal: 156,
  expanded: 196,
};

/**
 * E2:22 — Upper-right executive status placement with scene HUD overlap avoidance.
 */
export function resolveExecutiveStatusHudPlacement(contract: WorkspaceLayoutContract): React.CSSProperties {
  const inset = contract.breakpoint === "mobile" ? 8 : 12;
  let top = inset;
  let right = inset;

  const objectInfo = contract.hud.objectInfoHud;
  if (objectInfo.visible && objectInfo.right != null && objectInfo.top != null && objectInfo.bottom == null) {
    const objectHeight = OBJECT_INFO_TOP_RIGHT_HEIGHT[objectInfo.sizeMode] ?? 156;
    top = Math.max(top, (objectInfo.top as number) + objectHeight + 8);
  }

  const sceneInfo = contract.hud.sceneInfoHud;
  if (sceneInfo.visible && sceneInfo.right != null && sceneInfo.top != null) {
    right = Math.max(right, (sceneInfo.right as number) + 8);
  }

  if (contract.timelineExpanded) {
    right = Math.max(right, inset);
  }

  return {
    position: "absolute",
    top,
    right,
    zIndex: 6,
    pointerEvents: "none",
    maxWidth: contract.breakpoint === "mobile" ? "min(240px, 58vw)" : "min(280px, 34vw)",
    transition: `top ${contract.transitionMs}ms ease, right ${contract.transitionMs}ms ease, max-width ${contract.transitionMs}ms ease`,
  };
}
