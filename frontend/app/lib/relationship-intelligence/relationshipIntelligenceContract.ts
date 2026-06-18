/**
 * DS:4:1 — Business Relationship Intelligence foundation contract.
 *
 * Immutable intelligence metadata for relationships between Nexora objects.
 * No scene, object, or routing mutation authority.
 */

export const RELATIONSHIP_INTELLIGENCE_RUNTIME_DIAGNOSTIC =
  "[RELATIONSHIP_INTELLIGENCE_RUNTIME]" as const;

export const RELATIONSHIP_INTELLIGENCE_READY_DIAGNOSTIC =
  "[RELATIONSHIP_INTELLIGENCE_READY]" as const;

export const RELATIONSHIP_INTELLIGENCE_RUNTIME_VERSION = "4.1.0" as const;

export type RelationshipIntelligenceProfile = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  strength: number;
  dependency: number;
  influence: number;
  confidence: number;
  riskExposure: number;
}>;

export type RelationshipWithIntelligence<TRelationship> = Readonly<
  TRelationship & RelationshipIntelligenceProfile
>;

export type RelationshipIntelligenceRegistry = Readonly<{
  version: typeof RELATIONSHIP_INTELLIGENCE_RUNTIME_VERSION;
  profiles: readonly RelationshipIntelligenceProfile[];
  profileByRelationshipId: Readonly<Record<string, RelationshipIntelligenceProfile>>;
  relationshipCount: number;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
    typeof RELATIONSHIP_INTELLIGENCE_READY_DIAGNOSTIC,
  ];
}>;

export type RelationshipIntelligenceBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
}>;

export const RELATIONSHIP_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_INTELLIGENCE_RUNTIME_DIAGNOSTIC,
  RELATIONSHIP_INTELLIGENCE_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_INTELLIGENCE_REGISTRY: RelationshipIntelligenceRegistry =
  Object.freeze({
    version: RELATIONSHIP_INTELLIGENCE_RUNTIME_VERSION,
    profiles: Object.freeze([]),
    profileByRelationshipId: Object.freeze({}),
    relationshipCount: 0,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_INTELLIGENCE_DIAGNOSTICS,
  });
