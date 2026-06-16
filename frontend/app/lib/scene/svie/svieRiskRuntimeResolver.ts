/**
 * SVIE:2:1 — Pure risk intelligence resolver (read-only).
 */

import type { SceneObject } from "../../sceneTypes.ts";
import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import type { SvieSceneObjectReader } from "./svieRuntimeFoundationContract.ts";
import { classifySvieRiskLevel, deriveSvieObjectRiskScore } from "./svieRiskDerivation.ts";
import type { SvieRiskRuntimeBuildInput, SvieRiskSnapshot, SvieRiskState } from "./svieRiskRuntimeContract.ts";

function normalizeObjectId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveSvieObjectRiskState(object: SceneObject): SvieRiskState | null {
  const objectId = normalizeObjectId(object.id);
  if (!objectId) return null;

  const riskScore = deriveSvieObjectRiskScore(object);
  return Object.freeze({
    objectId,
    riskScore,
    riskLevel: classifySvieRiskLevel(riskScore),
  });
}

export function resolveSvieRiskSnapshot(
  input: SvieRiskRuntimeBuildInput,
  generatedAt: number,
  readSceneObjects: SvieSceneObjectReader = readSceneObjectsFromJson
): SvieRiskSnapshot {
  const sceneObjects = readSceneObjects(input.sceneJson);
  const objects = Object.freeze(
    sceneObjects
      .map((object) => resolveSvieObjectRiskState(object))
      .filter((entry): entry is SvieRiskState => entry !== null)
      .sort((left, right) => right.riskScore - left.riskScore)
  );

  return Object.freeze({
    objects,
    generatedAt,
  });
}
