/** D9:9:8 — Unified enterprise strategic resonance intelligence + cross-system harmonic alignment types. */

import type { AdaptiveGovernanceIntelligenceSnapshot } from "../enterprise/governance/adaptiveGovernanceTypes";
import type { DistributedExecutiveCognitionSnapshot } from "../consensus-intelligence/unifiedConsensusRuntimeTypes";
import type { EnterpriseStrategicActionSnapshot } from "../decision-orchestration/unifiedDecisionRuntimeTypes";
import type { EnterpriseAnticipatorySnapshot } from "../foresight-cognition/unifiedForesightRuntimeTypes";
import type { CivilizationScaleEnterpriseSnapshot } from "../institutional-consciousness/unifiedInstitutionalConsciousnessTypes";
import type { EnterpriseMemoryCognitionSnapshot } from "../institutional-memory/unifiedInstitutionalMemoryTypes";
import type { EnterpriseSelfReflectiveSnapshot } from "../meta-cognition/unifiedMetaCognitionTypes";
import type { EnterpriseTimeIntelligenceSnapshot } from "../temporal-cognition/unifiedTemporalCognitionTypes";
import type { EnterpriseAwarenessSynchronizationSnapshot } from "./awarenessSynchronizationTypes";
import type { EnterpriseCognitiveSingularitySnapshot } from "./cognitiveSingularityTypes";
import type { EnterpriseStrategicIdentitySnapshot } from "./strategicIdentityTypes";
import type { EnterpriseStrategicWillSnapshot } from "./strategicWillTypes";
import type { UnifiedStrategicIntentSnapshot } from "./strategicIntentTypes";
import type { UnifiedStrategicCoherenceSnapshot } from "./strategicCoherenceTypes";
import type { EnterpriseStrategicEquilibriumSnapshot } from "./strategicEquilibriumTypes";

export type ResonanceCategory =
  | "resilience_resonance"
  | "governance_resonance"
  | "foresight_decision_resonance"
  | "memory_foresight_resonance"
  | "consensus_meta_resonance"
  | "intent_identity_will_resonance"
  | "institutional_consciousness_resonance"
  | "unknown";

export type ResonanceStrength = "weak" | "moderate" | "reinforcing" | "harmonic" | "enterprise_grade";

export type ResonanceState =
  | "dissonant"
  | "unstable"
  | "reinforcing"
  | "harmonically_aligned"
  | "strategically_resonant";

export type StrategicReinforcementObservation = {
  resonanceId: string;
  resonanceState: ResonanceState;
  resonanceStrength: ResonanceStrength;
  resonanceCategory: ResonanceCategory;
  summary: string;
  resonanceSignals: readonly string[];
  amplificationRisks: readonly string[];
  confidence: number;
  generatedAt: number;
  lastObservedAt: number;
  occurrenceCount: number;
};

export type CrossSystemResonanceSignal = {
  signalId: string;
  signalLabel: string;
  signalSummary: string;
  linkedCategories: readonly ResonanceCategory[];
  signalIntensity: "low" | "moderate" | "high";
  confidence: number;
  generatedAt: number;
};

export type HarmonicAlignmentField = {
  fieldId: string;
  fieldLabel: string;
  fieldSummary: string;
  harmonicPosture: "low" | "moderate" | "high" | "executive_grade";
  linkedCategories: readonly ResonanceCategory[];
  generatedAt: number;
};

export type ResonanceAmplificationIndicator = {
  indicatorId: string;
  indicatorLabel: string;
  indicatorSummary: string;
  amplificationSeverity: "low" | "moderate" | "high";
  linkedCategories: readonly ResonanceCategory[];
  generatedAt: number;
};

export type StrategicResonanceSummary = {
  dominantResonanceState: ResonanceState;
  dominantResonanceStrength: ResonanceStrength;
  resonanceHeadline: string;
  harmonicPosture: "low" | "moderate" | "high" | "executive_grade";
};

export type EnterpriseStrategicResonanceSnapshot = {
  signature: string;
  organizationId: string;
  generatedAt: number;
  observationCount: number;
  strategicResonanceSummary: StrategicResonanceSummary;
  recentObservations: readonly StrategicReinforcementObservation[];
  crossSystemResonanceSignals: readonly CrossSystemResonanceSignal[];
  harmonicAlignmentFields: readonly HarmonicAlignmentField[];
  amplificationIndicators: readonly ResonanceAmplificationIndicator[];
};

export type UnifiedStrategicResonanceInput = {
  organizationId: string;
  cognitionSnapshot?: AdaptiveGovernanceIntelligenceSnapshot | null;
  enterpriseStrategicEquilibriumSnapshot?: EnterpriseStrategicEquilibriumSnapshot | null;
  unifiedStrategicCoherenceSnapshot?: UnifiedStrategicCoherenceSnapshot | null;
  enterpriseStrategicWillSnapshot?: EnterpriseStrategicWillSnapshot | null;
  enterpriseStrategicIdentitySnapshot?: EnterpriseStrategicIdentitySnapshot | null;
  unifiedStrategicIntentSnapshot?: UnifiedStrategicIntentSnapshot | null;
  awarenessSynchronizationSnapshot?: EnterpriseAwarenessSynchronizationSnapshot | null;
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

export type UnifiedStrategicResonanceResult = {
  evaluated: boolean;
  skipped: boolean;
  reason?: string;
  snapshot: EnterpriseStrategicResonanceSnapshot | null;
  newObservations: number;
  storeSignature: string;
};

export type StrategicResonanceStoreState = {
  observations: readonly StrategicReinforcementObservation[];
  snapshots: readonly EnterpriseStrategicResonanceSnapshot[];
  crossSystemResonanceSignals: readonly CrossSystemResonanceSignal[];
  harmonicAlignmentFields: readonly HarmonicAlignmentField[];
  amplificationIndicators: readonly ResonanceAmplificationIndicator[];
  signature: string;
  updatedAt: number;
  lastEvaluationSignature: string | null;
  lastResonanceState: ResonanceState | null;
};
