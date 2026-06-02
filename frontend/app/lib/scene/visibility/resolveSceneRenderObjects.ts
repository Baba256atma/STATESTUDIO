/**
 * E2:110 — Resolve the object list passed to SceneRenderer (never silently drop to one).
 */

import type { SceneObject } from "../../sceneTypes";
import { shouldRenderAllSceneObjects } from "./executiveVisibleObjectPolicy";

export type ResolveSceneRenderObjectsInput = {
  focusMode: "all" | "selected" | "pinned";
  selectedObjectId: string | null;
  executiveFocusModeEnabled: boolean;
  focusPinned?: boolean;
};

export function extractSceneObjectsArray(sceneJson: unknown): SceneObject[] {
  const record = sceneJson as { scene?: { objects?: unknown[] } } | null | undefined;
  const objects = Array.isArray(record?.scene?.objects) ? record.scene.objects : [];
  return objects as SceneObject[];
}

export function resolveSceneRenderObjects(
  sceneJson: unknown,
  input: ResolveSceneRenderObjectsInput
): SceneObject[] {
  const allObjects = extractSceneObjectsArray(sceneJson);
  if (allObjects.length === 0) return allObjects;

  // Render pipeline always mounts every scene object; isolation is visual-only.
  void shouldRenderAllSceneObjects(input);
  return allObjects;
}
