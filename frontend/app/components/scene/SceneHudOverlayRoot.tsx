"use client";

import React from "react";

import type { SceneHudDriftPanelId } from "../../lib/scene/sceneHudDriftGuard";

export type SceneHudOverlayRootProps = {
  panelId: SceneHudDriftPanelId;
  style: React.CSSProperties;
  children: React.ReactNode;
};

/** Positions a single HUD panel inside the scene HUD layer (never inside Canvas). */
export function SceneHudOverlayRoot(props: SceneHudOverlayRootProps): React.ReactElement {
  return (
    <div data-scene-layer="hud" data-scene-hud-panel={props.panelId} style={props.style}>
      {props.children}
    </div>
  );
}

export default SceneHudOverlayRoot;
