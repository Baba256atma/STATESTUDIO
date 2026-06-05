import type { SceneCanvasProps } from "../../components/SceneCanvas";
import { shouldSceneCanvasPropsRender } from "./sceneCanvasRenderSourceAudit.ts";

/** Stable comparator — allow SceneCanvas re-render only when meaningful scene inputs change. */
export function areSceneCanvasPropsEqual(
  prev: SceneCanvasProps,
  next: SceneCanvasProps
): boolean {
  return !shouldSceneCanvasPropsRender(prev, next);
}
