/**
 * DS:3:6 — Object Importance Intelligence Engine contract.
 *
 * Read-only strategic importance ranking for scene and data-source objects.
 */

export const OBJECT_IMPORTANCE_ENGINE_DIAGNOSTIC = "[OBJECT_IMPORTANCE_ENGINE]" as const;

export const OBJECT_IMPORTANCE_UPDATED_DIAGNOSTIC = "[OBJECT_IMPORTANCE_UPDATED]" as const;

export const OBJECT_IMPORTANCE_ENGINE_VERSION = "3.6.0" as const;

export type ObjectImportanceLevel = "Minor" | "Relevant" | "Important" | "Strategic";

export type ObjectImportanceFactors = Readonly<{
  businessInfluence: number;
  executiveRelevance: number;
  dependencyWeight: number;
  topologyCentrality: number;
}>;

export type ObjectImportanceProfile = Readonly<{
  objectId: string;
  importanceScore: number;
  importanceLevel: ObjectImportanceLevel;
  importanceFactors: ObjectImportanceFactors;
  importanceReasoning: readonly string[];
}>;

export type ObjectImportanceRegistry = Readonly<{
  version: typeof OBJECT_IMPORTANCE_ENGINE_VERSION;
  profiles: readonly ObjectImportanceProfile[];
  importanceByObjectId: Readonly<Record<string, ObjectImportanceProfile>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_IMPORTANCE_ENGINE_DIAGNOSTIC,
    typeof OBJECT_IMPORTANCE_UPDATED_DIAGNOSTIC,
  ];
}>;

export type ObjectImportanceBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
}>;

export const OBJECT_IMPORTANCE_DIAGNOSTICS = Object.freeze([
  OBJECT_IMPORTANCE_ENGINE_DIAGNOSTIC,
  OBJECT_IMPORTANCE_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_IMPORTANCE_REGISTRY: ObjectImportanceRegistry = Object.freeze({
  version: OBJECT_IMPORTANCE_ENGINE_VERSION,
  profiles: Object.freeze([]),
  importanceByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_IMPORTANCE_DIAGNOSTICS,
});
