/**
 * MRP:4C:5 — Pure resolver for Risk scene awareness snapshot.
 */

import type { SceneJson } from "../../../sceneTypes.ts";
import {
  DEFAULT_RISK_SCENE_AWARENESS,
  DEFAULT_RISK_SCENE_COVERAGE,
  type RiskSceneAwarenessInput,
  type RiskSceneAwarenessSnapshot,
  type RiskSceneCoverage,
} from "./riskSceneAwarenessContract.ts";
import { scanSceneRiskObjects } from "./riskSceneScanResolver.ts";

function resolveSelectedObjectId(input: RiskSceneAwarenessInput): string | null {
  return input.selectedObjectId?.trim() || input.routeObjectId?.trim() || null;
}

function countSceneObjects(sceneJson: SceneJson | null | undefined): number {
  const objects = sceneJson?.scene?.objects;
  return Array.isArray(objects) ? objects.length : 0;
}

export function resolveRiskSceneCoverage(sceneJson: SceneJson | null | undefined): RiskSceneCoverage {
  const objects = sceneJson?.scene?.objects;
  const objectsMonitored = countSceneObjects(sceneJson);

  if (!Array.isArray(objects) || !objects.length) {
    return DEFAULT_RISK_SCENE_COVERAGE;
  }

  const scanned = scanSceneRiskObjects(objects);
  let criticalObjects = 0;
  for (const row of scanned) {
    if (row.band === "critical") criticalObjects += 1;
  }

  return Object.freeze({
    objectsMonitored,
    objectsWithRisk: scanned.length,
    criticalObjects,
  });
}

export function resolveRiskSceneAwareness(
  input: RiskSceneAwarenessInput,
  revision = 0
): RiskSceneAwarenessSnapshot {
  const selectedObjectId = resolveSelectedObjectId(input);
  const coverage = resolveRiskSceneCoverage(input.sceneJson);
  const snapshot = Object.freeze({
    selectedObjectId,
    coverage,
    readOnly: true as const,
    revision,
    signature: "",
  });

  return Object.freeze({
    ...snapshot,
    signature: buildRiskSceneAwarenessSignature(snapshot),
  });
}

export function buildRiskSceneAwarenessSignature(
  snapshot: Pick<
    RiskSceneAwarenessSnapshot,
    "selectedObjectId" | "coverage" | "readOnly"
  >
): string {
  return JSON.stringify({
    selectedObjectId: snapshot.selectedObjectId,
    coverage: snapshot.coverage,
    readOnly: snapshot.readOnly,
  });
}

export function buildRiskSceneCoverageSignature(coverage: RiskSceneCoverage): string {
  return JSON.stringify(coverage);
}

/** @internal */
export function resolveRiskSceneAwarenessFromDefaults(
  revision = 0
): RiskSceneAwarenessSnapshot {
  return Object.freeze({
    ...DEFAULT_RISK_SCENE_AWARENESS,
    revision,
    signature: buildRiskSceneAwarenessSignature(DEFAULT_RISK_SCENE_AWARENESS),
  });
}
