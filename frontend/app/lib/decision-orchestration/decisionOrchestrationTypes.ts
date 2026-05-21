/** D9:5:1 — Executive action readiness + strategic decision orchestration foundation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseRecommendationSnapshot } from "../foresight-cognition/advisoryForesightTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

export type ActionCategory =
  | "escalation_prevention"
  | "resilience_reinforcement"
  | "governance_alignment"
  | "coordination_stabilization"
  | "pressure_reduction"
  | "recovery_acceleration"
  | "operational_realignment"
  | "strategic_focus"
  | "unknown";

export type ActionPriority = "informational" | "moderate" | "elevated" | "critical";

export type ReadinessState = "identified" | "organizing" | "sequencing" | "coordinated" | "ready";

export type ReadinessConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type ExecutiveActionCandidate = {
  candidateId: string;
  category: ActionCategory;
  actionPriority: ActionPriority;
  readinessState: ReadinessState;
  actionLabel: string;
  actionSummary: string;
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type OrganizationalResponseDependency = {
  dependencyId: string;
  prerequisiteCategory: ActionCategory;
  dependentCategory: ActionCategory;
  dependencySummary: string;
  sensitivity: "low" | "moderate" | "elevated";
  generatedAt: number;
};

export type OperationalResponseSequence = {
  sequenceId: string;
  sequenceLabel: string;
  actionSequence: readonly ActionCategory[];
  readinessState: ReadinessState;
  actionPriority: ActionPriority;
  sequenceSummary: string;
  linkedOrchestrationId: string;
  generatedAt: number;
};

export type StrategicDecisionOrchestration = {
  orchestrationId: string;
  readinessState: ReadinessState;
  actionPriority: ActionPriority;
  summary: string;
  actionSequence: readonly ActionCategory[];
  dependencies: readonly string[];
  confidence: number;
  confidenceLevel: ReadinessConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type ActionReadinessSignal = {
  signalId: string;
  category: ActionCategory;
  signalLabel: string;
  signalSummary: string;
  readinessState: ReadinessState;
  actionPriority: ActionPriority;
  confidence: number;
  generatedAt: number;
};

export type OrchestrationAwarenessSummary = {
  dominantCategory: ActionCategory;
  dominantReadinessState: ReadinessState;
  dominantActionPriority: ActionPriority;
  orchestrationHeadline: string;
  coordinationStability: "low" | "moderate" | "strong" | "executive_grade";
};

export type DecisionCoordinationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  orchestrationCount: number;
  awarenessSummary: OrchestrationAwarenessSummary;
  recentStrategicOrchestrations: readonly StrategicDecisionOrchestration[];
  actionReadinessSignals: readonly ActionReadinessSignal[];
  responseSequences: readonly OperationalResponseSequence[];
  responseDependencies: readonly OrganizationalResponseDependency[];
};

export type ExecutiveDecisionOrchestrationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
  advisorySnapshot?: EnterpriseRecommendationSnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type ExecutiveDecisionOrchestrationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: DecisionCoordinationSnapshot | null;
  newStrategicOrchestrations: number;
  storeSignature: string;
};

export type DecisionOrchestrationStoreState = {
  strategicOrchestrations: readonly StrategicDecisionOrchestration[];
  snapshots: readonly DecisionCoordinationSnapshot[];
  actionCandidates: readonly ExecutiveActionCandidate[];
  actionReadinessSignals: readonly ActionReadinessSignal[];
  responseSequences: readonly OperationalResponseSequence[];
  responseDependencies: readonly OrganizationalResponseDependency[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
