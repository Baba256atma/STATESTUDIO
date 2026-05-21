/** D9:9:2 — Strategic enterprise awareness synchronization + unified cross-domain operational cognition types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { CivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { EnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularityTypes";

export type AwarenessDomain =
  | "operational"
  | "institutional_memory"
  | "temporal"
  | "foresight"
  | "decision_orchestration"
  | "meta_cognition"
  | "consensus"
  | "institutional_consciousness"
  | "unknown";

export type SynchronizationStrength =
  | "weak"
  | "moderate"
  | "synchronized"
  | "unified"
  | "enterprise_grade";

export type AwarenessState =
  | "fragmented"
  | "partially_aligned"
  | "synchronized"
  | "unified"
  | "strategically_coherent";

export type AwarenessSynchronizationObservation = {
  synchronizationId: string;
  awarenessState: AwarenessState;
  synchronizationStrength: SynchronizationStrength;
  awarenessDomain: AwarenessDomain;
  summary: string;
  synchronizedDomains: readonly string[];
  fragmentationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CrossDomainAwarenessSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedDomains: readonly AwarenessDomain[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type UnifiedOperationalCognitionField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedDomains: readonly AwarenessDomain[];
  generatedAt: number;
};

export type StrategicAwarenessAlignment = {
  alignmentId: string;
  alignmentLabel: string;
  alignmentSummary: string;
  coherencePosture: "low" | "moderate" | "high" | "executive_grade";
  linkedDomains: readonly AwarenessDomain[];
  generatedAt: number;
};

export type AwarenessFragmentationIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  driftSeverity: "low" | "moderate" | "high";
  linkedDomains: readonly AwarenessDomain[];
  generatedAt: number;
};

export type SynchronizationSummary = {
  dominantAwarenessState: AwarenessState;
  dominantSynchronizationStrength: SynchronizationStrength;
  synchronizationHeadline: string;
  alignmentPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseAwarenessSynchronizationSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  synchronizationSummary: SynchronizationSummary;
  recentObservations: readonly AwarenessSynchronizationObservation[];
  awarenessSignals: readonly CrossDomainAwarenessSignal[];
  operationalCognitionFields: readonly UnifiedOperationalCognitionField[];
  awarenessAlignments: readonly StrategicAwarenessAlignment[];
  fragmentationIndicators: readonly AwarenessFragmentationIndicator[];
};

export type EnterpriseAwarenessSynchronizationInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  cognitiveSingularitySnapshot?: EnterpriseCognitiveSingularitySnapshot | null;
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

export type EnterpriseAwarenessSynchronizationResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseAwarenessSynchronizationSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type AwarenessSynchronizationStoreState = {
  observations: readonly AwarenessSynchronizationObservation[];
  snapshots: readonly EnterpriseAwarenessSynchronizationSnapshot[];
  awarenessSignals: readonly CrossDomainAwarenessSignal[];
  operationalCognitionFields: readonly UnifiedOperationalCognitionField[];
  awarenessAlignments: readonly StrategicAwarenessAlignment[];
  fragmentationIndicators: readonly AwarenessFragmentationIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastAwarenessState: AwarenessState | null;
};
