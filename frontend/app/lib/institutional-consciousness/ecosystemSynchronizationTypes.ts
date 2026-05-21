/** D9:8:2 — Strategic institutional ecosystem synchronization + civilization-scale interdependency types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { GovernanceCoherenceSnapshot } from "../decision-orchestration/institutionalAlignmentTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { InstitutionalLearningGovernanceAggregateSnapshot } from "../institutional-memory/institutionalGovernanceTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { InstitutionalConsciousnessSnapshot } from "./institutionalConsciousnessTypes";

export type SynchronizationCategory =
  | "infrastructure_synchronization"
  | "governance_synchronization"
  | "logistics_synchronization"
  | "workforce_synchronization"
  | "financial_synchronization"
  | "resilience_synchronization"
  | "fragility_synchronization"
  | "unknown";

export type SynchronizationStrength = "weak" | "moderate" | "strong" | "systemic" | "civilization_scale";

export type CoordinationState =
  | "disconnected"
  | "partially_connected"
  | "synchronized"
  | "systemically_integrated"
  | "civilization_coherent";

export type OperationalSynchronizationObservation = {
  synchronizationId: string;
  coordinationState: CoordinationState;
  synchronizationStrength: SynchronizationStrength;
  synchronizationCategory: SynchronizationCategory;
  summary: string;
  synchronizationSignals: readonly string[];
  ecosystemRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type InstitutionalInterdependencySignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly SynchronizationCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type CivilizationScaleCoordinationField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  coordinationPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly SynchronizationCategory[];
  generatedAt: number;
};

export type MacroDependencyTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  dependencyPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly SynchronizationCategory[];
  generatedAt: number;
};

export type EcosystemSynchronizationSummary = {
  dominantCoordinationState: CoordinationState;
  dominantSynchronizationStrength: SynchronizationStrength;
  synchronizationHeadline: string;
  interdependencyPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EcosystemSynchronizationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  synchronizationSummary: EcosystemSynchronizationSummary;
  recentObservations: readonly OperationalSynchronizationObservation[];
  interdependencySignals: readonly InstitutionalInterdependencySignal[];
  coordinationFields: readonly CivilizationScaleCoordinationField[];
  dependencyTopologies: readonly MacroDependencyTopology[];
};

export type EcosystemSynchronizationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
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

export type EcosystemSynchronizationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EcosystemSynchronizationSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type EcosystemSynchronizationStoreState = {
  observations: readonly OperationalSynchronizationObservation[];
  snapshots: readonly EcosystemSynchronizationSnapshot[];
  interdependencySignals: readonly InstitutionalInterdependencySignal[];
  coordinationFields: readonly CivilizationScaleCoordinationField[];
  dependencyTopologies: readonly MacroDependencyTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastCoordinationState: CoordinationState | null;
};
