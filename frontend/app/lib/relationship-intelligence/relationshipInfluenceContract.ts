/**
 * DS:4:4 — Relationship Influence Engine contract.
 *
 * Read-only influence intelligence for relationships between Nexora objects.
 */

export const RELATIONSHIP_INFLUENCE_ENGINE_DIAGNOSTIC =
  "[RELATIONSHIP_INFLUENCE_ENGINE]" as const;

export const RELATIONSHIP_INFLUENCE_UPDATED_DIAGNOSTIC =
  "[RELATIONSHIP_INFLUENCE_UPDATED]" as const;

export const RELATIONSHIP_INFLUENCE_ENGINE_VERSION = "4.4.0" as const;

export type RelationshipInfluenceLevel = "Low" | "Moderate" | "High" | "Critical";

export type RelationshipInfluenceDirection =
  | "source-to-target"
  | "target-to-source"
  | "bidirectional"
  | "neutral";

export type RelationshipInfluenceFactors = Readonly<{
  businessInfluence: number;
  decisionInfluence: number;
  dependencyInfluence: number;
  confidence: number;
}>;

export type RelationshipInfluenceProfile = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  influenceScore: number;
  influenceLevel: RelationshipInfluenceLevel;
  influenceDirection: RelationshipInfluenceDirection;
  influenceFactors: RelationshipInfluenceFactors;
  influenceReasoning: readonly string[];
}>;

export type RelationshipInfluenceRegistry = Readonly<{
  version: typeof RELATIONSHIP_INFLUENCE_ENGINE_VERSION;
  profiles: readonly RelationshipInfluenceProfile[];
  influenceByRelationshipId: Readonly<Record<string, RelationshipInfluenceProfile>>;
  relationshipCount: number;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_INFLUENCE_ENGINE_DIAGNOSTIC,
    typeof RELATIONSHIP_INFLUENCE_UPDATED_DIAGNOSTIC,
  ];
}>;

export type RelationshipInfluenceBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
}>;

export const RELATIONSHIP_INFLUENCE_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_INFLUENCE_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_INFLUENCE_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_INFLUENCE_REGISTRY: RelationshipInfluenceRegistry =
  Object.freeze({
    version: RELATIONSHIP_INFLUENCE_ENGINE_VERSION,
    profiles: Object.freeze([]),
    influenceByRelationshipId: Object.freeze({}),
    relationshipCount: 0,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_INFLUENCE_DIAGNOSTICS,
  });
