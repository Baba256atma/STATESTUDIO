/** D9:9:1 — Enterprise cognitive singularity foundation + unified strategic intelligence convergence types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { CivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";

export type ConvergenceCategory =
  | "operational_convergence"
  | "temporal_convergence"
  | "foresight_convergence"
  | "consensus_convergence"
  | "institutional_convergence"
  | "stewardship_convergence"
  | "resilience_convergence"
  | "unknown";

export type ConvergenceStrength = "weak" | "moderate" | "synchronized" | "unified" | "enterprise_singularity";

export type CognitionState =
  | "fragmented"
  | "partially_aligned"
  | "converging"
  | "unified"
  | "strategically_coherent";

export type IntelligenceConvergenceObservation = {
  convergenceId: string;
  cognitionState: CognitionState;
  convergenceStrength: ConvergenceStrength;
  convergenceCategory: ConvergenceCategory;
  summary: string;
  convergenceSignals: readonly string[];
  convergenceRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type StrategicIntelligenceConvergenceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ConvergenceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type UnifiedCognitionField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  coherencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly ConvergenceCategory[];
  generatedAt: number;
};

export type CrossDomainAwarenessTopology = {
  topologyId: string;
  topologyLabel: string;
  topologySummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly ConvergenceCategory[];
  generatedAt: number;
};

export type CognitiveSingularitySummary = {
  dominantCognitionState: CognitionState;
  dominantConvergenceStrength: ConvergenceStrength;
  singularityHeadline: string;
  convergencePosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseCognitiveSingularitySnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  singularitySummary: CognitiveSingularitySummary;
  recentObservations: readonly IntelligenceConvergenceObservation[];
  convergenceSignals: readonly StrategicIntelligenceConvergenceSignal[];
  cognitionFields: readonly UnifiedCognitionField[];
  awarenessTopologies: readonly CrossDomainAwarenessTopology[];
};

export type EnterpriseCognitiveSingularityInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  unifiedInstitutionalConsciousnessSnapshot?: CivilizationScaleEnterpriseSnapshot | null;
  unifiedConsensusSnapshot?: DistributedExecutiveCognitionSnapshot | null;
  unifiedSelfReflectiveSnapshot?: EnterpriseSelfReflectiveSnapshot | null;
  memorySnapshot?: EnterpriseMemoryCognitionSnapshot | null;
  temporalSnapshot?: EnterpriseTimeIntelligenceSnapshot | null;
  foresightSnapshot?: EnterpriseAnticipatorySnapshot | null;
  decisionSnapshot?: EnterpriseStrategicActionSnapshot | null;
  enterpriseNarrativeLine?: string;
  resilienceForecastLine?: string;
  operationalTopologyStressed?: boolean;
  fragilityElevated?: boolean;
  continuityPreserved?: boolean;
  cognitionConverged?: boolean;
  now?: number;
};

export type EnterpriseCognitiveSingularityResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseCognitiveSingularitySnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type CognitiveSingularityStoreState = {
  observations: readonly IntelligenceConvergenceObservation[];
  snapshots: readonly EnterpriseCognitiveSingularitySnapshot[];
  convergenceSignals: readonly StrategicIntelligenceConvergenceSignal[];
  cognitionFields: readonly UnifiedCognitionField[];
  awarenessTopologies: readonly CrossDomainAwarenessTopology[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastCognitionState: CognitionState | null;
};
