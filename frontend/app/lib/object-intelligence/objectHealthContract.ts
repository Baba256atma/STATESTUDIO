/**
 * DS:3:2 — Object Health Intelligence Engine contract.
 *
 * Read-only operational health calculation for scene and data-source objects.
 */

export const OBJECT_HEALTH_ENGINE_DIAGNOSTIC = "[OBJECT_HEALTH_ENGINE]" as const;

export const OBJECT_HEALTH_UPDATED_DIAGNOSTIC = "[OBJECT_HEALTH_UPDATED]" as const;

export const OBJECT_HEALTH_ENGINE_VERSION = "3.2.0" as const;

export type ObjectHealthState = "Healthy" | "Stable" | "Warning" | "Critical";

export type ObjectHealthFactors = Readonly<{
  dataCompleteness: number;
  activityLevel: number;
  relationshipStability: number;
  sourceConfidence: number;
}>;

export type ObjectHealthResult = Readonly<{
  objectId: string;
  healthScore: number;
  healthState: ObjectHealthState;
  factors: ObjectHealthFactors;
}>;

export type ObjectHealthRegistry = Readonly<{
  version: typeof OBJECT_HEALTH_ENGINE_VERSION;
  objects: readonly ObjectHealthResult[];
  healthByObjectId: Readonly<Record<string, ObjectHealthResult>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_HEALTH_ENGINE_DIAGNOSTIC,
    typeof OBJECT_HEALTH_UPDATED_DIAGNOSTIC,
  ];
}>;

export type ObjectHealthBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
}>;

export const OBJECT_HEALTH_DIAGNOSTICS = Object.freeze([
  OBJECT_HEALTH_ENGINE_DIAGNOSTIC,
  OBJECT_HEALTH_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_HEALTH_REGISTRY: ObjectHealthRegistry = Object.freeze({
  version: OBJECT_HEALTH_ENGINE_VERSION,
  objects: Object.freeze([]),
  healthByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_HEALTH_DIAGNOSTICS,
});
