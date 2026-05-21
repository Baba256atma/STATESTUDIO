/** D9:4:9 — Enterprise strategic consensus + multi-perspective advisory intelligence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { InstitutionalIntelligenceMaturitySnapshot } from "../institutional-memory/institutionalMaturityTypes";
import type { InstitutionalLearningSnapshot } from "../institutional-memory/institutionalMemoryTypes";
import type { EnterpriseRecommendationSnapshot } from "./advisoryForesightTypes";
import type { EnterprisePreparednessSnapshot } from "./preparednessCognitionTypes";
import type { InterventionWindowSnapshot } from "./interventionTimingTypes";
import type { StressSimulationSnapshot } from "./stressSimulationTypes";
import type { PositiveTrajectorySnapshot } from "./positiveDriftTypes";
import type { EnterpriseEarlyWarningSnapshot } from "./earlyWarningTypes";
import type { RiskConstellationSnapshot } from "./riskConstellationTypes";
import type { EnterpriseForesightSnapshot } from "./foresightCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

export type PerspectiveCategory =
  | "risk_constellation"
  | "early_warning"
  | "positive_drift"
  | "stress_simulation"
  | "intervention_timing"
  | "preparedness"
  | "advisory_recommendation"
  | "institutional_memory"
  | "temporal_cognition"
  | "unknown";

export type ConsensusState = "aligned" | "partially_aligned" | "conflicted" | "fragmented" | "inconclusive";

export type ConsensusStrength = "weak" | "moderate" | "strong" | "executive_grade";

export type ConsensusConfidenceLevel = "low" | "moderate" | "high" | "verified";

export type ThematicFocus =
  | "governance_stabilization"
  | "escalation_prevention"
  | "resilience_reinforcement"
  | "pressure_reduction"
  | "coordination_alignment"
  | "recovery_acceleration"
  | "opportunity_growth"
  | "operational_focus"
  | "unknown";

export type MultiPerspectiveRecommendation = {
  consensusId: string;
  thematicFocus: ThematicFocus;
  consensusState: ConsensusState;
  consensusStrength: ConsensusStrength;
  summary: string;
  supportingPerspectives: readonly PerspectiveCategory[];
  disagreements: readonly PerspectiveCategory[];
  confidence: number;
  confidenceLevel: ConsensusConfidenceLevel;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type AdvisoryPerspectiveSignal = {
  signalId: string;
  perspective: PerspectiveCategory;
  thematicFocus: ThematicFocus;
  perspectiveSummary: string;
  stance: "risk_escalation" | "opportunity_growth" | "stabilization" | "neutral";
  confidence: number;
  generatedAt: number;
};

export type ConsensusAlignmentScore = {
  scoreId: string;
  thematicFocus: ThematicFocus;
  alignmentScore: number;
  supportingCount: number;
  dissentingCount: number;
  consensusState: ConsensusState;
  generatedAt: number;
};

export type StrategicDisagreementSignal = {
  disagreementId: string;
  thematicFocus: ThematicFocus;
  perspectiveA: PerspectiveCategory;
  perspectiveB: PerspectiveCategory;
  disagreementSummary: string;
  tensionLevel: "moderate" | "elevated" | "critical";
  generatedAt: number;
};

export type ConsensusAwarenessSummary = {
  dominantThematicFocus: ThematicFocus;
  dominantConsensusState: ConsensusState;
  dominantConsensusStrength: ConsensusStrength;
  consensusHeadline: string;
  advisoryIntegrity: "low" | "moderate" | "strong" | "executive_grade";
};

export type StrategicConsensusSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  consensusCount: number;
  awarenessSummary: ConsensusAwarenessSummary;
  recentMultiPerspectiveRecommendations: readonly MultiPerspectiveRecommendation[];
  perspectiveSignals: readonly AdvisoryPerspectiveSignal[];
  alignmentScores: readonly ConsensusAlignmentScore[];
  disagreementSignals: readonly StrategicDisagreementSignal[];
};

export type ExecutiveConsensusForesightInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  advisorySnapshot?: EnterpriseRecommendationSnapshot | null;
  preparednessSnapshot?: EnterprisePreparednessSnapshot | null;
  interventionSnapshot?: InterventionWindowSnapshot | null;
  stressSnapshot?: StressSimulationSnapshot | null;
  earlyWarningSnapshot?: EnterpriseEarlyWarningSnapshot | null;
  positiveDriftSnapshot?: PositiveTrajectorySnapshot | null;
  constellationSnapshot?: RiskConstellationSnapshot | null;
  foresightSnapshot?: EnterpriseForesightSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  memorySnapshot?: InstitutionalLearningSnapshot | null;
  maturitySnapshot?: InstitutionalIntelligenceMaturitySnapshot | null;
  enterpriseNarrativeLine?: string;
  now?: number;
};

export type ExecutiveConsensusForesightResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: StrategicConsensusSnapshot | null;
  newMultiPerspectiveRecommendations: number;
  storeSignature: string;
};

export type ConsensusForesightStoreState = {
  multiPerspectiveRecommendations: readonly MultiPerspectiveRecommendation[];
  snapshots: readonly StrategicConsensusSnapshot[];
  perspectiveSignals: readonly AdvisoryPerspectiveSignal[];
  alignmentScores: readonly ConsensusAlignmentScore[];
  disagreementSignals: readonly StrategicDisagreementSignal[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
};
