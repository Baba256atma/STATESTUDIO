"use client";

import React from "react";

import {
  SCENE_HUD_LAYER_CLASS,
  SCENE_HUD_LAYER_STYLE,
} from "../../lib/scene/sceneLayerContract";

export type SceneHudLayerProps = {
  children: React.ReactNode;
};

/**
 * Viewport-fixed HUD shell inside the scene viewport.
 * Camera transforms must never apply to this layer.
 */
export function SceneHudLayer(props: SceneHudLayerProps): React.ReactElement {
  return (
    <div
      className={SCENE_HUD_LAYER_CLASS}
      data-scene-layer="hud"
      style={SCENE_HUD_LAYER_STYLE}
    >
      {props.children}
    </div>
  );
}

export default SceneHudLayer;
