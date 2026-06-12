"use client";

import React from "react";

import type { NexoraHudThemeMode } from "../../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayoutOptional } from "../../../lib/ui/useWorkspaceLayout";
import { SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE } from "../../../lib/scene/sceneHudZoneContract";
import { SceneHudOverlayRoot } from "../SceneHudOverlayRoot";
import { ExecutiveSceneToolbar } from "./ExecutiveSceneToolbar";

export type ExecutiveSceneToolbarOverlayProps = {
  themeMode?: NexoraHudThemeMode;
  sceneControlsRelocated?: boolean;
};

/**
 * Scene topbar zone — navigation controls only (no selection authority).
 */
export function ExecutiveSceneToolbarOverlay(props: ExecutiveSceneToolbarOverlayProps): React.ReactElement {
  const layout = useWorkspaceLayoutOptional();
  const density =
    layout?.contract.breakpoint === "mobile" || layout?.contract.breakpoint === "tablet"
      ? layout.contract.breakpoint
      : "desktop";

  return (
    <SceneHudOverlayRoot
      panelId="sceneToolbar"
      style={{
        ...SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE,
        overflow: "visible",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ExecutiveSceneToolbar
        themeMode={props.themeMode}
        density={density}
        sceneControlsRelocated={props.sceneControlsRelocated}
      />
    </SceneHudOverlayRoot>
  );
}

export default ExecutiveSceneToolbarOverlay;
