/**
 * MRP:4:11 — Operational workspace scene awareness contract.
 *
 * Read-only boundary for future Operational ↔ Scene synchronization.
 * No scene writes, topology changes, or camera control.
 */

import { DEFAULT_MRP_SELECTED_OBJECT } from "../../mrpContext/mrpContextStoreContract.ts";

export const OPERATIONAL_SCENE_AWARE_TAG = "[OPERATIONAL_SCENE_AWARE]" as const;

export const OPERATIONAL_SCENE_AWARENESS_VERSION = "4.11.0";

/** Scene fields the Operational workspace may read — and only read. */
export type OperationalSceneReadField =
  | "selectedObject"
  | "objectStatus"
  | "objectPriority"
  | "objectActivity";

/** Scene capabilities explicitly forbidden for Operational workspace. */
export type OperationalSceneForbiddenCapability =
  | "move_objects"
  | "modify_topology"
  | "change_camera"
  | "control_scene";

/** Future engine integration hooks — contracts only, no wiring in MRP:4:11. */
export type OperationalSceneFutureEngineSource =
  | "visual_intelligence_engine"
  | "operational_engine";

export type OperationalSceneAwarenessSnapshot = Readonly<{
  selectedObjectId: string | null;
  selectedObject: string;
  objectStatus: string;
  objectPriority: string;
  objectActivity: string;
  hasSelection: boolean;
  readOnly: true;
  revision: number;
  signature: string;
}>;

export type OperationalSceneAwarenessInput = Readonly<{
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  selectedObjectStatus?: string | null;
  objectPriority?: string | null;
  objectActivity?: string | null;
  routeObjectId?: string | null;
  routeObjectName?: string | null;
}>;

export type OperationalSceneWriteAttempt = Readonly<{
  capability: OperationalSceneForbiddenCapability;
  source?: string | null;
}>;

export type OperationalSceneWriteGuardResult = Readonly<{
  allowed: false;
  reason: string;
  capability: OperationalSceneForbiddenCapability;
  tag: typeof OPERATIONAL_SCENE_AWARE_TAG;
}>;

export const OPERATIONAL_SCENE_READ_FIELDS: readonly OperationalSceneReadField[] = Object.freeze([
  "selectedObject",
  "objectStatus",
  "objectPriority",
  "objectActivity",
]);

export const OPERATIONAL_SCENE_FORBIDDEN_CAPABILITIES: readonly OperationalSceneForbiddenCapability[] =
  Object.freeze([
    "move_objects",
    "modify_topology",
    "change_camera",
    "control_scene",
  ]);

export const OPERATIONAL_SCENE_FUTURE_ENGINE_SOURCES: readonly OperationalSceneFutureEngineSource[] =
  Object.freeze(["visual_intelligence_engine", "operational_engine"]);

export const OPERATIONAL_SCENE_READ_FIELD_LABELS: Readonly<
  Record<OperationalSceneReadField, string>
> = Object.freeze({
  selectedObject: "Selected Object",
  objectStatus: "Object Status",
  objectPriority: "Object Priority",
  objectActivity: "Object Activity",
});

export const DEFAULT_OPERATIONAL_SCENE_AWARENESS: OperationalSceneAwarenessSnapshot = Object.freeze({
  selectedObjectId: null,
  selectedObject: DEFAULT_MRP_SELECTED_OBJECT,
  objectStatus: "Awaiting selection",
  objectPriority: "None",
  objectActivity: "None",
  hasSelection: false,
  readOnly: true,
  revision: 0,
  signature: "operational:scene:defaults",
});
