/** D9:5:7 — Executive institutional alignment + enterprise governance-coherence decision types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { DependencyAwarenessSnapshot } from "./actionDependencyTypes";
import type { DecisionCoordinationSnapshot } from "./decisionOrchestrationTypes";
import type { ConfidenceArbitrationSnapshot } from "./decisionConfidenceTypes";
import type { MultiObjectiveDecisionSnapshot } from "./priorityArbitrationTypes";
import type { ScenarioCoordinationSnapshot } from "./scenarioCoordinationTypes";
import type { AdaptiveSequencingSnapshot } from "./adaptiveSequencingTypes";

export type AlignmentCategory =
  | "governance"
  | "resilience"
  | "operational_continuity"
  | "organizational_integrity"
  | "strategic_consistency"
  | "coordination_coherence"
  | "recovery_sustainability"
  | "executive_alignment"
  | "unknown";

export type AlignmentStrength = "weak" | "moderate" | "strong" | "institutional_grade";

export type CoherenceState =
  | "fragmented"
  | "conflicting"
  | "stabilizing"
  | "coherent"
  | "institutionally_aligned";

export type InstitutionalAlignmentSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly AlignmentCategory[];
  coherenceState: CoherenceState;
  alignmentStrength: AlignmentStrength;
  confidence: number;
  generatedAt: number;
};

export type StrategicConsistencyIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  consistencySummary: string;
  linkedCategories: readonly AlignmentCategory[];
  consistencyLevel: "low" | "moderate" | "high";
  generatedAt: number;
};

export type OrganizationalIntegrityField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  integrityLevel: "low" | "moderate" | "high";
  linkedCategories: readonly AlignmentCategory[];
  generatedAt: number;
};

export type EnterprisePolicyAlignment = {
  alignmentId: string;
  coherenceState: CoherenceState;
  alignmentStrength: AlignmentStrength;
  alignmentCategory: AlignmentCategory;
  summary: string;
  alignmentSignals: readonly string[];
  coherenceRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type InstitutionalAlignmentSummary = {
  dominantCoherenceState: CoherenceState;
  dominantAlignmentStrength: AlignmentStrength;
  alignmentHeadline: string;
  coherencePosture: "low" | "moderate" | "high" | "institutional_grade";
};

export type GovernanceCoherenceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  alignmentCount: number;
  alignmentSummary: InstitutionalAlignmentSummary;
  recentPolicyAlignments: readonly EnterprisePolicyAlignment[];
  alignmentSignals: readonly InstitutionalAlignmentSignal[];
  consistencyIndicators: readonly StrategicConsistencyIndicator[];
  integrityFields: readonly OrganizationalIntegrityField[];
};

export type InstitutionalAlignmentIntelligenceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  coordinationSnapshot?: DecisionCoordinationSnapshot | null;
  dependencySnapshot?: DependencyAwarenessSnapshot | null;
  arbitrationSnapshot?: MultiObjectiveDecisionSnapshot | null;
  scenarioSnapshot?: ScenarioCoordinationSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  anticipatorySnapshot?: EnterpriseAnticipatorySnapshot | null;
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

export type InstitutionalAlignmentIntelligenceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: GovernanceCoherenceSnapshot | null;
  newPolicyAlignments: number;
  storeSignature: string;
};

export type InstitutionalAlignmentStoreState = {
  policyAlignments: readonly EnterprisePolicyAlignment[];
  snapshots: readonly GovernanceCoherenceSnapshot[];
  alignmentSignals: readonly InstitutionalAlignmentSignal[];
  consistencyIndicators: readonly StrategicConsistencyIndicator[];
  integrityFields: readonly OrganizationalIntegrityField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
