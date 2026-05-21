/** D9:8:6 — Strategic civilization adaptation + macro-system evolution awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { CivilizationContinuitySnapshot } from "./civilizationContinuityTypes";
import type { CivilizationFragilitySnapshot } from "./civilizationFragilityTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";
import type { InstitutionalInfluenceSnapshot } from "./institutionalInfluenceTypes";

export type AdaptationCategory =
  | "infrastructure_adaptation"
  | "governance_adaptation"
  | "workforce_adaptation"
  | "logistics_adaptation"
  | "resilience_adaptation"
  | "ecosystem_reorganization"
  | "operational_evolution"
  | "unknown";

export type AdaptationStrength = "weak" | "moderate" | "adaptive" | "systemic" | "civilization_scale";

export type EvolutionState =
  | "static"
  | "shifting"
  | "adaptive"
  | "reorganizing"
  | "evolutionarily_stable";

export type LongHorizonEvolutionObservation = {
  adaptationId: string;
  evolutionState: EvolutionState;
  adaptationStrength: AdaptationStrength;
  adaptationCategory: AdaptationCategory;
  summary: string;
  adaptationSignals: readonly string[];
  evolutionRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type MacroEvolutionSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly AdaptationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type EcosystemTransformationField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  transformationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly AdaptationCategory[];
  generatedAt: number;
};

export type SystemicAdaptationTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  adaptationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly AdaptationCategory[];
  generatedAt: number;
};

export type CivilizationAdaptationSummary = {
  dominantEvolutionState: EvolutionState;
  dominantAdaptationStrength: AdaptationStrength;
  adaptationHeadline: string;
  evolutionPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CivilizationAdaptationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  adaptationSummary: CivilizationAdaptationSummary;
  recentObservations: readonly LongHorizonEvolutionObservation[];
  evolutionSignals: readonly MacroEvolutionSignal[];
  transformationFields: readonly EcosystemTransformationField[];
  adaptationTopologies: readonly SystemicAdaptationTopology[];
};

export type CivilizationAdaptationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type CivilizationAdaptationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationAdaptationSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CivilizationAdaptationStoreState = {
  observations: readonly LongHorizonEvolutionObservation[];
  snapshots: readonly CivilizationAdaptationSnapshot[];
  evolutionSignals: readonly MacroEvolutionSignal[];
  transformationFields: readonly EcosystemTransformationField[];
  adaptationTopologies: readonly SystemicAdaptationTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastEvolutionState: EvolutionState | null;
};
