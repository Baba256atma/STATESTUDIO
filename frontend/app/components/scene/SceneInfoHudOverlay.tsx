"use client";

import React from "react";
import { Html } from "@react-three/drei";

import { SceneInfoHud, type SceneInfoHudProps } from "./SceneInfoHud";
import type { NexoraHudThemeMode } from "../../lib/scene/nexoraHudTheme";
import { useWorkspaceLayout } from "../../lib/ui/useWorkspaceLayout";

/**
 * E2:8 — Scene-native executive HUD overlay (viewport-fixed, not a sidebar).
 */
export function SceneInfoHudOverlay(
  props: SceneInfoHudProps & { themeMode?: NexoraHudThemeMode }
): React.ReactElement {
  const { themeMode, ...hudProps } = props;
  const { hudStyle, getHudPlacement } = useWorkspaceLayout();
  const placement = getHudPlacement("sceneInfoHud");

  if (!placement.visible) return <></>;

  return (
    <Html transform={false} fullscreen style={{ pointerEvents: "none" }}>
      <div style={hudStyle("sceneInfoHud")}>
        <SceneInfoHud {...hudProps} themeMode={themeMode} panelSizeMode={placement.sizeMode} />
      </div>
    </Html>
  );
}

export default SceneInfoHudOverlay;
