/** D9:7:8 — Executive multi-perspective strategic memory synchronization + enterprise distributed cognition continuity types. */

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
import type { StrategicDiversitySnapshot } from "./diversityPreservationTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";
import type { CounterfactualReasoningSnapshot } from "./strategicDebateTypes";

export type MemoryPerspective =
  | "governance"
  | "resilience"
  | "operational_speed"
  | "counterfactual"
  | "trust"
  | "foresight"
  | "coordination"
  | "recovery"
  | "unknown";

export type SynchronizationCategory =
  | "governance_memory"
  | "resilience_memory"
  | "orchestration_memory"
  | "counterfactual_memory"
  | "trust_memory"
  | "foresight_memory"
  | "stabilization_memory"
  | "unknown";

export type SynchronizationStrength = "weak" | "partial" | "stable" | "synchronized" | "enterprise_grade";

export type ContinuityState = "fragmented" | "drifting" | "aligned" | "synchronized" | "continuous";

export type CollaborativeContinuityObservation = {
  synchronizationId: string;
  continuityState: ContinuityState;
  synchronizationStrength: SynchronizationStrength;
  synchronizationCategory: SynchronizationCategory;
  summary: string;
  synchronizedPerspectives: readonly MemoryPerspective[];
  fragmentedPerspectives: readonly MemoryPerspective[];
  synchronizationSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type DistributedCognitionContinuitySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly SynchronizationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type StrategicMemoryAlignmentField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly SynchronizationCategory[];
  generatedAt: number;
};

export type EnterpriseMemoryDivergenceIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  divergencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedPerspectives: readonly MemoryPerspective[];
  generatedAt: number;
};

export type MemorySynchronizationSummary = {
  dominantContinuityState: ContinuityState;
  dominantSynchronizationStrength: SynchronizationStrength;
  continuityHeadline: string;
  coherencePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type MultiPerspectiveMemorySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: MemorySynchronizationSummary;
  recentObservations: readonly CollaborativeContinuityObservation[];
  continuitySignals: readonly DistributedCognitionContinuitySignal[];
  divergenceIndicators: readonly EnterpriseMemoryDivergenceIndicator[];
  alignmentFields: readonly StrategicMemoryAlignmentField[];
};

export type DistributedStrategicMemorySyncInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  collectiveGuidanceSnapshot?: CollectiveStrategicGuidanceSnapshot | null;
  counterfactualSnapshot?: CounterfactualReasoningSnapshot | null;
  diversitySnapshot?: StrategicDiversitySnapshot | null;
  collectiveLearningSnapshot?: ExecutiveCollectiveLearningSnapshot | null;
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

export type DistributedStrategicMemorySyncResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: MultiPerspectiveMemorySnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type DistributedMemorySyncStoreState = {
  observations: readonly CollaborativeContinuityObservation[];
  snapshots: readonly MultiPerspectiveMemorySnapshot[];
  continuitySignals: readonly DistributedCognitionContinuitySignal[];
  divergenceIndicators: readonly EnterpriseMemoryDivergenceIndicator[];
  alignmentFields: readonly StrategicMemoryAlignmentField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastContinuityState: ContinuityState | null;
};
