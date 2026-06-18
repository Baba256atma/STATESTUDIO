/**
 * DS:3:3 — Object Impact Intelligence Engine contract.
 *
 * Read-only business impact calculation for scene and data-source objects.
 */

export const OBJECT_IMPACT_ENGINE_DIAGNOSTIC = "[OBJECT_IMPACT_ENGINE]" as const;

export const OBJECT_IMPACT_UPDATED_DIAGNOSTIC = "[OBJECT_IMPACT_UPDATED]" as const;

export const OBJECT_IMPACT_ENGINE_VERSION = "3.3.0" as const;

export type ObjectImpactLevel = "Low" | "Medium" | "High" | "Critical";

export type ObjectImpactFactors = Readonly<{
  relationshipCount: number;
  connectedKpis: number;
  connectedRisks: number;
  businessDependency: number;
}>;

export type ObjectImpactResult = Readonly<{
  objectId: string;
  impactScore: number;
  impactLevel: ObjectImpactLevel;
  impactFactors: ObjectImpactFactors;
}>;

export type ObjectImpactRegistry = Readonly<{
  version: typeof OBJECT_IMPACT_ENGINE_VERSION;
  objects: readonly ObjectImpactResult[];
  impactByObjectId: Readonly<Record<string, ObjectImpactResult>>;
  objectCount: number;
  sceneMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof OBJECT_IMPACT_ENGINE_DIAGNOSTIC,
    typeof OBJECT_IMPACT_UPDATED_DIAGNOSTIC,
  ];
}>;

export type ObjectImpactBuildInput = Readonly<{
  sceneJson?: unknown;
  sceneObjects?: readonly unknown[];
  dataSourceObjects?: readonly unknown[];
}>;

export const OBJECT_IMPACT_DIAGNOSTICS = Object.freeze([
  OBJECT_IMPACT_ENGINE_DIAGNOSTIC,
  OBJECT_IMPACT_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_OBJECT_IMPACT_REGISTRY: ObjectImpactRegistry = Object.freeze({
  version: OBJECT_IMPACT_ENGINE_VERSION,
  objects: Object.freeze([]),
  impactByObjectId: Object.freeze({}),
  objectCount: 0,
  sceneMutation: false,
  simulation: false,
  diagnostics: OBJECT_IMPACT_DIAGNOSTICS,
});
