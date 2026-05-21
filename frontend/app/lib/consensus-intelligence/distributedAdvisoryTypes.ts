/** D9:7:4 — Executive distributed advisory intelligence + enterprise collective strategic guidance types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { StrategicConsensusSnapshot } from "./consensusIntelligenceTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";

export type AdvisoryCategory =
  | "governance_guidance"
  | "resilience_guidance"
  | "operational_guidance"
  | "recovery_guidance"
  | "stabilization_guidance"
  | "trust_guidance"
  | "foresight_guidance"
  | "orchestration_guidance"
  | "unknown";

export type GuidanceStrength = "weak" | "moderate" | "strong" | "executive_grade";

export type CoordinationState =
  | "fragmented"
  | "partially_aligned"
  | "coordinated"
  | "converging"
  | "collectively_aligned";

export type DistributedExecutiveAdvisory = {
  advisoryId: string;
  coordinationState: CoordinationState;
  guidanceStrength: GuidanceStrength;
  advisoryCategory: AdvisoryCategory;
  summary: string;
  alignedGuidance: readonly string[];
  moderatedGuidance: readonly string[];
  advisorySignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type EnterpriseRecommendationConsensus = {
  consensusId: string;
  consensusLabel: string;
  consensusSummary: string;
  coordinationState: CoordinationState;
  linkedCategories: readonly AdvisoryCategory[];
  confidence: number;
  generatedAt: number;
};

export type AdvisoryCoordinationSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly AdvisoryCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicGuidanceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  guidancePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly AdvisoryCategory[];
  generatedAt: number;
};

export type DistributedAdvisorySummary = {
  dominantCoordinationState: CoordinationState;
  dominantGuidanceStrength: GuidanceStrength;
  advisoryHeadline: string;
  collectivePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CollectiveStrategicGuidanceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: DistributedAdvisorySummary;
  recentAdvisories: readonly DistributedExecutiveAdvisory[];
  recommendationConsensus: readonly EnterpriseRecommendationConsensus[];
  coordinationSignals: readonly AdvisoryCoordinationSignal[];
  guidanceFields: readonly StrategicGuidanceField[];
};

export type DistributedExecutiveAdvisoryInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type DistributedExecutiveAdvisoryResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CollectiveStrategicGuidanceSnapshot | null;
  newAdvisories: number;
  storeSignature: string;
};

export type DistributedAdvisoryStoreState = {
  advisories: readonly DistributedExecutiveAdvisory[];
  snapshots: readonly CollectiveStrategicGuidanceSnapshot[];
  recommendationConsensus: readonly EnterpriseRecommendationConsensus[];
  coordinationSignals: readonly AdvisoryCoordinationSignal[];
  guidanceFields: readonly StrategicGuidanceField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastCoordinationState: CoordinationState | null;
};
