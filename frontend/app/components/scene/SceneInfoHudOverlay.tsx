"use client";

import React from "react";

import { SceneInfoHud, type SceneInfoHudProps } from "./SceneInfoHud";
import { SceneHudOverlayRoot } from "./SceneHudOverlayRoot";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { persistSceneHudAnchorPreference, sceneHudDockStyle } from "../../lib/hud/sceneHudAnchorRuntime";
import { useFocusHudPresentation } from "../../lib/workspace/useFocusHudPresentation";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";

/**
 * E2:8 — Scene-native executive HUD overlay (viewport-fixed, not a sidebar).
 */
export function SceneInfoHudOverlay(
  props: SceneInfoHudProps & { themeMode?: NexoraHudThemeMode }
): React.ReactElement {
  const { themeMode, ...hudProps } = props;
  const { getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("sceneInfoHud");
  const focusHud = useFocusHudPresentation("sceneInfoHud", placement.visible);

  React.useEffect(() => {
    persistSceneHudAnchorPreference("sceneInfoHud", "TOP_LEFT");
  }, []);

  if (!placement.visible && !focusHud.preserveMount) return <></>;

  return (
    <SceneHudOverlayRoot
      panelId="sceneInfoHud"
      style={{
        ...sceneHudDockStyle({
          panelId: "sceneInfoHud",
          anchor: "TOP_LEFT",
          visible: focusHud.visible,
          collapsed: placement.sizeMode === "compact",
          maxWidth: placement.maxWidth,
          zIndex: placement.zIndex,
          transitionMs: 160,
          visiblePanelCount: 3,
        }),
        ...focusHud.style,
      }}
    >
      <SceneInfoHud {...hudProps} themeMode={themeMode} panelSizeMode={placement.sizeMode} />
    </SceneHudOverlayRoot>
  );
}

export default SceneInfoHudOverlay;
