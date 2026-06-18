/**
 * DS:4:5 — Relationship Risk Exposure Engine contract.
 *
 * Read-only risk exposure profile for relationships between Nexora objects.
 */

export const RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC = "[RELATIONSHIP_RISK_ENGINE]" as const;

export const RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC = "[RELATIONSHIP_RISK_UPDATED]" as const;

export const RELATIONSHIP_RISK_ENGINE_VERSION = "4.5.0" as const;

export type RelationshipRiskType =
  | "Operational Risk"
  | "Financial Risk"
  | "Supply Risk"
  | "Execution Risk";

export type RelationshipRiskExposureLevel = "Low" | "Medium" | "High" | "Critical";

export type RelationshipRiskExposureFactors = Readonly<{
  operationalRisk: number;
  financialRisk: number;
  supplyRisk: number;
  executionRisk: number;
}>;

export type RelationshipRiskExposureProfile = Readonly<{
  relationshipId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  riskExposureScore: number;
  riskExposureLevel: RelationshipRiskExposureLevel;
  riskTypes: readonly RelationshipRiskType[];
  riskExposureFactors: RelationshipRiskExposureFactors;
  riskExposureReasoning: readonly string[];
}>;

export type RelationshipRiskExposureRegistry = Readonly<{
  version: typeof RELATIONSHIP_RISK_ENGINE_VERSION;
  profiles: readonly RelationshipRiskExposureProfile[];
  riskExposureByRelationshipId: Readonly<Record<string, RelationshipRiskExposureProfile>>;
  relationshipCount: number;
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC,
    typeof RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC,
  ];
}>;

export type RelationshipRiskExposureBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
}>;

export const RELATIONSHIP_RISK_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_RISK_ENGINE_DIAGNOSTIC,
  RELATIONSHIP_RISK_UPDATED_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_RISK_EXPOSURE_REGISTRY: RelationshipRiskExposureRegistry =
  Object.freeze({
    version: RELATIONSHIP_RISK_ENGINE_VERSION,
    profiles: Object.freeze([]),
    riskExposureByRelationshipId: Object.freeze({}),
    relationshipCount: 0,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: RELATIONSHIP_RISK_DIAGNOSTICS,
  });
