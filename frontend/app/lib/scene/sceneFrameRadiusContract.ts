/**
 * MRP_SCENE:14:8 — Executive scene frame corner radius (master viewport shell only).
 */

export const SCENE_FRAME_RADIUS_PX = 5;
export const SCENE_FRAME_RADIUS_SCOPE = "scene-only";

let sceneFrameRadiusTraced = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveSceneFrameBorderRadius(): number {
  return SCENE_FRAME_RADIUS_PX;
}

export function traceSceneFrameRadius(): void {
  if (!isDev() || sceneFrameRadiusTraced) return;
  sceneFrameRadiusTraced = true;
  globalThis.console?.log?.(
    `[SceneFrameRadius] radius=${SCENE_FRAME_RADIUS_PX}px scope=${SCENE_FRAME_RADIUS_SCOPE}`
  );
}

export function resetSceneFrameRadiusContractForTests(): void {
  sceneFrameRadiusTraced = false;
}
