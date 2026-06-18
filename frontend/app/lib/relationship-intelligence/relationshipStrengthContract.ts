/**
 * DS:4:2 — Relationship Strength Engine contract.
 *
 * Read-only strength profile for relationships between Nexora objects.
 */

export const RELATIONSHIP_STRENGTH_ENGINE_DIAGNOSTIC =
  "[RELATIONSHIP_STRENGTH_ENGINE]" as const;

export const RELATIONSHIP_STRENGTH_UPDATED_DIAGNOSTIC =
  "[RELATIONSHIP_STRENGTH_UPDATED]" as const;

export const RELATIONSHIP_STRENGTH_ENGINE_VERSION = "4.2.0" as const;

export type RelationshipStrengthLevel = "Weak" | "Moderate" | "Strong" | "Critical";

export type RelationshipStrengthFactors = Readonly<{
  interactionFrequency: number;
  sharedDependencies: number;
  relationshipHistory: number;
  dataConfidence: number;
}>;

export type RelationshipStrengthProfile = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  strengthScore: number;
  strengthLevel: RelationshipStrengthLevel;
  strengthFactors: RelationshipStrengthFactors;
  strengthReasoning: readonly string[];
}>;

export type RelationshipStrengthRegistry = Readonly<{
  version: typeof RELATIONSHIP_STRENGTH_ENGINE_VERSION;
  profiles: readonly RelationshipStrengthProfile[];
  strengthByRelationshipId: Readonly<Record<string, RelationshipStrengthProfile>>;
  relationshipCount: number;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_STRENGTH_ENGINE_DIAGNOSTIC,
    typeof RELATIONSHIP_STRENGTH_UPDATED_DIAGNOSTIC,
  ];
}>;

export type RelationshipStrengthBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
}>;

export const RELATIONSHIP_STRENGTH_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_STRENGTH_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_STRENGTH_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_STRENGTH_REGISTRY: RelationshipStrengthRegistry =
  Object.freeze({
    version: RELATIONSHIP_STRENGTH_ENGINE_VERSION,
    profiles: Object.freeze([]),
    strengthByRelationshipId: Object.freeze({}),
    relationshipCount: 0,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_STRENGTH_DIAGNOSTICS,
  });
