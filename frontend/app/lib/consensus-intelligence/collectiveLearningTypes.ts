/** D9:7:7 — Executive collective intelligence evolution + enterprise distributed strategic learning types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { StrategicConsensusSnapshot } from "./consensusIntelligenceTypes";
import type { CollectiveStrategicGuidanceSnapshot } from "./distributedAdvisoryTypes";
import type { StrategicDiversitySnapshot } from "./diversityPreservationTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";
import type { CounterfactualReasoningSnapshot } from "./strategicDebateTypes";

export type LearningCategory =
  | "governance_learning"
  | "resilience_learning"
  | "orchestration_learning"
  | "counterfactual_learning"
  | "trust_learning"
  | "foresight_learning"
  | "stabilization_learning"
  | "unknown";

export type EvolutionStrength = "weak" | "developing" | "adaptive" | "mature" | "enterprise_grade";

export type LearningState = "fragmented" | "emerging" | "evolving" | "consolidating" | "strategically_mature";

export type EnterpriseIntelligenceEvolution = {
  learningId: string;
  learningState: LearningState;
  evolutionStrength: EvolutionStrength;
  learningCategory: LearningCategory;
  summary: string;
  learningSignals: readonly string[];
  maturityRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type DistributedStrategicLearningSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly LearningCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type PerspectiveLearningField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  learningPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly LearningCategory[];
  generatedAt: number;
};

export type StrategicMaturityObservation = {
  observationId: string;
  observationLabel: string;
  observationSummary: string;
  maturityPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly LearningCategory[];
  generatedAt: number;
};

export type CollectiveEvolutionSummary = {
  dominantLearningState: LearningState;
  dominantEvolutionStrength: EvolutionStrength;
  evolutionHeadline: string;
  maturationPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type ExecutiveCollectiveLearningSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: CollectiveEvolutionSummary;
  recentEvolutions: readonly EnterpriseIntelligenceEvolution[];
  learningSignals: readonly DistributedStrategicLearningSignal[];
  maturityObservations: readonly StrategicMaturityObservation[];
  learningFields: readonly PerspectiveLearningField[];
};

export type ExecutiveCollectiveLearningInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  collectiveGuidanceSnapshot?: CollectiveStrategicGuidanceSnapshot | null;
  counterfactualSnapshot?: CounterfactualReasoningSnapshot | null;
  diversitySnapshot?: StrategicDiversitySnapshot | null;
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

export type ExecutiveCollectiveLearningResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: ExecutiveCollectiveLearningSnapshot | null;
  newEvolutions: number;
  storeSignature: string;
};

export type CollectiveLearningStoreState = {
  evolutions: readonly EnterpriseIntelligenceEvolution[];
  snapshots: readonly ExecutiveCollectiveLearningSnapshot[];
  learningSignals: readonly DistributedStrategicLearningSignal[];
  maturityObservations: readonly StrategicMaturityObservation[];
  learningFields: readonly PerspectiveLearningField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastLearningState: LearningState | null;
};
