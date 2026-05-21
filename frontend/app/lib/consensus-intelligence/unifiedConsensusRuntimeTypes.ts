/** D9:7:10 — Unified enterprise consensus intelligence runtime + distributed executive strategic cognition completion types. */

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
import type { DistributedStrategicGovernanceSnapshot } from "./distributedGovernanceTypes";
import type { MultiPerspectiveMemorySnapshot } from "./distributedMemorySyncTypes";
import type { StrategicDiversitySnapshot } from "./diversityPreservationTypes";
import type { EnterpriseConflictResolutionSnapshot } from "./perspectiveNegotiationTypes";
import type { EnterpriseConsensusPrioritySnapshot } from "./perspectiveWeightingTypes";
import type { CounterfactualReasoningSnapshot } from "./strategicDebateTypes";

export type ConsensusSubsystemId =
  | "consensus_intelligence"
  | "perspective_negotiation"
  | "perspective_weighting"
  | "distributed_advisory"
  | "strategic_debate"
  | "diversity_preservation"
  | "collective_learning"
  | "distributed_memory_sync"
  | "distributed_governance";

export type UnifiedConsensusRuntimeStatus =
  | "initializing"
  | "stable"
  | "adaptive"
  | "fragmented"
  | "recovering";

export type ConsensusIntegrityLevel =
  | "weak"
  | "monitored"
  | "stable"
  | "governed"
  | "enterprise_grade";

export type ConsensusSubsystemState = {
  subsystemId: ConsensusSubsystemId;
  status: UnifiedConsensusRuntimeStatus;
  observationCount: number;
  integrityLevel: ConsensusIntegrityLevel;
  headline: string;
  active: boolean;
  lastUpdatedAt: number;
};

export type DistributedStrategicCognitionSummary = {
  consensusState: string;
  diversityState: string;
  negotiationState: string;
  advisoryState: string;
  continuityState: string;
  governanceState: string;
};

export type CollectiveIntelligenceHealth = {
  level: ConsensusIntegrityLevel;
  integrityState: string;
  governanceHeadline: string;
  coherencePosture: string;
};

export type DistributedStrategicCognition = {
  cognitionId: string;
  runtimeHeadline: string;
  cognitionSummary: string;
  activeSubsystemCount: number;
  diversityPreservationPosture: string;
  confidence: number;
  generatedAt: number;
};

export type DistributedExecutiveCognitionSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  runtimeStatus: UnifiedConsensusRuntimeStatus;
  collectiveIntegrity: ConsensusIntegrityLevel;
  summary: DistributedStrategicCognitionSummary;
  activeSubsystems: readonly ConsensusSubsystemId[];
  subsystemStates: readonly ConsensusSubsystemState[];
  collectiveIntelligenceHealth: CollectiveIntelligenceHealth;
  distributedStrategicCognition: DistributedStrategicCognition;
};

export type ConsensusRuntimeHistoryEntry = {
  entryId: string;
  collectiveIntegrity: ConsensusIntegrityLevel;
  runtimeStatus: UnifiedConsensusRuntimeStatus;
  headline: string;
  generatedAt: number;
};

export type UnifiedConsensusRuntimeState = {
  cognitionSnapshots: readonly DistributedExecutiveCognitionSnapshot[];
  subsystemStates: readonly ConsensusSubsystemState[];
  runtimeHistory: readonly ConsensusRuntimeHistoryEntry[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastRuntimeStatus: UnifiedConsensusRuntimeStatus | null;
};

export type UnifiedEnterpriseConsensusRuntimeInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
  conflictResolutionSnapshot?: EnterpriseConflictResolutionSnapshot | null;
  consensusPrioritySnapshot?: EnterpriseConsensusPrioritySnapshot | null;
  collectiveGuidanceSnapshot?: CollectiveStrategicGuidanceSnapshot | null;
  counterfactualSnapshot?: CounterfactualReasoningSnapshot | null;
  diversitySnapshot?: StrategicDiversitySnapshot | null;
  collectiveLearningSnapshot?: ExecutiveCollectiveLearningSnapshot | null;
  memorySyncSnapshot?: MultiPerspectiveMemorySnapshot | null;
  distributedGovernanceSnapshot?: DistributedStrategicGovernanceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type UnifiedEnterpriseConsensusRuntimeResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: DistributedExecutiveCognitionSnapshot | null;
  activeSubsystemCount: number;
  storeSignature: string;
};
