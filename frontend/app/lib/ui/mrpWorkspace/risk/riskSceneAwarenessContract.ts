/**
 * MRP:4C:5 — Risk workspace scene awareness contract.
 *
 * Read-only boundary for Risk ↔ Scene synchronization.
 * No scene writes, topology changes, or camera control.
 */

import type { SceneJson } from "../../../sceneTypes.ts";

export const MRP_RISK_SCENE_AWARE_TAG = "[MRP_RISK_SCENE_AWARE]" as const;

export const RISK_SCENE_AWARENESS_VERSION = "4C.5.0";

/** Scene/workspace fields the Risk workspace may read — and only read. */
export type RiskSceneReadField =
  | "selectedObject"
  | "sceneObjects"
  | "workspaceDiagnostics";

/** Scene capabilities explicitly forbidden for Risk workspace. */
export type RiskSceneForbiddenCapability =
  | "move_objects"
  | "modify_topology"
  | "modify_scene"
  | "change_camera"
  | "control_scene";

export type RiskSceneCoverage = Readonly<{
  objectsMonitored: number;
  objectsWithRisk: number;
  criticalObjects: number;
}>;

export type RiskSceneAwarenessSnapshot = Readonly<{
  selectedObjectId: string | null;
  coverage: RiskSceneCoverage;
  readOnly: true;
  revision: number;
  signature: string;
}>;

export type RiskSceneAwarenessInput = Readonly<{
  selectedObjectId?: string | null;
  routeObjectId?: string | null;
  sceneJson?: SceneJson | null;
}>;

export type RiskSceneWriteAttempt = Readonly<{
  capability: RiskSceneForbiddenCapability;
  source?: string | null;
}>;

export type RiskSceneWriteGuardResult = Readonly<{
  allowed: false;
  reason: string;
  capability: RiskSceneForbiddenCapability;
  tag: typeof MRP_RISK_SCENE_AWARE_TAG;
}>;

export const RISK_SCENE_READ_FIELDS: readonly RiskSceneReadField[] = Object.freeze([
  "selectedObject",
  "sceneObjects",
  "workspaceDiagnostics",
]);

export const RISK_SCENE_FORBIDDEN_CAPABILITIES: readonly RiskSceneForbiddenCapability[] =
  Object.freeze([
    "move_objects",
    "modify_topology",
    "modify_scene",
    "change_camera",
    "control_scene",
  ]);

export const RISK_SCENE_COVERAGE_LABELS = Object.freeze({
  objectsMonitored: "Objects Monitored",
  objectsWithRisk: "Objects With Risk",
  criticalObjects: "Critical Objects",
});

export const DEFAULT_RISK_SCENE_COVERAGE: RiskSceneCoverage = Object.freeze({
  objectsMonitored: 0,
  objectsWithRisk: 0,
  criticalObjects: 0,
});

export const DEFAULT_RISK_SCENE_AWARENESS: RiskSceneAwarenessSnapshot = Object.freeze({
  selectedObjectId: null,
  coverage: DEFAULT_RISK_SCENE_COVERAGE,
  readOnly: true,
  revision: 0,
  signature: "risk:scene:defaults",
});
