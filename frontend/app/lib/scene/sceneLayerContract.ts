import type React from "react";

/** Scene rendering layer — world is camera-driven; hud/chrome stay viewport-fixed. */
export type SceneLayer = "world" | "hud" | "chrome";

export const SCENE_LAYER_RULES: Readonly<Record<SceneLayer, string>> = Object.freeze({
  world: "Camera movement affects only world-space objects and overlays.",
  hud: "Fixed inside the scene viewport; never inherits camera or canvas transforms.",
  chrome: "Fixed app-level UI outside the scene viewport.",
});

export const SCENE_SHELL_CLASS = "scene-shell";
export const SCENE_WORLD_LAYER_CLASS = "three-world-layer";
export const SCENE_HUD_LAYER_CLASS = "scene-hud-layer";

/** Root HUD layer — children use pointer-events: auto when interactive. */
export const SCENE_HUD_LAYER_STYLE: React.CSSProperties = Object.freeze({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 2,
});

export function isSceneHudLayer(layer: SceneLayer): layer is "hud" {
  return layer === "hud";
}

export function isSceneWorldLayer(layer: SceneLayer): layer is "world" {
  return layer === "world";
}

export function isSceneChromeLayer(layer: SceneLayer): layer is "chrome" {
  return layer === "chrome";
}
