"use client";

import React from "react";

import { SceneInfoHud, type SceneInfoHudProps } from "./SceneInfoHud";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE } from "../../lib/scene/sceneHudZoneContract";
import { traceSceneHudPanelScroll } from "../../lib/hud/sceneHudTopAlignmentContract";
import { traceNexoraScenePanelRole } from "../../lib/scene/scenePanelPurposeContract";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";

/**
 * Scene Panel zone — scene-level summary and controls (left side).
 */
export function SceneInfoHudOverlay(
  props: SceneInfoHudProps & { themeMode?: NexoraHudThemeMode }
): React.ReactElement {
  const { themeMode, ...hudProps } = props;
  const { getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("sceneInfoHud");
  const focusHud = useFocusHudPresentation("sceneInfoHud", placement.visible);

  React.useEffect(() => {
    traceSceneHudPanelScroll("scene");
    traceNexoraScenePanelRole();
  }, []);

  if (!placement.visible && !focusHud.preserveMount) return <></>;

  return (
    <SceneHudOverlayRoot
      panelId="sceneInfoHud"
      style={{
        ...SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE,
        ...focusHud.style,
        opacity: focusHud.visible ? 1 : 0,
      }}
    >
      <SceneInfoHud {...hudProps} themeMode={themeMode} panelSizeMode={placement.sizeMode} />
    </SceneHudOverlayRoot>
  );
}

export default SceneInfoHudOverlay;
