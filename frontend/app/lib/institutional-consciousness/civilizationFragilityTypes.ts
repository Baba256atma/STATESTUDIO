/** D9:8:3 — Strategic civilization fragility propagation + macro-systemic resilience awareness types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { EcosystemSynchronizationSnapshot } from "./ecosystemSynchronizationTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";

export type FragilityCategory =
  | "infrastructure_fragility"
  | "governance_fragility"
  | "logistics_fragility"
  | "workforce_fragility"
  | "financial_fragility"
  | "communication_fragility"
  | "energy_fragility"
  | "unknown";

export type PropagationStrength = "weak" | "moderate" | "strong" | "systemic" | "civilization_scale";

export type ResilienceState =
  | "unstable"
  | "pressured"
  | "adaptive"
  | "resilient"
  | "macro_stabilized";

export type CascadingInstabilityObservation = {
  fragilityId: string;
  resilienceState: ResilienceState;
  propagationStrength: PropagationStrength;
  fragilityCategory: FragilityCategory;
  summary: string;
  propagationSignals: readonly string[];
  resilienceRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type MacroResilienceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly FragilityCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type FragilityPropagationField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  propagationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly FragilityCategory[];
  generatedAt: number;
};

export type SystemicResilienceTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  resiliencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly FragilityCategory[];
  generatedAt: number;
};

export type CivilizationResilienceSummary = {
  dominantResilienceState: ResilienceState;
  dominantPropagationStrength: PropagationStrength;
  resilienceHeadline: string;
  fragilityPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type CivilizationFragilitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  resilienceSummary: CivilizationResilienceSummary;
  recentObservations: readonly CascadingInstabilityObservation[];
  resilienceSignals: readonly MacroResilienceSignal[];
  propagationFields: readonly FragilityPropagationField[];
  resilienceTopologies: readonly SystemicResilienceTopology[];
};

export type CivilizationFragilityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type CivilizationFragilityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: CivilizationFragilitySnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CivilizationFragilityStoreState = {
  observations: readonly CascadingInstabilityObservation[];
  snapshots: readonly CivilizationFragilitySnapshot[];
  resilienceSignals: readonly MacroResilienceSignal[];
  propagationFields: readonly FragilityPropagationField[];
  resilienceTopologies: readonly SystemicResilienceTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastResilienceState: ResilienceState | null;
};
