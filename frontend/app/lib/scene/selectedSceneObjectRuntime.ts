"use client";

import { useSelectedId } from "../../components/SceneContext";

/** Lightweight scene selection id — prefer this over passing full object payloads. */
export function useSelectedSceneObjectId(): string | null {
  return useSelectedId();
}

export function isSceneObjectSelected(
  selectedObjectId: string | null | undefined,
  objectId: string,
  alternateId?: string | null
): boolean {
  if (!selectedObjectId) return false;
  if (selectedObjectId === objectId) return true;
  if (alternateId && selectedObjectId === alternateId) return true;
  return false;
}
