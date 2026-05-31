"use client";

import React from "react";

import { resolveSceneNavigationToolbarPlacement } from "../../../lib/scene/sceneNavigationPlacement";
import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayoutOptional } from "../../../lib/ui/useWorkspaceLayout";
import { SceneHudOverlayRoot } from "../SceneHudOverlayRoot";
import { ExecutiveSceneToolbar } from "./ExecutiveSceneToolbar";

export type ExecutiveSceneToolbarOverlayProps = {
  themeMode?: NexoraHudThemeMode;
};

/**
 * E2:21 — Top-center scene-native executive navigation toolbar.
 */
export function ExecutiveSceneToolbarOverlay(props: ExecutiveSceneToolbarOverlayProps): React.ReactElement {
  const layout = useWorkspaceLayoutOptional();
  const density =
    layout?.contract.breakpoint === "mobile" || layout?.contract.breakpoint === "tablet"
      ? layout.contract.breakpoint
      : "desktop";
  const placementStyle = layout
    ? resolveSceneNavigationToolbarPlacement(layout.contract)
    : {
        position: "absolute" as const,
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 6,
        pointerEvents: "none" as const,
      };

  return (
    <SceneHudOverlayRoot panelId="sceneToolbar" style={placementStyle}>
      <ExecutiveSceneToolbar themeMode={props.themeMode} density={density} />
    </SceneHudOverlayRoot>
  );
}

export default ExecutiveSceneToolbarOverlay;
