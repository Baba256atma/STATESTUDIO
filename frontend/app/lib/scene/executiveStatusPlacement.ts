import type React from "react";

import type { WorkspaceLayoutContract } from "../ui/workspaceLayoutTypes";
import { resolveExecutiveTopBaseline, resolveExecutiveSideInset } from "./executiveTopAlignmentRuntime";
import { getSceneHudRegistration } from "./sceneHudRegistry";

/**
 * E2:22 — Upper-right executive status placement with scene HUD overlap avoidance.
 */
export function resolveExecutiveStatusHudPlacement(contract: WorkspaceLayoutContract): React.CSSProperties {
  const viewportWidth =
    contract.breakpoint === "mobile" ? 390 : contract.breakpoint === "tablet" ? 820 : 1440;
  const inset = resolveExecutiveSideInset(viewportWidth);
  let top = resolveExecutiveTopBaseline(viewportWidth);
  let right = inset;

  const objectInfo = contract.hud.objectInfoHud;
  if (objectInfo.visible && objectInfo.right != null && objectInfo.top != null && objectInfo.bottom == null) {
    const objectEntry = getSceneHudRegistration("objectInfoHud");
    const objectHeight =
      objectInfo.sizeMode === "expanded" ? 320 : objectInfo.sizeMode === "compact" ? 180 : objectEntry.estimatedHeight;
    top = resolveExecutiveTopBaseline(viewportWidth) + objectHeight + 8;
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
