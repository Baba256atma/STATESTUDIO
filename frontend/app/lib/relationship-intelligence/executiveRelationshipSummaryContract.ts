/**
 * DS:4:6 — Executive Relationship Intelligence Aggregator contract.
 *
 * Read-only executive-level summary across relationship strength, dependency,
 * influence, confidence, and risk exposure.
 */

import type { DependencyProfile } from "./dependencyIntelligenceContract.ts";
import type { RelationshipInfluenceProfile } from "./relationshipInfluenceContract.ts";
import type { RelationshipIntelligenceProfile } from "./relationshipIntelligenceContract.ts";
import type { RelationshipRiskExposureProfile } from "./relationshipRiskExposureContract.ts";
import type { RelationshipStrengthProfile } from "./relationshipStrengthContract.ts";

export const EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTIC = "[EXEC_RELATIONSHIP_SUMMARY]" as const;

export const EXEC_RELATIONSHIP_READY_DIAGNOSTIC = "[EXEC_RELATIONSHIP_READY]" as const;

export const EXEC_RELATIONSHIP_SUMMARY_VERSION = "4.6.0" as const;

export type ExecutiveRelationshipAttentionLevel = "monitor" | "review" | "prioritize";

export type ExecutiveRelationshipSummaryProfile = Readonly<{
  relationshipId: string;
  sourceId?: string;
  targetId?: string;
  intelligence?: RelationshipIntelligenceProfile;
  strength?: RelationshipStrengthProfile;
  dependency?: DependencyProfile;
  influence?: RelationshipInfluenceProfile;
  riskExposure?: RelationshipRiskExposureProfile;
}>;

export type ExecutiveRelationshipAttention = Readonly<{
  relationshipId: string;
  attentionLevel: ExecutiveRelationshipAttentionLevel;
  reason: string;
}>;

export type ExecutiveRelationshipSummary = Readonly<{
  version: typeof EXEC_RELATIONSHIP_SUMMARY_VERSION;
  executiveSummary: string;
  relationshipCount: number;
  averageStrengthScore: number;
  averageDependencyScore: number;
  averageInfluenceScore: number;
  averageConfidenceScore: number;
  averageRiskExposureScore: number;
  topRisks: readonly string[];
  topDependencies: readonly string[];
  topInfluencers: readonly string[];
  recommendedAttention: readonly ExecutiveRelationshipAttention[];
  profiles: readonly ExecutiveRelationshipSummaryProfile[];
  sceneMutation: false;
  objectMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTIC,
    typeof EXEC_RELATIONSHIP_READY_DIAGNOSTIC,
  ];
}>;

export type ExecutiveRelationshipSummaryBuildInput = Readonly<{
  sceneJson?: unknown;
  relationships?: readonly unknown[];
  objects?: readonly unknown[];
  intelligenceProfiles?: readonly RelationshipIntelligenceProfile[];
  strengthProfiles?: readonly RelationshipStrengthProfile[];
  dependencyProfiles?: readonly DependencyProfile[];
  influenceProfiles?: readonly RelationshipInfluenceProfile[];
  riskExposureProfiles?: readonly RelationshipRiskExposureProfile[];
}>;

export const EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTICS = Object.freeze([
  EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTIC,
  EXEC_RELATIONSHIP_READY_DIAGNOSTIC,
] as const);

export const EMPTY_EXECUTIVE_RELATIONSHIP_SUMMARY: ExecutiveRelationshipSummary =
  Object.freeze({
    version: EXEC_RELATIONSHIP_SUMMARY_VERSION,
    executiveSummary: "No relationship intelligence is available.",
    relationshipCount: 0,
    averageStrengthScore: 0,
    averageDependencyScore: 0,
    averageInfluenceScore: 0,
    averageConfidenceScore: 0,
    averageRiskExposureScore: 0,
    topRisks: Object.freeze([]),
    topDependencies: Object.freeze([]),
    topInfluencers: Object.freeze([]),
    recommendedAttention: Object.freeze([]),
    profiles: Object.freeze([]),
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: EXEC_RELATIONSHIP_SUMMARY_DIAGNOSTICS,
  });
