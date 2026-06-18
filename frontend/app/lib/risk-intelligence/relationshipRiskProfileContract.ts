/**
 * DS:6:3 — Relationship Risk Intelligence Engine contract.
 *
 * Read-only relationship risk profiles derived from relationship intelligence
 * signals. No UI, scene mutation, routing, or simulation authority.
 */

export const RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC = "[RELATIONSHIP_RISK_ENGINE]" as const;

export const RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC = "[RELATIONSHIP_RISK_UPDATED]" as const;

export const RELATIONSHIP_RISK_INTELLIGENCE_ENGINE_VERSION = "6.3.0" as const;

export type RelationshipRiskFactors = Readonly<{
  dependencyScore: number;
  influenceScore: number;
  riskExposureScore: number;
  strengthScore: number;
}>;

export type RelationshipRiskProfile = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  relationshipRiskScore: number;
  singlePointOfFailure: boolean;
  criticalDependency: boolean;
  riskFactors: RelationshipRiskFactors;
  riskReasoning: readonly string[];
}>;

export type RelationshipRiskRegistry = Readonly<{
  version: typeof RELATIONSHIP_RISK_INTELLIGENCE_ENGINE_VERSION;
  profiles: readonly RelationshipRiskProfile[];
  riskByRelationshipId: Readonly<Record<string, RelationshipRiskProfile>>;
  relationshipCount: number;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  simulation: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC,
    typeof RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC,
  ];
}>;

export type RelationshipRiskBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
}>;

export const RELATIONSHIP_RISK_INTELLIGENCE_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_RISK_REGISTRY: RelationshipRiskRegistry = Object.freeze({
  version: RELATIONSHIP_RISK_INTELLIGENCE_ENGINE_VERSION,
  profiles: Object.freeze([]),
  riskByRelationshipId: Object.freeze({}),
  relationshipCount: 0,
  sceneMutation: false,
  objectMutation: false,
  routingMutation: false,
  simulation: false,
  diagnostics: RELATIONSHIP_RISK_INTELLIGENCE_DIAGNOSTICS,
});
