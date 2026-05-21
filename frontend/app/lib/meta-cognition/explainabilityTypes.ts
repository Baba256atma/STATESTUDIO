/** D9:6:5 — Executive cognitive explainability + enterprise transparent reasoning types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { ConfidenceArbitrationSnapshot } from "../decision-orchestration/decisionConfidenceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { AdaptiveSequencingSnapshot } from "../decision-orchestration/adaptiveSequencingTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { ExecutiveCognitiveDriftSnapshot } from "./cognitiveDriftTypes";
import type { ExecutiveCognitiveUncertaintySnapshot } from "./cognitiveUncertaintyTypes";
import type { MetaCognitionRuntimeSnapshot } from "./metaCognitionTypes";
import type { StrategicReasoningIntegritySnapshot } from "./reasoningIntegrityTypes";

export type ExplanationCategory =
  | "escalation_analysis"
  | "resilience_reasoning"
  | "governance_alignment"
  | "orchestration_pathway"
  | "intervention_projection"
  | "preparedness_reasoning"
  | "foresight_alignment"
  | "confidence_arbitration"
  | "unknown";

export type ExplanationStrength = "weak" | "moderate" | "strong" | "executive_grade";

export type TransparencyState =
  | "partial"
  | "traceable"
  | "coherent"
  | "explainable"
  | "fully_transparent";

export type ExecutiveReasoningTrace = {
  explainabilityId: string;
  transparencyState: TransparencyState;
  explanationStrength: ExplanationStrength;
  explanationCategory: ExplanationCategory;
  summary: string;
  reasoningPathways: readonly string[];
  uncertaintyFactors: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type TransparentReasoningSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ExplanationCategory[];
  signalStrength: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EnterpriseCognitionPathway = {
  pathwayId: string;
  pathwayLabel: string;
  pathwaySummary: string;
  sourceRuntime: string;
  targetRuntime: string;
  pathwayStrength: ExplanationStrength;
  generatedAt: number;
};

export type ExplanationConfidenceField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  confidencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly ExplanationCategory[];
  generatedAt: number;
};

export type ExplainabilitySummary = {
  dominantTransparencyState: TransparencyState;
  dominantExplanationStrength: ExplanationStrength;
  explainabilityHeadline: string;
  auditabilityPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type StrategicExplanationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  traceCount: number;
  awarenessSummary: ExplainabilitySummary;
  recentReasoningTraces: readonly ExecutiveReasoningTrace[];
  transparentReasoningSignals: readonly TransparentReasoningSignal[];
  cognitionPathways: readonly EnterpriseCognitionPathway[];
  explanationConfidenceFields: readonly ExplanationConfidenceField[];
};

export type ExecutiveExplainabilityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  metaCognitionSnapshot?: MetaCognitionRuntimeSnapshot | null;
  reasoningIntegritySnapshot?: StrategicReasoningIntegritySnapshot | null;
  cognitiveDriftSnapshot?: ExecutiveCognitiveDriftSnapshot | null;
  cognitiveUncertaintySnapshot?: ExecutiveCognitiveUncertaintySnapshot | null;
  confidenceSnapshot?: ConfidenceArbitrationSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  sequencingSnapshot?: AdaptiveSequencingSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type ExecutiveExplainabilityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StrategicExplanationSnapshot | null;
  newReasoningTraces: number;
  storeSignature: string;
};

export type ExplainabilityStoreState = {
  reasoningTraces: readonly ExecutiveReasoningTrace[];
  snapshots: readonly StrategicExplanationSnapshot[];
  transparentReasoningSignals: readonly TransparentReasoningSignal[];
  cognitionPathways: readonly EnterpriseCognitionPathway[];
  explanationConfidenceFields: readonly ExplanationConfidenceField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastTransparencyState: TransparencyState | null;
};
