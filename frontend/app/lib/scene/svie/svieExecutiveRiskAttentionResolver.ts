/**
 * SVIE:2:3 — Executive risk attention resolver (read-only).
 */

import { readSceneObjectsFromJson } from "./svieRuntimeFoundationResolver.ts";
import {
  DEFAULT_SVIE_EXECUTIVE_RISK_ATTENTION_SNAPSHOT,
  type SvieExecutiveRiskAttention,
  type SvieExecutiveRiskAttentionBuildInput,
  type SvieExecutiveRiskAttentionSnapshot,
} from "./svieExecutiveRiskAttentionContract.ts";
import {
  deriveExecutiveAttentionScore,
  deriveExecutiveConfidenceWeight,
  deriveExecutiveImpactWeight,
  resolveExecutiveAttentionTier,
} from "./svieExecutiveRiskAttentionDerivation.ts";
import type { SvieRiskState } from "./svieRiskRuntimeContract.ts";

function buildSceneObjectIndex(sceneJson: unknown): ReadonlyMap<string, import("../../sceneTypes.ts").SceneObject> {
  const objects = readSceneObjectsFromJson(sceneJson);
  const index = new Map<string, import("../../sceneTypes.ts").SceneObject>();
  for (const object of objects) {
    if (typeof object.id === "string" && object.id.trim()) {
      index.set(object.id.trim(), object);
    }
  }
  return index;
}

export function buildSvieExecutiveRiskAttentionSnapshot(input: {
  riskObjects: readonly SvieRiskState[];
  sceneJson?: unknown;
  sceneSignature: string;
  generatedAt: number;
}): SvieExecutiveRiskAttentionSnapshot {
  if (input.riskObjects.length === 0) {
    return Object.freeze({
      ...DEFAULT_SVIE_EXECUTIVE_RISK_ATTENTION_SNAPSHOT,
      sceneSignature: input.sceneSignature,
      generatedAt: input.generatedAt,
    });
  }

  const sceneObjectIndex = buildSceneObjectIndex(input.sceneJson);
  const ranked = input.riskObjects
    .map((riskObject) => {
      const sceneObject = sceneObjectIndex.get(riskObject.objectId) ?? null;
      const impactWeight = deriveExecutiveImpactWeight(sceneObject);
      const confidenceWeight = deriveExecutiveConfidenceWeight(sceneObject);
      const attentionScore = deriveExecutiveAttentionScore({
        riskScore: riskObject.riskScore,
        impactWeight,
        confidenceWeight,
      });
      return Object.freeze({
        objectId: riskObject.objectId,
        riskScore: riskObject.riskScore,
        impactWeight,
        confidenceWeight,
        attentionScore,
      });
    })
    .sort(
      (left, right) =>
        right.attentionScore - left.attentionScore || left.objectId.localeCompare(right.objectId)
    );

  const objects: SvieExecutiveRiskAttention[] = ranked.map((entry, index) => {
    const rank = index + 1;
    return Object.freeze({
      ...entry,
      rank,
      attentionTier: resolveExecutiveAttentionTier(rank),
    });
  });

  const top5 = Object.freeze(objects.slice(0, 5).map((entry) => entry.objectId));
  const top3 = Object.freeze(objects.slice(0, 3).map((entry) => entry.objectId));
  const top1 = Object.freeze(objects.slice(0, 1).map((entry) => entry.objectId));
  const topEntry = objects[0] ?? null;

  return Object.freeze({
    objects: Object.freeze(objects),
    top1,
    top3,
    top5,
    topObjectId: topEntry?.objectId ?? null,
    topScore: topEntry?.attentionScore ?? 0,
    objectCount: objects.length,
    sceneSignature: input.sceneSignature,
    generatedAt: input.generatedAt,
  });
}

export function resolveSvieExecutiveRiskAttentionSnapshot(
  input: SvieExecutiveRiskAttentionBuildInput,
  riskObjects: readonly SvieRiskState[],
  generatedAt: number,
  sceneSignature: string
): SvieExecutiveRiskAttentionSnapshot {
  return buildSvieExecutiveRiskAttentionSnapshot({
    riskObjects,
    sceneJson: input.sceneJson,
    sceneSignature,
    generatedAt,
  });
}
