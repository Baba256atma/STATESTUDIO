/** D9:4:8 — Strategic executive advisory foresight + enterprise guidance recommendation types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { InterventionWindowSnapshot } from "./interventionTimingTypes";
import type { EnterprisePreparednessSnapshot } from "./preparednessCognitionTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { StrategicAlignmentSnapshot } from "../temporal-cognition/temporalConvergenceTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { TemporalDriftSnapshot } from "../temporal-cognition/temporalDriftProjectionTypes";

export type RecommendationCategory =
  | "escalation_prevention"
  | "resilience_reinforcement"
  | "governance_alignment"
  | "coordination_stabilization"
  | "pressure_reduction"
  | "recovery_acceleration"
  | "operational_focus"
  | "strategic_realignment"
  | "unknown";

export type RecommendationPriority = "informational" | "moderate" | "elevated" | "critical";

export type AdvisoryState = "emerging" | "relevant" | "actionable" | "urgent" | "stabilizing";

export type GuidanceConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type ExecutiveGuidanceRecommendation = {
  advisoryId: string;
  category: RecommendationCategory;
  recommendationPriority: RecommendationPriority;
  advisoryState: AdvisoryState;
  summary: string;
  recommendations: readonly string[];
  confidence: number;
  confidenceLevel: GuidanceConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicAdvisorySignal = {
  signalId: string;
  category: RecommendationCategory;
  signalLabel: string;
  signalSummary: string;
  recommendationPriority: RecommendationPriority;
  advisoryState: AdvisoryState;
  confidence: number;
  generatedAt: number;
};

export type OrganizationalFocusSuggestion = {
  suggestionId: string;
  category: RecommendationCategory;
  focusLabel: string;
  focusSummary: string;
  linkedAdvisoryIds: readonly string[];
  recommendationPriority: RecommendationPriority;
  generatedAt: number;
};

export type AdvisoryPriorityField = {
  fieldId: string;
  category: RecommendationCategory;
  fieldLabel: string;
  prioritySummary: string;
  recommendations: readonly string[];
  advisoryState: AdvisoryState;
  generatedAt: number;
};

export type AdvisoryAwarenessSummary = {
  dominantCategory: RecommendationCategory;
  dominantRecommendationPriority: RecommendationPriority;
  dominantAdvisoryState: AdvisoryState;
  advisoryHeadline: string;
  guidanceUrgency: "low" | "moderate" | "elevated" | "critical";
};

export type EnterpriseRecommendationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  recommendationCount: number;
  awarenessSummary: AdvisoryAwarenessSummary;
  recentExecutiveGuidanceRecommendations: readonly ExecutiveGuidanceRecommendation[];
  strategicAdvisorySignals: readonly StrategicAdvisorySignal[];
  organizationalFocusSuggestions: readonly OrganizationalFocusSuggestion[];
  advisoryPriorityFields: readonly AdvisoryPriorityField[];
};

export type ExecutiveAdvisoryForesightInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  stressSnapshot?: StressSimulationSnapshot | null;
  earlyWarningSnapshot?: EnterpriseEarlyWarningSnapshot | null;
  positiveDriftSnapshot?: PositiveTrajectorySnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  constellationSnapshot?: RiskConstellationSnapshot | null;
  convergenceSnapshot?: StrategicAlignmentSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  driftSnapshot?: TemporalDriftSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  pressureTopologyStressed?: boolean;
  now?: number;
};

export type ExecutiveAdvisoryForesightResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseRecommendationSnapshot | null;
  newExecutiveGuidanceRecommendations: number;
  storeSignature: string;
};

export type AdvisoryForesightStoreState = {
  executiveGuidanceRecommendations: readonly ExecutiveGuidanceRecommendation[];
  snapshots: readonly EnterpriseRecommendationSnapshot[];
  strategicAdvisorySignals: readonly StrategicAdvisorySignal[];
  organizationalFocusSuggestions: readonly OrganizationalFocusSuggestion[];
  advisoryPriorityFields: readonly AdvisoryPriorityField[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
