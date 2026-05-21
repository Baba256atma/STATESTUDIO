/** D9:7:9 — Executive distributed strategic governance + enterprise collective intelligence integrity types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { ExecutiveCollectiveLearningSnapshot } from "./collectiveLearningTypes";
import type { StrategicConsensusSnapshot } from "./consensusIntelligenceTypes";
import type { CollectiveStrategicGuidanceSnapshot } from "./distributedAdvisoryTypes";
import type { MultiPerspectiveMemorySnapshot } from "./distributedMemorySyncTypes";
import type { StrategicDiversitySnapshot } from "./diversityPreservationTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";
import type { CounterfactualReasoningSnapshot } from "./strategicDebateTypes";

export type GovernanceCategory =
  | "consensus_governance"
  | "diversity_governance"
  | "advisory_governance"
  | "trust_governance"
  | "explainability_governance"
  | "memory_governance"
  | "orchestration_governance"
  | "unknown";

export type IntegrityStrength = "weak" | "monitored" | "stable" | "governed" | "enterprise_grade";

export type GovernanceState = "fragmented" | "unstable" | "regulated" | "coherent" | "integrity_preserved";

export type CollaborativeIntegrityObservation = {
  governanceId: string;
  governanceState: GovernanceState;
  integrityStrength: IntegrityStrength;
  governanceCategory: GovernanceCategory;
  summary: string;
  governanceSignals: readonly string[];
  integrityRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CollectiveIntegritySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly GovernanceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EnterpriseCoherenceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  coherencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly GovernanceCategory[];
  generatedAt: number;
};

export type DistributedGovernanceIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  governancePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly GovernanceCategory[];
  generatedAt: number;
};

export type CollectiveGovernanceSummary = {
  dominantGovernanceState: GovernanceState;
  dominantIntegrityStrength: IntegrityStrength;
  governanceHeadline: string;
  integrityPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type DistributedStrategicGovernanceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: CollectiveGovernanceSummary;
  recentObservations: readonly CollaborativeIntegrityObservation[];
  integritySignals: readonly CollectiveIntegritySignal[];
  governanceIndicators: readonly DistributedGovernanceIndicator[];
  coherenceFields: readonly EnterpriseCoherenceField[];
};

export type DistributedStrategicGovernanceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  collectiveGuidanceSnapshot?: CollectiveStrategicGuidanceSnapshot | null;
  counterfactualSnapshot?: CounterfactualReasoningSnapshot | null;
  diversitySnapshot?: StrategicDiversitySnapshot | null;
  collectiveLearningSnapshot?: ExecutiveCollectiveLearningSnapshot | null;
  memorySyncSnapshot?: MultiPerspectiveMemorySnapshot | null;
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

export type DistributedStrategicGovernanceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: DistributedStrategicGovernanceSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type DistributedGovernanceStoreState = {
  observations: readonly CollaborativeIntegrityObservation[];
  snapshots: readonly DistributedStrategicGovernanceSnapshot[];
  integritySignals: readonly CollectiveIntegritySignal[];
  governanceIndicators: readonly DistributedGovernanceIndicator[];
  coherenceFields: readonly EnterpriseCoherenceField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastGovernanceState: GovernanceState | null;
};
