/**
 * DS:3:4 — Object Confidence Intelligence Engine contract.
 *
 * Read-only confidence calculation for object intelligence.
 */

export const OBJECT_CONFIDENCE_ENGINE_DIAGNOSTIC = "[OBJECT_CONFIDENCE_ENGINE]" as const;

export const OBJECT_CONFIDENCE_UPDATED_DIAGNOSTIC = "[OBJECT_CONFIDENCE_UPDATED]" as const;

export const OBJECT_CONFIDENCE_ENGINE_VERSION = "3.4.0" as const;

export type ObjectConfidenceFactors = Readonly<{
  dataQuality: number;
  dataFreshness: number;
  sourceReliability: number;
  relationshipCertainty: number;
}>;

export type ObjectConfidenceResult = Readonly<{
  objectId: string;
  confidenceScore: number;
  confidenceExplanation: string;
  confidenceReasoning: readonly string[];
  confidenceFactors: ObjectConfidenceFactors;
}>;

export type ObjectConfidenceRegistry = Readonly<{
  version: typeof OBJECT_CONFIDENCE_ENGINE_VERSION;
  objects: readonly ObjectConfidenceResult[];
  confidenceByObjectId: Readonly<Record<string, ObjectConfidenceResult>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_CONFIDENCE_ENGINE_DIAGNOSTIC,
    typeof OBJECT_CONFIDENCE_UPDATED_DIAGNOSTIC,
  ];
}>;

export type ObjectConfidenceBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
}>;

export const OBJECT_CONFIDENCE_DIAGNOSTICS = Object.freeze([
  OBJECT_CONFIDENCE_ENGINE_DIAGNOSTIC,
  OBJECT_CONFIDENCE_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_CONFIDENCE_REGISTRY: ObjectConfidenceRegistry = Object.freeze({
  version: OBJECT_CONFIDENCE_ENGINE_VERSION,
  objects: Object.freeze([]),
  confidenceByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_CONFIDENCE_DIAGNOSTICS,
});
