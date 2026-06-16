/**
 * SVIE:1:1 — Pure visual intelligence resolver (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import {
  SVIE_VISUAL_PRIORITY_BY_HEALTH,
  type SvieHealthLevel,
  type SvieObjectState,
  type SvieRuntimeBuildInput,
  type SvieSceneMetricsInput,
  type SvieSceneObjectReader,
} from "./svieRuntimeFoundationContract.ts";
import { deriveSvieObjectHealthLevel } from "./svieHealthDerivation.ts";

const SELECTED_OBJECT_PRIORITY_BOOST = 10;

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function readSceneObjectsFromJson(sceneJson: unknown): readonly SceneObject[] {
  const objects = (sceneJson as { scene?: { objects?: unknown[] } } | null)?.scene?.objects;
  if (!Array.isArray(objects)) return Object.freeze([]);
  return Object.freeze(
    objects.filter((entry): entry is SceneObject => {
      return Boolean(entry && typeof entry === "object" && typeof (entry as SceneObject).id === "string");
    })
  );
}

function resolveHealthFromObject(
  object: SceneObject,
  _metrics: SvieSceneMetricsInput | null | undefined
): SvieHealthLevel {
  return deriveSvieObjectHealthLevel(object);
}

function resolveVisualPriority(
  healthLevel: SvieHealthLevel,
  objectId: string,
  selectedObjectId: string | null
): number {
  let priority = SVIE_VISUAL_PRIORITY_BY_HEALTH[healthLevel];
  if (selectedObjectId && selectedObjectId === objectId) {
    priority += SELECTED_OBJECT_PRIORITY_BOOST;
  }
  return priority;
}

export function resolveSvieObjectState(
  object: SceneObject,
  input: Pick<SvieRuntimeBuildInput, "metrics" | "selectedObjectId">
): SvieObjectState | null {
  const objectId = normalizeObjectId(object.id);
  if (!objectId) return null;

  const healthLevel = resolveHealthFromObject(object, input.metrics);
  const selectedObjectId = normalizeObjectId(input.selectedObjectId);

  return Object.freeze({
    objectId,
    healthLevel,
    visualPriority: resolveVisualPriority(healthLevel, objectId, selectedObjectId),
  });
}

export function resolveSvieRuntimeSnapshot(
  input: SvieRuntimeBuildInput,
  generatedAt: number,
  readSceneObjects: SvieSceneObjectReader = readSceneObjectsFromJson
): Readonly<{ objects: readonly SvieObjectState[]; generatedAt: number }> {
  const sceneObjects = readSceneObjects(input.sceneJson);
  const metrics =
    input.metrics ??
    ((input.sceneJson as { state_vector?: SvieSceneMetricsInput } | null)?.state_vector ?? null);

  const objects = Object.freeze(
    sceneObjects
      .map((object) => resolveSvieObjectState(object, { metrics, selectedObjectId: input.selectedObjectId }))
      .filter((entry): entry is SvieObjectState => entry !== null)
      .sort((left, right) => right.visualPriority - left.visualPriority)
  );

  return Object.freeze({
    objects,
    generatedAt,
  });
}
