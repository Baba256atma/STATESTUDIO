/** D9:5:5 — Executive adaptive decision sequencing + enterprise dynamic response evolution types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterprisePreparednessSnapshot } from "../foresight-cognition/preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "../foresight-cognition/interventionTimingTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { OrganizationalReplaySnapshot } from "../temporal-cognition/operationalReplayTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { ActionCategory } from "./decisionOrchestrationTypes";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";

export type AdaptationCategory =
  | "escalation_shift"
  | "resilience_reprioritization"
  | "governance_transition"
  | "coordination_realignment"
  | "recovery_resequencing"
  | "pressure_response_shift"
  | "stabilization_reordering"
  | "unknown";

export type AdaptationStrength = "weak" | "moderate" | "strong" | "systemic";

export type SequencingState = "static" | "evolving" | "adaptive" | "unstable" | "stabilized";

export type SequencingConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type SequencingTransition = {
  previous: ActionCategory;
  current: ActionCategory;
};

export type EnterpriseResponseTransition = {
  transitionId: string;
  adaptationCategory: AdaptationCategory;
  transitionSummary: string;
  sequencingTransitions: readonly SequencingTransition[];
  transitionSensitivity: "low" | "moderate" | "elevated";
  generatedAt: number;
};

export type OperationalPriorityShift = {
  shiftId: string;
  adaptationCategory: AdaptationCategory;
  previousPriority: ActionCategory;
  currentPriority: ActionCategory;
  shiftSummary: string;
  shiftIntensity: "low" | "moderate" | "high";
  generatedAt: number;
};

export type SequencingAdaptationSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ActionCategory[];
  adaptationStrength: AdaptationStrength;
  confidence: number;
  generatedAt: number;
};

export type AdaptiveDecisionSequence = {
  adaptiveSequenceId: string;
  sequencingState: SequencingState;
  adaptationStrength: AdaptationStrength;
  adaptationCategory: AdaptationCategory;
  summary: string;
  sequencingTransitions: readonly SequencingTransition[];
  adaptationSignals: readonly string[];
  confidence: number;
  confidenceLevel: SequencingConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type DynamicResponseEvolution = {
  evolutionId: string;
  sequencingState: SequencingState;
  adaptationStrength: AdaptationStrength;
  evolutionSummary: string;
  linkedSequences: readonly string[];
  evolutionConsistency: "low" | "moderate" | "high";
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type SequencingAwarenessSummary = {
  dominantSequencingState: SequencingState;
  dominantAdaptationStrength: AdaptationStrength;
  sequencingHeadline: string;
  adaptationPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type AdaptiveSequencingSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  sequenceCount: number;
  awarenessSummary: SequencingAwarenessSummary;
  recentAdaptiveSequences: readonly AdaptiveDecisionSequence[];
  responseEvolutions: readonly DynamicResponseEvolution[];
  responseTransitions: readonly EnterpriseResponseTransition[];
  priorityShifts: readonly OperationalPriorityShift[];
  adaptationSignals: readonly SequencingAdaptationSignal[];
};

export type AdaptiveDecisionSequencingInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  arbitrationSnapshot?: MultiObjectiveDecisionSnapshot | null;
  scenarioSnapshot?: ScenarioCoordinationSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  replaySnapshot?: OrganizationalReplaySnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type AdaptiveDecisionSequencingResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: AdaptiveSequencingSnapshot | null;
  newAdaptiveSequences: number;
  storeSignature: string;
};

export type AdaptiveSequencingStoreState = {
  adaptiveSequences: readonly AdaptiveDecisionSequence[];
  snapshots: readonly AdaptiveSequencingSnapshot[];
  responseEvolutions: readonly DynamicResponseEvolution[];
  responseTransitions: readonly EnterpriseResponseTransition[];
  priorityShifts: readonly OperationalPriorityShift[];
  adaptationSignals: readonly SequencingAdaptationSignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
