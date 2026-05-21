/** D9:8:8 — Strategic civilization wisdom + macro-institutional learning-convergence awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { CivilizationAdaptationSnapshot } from "./civilizationAdaptationTypes";
import type { CivilizationContinuitySnapshot } from "./civilizationContinuityTypes";
import type { CivilizationCoordinationSnapshot } from "./civilizationCoordinationTypes";
import type { CivilizationFragilitySnapshot } from "./civilizationFragilityTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";
import type { InstitutionalInfluenceSnapshot } from "./institutionalInfluenceTypes";

export type WisdomCategory =
  | "resilience_wisdom"
  | "governance_wisdom"
  | "infrastructure_wisdom"
  | "ecosystem_wisdom"
  | "operational_wisdom"
  | "continuity_wisdom"
  | "sustainability_wisdom"
  | "unknown";

export type WisdomStrength = "weak" | "moderate" | "mature" | "systemic" | "civilization_scale";

export type LearningConvergenceState =
  | "fragmented"
  | "emerging"
  | "adaptive"
  | "converging"
  | "wisdom_stabilized";

export type LongHorizonWisdomObservation = {
  wisdomId: string;
  convergenceState: LearningConvergenceState;
  wisdomStrength: WisdomStrength;
  wisdomCategory: WisdomCategory;
  summary: string;
  wisdomSignals: readonly string[];
  wisdomRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type InstitutionalLearningConvergenceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly WisdomCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type MacroWisdomField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  wisdomPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly WisdomCategory[];
  generatedAt: number;
};

export type StrategicExperienceTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  experiencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly WisdomCategory[];
  generatedAt: number;
};

export type CivilizationWisdomSummary = {
  dominantConvergenceState: LearningConvergenceState;
  dominantWisdomStrength: WisdomStrength;
  wisdomHeadline: string;
  learningPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CivilizationWisdomSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  wisdomSummary: CivilizationWisdomSummary;
  recentObservations: readonly LongHorizonWisdomObservation[];
  convergenceSignals: readonly InstitutionalLearningConvergenceSignal[];
  wisdomFields: readonly MacroWisdomField[];
  experienceTopologies: readonly StrategicExperienceTopology[];
};

export type CivilizationWisdomInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  civilizationCoordinationSnapshot?: CivilizationCoordinationSnapshot | null;
  civilizationAdaptationSnapshot?: CivilizationAdaptationSnapshot | null;
  civilizationContinuitySnapshot?: CivilizationContinuitySnapshot | null;
  institutionalInfluenceSnapshot?: InstitutionalInfluenceSnapshot | null;
  civilizationFragilitySnapshot?: CivilizationFragilitySnapshot | null;
  ecosystemSynchronizationSnapshot?: EcosystemSynchronizationSnapshot | null;
  institutionalConsciousnessSnapshot?: InstitutionalConsciousnessSnapshot | null;
  unifiedConsensusSnapshot?: DistributedExecutiveCognitionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  governanceCoherenceSnapshot?: GovernanceCoherenceSnapshot | null;
  governanceSnapshot?: InstitutionalLearningGovernanceAggregateSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  operationalTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  now?: number;
};

export type CivilizationWisdomResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationWisdomSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CivilizationWisdomStoreState = {
  observations: readonly LongHorizonWisdomObservation[];
  snapshots: readonly CivilizationWisdomSnapshot[];
  convergenceSignals: readonly InstitutionalLearningConvergenceSignal[];
  wisdomFields: readonly MacroWisdomField[];
  experienceTopologies: readonly StrategicExperienceTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastConvergenceState: LearningConvergenceState | null;
};
