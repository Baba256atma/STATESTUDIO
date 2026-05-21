/** D9:7:2 — Strategic perspective negotiation intelligence + enterprise cognitive conflict resolution types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type {
  PerspectiveCategory,
  StrategicConsensusSnapshot,
} from "./consensusIntelligenceTypes";

export type NegotiationCategory =
  | "governance_vs_speed"
  | "resilience_vs_growth"
  | "stability_vs_adaptability"
  | "recovery_vs_control"
  | "foresight_vs_execution"
  | "caution_vs_acceleration"
  | "continuity_vs_optimization"
  | "unknown";

export type NegotiationStrength = "weak" | "partial" | "moderate" | "strong" | "executive_grade";

export type ResolutionState =
  | "unresolved"
  | "contested"
  | "negotiating"
  | "partially_resolved"
  | "reconciled";

export type StrategicPerspectiveNegotiation = {
  negotiationId: string;
  resolutionState: ResolutionState;
  negotiationStrength: NegotiationStrength;
  negotiationCategory: NegotiationCategory;
  summary: string;
  alignedPerspectives: readonly PerspectiveCategory[];
  contestedPerspectives: readonly PerspectiveCategory[];
  negotiationSignals: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CognitiveNegotiationSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly NegotiationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type ExecutiveTradeoffResolution = {
  resolutionId: string;
  tradeoffLabel: string;
  tradeoffSummary: string;
  primaryCategory: NegotiationCategory;
  balancePosture: "low" | "moderate" | "high" | "executive_grade";
  generatedAt: number;
};

export type PerspectiveReconciliationField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  reconciliationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly NegotiationCategory[];
  generatedAt: number;
};

export type NegotiationIntelligenceSummary = {
  dominantResolutionState: ResolutionState;
  dominantNegotiationStrength: NegotiationStrength;
  negotiationHeadline: string;
  cohesionPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseConflictResolutionSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  awarenessSummary: NegotiationIntelligenceSummary;
  recentNegotiations: readonly StrategicPerspectiveNegotiation[];
  tradeoffResolutions: readonly ExecutiveTradeoffResolution[];
  negotiationSignals: readonly CognitiveNegotiationSignal[];
  reconciliationFields: readonly PerspectiveReconciliationField[];
};

export type StrategicPerspectiveNegotiationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  strategicConsensusSnapshot?: StrategicConsensusSnapshot | null;
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

export type StrategicPerspectiveNegotiationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseConflictResolutionSnapshot | null;
  newNegotiations: number;
  storeSignature: string;
};

export type PerspectiveNegotiationStoreState = {
  negotiations: readonly StrategicPerspectiveNegotiation[];
  snapshots: readonly EnterpriseConflictResolutionSnapshot[];
  tradeoffResolutions: readonly ExecutiveTradeoffResolution[];
  negotiationSignals: readonly CognitiveNegotiationSignal[];
  reconciliationFields: readonly PerspectiveReconciliationField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastResolutionState: ResolutionState | null;
};
