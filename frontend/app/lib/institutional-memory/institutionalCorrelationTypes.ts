/** D9:2:2 — Organizational learning pattern consolidation + strategic experience correlation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type {
  EnterpriseCognitionObservationInput,
  InstitutionalLearningSnapshot,
  InstitutionalMemoryRecord,
  OrganizationalExperience,
} from "./institutionalMemoryTypes";

export type ExperienceCorrelationStrength = "weak" | "moderate" | "strong" | "systemic";

export type LearningPatternCategory =
  | "escalation_chain"
  | "fragility_cycle"
  | "governance_pressure"
  | "resilience_growth"
  | "coordination_breakdown"
  | "operational_recovery"
  | "systemic_instability"
  | "unknown";

export type InstitutionalCorrelation = {
  correlationId: string;
  category: LearningPatternCategory;
  strength: ExperienceCorrelationStrength;
  summary: string;
  linkedExperiences: readonly string[];
  observations: readonly string[];
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicExperienceLink = {
  linkId: string;
  fromMemoryId: string;
  toMemoryId: string;
  strength: ExperienceCorrelationStrength;
  relationship: string;
  generatedAt: number;
};

export type CorrelatedOperationalSequence = {
  sequenceId: string;
  category: LearningPatternCategory;
  memoryIds: readonly string[];
  summary: string;
  generatedAt: number;
};

export type OrganizationalLearningPattern = {
  patternId: string;
  category: LearningPatternCategory;
  strength: ExperienceCorrelationStrength;
  lesson: string;
  correlationIds: readonly string[];
  linkedMemoryIds: readonly string[];
  firstObservedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type LearningConsolidationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  correlationCount: number;
  patternCount: number;
  linkCount: number;
  consolidationSummary: string;
  dominantPatterns: readonly LearningPatternCategory[];
  strongCorrelations: readonly InstitutionalCorrelation[];
  consolidatedPatterns: readonly OrganizationalLearningPattern[];
};

export type InstitutionalExperienceCorrelationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  observations?: EnterpriseCognitionObservationInput | null;
  continuityPreserved?: boolean;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  records?: readonly InstitutionalMemoryRecord[];
  experiences?: readonly OrganizationalExperience[];
  now?: number;
};

export type InstitutionalCorrelationStoreState = {
  correlations: readonly InstitutionalCorrelation[];
  links: readonly StrategicExperienceLink[];
  patterns: readonly OrganizationalLearningPattern[];
  sequences: readonly CorrelatedOperationalSequence[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
