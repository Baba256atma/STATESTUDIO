import type React from "react";

import { applyToolbarSafeZonePlacement } from "./toolbarSafeZoneRuntime";
import { resolveTopHudAnchorStyle } from "./executiveTopAlignmentRuntime";
import type { WorkspaceLayoutContract } from "../ui/workspaceLayoutTypes";

/**
 * E2:21 / E2:57 — Top-center toolbar on unified executive top baseline.
 */
export function resolveSceneNavigationToolbarPlacement(
  contract: WorkspaceLayoutContract
): React.CSSProperties {
  const viewportWidth =
    contract.breakpoint === "mobile" ? 390 : contract.breakpoint === "tablet" ? 820 : 1440;
  const aligned = resolveTopHudAnchorStyle({ anchor: "TOP_CENTER", viewportWidth });

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: aligned.top,
    left: aligned.left,
    transform: aligned.transform,
    zIndex: 6,
    pointerEvents: "none",
    transition: `top ${contract.transitionMs}ms ease, max-width ${contract.transitionMs}ms ease`,
  };

  return applyToolbarSafeZonePlacement(baseStyle, {
    contract,
    objectInfoVisible: contract.hud.objectInfoHud.visible,
    statusHudVisible: contract.hud.executiveStatusHud.visible,
  });
}
